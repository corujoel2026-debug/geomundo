import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Country, RegionFilter, QuizQuestion, QuizQuestionType, UserProgress } from '../types';
import { COUNTRIES } from '../data/countries';
import { getCountriesForRegionFilter } from '../data/subregions';
import { recordCountryResult } from '../utils/storage';
import { RegionFilterBadge } from './RegionSelectorModal';
import { CountryMap } from './CountryMap';
import { getFlagUrl } from '../utils/flags';
import { EspacioPublicitario } from './EspacioPublicitario';
import { Timer, Zap, Play, RotateCcw, Award, CheckCircle2, XCircle } from 'lucide-react';

interface TimeTrialModeProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  regionFilter: RegionFilter;
  onOpenRegionSelector: () => void;
}

export const TimeTrialMode: React.FC<TimeTrialModeProps> = ({
  progress,
  onUpdateProgress,
  regionFilter,
  onOpenRegionSelector,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Pool of countries based strictly on the selected region filter
  const pool = useMemo(() => {
    return getCountriesForRegionFilter(regionFilter, COUNTRIES);
  }, [regionFilter]);

  const generateSingleQuestion = useCallback((): QuizQuestion | null => {
    if (pool.length === 0) return null;

    const country = pool[Math.floor(Math.random() * pool.length)];

    const types: QuizQuestionType[] = [
      'flag_to_country',
      'country_to_capital',
      'capital_to_country',
      'map_to_country',
    ];
    const qType = types[Math.floor(Math.random() * types.length)];

    // Options strictly from the selected pool (or world fallback only if pool < 4)
    const optionsSource = pool.length >= 4 ? pool : COUNTRIES;
    const distractors = optionsSource
      .filter(c => c.id !== country.id)
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
        prompt = '¿Qué país está resaltado en el mapa?';
        subPrompt = country.subregion;
        correctAnswerText = country.name;
        break;
      case 'capital_to_country':
        prompt = `¿De qué país es capital "${country.capital}"?`;
        correctAnswerText = country.name;
        break;
    }

    return {
      id: `tt-${Date.now()}-${Math.random()}`,
      type: qType,
      country,
      prompt,
      subPrompt,
      options,
      correctCountryId: country.id,
      correctAnswerText,
    };
  }, [pool]);

  const handleStart = () => {
    setTimeLeft(selectedDuration);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setSelectedOptionId(null);
    setFeedback(null);
    setGameState('playing');
    setCurrentQuestion(generateSingleQuestion());
  };

  // Timer tick
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Answer handler
  const handleSelectOption = (countryOption: Country) => {
    if (gameState !== 'playing' || !currentQuestion || feedback) return;

    setSelectedOptionId(countryOption.id);
    const isCorrect = countryOption.id === currentQuestion.correctCountryId;

    const updated = recordCountryResult(currentQuestion.country.id, isCorrect, progress);
    onUpdateProgress(updated);

    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 10 + streak * 2);
      setCorrectCount(prev => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
      // Bonus second
      setTimeLeft(t => Math.min(selectedDuration + 15, t + 1));
    } else {
      setFeedback('wrong');
      setStreak(0);
      setWrongCount(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOptionId(null);
      setCurrentQuestion(generateSingleQuestion());
    }, 450);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / selectedDuration) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Persistent Region Badge */}
      <RegionFilterBadge
        filter={regionFilter}
        onOpenSelector={onOpenRegionSelector}
        className="mb-2"
      />

      {/* IDLE / PRE-START VIEW */}
      {gameState === 'idle' && (
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-12 text-center space-y-8 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Timer className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-stone-400 block">
              Desafío de velocidad
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-stone-900 dark:text-stone-100">
              Modo Contrarreloj
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Responde la mayor cantidad de preguntas posibles antes de que se agote el tiempo.
              Todas las preguntas y opciones se ciñen a los países de la selección activa.
            </p>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 max-w-md mx-auto space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between text-stone-500">
              <span>Duración del reto:</span>
              <div className="flex gap-1.5">
                {[30, 60, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      setSelectedDuration(dur);
                      setTimeLeft(dur);
                    }}
                    className={`px-3 py-1 border transition-colors ${
                      selectedDuration === dur
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold'
                        : 'border-stone-300 dark:border-stone-700 hover:border-stone-500 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-2 text-stone-500">
              <span>Países en la ronda:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100">
                {pool.length} disponibles
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenRegionSelector}
              className="w-full sm:w-auto px-6 py-3 border border-stone-300 dark:border-stone-700 text-xs font-mono uppercase tracking-wider hover:border-stone-900 dark:hover:border-stone-100 transition-colors"
            >
              Cambiar región
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Iniciar contrarreloj</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING VIEW */}
      {gameState === 'playing' && currentQuestion && (
        <div className="space-y-6">
          {/* Header Stats & Timer Bar */}
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-stone-900 dark:text-stone-100 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{score} pts</span>
                </div>
                {streak > 1 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-bold">
                    Racha x{streak}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Timer className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-stone-500'}`} />
                <span className={`text-base font-bold tabular-nums ${timeLeft <= 10 ? 'text-red-600 dark:text-red-400' : 'text-stone-900 dark:text-stone-100'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Visual timer countdown bar */}
            <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                {currentQuestion.subPrompt || currentQuestion.country.continent}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-stone-900 dark:text-stone-100">
                {currentQuestion.prompt}
              </h3>
            </div>

            {/* Prompt Media */}
            <div className="flex justify-center py-2">
              {currentQuestion.type === 'flag_to_country' && (
                <div className="w-44 h-28 border border-stone-300 dark:border-stone-700 shadow-sm overflow-hidden flex items-center justify-center bg-stone-100 dark:bg-stone-800">
                  <img
                    src={getFlagUrl(currentQuestion.country, 320)}
                    alt="Bandera misteriosa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {currentQuestion.type === 'country_to_capital' && (
                <div className="px-6 py-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-serif text-2xl text-stone-900 dark:text-stone-100">
                  {currentQuestion.country.name}
                </div>
              )}

              {currentQuestion.type === 'capital_to_country' && (
                <div className="px-6 py-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-serif text-2xl text-stone-900 dark:text-stone-100">
                  {currentQuestion.country.capital}
                </div>
              )}

              {currentQuestion.type === 'map_to_country' && (
                <div className="w-full max-w-md h-52 border border-stone-200 dark:border-stone-800 overflow-hidden relative">
                  <CountryMap
                    country={currentQuestion.country}
                    mode="continental"
                    quizMode={true}
                    showControls={false}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOption = opt.id === currentQuestion.correctCountryId;

                let btnStyle = 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/40 text-stone-900 dark:text-stone-100 hover:border-stone-400 dark:hover:border-stone-500';

                if (feedback && isCorrectOption) {
                  btnStyle = 'border-emerald-600 bg-emerald-600 text-white font-bold';
                } else if (feedback && isSelected && !isCorrectOption) {
                  btnStyle = 'border-red-600 bg-red-600 text-white font-bold';
                }

                const displayText =
                  currentQuestion.type === 'country_to_capital' ? opt.capital : opt.name;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 border text-left font-serif text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{displayText}</span>
                    {feedback && isCorrectOption && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {feedback && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED VIEW */}
      {gameState === 'completed' && (
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-12 text-center space-y-8 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-stone-400 block">
              ¡Tiempo terminado!
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 dark:text-stone-100">
              Ronda completada
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto font-mono text-center">
            <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <span className="text-[10px] uppercase text-stone-400 block">Puntaje</span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {score}
              </span>
            </div>
            <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <span className="text-[10px] uppercase text-stone-400 block">Aciertos</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {correctCount}
              </span>
            </div>
            <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <span className="text-[10px] uppercase text-stone-400 block">Fallos</span>
              <span className="text-2xl font-bold text-stone-500">
                {wrongCount}
              </span>
            </div>
            <div className="p-4 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
              <span className="text-[10px] uppercase text-stone-400 block">Mejor racha</span>
              <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {bestStreak}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenRegionSelector}
              className="w-full sm:w-auto px-6 py-3 border border-stone-300 dark:border-stone-700 text-xs font-mono uppercase tracking-wider hover:border-stone-900 dark:hover:border-stone-100 transition-colors"
            >
              Cambiar región
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar de nuevo</span>
            </button>
          </div>

          <EspacioPublicitario position="resumen-sesion" id="ad-resumen-timetrial" />
        </div>
      )}
    </div>
  );
};
