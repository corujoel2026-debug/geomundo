import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Country, Continent, QuizQuestion, QuizQuestionType, UserProgress } from '../types';
import { COUNTRIES, COUNTRIES_BY_CONTINENT } from '../data/countries';
import { CONTINENTS_LIST } from '../data/continents';
import { recordCountryResult } from '../utils/storage';
import { checkQuizAnswer, MatchResult } from '../utils/fuzzyMatch';
import { CountryMap } from './CountryMap';
import { getFlagUrl } from '../utils/flags';
import { FlagImage } from './FlagImage';

import { RegionFilter } from '../types';
import { getCountriesForRegionFilter } from '../data/subregions';
import { RegionFilterBadge } from './RegionSelectorModal';

export type QuizDifficulty = 'standard' | 'hard';

interface QuizModeProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  initialContinent?: Continent;
  regionFilter: RegionFilter;
  onOpenRegionSelector: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  progress,
  onUpdateProgress,
  initialContinent,
  regionFilter,
  onOpenRegionSelector,
}) => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('standard');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [failedCountries, setFailedCountries] = useState<Country[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Pool of countries strictly filtered by region/subregion
  const pool = useMemo(() => {
    return getCountriesForRegionFilter(regionFilter, COUNTRIES);
  }, [regionFilter]);

  const generateQuestions = useCallback((count: number) => {
    const activePool = pool.length > 0 ? pool : COUNTRIES;
    const shuffledPool = [...activePool].sort(() => Math.random() - 0.5);
    const chosen = shuffledPool.slice(0, Math.min(count, activePool.length));

    const types: QuizQuestionType[] = [
      'flag_to_country',
      'country_to_capital',
      'map_to_country',
      'capital_to_country',
    ];

    const generated: QuizQuestion[] = chosen.map((country, idx) => {
      const qType = types[idx % types.length];

      // CRITICAL: Distractors come ONLY from the active pool of selected countries/subregions
      const optionsSource = activePool.length >= 4 ? activePool : COUNTRIES;
      const distractors = optionsSource
        .filter((c: Country) => c.id !== country.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [country, ...distractors].sort(() => Math.random() - 0.5);

      let prompt = '';
      let subPrompt = '';
      let correctAnswerText = '';

      switch (qType) {
        case 'flag_to_country':
          prompt = '¿A qué Estado corresponde esta bandera?';
          correctAnswerText = country.name;
          break;
        case 'country_to_capital':
          prompt = `¿Cuál es la capital de ${country.name}?`;
          correctAnswerText = country.capital;
          break;
        case 'map_to_country':
          prompt = '¿Qué país se encuentra resaltado en el mapa?';
          subPrompt = `Subregión: ${country.subregion}`;
          correctAnswerText = country.name;
          break;
        case 'capital_to_country':
          prompt = `¿De qué país es capital "${country.capital}"?`;
          correctAnswerText = country.name;
          break;
      }

      return {
        id: `q-${idx}-${country.id}`,
        type: qType,
        country,
        prompt,
        subPrompt,
        options,
        correctCountryId: country.id,
        correctAnswerText,
      };
    });

    setQuestions(generated);
    setActiveQuestionIndex(0);
    setSelectedOptionId(null);
    setTextInput('');
    setMatchResult(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setFailedCountries([]);
  }, [pool]);

  useEffect(() => {
    generateQuestions(questionCount);
  }, [pool, questionCount, generateQuestions]);

  // Focus input on new question in hard mode
  useEffect(() => {
    if (difficulty === 'hard' && !isAnswered) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [activeQuestionIndex, difficulty, isAnswered]);

  const currentQ = questions[activeQuestionIndex];

  // Standard Mode: Multiple choice selection
  const handleSelectOption = (countryOption: Country) => {
    if (isAnswered || !currentQ || difficulty !== 'standard') return;

    setSelectedOptionId(countryOption.id);
    setIsAnswered(true);

    const isCorrect = countryOption.id === currentQ.correctCountryId;

    const updated = recordCountryResult(currentQ.country.id, isCorrect, progress);
    onUpdateProgress(updated);

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setFailedCountries(prev => [...prev, currentQ.country]);
    }
  };

  // Hard Mode: Submit text input
  const handleSubmitText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswered || !currentQ || difficulty !== 'hard') return;

    const trimmed = textInput.trim();
    if (!trimmed) return;

    const alternatives: string[] = [];
    if (currentQ.country.officialName) {
      alternatives.push(currentQ.country.officialName);
    }
    // For capital with parentheses, e.g. "Washington (D.C.)", add "Washington"
    if (currentQ.correctAnswerText.includes('(')) {
      alternatives.push(currentQ.correctAnswerText.replace(/\s*\(.*?\)\s*/g, '').trim());
    }

    const check = checkQuizAnswer(trimmed, currentQ.correctAnswerText, alternatives);
    setMatchResult(check);
    setIsAnswered(true);

    const updated = recordCountryResult(currentQ.country.id, check.isCorrect, progress);
    onUpdateProgress(updated);

    if (check.isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setFailedCountries(prev => [...prev, currentQ.country]);
    }
  };

  const handleNext = () => {
    if (activeQuestionIndex + 1 >= questions.length) {
      setIsCompleted(true);
    } else {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setTextInput('');
      setMatchResult(null);
      setIsAnswered(false);
    }
  };

  // Global enter key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, activeQuestionIndex, questions.length]);

  if (!currentQ && !isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-xs font-mono text-stone-400">
        Preparando cuestionario...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
      {/* Persistent Region Filter Badge */}
      <RegionFilterBadge
        filter={regionFilter}
        onOpenSelector={onOpenRegionSelector}
        className="mb-6"
      />

      {/* Header & Configuration */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
            Cuestionario
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Evaluación de capitales, banderas y localización cartográfica
          </p>
        </div>

        {/* Dropdowns & Difficulty */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Difficulty segmented control */}
          <div className="flex items-center border border-stone-200 dark:border-stone-800 p-0.5">
            <button
              type="button"
              onClick={() => {
                setDifficulty('standard');
                generateQuestions(questionCount);
              }}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                difficulty === 'standard'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Estándar
            </button>
            <button
              type="button"
              onClick={() => {
                setDifficulty('hard');
                generateQuestions(questionCount);
              }}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                difficulty === 'hard'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              Difícil
            </button>
          </div>

          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="bg-transparent border-b border-stone-300 dark:border-stone-700 py-1 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
          >
            <option value={10} className="bg-white dark:bg-stone-900">10 preguntas</option>
            <option value={20} className="bg-white dark:bg-stone-900">20 preguntas</option>
            <option value={30} className="bg-white dark:bg-stone-900">30 preguntas</option>
            {pool.length > 5 && (
              <option value={pool.length} className="bg-white dark:bg-stone-900">
                Todas ({pool.length})
              </option>
            )}
          </select>
        </div>
      </div>

      {isCompleted ? (
        /* Results */
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-10 sm:p-14 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block mb-2">
            {difficulty === 'hard' ? 'Nivel Difícil · Escritura libre' : 'Nivel Estándar · Opción múltiple'}
          </span>
          <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100 mb-2">
            Resultados del cuestionario
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-10">
            {pool.length} países disponibles · {questions.length} preguntas formuladas
          </p>

          <div className="flex justify-center gap-12 font-mono text-center mb-10">
            <div>
              <span className="text-4xl font-light text-stone-900 dark:text-stone-100 block">
                {score} / {questions.length}
              </span>
              <span className="text-xs text-stone-400">Aciertos</span>
            </div>
            <div className="w-px h-12 bg-stone-200 dark:bg-stone-800 my-auto" />
            <div>
              <span className="text-4xl font-light text-stone-900 dark:text-stone-100 block">
                {Math.round((score / questions.length) * 100)}%
              </span>
              <span className="text-xs text-stone-400">Precisión</span>
            </div>
          </div>

          {failedCountries.length > 0 && (
            <div className="max-w-md mx-auto mb-10 text-left border-t border-stone-100 dark:border-stone-800 pt-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-3">
                Países para repasar:
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
                {Array.from(new Set(failedCountries.map(c => c.name))).map((name, i, arr) => (
                  <span key={name}>
                    {name}{i < arr.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => generateQuestions(questionCount)}
            className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-900 dark:text-stone-100 transition-colors"
          >
            Comenzar nuevo cuestionario
          </button>
        </div>
      ) : (
        /* Active Question */
        <div className="space-y-8">
          {/* Question Sequence & Mode indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <span>
                Pregunta {activeQuestionIndex + 1} de {questions.length}
              </span>
              <span>·</span>
              <span className="uppercase text-[11px]">
                {difficulty === 'hard' ? 'Nivel Difícil' : 'Nivel Estándar'}
              </span>
            </div>
            <span>
              Aciertos: {score}
            </span>
          </div>

          {/* Prompt */}
          <div>
            <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
              {currentQ.prompt}
            </h3>
            {currentQ.subPrompt && (
              <p className="text-xs text-stone-400 mt-1 font-mono">
                {currentQ.subPrompt}
              </p>
            )}
          </div>

          {/* Visual element */}
          <div className="py-2">
            {currentQ.type === 'flag_to_country' && (
              <div className="w-44 h-28 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 overflow-hidden mx-auto flex items-center justify-center">
                <FlagImage
                  country={currentQ.country}
                  width={320}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {currentQ.type === 'map_to_country' && (
              <div className="w-full">
                <CountryMap
                  country={currentQ.country}
                  height={270}
                  width={560}
                  mode="continental"
                  showControls={true}
                  interactive={true}
                  quizMode={true}
                  accentColor="#047857"
                />
              </div>
            )}

            {currentQ.type === 'country_to_capital' && (
              <div className="flex items-center gap-4 p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 max-w-sm mx-auto">
                <div className="w-12 h-8 border border-stone-200 dark:border-stone-700 shrink-0 overflow-hidden bg-stone-100">
                  <img
                    src={getFlagUrl(currentQ.country, 160)}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-stone-400 block">Estado</span>
                  <span className="text-base font-normal text-stone-900 dark:text-stone-100">
                    {currentQ.country.name}
                  </span>
                </div>
              </div>
            )}

            {currentQ.type === 'capital_to_country' && (
              <div className="p-6 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-center max-w-sm mx-auto">
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                  Capital oficial
                </span>
                <span className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
                  {currentQ.country.capital}
                </span>
              </div>
            )}
          </div>

          {/* DIFFICULTY: HARD MODE -> TEXT INPUT */}
          {difficulty === 'hard' ? (
            <div className="space-y-4">
              <form onSubmit={handleSubmitText} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      disabled={isAnswered}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={
                        currentQ.type === 'country_to_capital'
                          ? 'Escribe el nombre de la capital...'
                          : 'Escribe el nombre del país...'
                      }
                      className={`w-full px-4 py-3.5 border bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-base font-normal focus:outline-none transition-colors ${
                        isAnswered
                          ? matchResult?.isCorrect
                            ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800/40'
                            : 'border-red-400/80 dark:border-red-500/80 bg-red-50/20 dark:bg-red-950/20'
                          : 'border-stone-300 dark:border-stone-700 focus:border-stone-900 dark:focus:border-stone-100'
                      }`}
                    />
                  </div>

                  {!isAnswered && (
                    <button
                      type="submit"
                      disabled={!textInput.trim()}
                      className="px-6 py-3.5 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      Comprobar
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 px-1">
                  <span>Tolerancia a tildes, mayúsculas y erratas leves activada</span>
                  <span>[Enter] para comprobar</span>
                </div>
              </form>

              {/* Hard Mode feedback display */}
              {isAnswered && matchResult && (
                <div
                  className={`p-4 border ${
                    matchResult.isCorrect
                      ? 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 text-stone-900 dark:text-stone-100'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/20 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold">
                      {matchResult.isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
                    </span>
                    {matchResult.isNearMatch && matchResult.isCorrect && (
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        (pequeña errata tolerada)
                      </span>
                    )}
                  </div>

                  <p className="text-sm">
                    Respuesta exacta:{' '}
                    <strong className="font-medium text-stone-900 dark:text-stone-100">
                      {currentQ.correctAnswerText}
                    </strong>
                    {currentQ.type !== 'country_to_capital' && (
                      <span className="text-xs text-stone-500 ml-2">
                        · Capital: {currentQ.country.capital}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* DIFFICULTY: STANDARD MODE -> MULTIPLE CHOICE OPTIONS */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectAnswer = opt.id === currentQ.correctCountryId;

                let style = 'border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900/40';

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    style = 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium';
                  } else if (isSelected && !isCorrectAnswer) {
                    style = 'border-stone-400 line-through text-stone-400 opacity-60';
                  } else {
                    style = 'border-stone-200 dark:border-stone-800 opacity-40';
                  }
                }

                const optionText =
                  currentQ.type === 'country_to_capital' ? opt.capital : opt.name;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt)}
                    className={`flex items-baseline justify-between p-4 border text-left transition-colors text-sm ${style}`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-stone-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{optionText}</span>
                    </div>

                    {isAnswered && isCorrectAnswer && (
                      <span className="text-xs font-mono uppercase text-stone-900 dark:text-stone-100">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Resolution Footer */}
          {isAnswered && (
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {difficulty === 'standard' && (
                  <span>
                    {selectedOptionId === currentQ.correctCountryId
                      ? `Respuesta correcta. ${currentQ.country.name} — Capital: ${currentQ.country.capital}`
                      : `Respuesta correcta: ${currentQ.correctAnswerText}`}
                  </span>
                )}
                {difficulty === 'hard' && (
                  <span>Pulsa [Enter] para continuar</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors"
              >
                {activeQuestionIndex + 1 >= questions.length
                  ? 'Ver resultado'
                  : 'Siguiente'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
