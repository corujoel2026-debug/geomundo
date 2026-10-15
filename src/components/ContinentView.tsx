import React, { useState, useMemo } from 'react';
import { Continent, Country, UserProgress, Subregion, AppExperienceMode } from '../types';
import { CONTINENTS_META } from '../data/continents';
import { COUNTRIES_BY_CONTINENT } from '../data/countries';
import { SUBREGIONS_BY_CONTINENT } from '../data/subregions';
import { CountryCard } from './CountryCard';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';

interface ContinentViewProps {
  continent: Continent;
  progress: UserProgress;
  onBack: () => void;
  onOpenDetails: (country: Country) => void;
  onStartFlashcards: (continent: Continent) => void;
  onStartQuiz: (continent: Continent) => void;
  onStartMapGame?: (continent: Continent) => void;
  onToggleMastered: (countryId: string) => void;
  onToggleReview: (countryId: string) => void;
  experienceMode?: AppExperienceMode;
  onStartGuidedPractice?: (continent: Continent) => void;
}

export const ContinentView: React.FC<ContinentViewProps> = ({
  continent,
  progress,
  onBack,
  onOpenDetails,
  onStartFlashcards,
  onStartQuiz,
  onStartMapGame,
  onToggleMastered,
  onToggleReview,
  experienceMode = 'simple',
  onStartGuidedPractice,
}) => {
  const meta = CONTINENTS_META[continent];
  const countries = COUNTRIES_BY_CONTINENT[continent] || [];
  const subregions = SUBREGIONS_BY_CONTINENT[continent] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'mastered' | 'review' | 'unstudied'>('all');
  const [selectedSubregion, setSelectedSubregion] = useState<Subregion | 'all'>('all');

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return countries.filter(c => {
      if (selectedSubregion !== 'all' && c.subregion !== selectedSubregion) {
        return false;
      }

      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.iso3.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const isMastered = progress.masteredIds.includes(c.id);
      const isReview = progress.reviewIds.includes(c.id);

      if (filterState === 'mastered') return isMastered;
      if (filterState === 'review') return isReview;
      if (filterState === 'unstudied') return !isMastered && !isReview;

      return true;
    });
  }, [countries, searchQuery, filterState, selectedSubregion, progress]);

  const masteredCount = countries.filter(c => progress.masteredIds.includes(c.id)).length;
  const percent = countries.length > 0 ? Math.round((masteredCount / countries.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-12 space-y-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Continentes</span>
        </button>

        {countries.length > 0 && (
          experienceMode === 'simple' ? (
            <button
              type="button"
              onClick={() => {
                if (onStartGuidedPractice) {
                  onStartGuidedPractice(continent);
                } else {
                  onStartFlashcards(continent);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Practicar {meta.name}</span>
            </button>
          ) : (
            <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
              <button
                type="button"
                onClick={() => onStartFlashcards(continent)}
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-4"
              >
                Tarjetas
              </button>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <button
                type="button"
                onClick={() => onStartQuiz(continent)}
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-4"
              >
                Cuestionario
              </button>
              {onStartMapGame && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <button
                    type="button"
                    onClick={() => onStartMapGame(continent)}
                    className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline underline-offset-4"
                  >
                    Mapa mudo
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>

      {/* Header Info */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: meta.theme.accentHex }}
          />
          <span>División continental</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-normal text-stone-900 dark:text-stone-100">
          {meta.name}
        </h1>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
          {meta.description}
        </p>

        {countries.length > 0 && (
          <div className="pt-2 text-xs text-stone-400 font-mono">
            <span>{countries.length} países</span>
            <span className="mx-2">·</span>
            <span>{masteredCount} dominados ({percent}%)</span>
          </div>
        )}
      </div>

      {/* Antártida special case */}
      {continent === 'Antártida' ? (
        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-6">
          <h3 className="text-xl font-serif text-stone-900 dark:text-stone-100">
            Marco jurídico y geográfico polar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            <div className="border-l border-stone-200 dark:border-stone-800 pl-4 space-y-1">
              <span className="font-mono uppercase text-stone-400 block">
                Tratado Antártico (1959)
              </span>
              <p>
                Régimen internacional que consagra la masa polar austral para fines exclusivamente pacíficos y científicos, congelando las reclamaciones soberanas territoriales.
              </p>
            </div>

            <div className="border-l border-stone-200 dark:border-stone-800 pl-4 space-y-1">
              <span className="font-mono uppercase text-stone-400 block">
                Superficie y reservas hídricas
              </span>
              <p>
                Superficie aproximada de 14.200.000 km². Constituye el continente más frío y seco, albergando el 70% del agua dulce del globo en forma de casquete de hielo.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Countries Directory */
        <div className="space-y-6">
          {/* Search & quiet filters */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder={`Buscar país o capital (${countries.length})...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-4 py-1 text-xs border-b border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100 font-mono"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFilterState('all')}
                className={`transition-colors ${
                  filterState === 'all'
                    ? 'font-medium text-stone-900 dark:text-stone-100 underline underline-offset-4'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Todos ({countries.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterState('mastered')}
                className={`transition-colors ${
                  filterState === 'mastered'
                    ? 'font-medium text-stone-900 dark:text-stone-100 underline underline-offset-4'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Dominados ({countries.filter(c => progress.masteredIds.includes(c.id)).length})
              </button>

              <button
                type="button"
                onClick={() => setFilterState('review')}
                className={`transition-colors ${
                  filterState === 'review'
                    ? 'font-medium text-stone-900 dark:text-stone-100 underline underline-offset-4'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Repaso ({countries.filter(c => progress.reviewIds.includes(c.id)).length})
              </button>

              <button
                type="button"
                onClick={() => setFilterState('unstudied')}
                className={`transition-colors ${
                  filterState === 'unstudied'
                    ? 'font-medium text-stone-900 dark:text-stone-100 underline underline-offset-4'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Por estudiar
              </button>
            </div>
          </div>

          {/* Subregions chips (Only in Advanced Mode) */}
          {experienceMode === 'advanced' && subregions.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-[10px] uppercase text-stone-400 shrink-0">Subregión:</span>
              <button
                type="button"
                onClick={() => setSelectedSubregion('all')}
                className={`px-2.5 py-1 border transition-colors ${
                  selectedSubregion === 'all'
                    ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                }`}
              >
                Todas ({countries.length})
              </button>
              {subregions.map((sub) => {
                const subCount = countries.filter(c => c.subregion === sub).length;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubregion(sub)}
                    className={`px-2.5 py-1 border whitespace-nowrap transition-colors ${
                      selectedSubregion === sub
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                    }`}
                  >
                    {sub} ({subCount})
                  </button>
                );
              })}
            </div>
          )}

          {/* Grid */}
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCountries.map((c) => (
                <CountryCard
                  key={c.id}
                  country={c}
                  progress={progress}
                  onOpenDetails={onOpenDetails}
                  onToggleMastered={onToggleMastered}
                  onToggleReview={onToggleReview}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-xs font-mono text-stone-400 border border-dashed border-stone-200 dark:border-stone-800">
              No se encontraron países correspondientes al criterio especificado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
