import React, { useState, useMemo, useEffect } from 'react';
import { Continent, Subregion, RegionFilter } from '../types';
import { CONTINENTS_LIST } from '../data/continents';
import { COUNTRIES } from '../data/countries';
import {
  SUBREGIONS_BY_CONTINENT,
  getCountriesForRegionFilter,
  getRegionFilterSummary,
  saveRegionFilter,
} from '../data/subregions';
import { Globe, Check, X, Layers, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface RegionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: RegionFilter;
  onApplyFilter: (newFilter: RegionFilter) => void;
  title?: string;
  description?: string;
}

export const RegionSelectorModal: React.FC<RegionSelectorModalProps> = ({
  isOpen,
  onClose,
  currentFilter,
  onApplyFilter,
  title = 'Seleccionar región de estudio',
  description = 'Elige todo el mundo, uno o varios continentes, o profundiza en una subregión específica.',
}) => {
  const [mode, setMode] = useState<'world' | 'custom'>(currentFilter.mode);
  const [selectedContinents, setSelectedContinents] = useState<Continent[]>(
    currentFilter.continents || []
  );
  const [selectedSubregions, setSelectedSubregions] = useState<Subregion[]>(
    currentFilter.subregions || []
  );

  // Sync with current filter when opened
  useEffect(() => {
    if (isOpen) {
      setMode(currentFilter.mode);
      setSelectedContinents(currentFilter.continents || []);
      setSelectedSubregions(currentFilter.subregions || []);
    }
  }, [isOpen, currentFilter]);

  // Draft filter for live computation
  const draftFilter: RegionFilter = useMemo(() => {
    return {
      mode,
      continents: mode === 'world' ? [] : selectedContinents,
      subregions: mode === 'world' ? [] : selectedSubregions,
    };
  }, [mode, selectedContinents, selectedSubregions]);

  const previewCountries = useMemo(() => {
    return getCountriesForRegionFilter(draftFilter, COUNTRIES);
  }, [draftFilter]);

  const summary = useMemo(() => {
    return getRegionFilterSummary(draftFilter, COUNTRIES);
  }, [draftFilter]);

  if (!isOpen) return null;

  const handleToggleWorld = () => {
    setMode('world');
    setSelectedContinents([]);
    setSelectedSubregions([]);
  };

  const handleToggleContinent = (cont: Continent) => {
    setMode('custom');
    if (selectedContinents.includes(cont)) {
      // Remove continent and its subregions
      const nextContinents = selectedContinents.filter(c => c !== cont);
      setSelectedContinents(nextContinents);
      const contSubs = SUBREGIONS_BY_CONTINENT[cont] || [];
      setSelectedSubregions(prev => prev.filter(s => !contSubs.includes(s)));
      if (nextContinents.length === 0) {
        setMode('world');
      }
    } else {
      // Add continent
      setSelectedContinents(prev => [...prev, cont]);
    }
  };

  const handleToggleSubregion = (sub: Subregion, parentContinent: Continent) => {
    setMode('custom');
    // Ensure parent continent is selected
    if (!selectedContinents.includes(parentContinent)) {
      setSelectedContinents(prev => [...prev, parentContinent]);
    }

    if (selectedSubregions.includes(sub)) {
      setSelectedSubregions(prev => prev.filter(s => s !== sub));
    } else {
      setSelectedSubregions(prev => [...prev, sub]);
    }
  };

  const handleSelectOnlySubregion = (sub: Subregion, parentContinent: Continent) => {
    setMode('custom');
    setSelectedContinents([parentContinent]);
    setSelectedSubregions([sub]);
  };

  const handleApply = () => {
    saveRegionFilter(draftFilter);
    onApplyFilter(draftFilter);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-stone-700 dark:text-stone-300" />
              <h3 className="text-xl font-serif font-normal text-stone-900 dark:text-stone-100">
                {title}
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Filter Indicator Bar */}
        <div className="p-3.5 bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-stone-400 uppercase text-[10px] tracking-wider block">
              Selección activa:
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 px-2 py-0.5 border border-stone-200 dark:border-stone-700">
              {summary.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 dark:text-stone-400">Total incluidos:</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              {summary.count} {summary.count === 1 ? 'país' : 'países'}
            </span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1 text-xs">
          {/* Quick World Option */}
          <div>
            <button
              type="button"
              onClick={handleToggleWorld}
              className={`w-full flex items-center justify-between p-3.5 border transition-all text-left ${
                mode === 'world'
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium shadow-sm'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 bg-stone-50 dark:bg-stone-950/40 text-stone-800 dark:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-sm font-medium block">Todo el mundo</span>
                  <span className={`text-[11px] block font-mono ${mode === 'world' ? 'opacity-80' : 'text-stone-400'}`}>
                    Estudiar con el catálogo completo de países y territorios
                  </span>
                </div>
              </div>

              <span className="font-mono text-xs px-2 py-0.5 border border-current">
                253 países
              </span>
            </button>
          </div>

          {/* Continents & Subregions Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block font-semibold">
                O filtra por Continentes y Subregiones (ONU)
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                (puedes marcar varios a la vez)
              </span>
            </div>

            {/* Continents list with subregions expansion */}
            <div className="space-y-3">
              {CONTINENTS_LIST.filter(c => c !== 'Antártida').map((continent) => {
                const isContSelected = mode === 'custom' && selectedContinents.includes(continent);
                const subregions = SUBREGIONS_BY_CONTINENT[continent] || [];
                const contCountriesCount = COUNTRIES.filter(c => c.continent === continent).length;

                // Check which subregions of this continent are selected
                const activeSubsInCont = subregions.filter(s => selectedSubregions.includes(s));

                return (
                  <div
                    key={continent}
                    className={`border transition-colors ${
                      isContSelected
                        ? 'border-stone-400 dark:border-stone-600 bg-stone-50/70 dark:bg-stone-900/60'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950/30'
                    }`}
                  >
                    {/* Continent row with checkbox */}
                    <div className="flex items-center justify-between p-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isContSelected}
                          onChange={() => handleToggleContinent(continent)}
                          className="w-4 h-4 rounded text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700 cursor-pointer focus:ring-0"
                        />
                        <span className="font-medium text-sm text-stone-900 dark:text-stone-100">
                          {continent}
                        </span>
                      </label>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                        <span>{contCountriesCount} países</span>
                        {activeSubsInCont.length > 0 && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                            {activeSubsInCont.length} {activeSubsInCont.length === 1 ? 'subregión' : 'subregiones'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Subregions pill chips (always accessible or highlighted when continent is active) */}
                    <div className="px-3 pb-3 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block mb-2">
                        Subregiones:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {subregions.map((sub) => {
                          const isSubSelected = selectedSubregions.includes(sub);
                          const subCount = COUNTRIES.filter(c => c.subregion === sub).length;

                          return (
                            <div
                              key={sub}
                              className="inline-flex items-center gap-1 border transition-all text-xs"
                              style={{
                                borderColor: isSubSelected ? '#047857' : undefined,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggleSubregion(sub, continent)}
                                title={`Alternar ${sub} (${subCount} países)`}
                                className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
                                  isSubSelected
                                    ? 'bg-emerald-700 text-white font-medium'
                                    : 'bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                                }`}
                              >
                                {isSubSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                                <span>{sub}</span>
                                <span className={`font-mono text-[10px] ${isSubSelected ? 'opacity-80' : 'text-stone-400'}`}>
                                  ({subCount})
                                </span>
                              </button>

                              {/* Direct "Solo esta" quick isolate button */}
                              <button
                                type="button"
                                onClick={() => handleSelectOnlySubregion(sub, continent)}
                                title={`Seleccionar únicamente ${sub}`}
                                className="px-1.5 py-1 text-[10px] font-mono text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                              >
                                solo
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleWorld}
            className="text-xs font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:underline"
          >
            Restablecer a Todo el mundo
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Aplicar selección</span>
              <span className="opacity-80 font-normal">({summary.count})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RegionFilterBadgeProps {
  filter: RegionFilter;
  onOpenSelector: () => void;
  className?: string;
  compact?: boolean;
}

export const RegionFilterBadge: React.FC<RegionFilterBadgeProps> = ({
  filter,
  onOpenSelector,
  className = '',
  compact = false,
}) => {
  const summary = useMemo(() => {
    return getRegionFilterSummary(filter, COUNTRIES);
  }, [filter]);

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenSelector}
        title="Cambiar región de estudio"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 hover:border-stone-400 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 transition-colors shadow-2xs ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
          {summary.label}
        </span>
        <span className="text-[10px] text-stone-400">({summary.count})</span>
        <span className="text-[10px] text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline ml-0.5">
          Cambiar
        </span>
      </button>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 p-2.5 sm:p-3 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-mono shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="truncate">
          <span className="text-[10px] uppercase text-stone-400 block tracking-wider">
            Región de estudio activa
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm truncate">
              {summary.label}
            </span>
            <span className="text-stone-400 text-xs">
              ({summary.count} {summary.count === 1 ? 'país' : 'países'})
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenSelector}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors uppercase tracking-wider text-[11px] font-medium shrink-0"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Cambiar región</span>
      </button>
    </div>
  );
};
