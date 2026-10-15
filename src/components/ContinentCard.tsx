import React from 'react';
import { Continent, UserProgress } from '../types';
import { CONTINENTS_META } from '../data/continents';
import { COUNTRIES_BY_CONTINENT } from '../data/countries';
import { ArrowUpRight } from 'lucide-react';

interface ContinentCardProps {
  continent: Continent;
  progress: UserProgress;
  onSelectContinent: (c: Continent) => void;
  onStartFlashcards: (c: Continent) => void;
}

export const ContinentCard: React.FC<ContinentCardProps> = ({
  continent,
  progress,
  onSelectContinent,
  onStartFlashcards,
}) => {
  const meta = CONTINENTS_META[continent];
  const countries = COUNTRIES_BY_CONTINENT[continent] || [];
  const total = meta.countryCount;

  const masteredCount = countries.filter(c => progress.masteredIds.includes(c.id)).length;
  const percent = total > 0 ? Math.round((masteredCount / total) * 100) : (continent === 'Antártida' ? 100 : 0);

  return (
    <article
      onClick={() => onSelectContinent(continent)}
      className="group relative flex flex-col justify-between p-7 rounded-none border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer"
    >
      <div>
        {/* Top subtle category & accent indicator */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: meta.theme.accentHex }}
            />
            <span className="tracking-widest uppercase font-mono text-[11px]">
              {total > 0 ? `${total} países` : 'Territorio polar'}
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100 group-hover:underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700 mb-3">
          {meta.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal mb-8">
          {meta.description}
        </p>
      </div>

      {/* Mastery line indicator */}
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
          <span>
            {total > 0 ? (
              <>
                <span className="font-mono tabular-nums text-stone-800 dark:text-stone-200">
                  {masteredCount}
                </span>{' '}
                dominados
              </>
            ) : (
              'Bases científicas'
            )}
          </span>
          <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">
            {percent}%
          </span>
        </div>

        {/* Thin minimalist progress rule */}
        <div className="h-0.5 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${percent}%`,
              backgroundColor: meta.theme.accentHex,
            }}
          />
        </div>
      </div>
    </article>
  );
};
