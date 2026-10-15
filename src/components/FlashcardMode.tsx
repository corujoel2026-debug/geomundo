import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Country, Continent, UserProgress, FlashcardRating } from '../types';
import { COUNTRIES, COUNTRIES_BY_CONTINENT } from '../data/countries';
import { CONTINENTS_LIST, CONTINENTS_META } from '../data/continents';
import { recordSM2Result } from '../utils/storage';
import { getRatingIntervalPreviews } from '../utils/sm2';
import { CountryMap } from './CountryMap';
import { getFlagUrl } from '../utils/flags';

import { RegionFilter } from '../types';
import { getCountriesForRegionFilter } from '../data/subregions';
import { RegionFilterBadge } from './RegionSelectorModal';

interface FlashcardModeProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  initialContinent?: Continent;
  regionFilter: RegionFilter;
  onOpenRegionSelector: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  progress,
  onUpdateProgress,
  initialContinent,
  regionFilter,
  onOpenRegionSelector,
}) => {
  const [deck, setDeck] = useState<Country[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Record<FlashcardRating, number>>({
    no_lo_sabia: 0,
    dificil: 0,
    bien: 0,
    facil: 0,
  });

  const pool = useMemo(() => {
    return getCountriesForRegionFilter(regionFilter, COUNTRIES);
  }, [regionFilter]);

  const initDeck = useCallback(() => {
    const source = pool.length > 0 ? pool : COUNTRIES;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionRatings({
      no_lo_sabia: 0,
      dificil: 0,
      bien: 0,
      facil: 0,
    });
  }, [pool]);

  useEffect(() => {
    initDeck();
  }, [pool, initDeck]);

  const currentCountry = deck[currentIndex];
  const meta = currentCountry ? CONTINENTS_META[currentCountry.continent] : null;
  const currentStats = currentCountry ? progress.studyStats[currentCountry.id] : undefined;

  // Calculate interval predictions for the 4 buttons
  const intervalPreviews = getRatingIntervalPreviews(currentStats);

  const handleRating = (rating: FlashcardRating) => {
    if (!currentCountry) return;

    const updated = recordSM2Result(currentCountry.id, rating, progress);
    onUpdateProgress(updated);

    setSessionRatings(prev => ({ ...prev, [rating]: prev[rating] + 1 }));
    setIsFlipped(false);

    if (currentIndex + 1 >= deck.length) {
      setSessionCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted || !currentCountry) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === '1') {
        e.preventDefault();
        handleRating('no_lo_sabia');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRating('dificil');
      } else if (e.key === '3') {
        e.preventDefault();
        handleRating('bien');
      } else if (e.key === '4') {
        e.preventDefault();
        handleRating('facil');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessionCompleted, currentCountry, isFlipped, currentIndex, deck.length]);

  if (!currentCountry && !sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-xs font-mono text-stone-400">
        Cargando baraja de estudio...
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

      {/* Title & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
            Tarjetas de Estudio
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Programación de intervalos con algoritmo SM-2 y cajas de Leitner
          </p>
        </div>

        <div className="text-xs font-mono text-stone-400">
          <span>{deck.length} tarjetas en cola</span>
        </div>
      </div>

      {sessionCompleted ? (
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-10 sm:p-14 text-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block mb-2">
            Sesión concluida
          </span>
          <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100 mb-2">
            {deck.length} tarjetas evaluadas
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-8">
            Los próximos repasos se han programado según tu nivel de dificultad percibida.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto font-mono text-center mb-10 pb-8 border-b border-stone-100 dark:border-stone-800">
            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-2xl font-light text-stone-900 dark:text-stone-100 block">
                {sessionRatings.facil}
              </span>
              <span className="text-[10px] uppercase text-stone-400">Fácil</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-2xl font-light text-stone-900 dark:text-stone-100 block">
                {sessionRatings.bien}
              </span>
              <span className="text-[10px] uppercase text-stone-400">Bien</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-2xl font-light text-stone-900 dark:text-stone-100 block">
                {sessionRatings.dificil}
              </span>
              <span className="text-[10px] uppercase text-stone-400">Difícil</span>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-2xl font-light text-stone-500 block">
                {sessionRatings.no_lo_sabia}
              </span>
              <span className="text-[10px] uppercase text-stone-400">No lo sabía</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenRegionSelector}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-700 dark:text-stone-300 transition-colors"
            >
              Cambiar región
            </button>
            <button
              type="button"
              onClick={() => initDeck()}
              className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors"
            >
              Iniciar nueva sesión
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Card Sequence Meta */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-4">
            <div className="flex items-center gap-3">
              <span>
                {currentIndex + 1} / {deck.length}
              </span>
              {currentStats?.leitnerBox && (
                <>
                  <span>·</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    Caja Leitner {currentStats.leitnerBox}
                  </span>
                </>
              )}
            </div>
            <span className="hidden sm:inline">
              [Espacio] voltear · [1..4] clasificar
            </span>
          </div>

          {/* Flashcard container */}
          <div
            className="perspective-1000 w-full min-h-[380px] cursor-pointer mb-6"
            onClick={() => setIsFlipped(prev => !prev)}
          >
            <div
              className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT: Flag + Name */}
              <div
                className={`absolute inset-0 backface-hidden w-full h-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-10 flex flex-col justify-between select-none ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span>{currentCountry.continent}</span>
                  <span>{currentCountry.iso3}</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto text-center py-6">
                  {/* Flag */}
                  <div className="w-36 h-24 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 overflow-hidden mb-6">
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
                </div>

                <div className="text-center text-xs text-stone-400 font-mono">
                  Pulsa o haz clic para comprobar capital y mapa
                </div>
              </div>

              {/* BACK: Capital + Map + Fact */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 sm:p-10 flex flex-col justify-between select-none ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between border-b border-stone-100 dark:border-stone-800 pb-3 mb-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-stone-400 block">
                        País
                      </span>
                      <strong className="text-lg font-serif font-normal text-stone-900 dark:text-stone-100">
                        {currentCountry.name}
                      </strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono uppercase text-stone-400 block">
                        Capital
                      </span>
                      <strong className="text-lg font-serif font-normal text-stone-900 dark:text-stone-100">
                        {currentCountry.capital}
                      </strong>
                    </div>
                  </div>

                  <div className="mb-4">
                    <CountryMap
                      country={currentCountry}
                      height={160}
                      width={500}
                      mode="continental"
                      showControls={false}
                      interactive={false}
                      accentColor={meta?.theme.accentHex}
                    />
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                    {currentCountry.curiosity}
                  </p>
                </div>

                <div className="text-center text-xs text-stone-400 pt-2 font-mono">
                  Elige dificultad para programar el próximo repaso
                </div>
              </div>
            </div>
          </div>

          {/* 4 SM-2 / Leitner Buttons: Fácil, Bien, Difícil, No lo sabía */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1: No lo sabía */}
              <button
                type="button"
                onClick={() => handleRating('no_lo_sabia')}
                className="group flex flex-col items-center justify-center p-3 border border-stone-200 dark:border-stone-800 hover:border-red-400/80 dark:hover:border-red-400/60 bg-white dark:bg-stone-900 hover:bg-red-50/30 dark:hover:bg-red-950/20 text-stone-800 dark:text-stone-200 transition-all text-center"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs uppercase tracking-wider font-medium text-stone-800 dark:text-stone-200">
                    No lo sabía
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 group-hover:text-red-500">
                    (1)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                  Próx: {intervalPreviews.no_lo_sabia}
                </span>
              </button>

              {/* 2: Difícil */}
              <button
                type="button"
                onClick={() => handleRating('dificil')}
                className="group flex flex-col items-center justify-center p-3 border border-stone-200 dark:border-stone-800 hover:border-amber-400/80 dark:hover:border-amber-400/60 bg-white dark:bg-stone-900 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 text-stone-800 dark:text-stone-200 transition-all text-center"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs uppercase tracking-wider font-medium text-stone-800 dark:text-stone-200">
                    Difícil
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 group-hover:text-amber-500">
                    (2)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                  Próx: {intervalPreviews.dificil}
                </span>
              </button>

              {/* 3: Bien */}
              <button
                type="button"
                onClick={() => handleRating('bien')}
                className="group flex flex-col items-center justify-center p-3 border border-stone-300 dark:border-stone-700 hover:border-stone-600 dark:hover:border-stone-400 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 transition-all text-center"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs uppercase tracking-wider font-medium text-stone-900 dark:text-stone-100">
                    Bien
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">
                    (3)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                  Próx: {intervalPreviews.bien}
                </span>
              </button>

              {/* 4: Fácil */}
              <button
                type="button"
                onClick={() => handleRating('facil')}
                className="group flex flex-col items-center justify-center p-3 border border-stone-900 dark:border-stone-100 hover:bg-stone-800 dark:hover:bg-white bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 transition-all text-center"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs uppercase tracking-wider font-medium text-white dark:text-stone-900">
                    Fácil
                  </span>
                  <span className="font-mono text-[10px] text-stone-300 dark:text-stone-600">
                    (4)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-300 dark:text-stone-600">
                  Próx: {intervalPreviews.facil}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-2 px-1">
              <span>SM-2 Interval Scheduling</span>
              <span>Espacio = Voltear</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
