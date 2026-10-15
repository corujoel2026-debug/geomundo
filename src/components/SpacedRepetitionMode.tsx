import React, { useState, useMemo } from 'react';
import { Country, UserProgress, FlashcardRating } from '../types';
import { getSpacedRepetitionQueue, recordSM2Result } from '../utils/storage';
import { getRatingIntervalPreviews } from '../utils/sm2';
import { CountryMap } from './CountryMap';
import { getFlagUrl } from '../utils/flags';

interface SpacedRepetitionModeProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onOpenDetails: (country: Country) => void;
  onStartDailyReview?: () => void;
}

export const SpacedRepetitionMode: React.FC<SpacedRepetitionModeProps> = ({
  progress,
  onUpdateProgress,
  onOpenDetails,
  onStartDailyReview,
}) => {
  const queue = useMemo(() => getSpacedRepetitionQueue(progress, 15), [progress]);
  const [activeSession, setActiveSession] = useState(false);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentCountry = queue[sessionIndex];
  const currentStats = currentCountry ? progress.studyStats[currentCountry.id] : undefined;
  const intervalPreviews = getRatingIntervalPreviews(currentStats);

  const handleStart = () => {
    setActiveSession(true);
    setSessionIndex(0);
    setShowAnswer(false);
    setSessionCompleted(false);
  };

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCountry) return;

    const updated = recordSM2Result(currentCountry.id, rating, progress);
    onUpdateProgress(updated);

    if (sessionIndex + 1 >= queue.length) {
      setSessionCompleted(true);
    } else {
      setSessionIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
            Repaso Inteligente
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Priorización algorítmica de curvas de olvido y fallos frecuentes
          </p>
        </div>

        {onStartDailyReview && (
          <button
            type="button"
            onClick={onStartDailyReview}
            className="text-xs font-mono uppercase tracking-wider text-stone-900 dark:text-stone-100 underline underline-offset-4 hover:opacity-75 transition-opacity"
          >
            Ir a Repaso del día →
          </button>
        )}
      </div>

      {!activeSession ? (
        <div className="space-y-12">
          {/* Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                En cola de refuerzo
              </span>
              <span className="text-3xl font-light font-mono text-stone-900 dark:text-stone-100">
                {progress.reviewIds.length > 0 ? progress.reviewIds.length : queue.length}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Lapsos y dudas recientes
              </p>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                Dominados
              </span>
              <span className="text-3xl font-light font-mono text-stone-900 dark:text-stone-100">
                {progress.masteredIds.length}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Respuestas consolidadas
              </p>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                  Lote recomendado
                </span>
                <span className="text-3xl font-light font-mono text-stone-900 dark:text-stone-100">
                  {queue.length}
                </span>
              </div>
              <button
                type="button"
                onClick={handleStart}
                className="mt-4 py-2 px-4 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          {/* Queue List */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">
                Lista prioritaria de estudio
              </h3>
              <span className="text-xs font-mono text-stone-400">
                {queue.length} países seleccionados
              </span>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
              {queue.map((c) => {
                const stat = progress.studyStats[c.id];
                const inReview = progress.reviewIds.includes(c.id);

                return (
                  <div
                    key={c.id}
                    onClick={() => onOpenDetails(c)}
                    className="flex items-center justify-between py-3.5 hover:bg-stone-50 dark:hover:bg-stone-900/50 cursor-pointer transition-colors px-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-5 border border-stone-200 dark:border-stone-700 bg-stone-100 shrink-0 overflow-hidden">
                        <img
                          src={getFlagUrl(c, 160)}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-sm text-stone-900 dark:text-stone-100 hover:underline">
                          {c.name}
                        </span>
                        <span className="text-xs text-stone-400 ml-2">
                          ({c.capital})
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-stone-400">
                      {inReview ? (
                        <span className="text-stone-700 dark:text-stone-300">En revisión</span>
                      ) : stat && stat.wrongCount > 0 ? (
                        <span>{stat.wrongCount} fallos</span>
                      ) : stat?.leitnerBox ? (
                        <span>Caja {stat.leitnerBox}</span>
                      ) : (
                        <span>Nuevo</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : sessionCompleted ? (
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-10 sm:p-14 text-center">
          <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100 mb-2">
            Sesión de repaso completada
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-8">
            Se han actualizado las ponderaciones de dificultad para los {queue.length} países evaluados.
          </p>
          <button
            type="button"
            onClick={() => setActiveSession(false)}
            className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-900 dark:text-stone-100 transition-colors"
          >
            Volver a la cola
          </button>
        </div>
      ) : (
        /* Active Repetition Step with 4 buttons */
        <div className="max-w-lg mx-auto border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-10">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-6">
            <span>
              {sessionIndex + 1} / {queue.length}
            </span>
            <span>{currentCountry.continent}</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-36 h-24 border border-stone-200 dark:border-stone-700 bg-stone-100 overflow-hidden mb-6">
              <img
                src={getFlagUrl(currentCountry, 320)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-3xl font-serif font-normal text-stone-900 dark:text-stone-100">
              {currentCountry.name}
            </h3>

            {!showAnswer ? (
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="px-5 py-2 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 text-stone-800 dark:text-stone-200 transition-colors"
                >
                  Comprobar capital
                </button>
              </div>
            ) : (
              <div className="w-full mt-8 space-y-6">
                <div className="border-t border-stone-100 dark:border-stone-800 pt-4">
                  <span className="text-[11px] font-mono uppercase text-stone-400 block mb-1">
                    Capital oficial
                  </span>
                  <span className="text-xl font-serif text-stone-900 dark:text-stone-100">
                    {currentCountry.capital}
                  </span>
                </div>

                <CountryMap
                  country={currentCountry}
                  height={150}
                  width={420}
                  mode="continental"
                  showControls={false}
                  interactive={false}
                />

                {/* 4 buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRate('no_lo_sabia')}
                    className="p-2 border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-800 dark:text-stone-200 text-center"
                  >
                    <span className="block text-[11px] uppercase font-medium">No lo sabía</span>
                    <span className="block text-[9px] font-mono text-stone-400">Próx: {intervalPreviews.no_lo_sabia}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('dificil')}
                    className="p-2 border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-800 dark:text-stone-200 text-center"
                  >
                    <span className="block text-[11px] uppercase font-medium">Difícil</span>
                    <span className="block text-[9px] font-mono text-stone-400">Próx: {intervalPreviews.dificil}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('bien')}
                    className="p-2 border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-center"
                  >
                    <span className="block text-[11px] uppercase font-medium">Bien</span>
                    <span className="block text-[9px] font-mono text-stone-400">Próx: {intervalPreviews.bien}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRate('facil')}
                    className="p-2 border border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-center"
                  >
                    <span className="block text-[11px] uppercase font-medium">Fácil</span>
                    <span className="block text-[9px] font-mono text-stone-300 dark:text-stone-600">Próx: {intervalPreviews.facil}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
