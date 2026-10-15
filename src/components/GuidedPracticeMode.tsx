import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Country, Continent, UserProgress } from '../types';
import { COUNTRIES } from '../data/countries';
import { recordSM2Result } from '../utils/storage';
import { getDailyReviewQueue } from '../utils/sm2';
import { getFlagUrl } from '../utils/flags';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Globe2,
} from 'lucide-react';

interface GuidedPracticeModeProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onExit: () => void;
  selectedContinent?: Continent | null;
}

interface StepOutcome {
  country: Country;
  type: 'card' | 'quiz';
  result: 'known' | 'review';
}

export const GuidedPracticeMode: React.FC<GuidedPracticeModeProps> = ({
  progress,
  onUpdateProgress,
  onExit,
  selectedContinent,
}) => {
  const [sessionCountries, setSessionCountries] = useState<Country[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [outcomes, setOutcomes] = useState<StepOutcome[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Generate a curated list of 10 countries for this practice session
  const pickSessionCountries = useCallback(() => {
    let pool = COUNTRIES;
    if (selectedContinent) {
      pool = COUNTRIES.filter(c => c.continent === selectedContinent);
    }

    const poolIds = new Set(pool.map(c => c.id));
    const { dueCountries } = getDailyReviewQueue(progress, 20);
    const validDue = dueCountries.filter(c => poolIds.has(c.id));

    // Priority 1: Due for review
    const selected: Country[] = [...validDue];

    // Priority 2: Needs review or learning level
    if (selected.length < 10) {
      const remainingPool = pool.filter(c => !selected.some(s => s.id === c.id));
      const learning = remainingPool.filter(c => {
        const stats = progress.studyStats[c.id];
        return stats && stats.level < 2;
      });
      // Shuffle learning
      const shuffledLearning = [...learning].sort(() => Math.random() - 0.5);
      selected.push(...shuffledLearning.slice(0, 10 - selected.length));
    }

    // Priority 3: Never studied (new)
    if (selected.length < 10) {
      const remainingPool = pool.filter(c => !selected.some(s => s.id === c.id));
      const newCountries = remainingPool.filter(c => !progress.studyStats[c.id]);
      const shuffledNew = [...newCountries].sort(() => Math.random() - 0.5);
      selected.push(...shuffledNew.slice(0, 10 - selected.length));
    }

    // Priority 4: Fill remaining from whatever is left
    if (selected.length < 10) {
      const remainingPool = pool.filter(c => !selected.some(s => s.id === c.id));
      const shuffledRemaining = [...remainingPool].sort(() => Math.random() - 0.5);
      selected.push(...shuffledRemaining.slice(0, 10 - selected.length));
    }

    // Final shuffle of the 10 countries
    return selected.slice(0, 10).sort(() => Math.random() - 0.5);
  }, [progress, selectedContinent]);

  const startNewSession = useCallback(() => {
    const list = pickSessionCountries();
    setSessionCountries(list);
    setCurrentIndex(0);
    setIsCardFlipped(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setOutcomes([]);
    setIsSessionComplete(false);
  }, [pickSessionCountries]);

  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  const currentCountry: Country | undefined = sessionCountries[currentIndex];

  // Alternates between card (even index: 0, 2, 4...) and quiz (odd index: 1, 3, 5...)
  const isCardStep = currentIndex % 2 === 0;

  // Quiz distractors for current country
  const quizOptions = useMemo(() => {
    if (!currentCountry || isCardStep) return [];

    let distractorPool = COUNTRIES.filter(
      c => c.id !== currentCountry.id && c.continent === currentCountry.continent
    );
    if (distractorPool.length < 3) {
      distractorPool = COUNTRIES.filter(c => c.id !== currentCountry.id);
    }

    const shuffled = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [currentCountry, ...shuffled].sort(() => Math.random() - 0.5);
    return options;
  }, [currentCountry, isCardStep]);

  // Handle Flashcard choice ("Lo sé" or "Repasar")
  const handleCardChoice = (rating: 'bien' | 'no_lo_sabia') => {
    if (!currentCountry) return;

    const updated = recordSM2Result(currentCountry.id, rating, progress);
    onUpdateProgress(updated);

    const outcome: StepOutcome = {
      country: currentCountry,
      type: 'card',
      result: rating === 'bien' ? 'known' : 'review',
    };
    const nextOutcomes = [...outcomes, outcome];
    setOutcomes(nextOutcomes);

    // Advance to next country or complete
    if (currentIndex + 1 >= sessionCountries.length) {
      setIsSessionComplete(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore if confetti blocked
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsCardFlipped(false);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Handle Quiz option selection
  const handleSelectQuizOption = (option: Country) => {
    if (isAnswerSubmitted || !currentCountry) return;

    setSelectedAnswer(option.capital);
    setIsAnswerSubmitted(true);

    const isCorrect = option.id === currentCountry.id;
    const rating = isCorrect ? 'bien' : 'no_lo_sabia';

    const updated = recordSM2Result(currentCountry.id, rating, progress);
    onUpdateProgress(updated);

    const outcome: StepOutcome = {
      country: currentCountry,
      type: 'quiz',
      result: isCorrect ? 'known' : 'review',
    };
    setOutcomes(prev => [...prev, outcome]);
  };

  const handleNextQuizStep = () => {
    if (currentIndex + 1 >= sessionCountries.length) {
      setIsSessionComplete(true);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsCardFlipped(false);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  if (!currentCountry && !isSessionComplete) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <p className="text-lg text-stone-600 dark:text-stone-300">
          Preparando tu sesión de práctica...
        </p>
      </div>
    );
  }

  // Session Completed Screen
  if (isSessionComplete) {
    const knownCount = outcomes.filter(o => o.result === 'known').length;

    return (
      <div className="max-w-xl mx-auto px-6 py-10 sm:py-14 space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-md">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100">
            ¡Excelente sesión completada!
          </h2>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            Has practicado <span className="font-semibold text-stone-900 dark:text-white">10 países</span>. Recordaste{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{knownCount}</span> y dejaste{' '}
            <span className="font-semibold text-amber-600 dark:text-amber-400">{10 - knownCount}</span> para seguir reforzando.
          </p>
        </div>

        {/* List of Countries Studied */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Países de esta sesión
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {outcomes.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={getFlagUrl(item.country, 40)}
                    alt={`Bandera de ${item.country.name}`}
                    className="w-7 h-5 object-cover rounded shadow-xs shrink-0"
                    loading="lazy"
                  />
                  <div className="truncate">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate">
                      {item.country.name}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 block truncate">
                      {item.country.capital}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {item.result === 'known' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3 h-3" />
                      Lo sé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      <RotateCcw className="w-3 h-3" />
                      Repasar
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={startNewSession}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-lg shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Practicar otros 10 países</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-medium text-base transition-colors cursor-pointer"
          >
            <Globe2 className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header bar: Step count & exit button */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir al inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
            {selectedContinent ? selectedContinent : 'Mundo'}
          </span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="text-sm font-semibold font-mono text-emerald-700 dark:text-emerald-400">
            País {currentIndex + 1} de {sessionCountries.length}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / sessionCountries.length) * 100}%` }}
        />
      </div>

      {/* STEP 1: FLASHCARD VIEW */}
      {isCardStep && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Tarjeta de memoria
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-stone-900 dark:text-stone-100">
              ¿Recuerdas este país?
            </h3>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsCardFlipped(prev => !prev)}
            className="w-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col items-center text-center space-y-5"
          >
            {/* Flag */}
            <div className="relative group">
              <img
                src={getFlagUrl(currentCountry, 320)}
                alt={`Bandera de ${currentCountry.name}`}
                className="w-44 sm:w-56 h-auto max-h-36 object-contain rounded-lg shadow-md border border-stone-200/60 dark:border-stone-700"
              />
            </div>

            {/* Country Name */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                {currentCountry.continent}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                {currentCountry.name}
              </h2>
            </div>

            {/* Capital reveal toggle */}
            <div className="pt-2 w-full">
              {isCardFlipped ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1 animate-fadeIn">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Capital
                  </span>
                  <p className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-200">
                    {currentCountry.capital}
                  </p>
                  {currentCountry.curiosity && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 italic">
                      "{currentCountry.curiosity}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-medium">
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Toca la tarjeta para ver la capital</span>
                </div>
              )}
            </div>
          </div>

          {/* TWO BIG BUTTONS: "Repasar" y "Lo sé" */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleCardChoice('no_lo_sabia')}
              className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-semibold text-base sm:text-lg shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Repasar</span>
            </button>

            <button
              type="button"
              onClick={() => handleCardChoice('bien')}
              className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-base sm:text-lg shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Check className="w-6 h-6 shrink-0" />
              <span>Lo sé</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MULTIPLE CHOICE QUIZ VIEW */}
      {!isCardStep && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
              Pregunta rápida
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 dark:text-stone-100">
              ¿Cuál es la capital de{' '}
              <span className="font-bold underline decoration-emerald-500 decoration-2">
                {currentCountry.name}
              </span>
              ?
            </h3>
          </div>

          {/* Country flag banner */}
          <div className="flex justify-center">
            <img
              src={getFlagUrl(currentCountry, 250)}
              alt={`Bandera de ${currentCountry.name}`}
              className="w-36 sm:w-44 h-auto max-h-28 object-contain rounded-lg shadow border border-stone-200 dark:border-stone-700"
            />
          </div>

          {/* 4 Large Option Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {quizOptions.map(option => {
              const isSelected = selectedAnswer === option.capital;
              const isCorrect = option.id === currentCountry.id;

              let buttonStyle =
                'border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  buttonStyle =
                    'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  buttonStyle =
                    'border-2 border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200';
                } else {
                  buttonStyle = 'opacity-40 border-stone-200 dark:border-stone-800';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectQuizOption(option)}
                  className={`flex items-center justify-between p-4 rounded-2xl text-left text-base sm:text-lg font-medium transition-all shadow-sm ${buttonStyle} ${
                    !isAnswerSubmitted ? 'cursor-pointer active:scale-98' : 'cursor-default'
                  }`}
                >
                  <span className="truncate">{option.capital}</span>
                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Continue Button */}
          {isAnswerSubmitted && (
            <div className="pt-3 space-y-4 animate-fadeIn">
              <div
                className={`p-4 rounded-2xl border text-sm sm:text-base flex items-center gap-3 ${
                  selectedAnswer === currentCountry.capital
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                }`}
              >
                {selectedAnswer === currentCountry.capital ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold block">¡Respuesta correcta!</span>
                      <span className="text-xs sm:text-sm opacity-90">
                        La capital de {currentCountry.name} es {currentCountry.capital}.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="font-bold block">
                        La capital es {currentCountry.capital}
                      </span>
                      <span className="text-xs sm:text-sm opacity-90">
                        No te preocupes, la volveremos a repasar pronto.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextQuizStep}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-lg shadow-md transition-all cursor-pointer"
              >
                <span>Siguiente país</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
