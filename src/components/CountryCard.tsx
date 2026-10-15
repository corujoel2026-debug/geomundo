import React, { useState } from 'react';
import { Country, UserProgress } from '../types';
import { CONTINENTS_META } from '../data/continents';
import { getFlagUrl } from '../utils/flags';

interface CountryCardProps {
  country: Country;
  progress: UserProgress;
  onOpenDetails: (country: Country) => void;
  onToggleMastered: (countryId: string) => void;
  onToggleReview: (countryId: string) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({
  country,
  progress,
  onOpenDetails,
  onToggleMastered,
  onToggleReview,
}) => {
  const [imageError, setImageError] = useState(false);
  const isMastered = progress.masteredIds.includes(country.id);
  const isReview = progress.reviewIds.includes(country.id);
  const meta = CONTINENTS_META[country.continent];

  return (
    <article
      onClick={() => onOpenDetails(country)}
      className="group relative flex flex-col justify-between p-5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer"
    >
      <div>
        {/* Top Flag row & ISO code */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-10 h-7 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0">
            {!imageError ? (
              <img
                src={getFlagUrl(country, 160)}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-stone-500 uppercase">
                {country.iso2}
              </div>
            )}
          </div>

          <span className="font-mono text-xs text-stone-400">
            {country.iso3}
          </span>
        </div>

        {/* Country Name */}
        <h4 className="text-base font-normal text-stone-900 dark:text-stone-100 group-hover:underline underline-offset-4 decoration-stone-300 dark:decoration-stone-700 leading-snug">
          {country.name}
        </h4>

        {/* Capital */}
        <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          <span>{country.capital}</span>
        </div>
      </div>

      {/* Footer quiet status */}
      <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2">
          {isMastered ? (
            <span className="text-[11px] font-medium text-stone-900 dark:text-stone-200">
              Dominado
            </span>
          ) : isReview ? (
            <span className="text-[11px] text-stone-600 dark:text-stone-400">
              En repaso
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              Por estudiar
            </span>
          )}
        </div>

        {/* Action triggers */}
        <div
          className="flex items-center gap-2 text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onToggleReview(country.id)}
            className={`hover:underline ${isReview ? 'font-medium text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}
          >
            {isReview ? 'En repaso' : 'Repasar'}
          </button>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <button
            type="button"
            onClick={() => onToggleMastered(country.id)}
            className={`hover:underline ${isMastered ? 'font-medium text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}
          >
            {isMastered ? 'Desmarcar' : 'Dominar'}
          </button>
        </div>
      </div>
    </article>
  );
};
