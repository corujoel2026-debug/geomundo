import React, { useState } from 'react';
import { Country, UserProgress } from '../types';
import { CONTINENTS_META } from '../data/continents';
import { CountryMap } from './CountryMap';
import { getFlagUrl } from '../utils/flags';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CountryDetailModalProps {
  country: Country | null;
  continentCountries: Country[];
  progress: UserProgress;
  onClose: () => void;
  onSelectCountry: (c: Country) => void;
  onToggleMastered: (countryId: string) => void;
  onToggleReview: (countryId: string) => void;
}

export const CountryDetailModal: React.FC<CountryDetailModalProps> = ({
  country,
  continentCountries,
  progress,
  onClose,
  onSelectCountry,
  onToggleMastered,
  onToggleReview,
}) => {
  if (!country) return null;

  const [imageError, setImageError] = useState(false);
  const meta = CONTINENTS_META[country.continent];
  const isMastered = progress.masteredIds.includes(country.id);
  const isReview = progress.reviewIds.includes(country.id);

  const currentIndex = continentCountries.findIndex(c => c.id === country.id);
  const prevCountry = currentIndex > 0 ? continentCountries[currentIndex - 1] : null;
  const nextCountry = currentIndex < continentCountries.length - 1 ? continentCountries[currentIndex + 1] : null;

  const formattedPopulation = new Intl.NumberFormat('es-ES').format(country.population);
  const formattedArea = new Intl.NumberFormat('es-ES').format(country.areaKm2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto bg-stone-950/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 pb-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-start gap-5">
            {/* Flag */}
            <div className="w-14 h-9 border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 shrink-0 overflow-hidden">
              {!imageError ? (
                <img
                  src={getFlagUrl(country, 160)}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs text-stone-400">
                  {country.iso2}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
                  {country.name}
                </h2>
                <span className="font-mono text-xs text-stone-400">
                  {country.iso3}
                </span>
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                <span>{country.continent}</span>
                <span className="mx-2 text-stone-300 dark:text-stone-700">·</span>
                <span>Capital: {country.capital}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ficha"
            className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-7 max-h-[70vh] overflow-y-auto">
          {/* Map */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="uppercase tracking-wider font-mono text-[11px]">
                Cartografía
              </span>
              <span className="text-stone-400">
                País resaltado en su contexto continental
              </span>
            </div>

            <CountryMap
              country={country}
              height={280}
              width={600}
              mode="continental"
              accentColor={meta.theme.accentHex}
            />
          </div>

          {/* Demographic & Geographic Data Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Capital
              </span>
              <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                {country.capital}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Población aprox.
              </span>
              <span className="text-sm font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                {formattedPopulation}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Superficie
              </span>
              <span className="text-sm font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                {formattedArea} km²
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Coordenadas
              </span>
              <span className="text-xs font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                {country.coords[0] >= 0 ? `${country.coords[0].toFixed(1)}°N` : `${Math.abs(country.coords[0]).toFixed(1)}°S`},{' '}
                {country.coords[1] >= 0 ? `${country.coords[1].toFixed(1)}°E` : `${Math.abs(country.coords[1]).toFixed(1)}°W`}
              </span>
            </div>
          </div>

          {/* Reference Fact */}
          <div className="p-4 border-l-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            <span className="font-medium text-stone-900 dark:text-stone-100 mr-1.5">
              Nota geográfica:
            </span>
            {country.curiosity}
          </div>

          {/* Study Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="text-xs text-stone-500">
              Estado actual:{' '}
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {isMastered ? 'Dominado' : isReview ? 'En cola de repaso' : 'Por estudiar'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => onToggleReview(country.id)}
                className="hover:underline text-stone-600 dark:text-stone-400"
              >
                {isReview ? 'Quitar de repaso' : 'Marcar para repaso'}
              </button>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <button
                type="button"
                onClick={() => onToggleMastered(country.id)}
                className="font-medium hover:underline text-stone-900 dark:text-stone-100"
              >
                {isMastered ? 'Desmarcar como dominado' : 'Marcar como dominado'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
          <button
            type="button"
            disabled={!prevCountry}
            onClick={() => prevCountry && onSelectCountry(prevCountry)}
            className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior: {prevCountry?.name || '—'}</span>
          </button>

          <span className="font-mono text-stone-400">
            {currentIndex + 1} / {continentCountries.length}
          </span>

          <button
            type="button"
            disabled={!nextCountry}
            onClick={() => nextCountry && onSelectCountry(nextCountry)}
            className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <span>Siguiente: {nextCountry?.name || '—'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
