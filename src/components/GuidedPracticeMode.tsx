import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Country, Continent, UserProgress, FlashcardRating } from '../types';
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
  rating: 'lo_se' | 'repasar';
}

/**
 * Pure helper to select 10 unique countries based on spaced repetition priorities:
 * 1. Countries marked for review ('no_lo_sabia' / in reviewIds / flaggedForReview)
 * 2. SM-2 due countries (due today)
 * 3. Unstudied new countries
 * 4. Learning countries (level < 2)
 * 5. Oldest studied countries (least recently seen)
 */
function pickSessionCountries(
  currentProgress: UserProgress,
  selectedContinent?: Continent | null
): Country[] {
  let pool = COUNTRIES;
  if (selectedContinent) {
    pool = COUNTRIES.filter(c => c.continent === selectedContinent);
  }

  const selectedIds = new Set<string>();
  const selected: Country[] = [];

  const add = (c: Country) => {
    if (!selectedIds.has(c.id) && selected.length < 10) {
      selectedIds.add(c.id);
      selected.push(c);
    }
  };

  const poolIds = new Set(pool.map(c => c.id));

  // Priority 1: Countries marked as "Repasar" (review queue or flagged)
  const reviewPool = pool.filter(c => {
    const s = currentProgress.studyStats[c.id];
    return (
      currentProgress.reviewIds.includes(c.id) ||
      s?.flaggedForReview ||
      s?.lastRating === 'no_lo_sabia'
    );
  });
  [...reviewPool].sort(() => Math.random() - 0.5).forEach(add);

  // Priority 2: SM-2 Due countries
  const { dueCountries } = getDailyReviewQueue(currentProgress, 20);
  dueCountries.filter(c => poolIds.has(c.id)).forEach(add);

  // Priority 3: New countries never studied
  const unstudied = pool.filter(c => !currentProgress.studyStats[c.id]);
  [...unstudied].sort(() => Math.random() - 0.5).forEach(add);

  // Priority 4: Countries still in learning phase
  const learning = pool.filter(c => {
    const s = currentProgress.studyStats[c.id];
    return s && s.level < 2;
  });
  [...learning].sort(() => Math.random() - 0.5).forEach(add);

  // Priority 5: Fill remainder by oldest studied (least recently seen)
  if (selected.length < 10) {
    const remaining = pool
      .filter(c => !selectedIds.has(c.id))
      .sort((a, b) => {
        const lastA = currentProgress.studyStats[a.id]?.lastStudied || 0;
        const lastB = currentProgress.studyStats[b.id]?.lastStudied || 0;
        return lastA - lastB; // oldest first
      });
    remaining.forEach(add);
  }

  // Final shuffle of the 10 selected countries
  return [...selected].sort(() => Math.random() - 0.5);
}

export const GuidedPracticeMode: React.FC<GuidedPracticeModeProps> = ({
  progress,
  onUpdateProgress,
  onExit,
  selectedContinent,
}) => {
  // Keep fresh reference to progress for updating without triggering re-render resets
  const progressRef = useRef(progress);
  progressRef.current = progress;

  // Initialize session countries ONCE on mount
  const [sessionCountries, setSessionCountries] = useState<Country[]>(() =>
    pickSessionCountries(progress, selectedContinent)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [outcomes, setOutcomes] = useState<StepOutcome[]>([]);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Start a fresh session with a new batch of 10 countries
  const startNewSession = useCallback(() => {
    const freshList = pickSessionCountries(progressRef.current, selectedContinent);
    setSessionCountries(freshList);
    setCurrentIndex(0);
    setIsCardFlipped(false);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);
    setOutcomes([]);
    setIsSessionComplete(false);
  }, [selectedContinent]);

  const currentCountry: Country | undefined = sessionCountries[currentIndex];

  // Alternates between card (even index: 0, 2, 4...) and question (odd index: 1, 3, 5...)
  const isCardStep = currentIndex % 2 === 0;

  // Quiz options for multiple-choice steps
  const quizOptions = useMemo(() => {
    if (!currentCountry || isCardStep) return [];

    let distractorPool = COUNTRIES.filter(
      c => c.id !== currentCountry.id && c.continent === currentCountry.continent
    );
    if (distractorPool.length < 3) {
      distractorPool = COUNTRIES.filter(c => c.id !== currentCountry.id);
    }

    const shuffled = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [currentCountry, ...shuffled].sort(() => Math.random() - 0.5);
  }, [currentCountry, isCardStep]);

  // Main response handler for "Lo sé" or "Repasar"
  const handleAnswer = (rating: 'lo_se' | 'repasar') => {
    if (!currentCountry || isSessionComplete) return;

    // 1. Run SM-2 algorithm: 'lo_se' -> 'bien', 'repasar' -> 'no_lo_sabia'
    const sm2Rating: FlashcardRating = rating === 'lo_se' ? 'bien' : 'no_lo_sabia';
    const updated = recordSM2Result(currentCountry.id, sm2Rating, progressRef.current);
    progressRef.current = updated;
    onUpdateProgress(updated);

    // 2. Log outcome
    const nextOutcomes = [...outcomes, { country: currentCountry, rating }];
    setOutcomes(nextOutcomes);

    // 3. Reset step view state
    setIsCardFlipped(false);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);

    // 4. Advance counter (1 de 10 -> 2 de 10 -> ... -> 10 de 10) or show summary
    if (currentIndex + 1 >= sessionCountries.length) {
      setIsSessionComplete(true);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Handle clicking a quiz option in question steps
  const handleSelectQuizOption = (option: Country) => {
    if (isQuizSubmitted || !currentCountry) return;

    setSelectedQuizAnswer(option.capital);
    setIsQuizSubmitted(true);

    const isCorrect = option.id === currentCountry.id;
    const rating: 'lo_se' | 'repasar' = isCorrect ? 'lo_se' : 'repasar';

    // Update SM-2 immediately
    const sm2Rating: FlashcardRating = isCorrect ? 'bien' : 'no_lo_sabia';
    const updated = recordSM2Result(currentCountry.id, sm2Rating, progressRef.current);
    progressRef.current = updated;
    onUpdateProgress(updated);

    setOutcomes(prev => [...prev, { country: currentCountry, rating }]);
  };

  // Continue to next card after reviewing quiz result
  const handleNextFromQuiz = () => {
    setIsCardFlipped(false);
    setSelectedQuizAnswer(null);
    setIsQuizSubmitted(false);

    if (currentIndex + 1 >= sessionCountries.length) {
      setIsSessionComplete(true);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Empty state guard
  if (!currentCountry && !isSessionComplete) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <p className="text-lg text-stone-600 dark:text-stone-300">
          Preparando tu sesión de 10 países...
        </p>
      </div>
    );
  }

  // SUMMARY SCREEN (10 de 10 completado)
  if (isSessionComplete) {
    const loSeCount = outcomes.filter(o => o.rating === 'lo_se').length;
    const repasarCount = outcomes.filter(o => o.rating === 'repasar').length;

    return (
      <div className="max-w-xl mx-auto px-6 py-10 sm:py-14 space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 shadow-md">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100">
            ¡Sesión completada!
          </h2>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-md mx-auto">
            Has completado los <span className="font-semibold text-stone-900 dark:text-white">10 países</span> de esta sesión.
          </p>
        </div>

        {/* Resumen numérico: Lo sé vs Repasar */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-700 dark:text-emerald-300 block">
              {loSeCount}
            </span>
            <span className="text-sm sm:text-base font-semibold text-emerald-900 dark:text-emerald-200 block">
              Marcados como «Lo sé»
            </span>
            <span className="text-xs text-emerald-700/80 dark:text-emerald-400/80 block">
              Aparecerán con menos frecuencia
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-bold font-mono text-amber-700 dark:text-amber-300 block">
              {repasarCount}
            </span>
            <span className="text-sm sm:text-base font-semibold text-amber-900 dark:text-amber-200 block">
              Marcados como «Repasar»
            </span>
            <span className="text-xs text-amber-700/80 dark:text-amber-400/80 block">
              Volverán a salir en próximas sesiones
            </span>
          </div>
        </div>

        {/* Lista de países repasados */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
            Países de esta sesión (10 de 10)
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
                  {item.rating === 'lo_se' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                      <Check className="w-3.5 h-3.5" />
                      Lo sé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800">
                      <RotateCcw className="w-3.5 h-3.5" />
                      Repasar
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción solicitados */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={startNewSession}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-lg shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Practicar otra vez</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-semibold text-base transition-colors cursor-pointer"
          >
            <Globe2 className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE CARD / QUESTION STEP
  const total = sessionCountries.length || 10;
  const progressPercent = Math.round(((currentIndex) / total) * 100);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Header bar: Contador visible "1 de 10", "2 de 10", etc. y botón salir */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
            {selectedContinent ? selectedContinent : 'Mundo'}
          </span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {currentIndex + 1} de {total}
          </span>
        </div>
      </div>

      {/* Barra de progreso dinámica que avanza con cada respuesta */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>Progreso de la sesión</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {currentIndex} de {total} completados ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(5, (currentIndex / total) * 100)}%` }}
          />
        </div>
      </div>

      {/* VISTA 1: TARJETA DE MEMORIA */}
      {isCardStep && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
              Tarjeta de memoria ({currentIndex + 1} de {total})
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-stone-900 dark:text-stone-100">
              ¿Recuerdas este país?
            </h3>
          </div>

          {/* Tarjeta interactiva */}
          <div
            onClick={() => setIsCardFlipped(prev => !prev)}
            className="w-full bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col items-center text-center space-y-5"
          >
            {/* Bandera */}
            <div className="relative">
              <img
                src={getFlagUrl(currentCountry, 320)}
                alt={`Bandera de ${currentCountry.name}`}
                className="w-44 sm:w-56 h-auto max-h-36 object-contain rounded-lg shadow-md border border-stone-200/60 dark:border-stone-700"
              />
            </div>

            {/* Nombre del país */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                {currentCountry.continent}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                {currentCountry.name}
              </h2>
            </div>

            {/* Revelar capital */}
            <div className="pt-2 w-full">
              {isCardFlipped ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1 animate-fadeIn">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-semibold">
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

          {/* DOS BOTONES GRANDES: "Repasar" y "Lo sé" */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleAnswer('repasar')}
              className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 font-semibold text-lg sm:text-xl shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Repasar</span>
            </button>

            <button
              type="button"
              onClick={() => handleAnswer('lo_se')}
              className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-lg sm:text-xl shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Check className="w-7 h-7 shrink-0" />
              <span>Lo sé</span>
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: PREGUNTA DE OPCIÓN MÚLTIPLE */}
      {!isCardStep && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
              Pregunta rápida ({currentIndex + 1} de {total})
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 dark:text-stone-100">
              ¿Cuál es la capital de{' '}
              <span className="font-bold underline decoration-emerald-500 decoration-2">
                {currentCountry.name}
              </span>
              ?
            </h3>
          </div>

          {/* Bandera */}
          <div className="flex justify-center">
            <img
              src={getFlagUrl(currentCountry, 250)}
              alt={`Bandera de ${currentCountry.name}`}
              className="w-36 sm:w-44 h-auto max-h-28 object-contain rounded-lg shadow border border-stone-200 dark:border-stone-700"
            />
          </div>

          {/* 4 Opciones grandes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {quizOptions.map(option => {
              const isSelected = selectedQuizAnswer === option.capital;
              const isCorrect = option.id === currentCountry.id;

              let buttonStyle =
                'border-2 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600';

              if (isQuizSubmitted) {
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
                  disabled={isQuizSubmitted}
                  onClick={() => handleSelectQuizOption(option)}
                  className={`flex items-center justify-between p-4 rounded-2xl text-left text-base sm:text-lg font-medium transition-all shadow-sm ${buttonStyle} ${
                    !isQuizSubmitted ? 'cursor-pointer active:scale-98' : 'cursor-default'
                  }`}
                >
                  <span className="truncate">{option.capital}</span>
                  {isQuizSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isQuizSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Retroalimentación o botones directos "Lo sé" / "Repasar" */}
          {isQuizSubmitted ? (
            <div className="pt-3 space-y-4 animate-fadeIn">
              <div
                className={`p-4 rounded-2xl border text-sm sm:text-base flex items-center gap-3 ${
                  selectedQuizAnswer === currentCountry.capital
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                }`}
              >
                {selectedQuizAnswer === currentCountry.capital ? (
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
                        No te preocupes, la volveremos a repasar.
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextFromQuiz}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-lg shadow-md transition-all cursor-pointer"
              >
                <span>Avanzar a la siguiente tarjeta</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Los dos botones también accesibles directamente si el usuario prefiere responder sin tocar las opciones */
            <div className="pt-2">
              <div className="text-center text-xs text-stone-400 mb-2 font-mono">
                O responde directamente:
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAnswer('repasar')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-medium text-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Repasar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer('lo_se')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Lo sé</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
