import React, { useMemo } from 'react';
import { ActiveTab, UserProgress, AppExperienceMode } from '../types';
import { TOTAL_COUNTRIES_COUNT } from '../data/countries';
import { getDailyReviewQueue } from '../utils/sm2';
import { Sun, Moon, Settings, HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  progress: UserProgress;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  experienceMode?: AppExperienceMode;
  onOpenOnboarding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  theme,
  onToggleTheme,
  onOpenSettings,
  experienceMode = 'simple',
  onOpenOnboarding,
}) => {
  const { pendingDueCount } = useMemo(() => getDailyReviewQueue(progress, 15), [progress]);

  const navItems: { id: ActiveTab; label: string; badge?: number; icon?: boolean }[] = useMemo(() => {
    if (experienceMode === 'simple') {
      return [
        { id: 'continents', label: 'Continentes' },
        { id: 'guided-practice', label: 'Practicar', icon: true },
      ];
    }
    return [
      { id: 'continents', label: 'Continentes' },
      { id: 'daily-review', label: 'Repaso del día', badge: pendingDueCount > 0 ? pendingDueCount : undefined },
      { id: 'flashcards', label: 'Tarjetas' },
      { id: 'quiz', label: 'Cuestionario' },
      { id: 'contrarreloj', label: 'Contrarreloj' },
      { id: 'map-game', label: 'Mapa mudo' },
      { id: 'progress', label: 'Progreso' },
    ];
  }, [experienceMode, pendingDueCount]);

  const masteredCount = progress.masteredIds.length;
  const percentage = Math.round((masteredCount / TOTAL_COUNTRIES_COUNT) * 100);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-stone-950/95 backdrop-blur-xs border-b border-stone-200/80 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-baseline gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('continents')}
            className="text-left text-stone-900 dark:text-stone-100 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <span className="text-xl font-medium tracking-tight font-display">
              GeoMundo
            </span>
          </button>
          <span className="hidden sm:inline text-xs text-stone-400 font-mono">
            Atlas de memorización
          </span>
        </div>

        {/* Text Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`text-xs tracking-wide uppercase transition-colors relative py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'font-semibold text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-px bg-stone-900 dark:bg-stone-100" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quiet Metrics & Theme */}
        <div className="flex items-center gap-5 text-xs text-stone-500 dark:text-stone-400">
          <div className="hidden sm:flex items-center gap-2">
            <span>Dominio:</span>
            <span className="font-mono tabular-nums font-medium text-stone-900 dark:text-stone-200">
              {masteredCount}/{TOTAL_COUNTRIES_COUNT}
            </span>
            <span className="text-stone-400 font-mono">({percentage}%)</span>
          </div>

          <div className="hidden sm:inline text-stone-300 dark:text-stone-700">·</div>

          <div className="flex items-center gap-1.5">
            <span>Racha:</span>
            <span className="font-mono tabular-nums font-medium text-stone-900 dark:text-stone-200">
              {progress.currentStreak} {progress.currentStreak === 1 ? 'día' : 'días'}
            </span>
          </div>

          {/* Theme button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-1.5 rounded text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {onOpenOnboarding && (
            <>
              <div className="hidden sm:inline text-stone-300 dark:text-stone-700">·</div>
              <button
                type="button"
                onClick={onOpenOnboarding}
                aria-label="Abrir guía de bienvenida"
                title="Cómo usar GeoMundo"
                className="flex items-center gap-1.5 px-2 py-1 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono uppercase tracking-wider hidden lg:inline">Guía</span>
              </button>
            </>
          )}

          <div className="hidden sm:inline text-stone-300 dark:text-stone-700">·</div>

          {/* Ajustes button */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Abrir ajustes"
            title="Ajustes de la aplicación"
            className="flex items-center gap-1.5 px-2 py-1 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors rounded-none"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono uppercase tracking-wider">Ajustes</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/70 dark:border-stone-800 px-4 py-2 bg-white dark:bg-stone-950 overflow-x-auto gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`text-[11px] uppercase tracking-wider py-1 px-1.5 whitespace-nowrap transition-colors flex items-center gap-1 ${
                isActive
                  ? 'font-semibold text-stone-900 dark:text-stone-100 border-b border-stone-900 dark:border-stone-100'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-[9px] font-mono px-1 rounded-full border border-stone-300 dark:border-stone-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {onOpenOnboarding && (
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="text-[11px] uppercase tracking-wider py-1 px-1.5 whitespace-nowrap transition-colors flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:text-stone-400"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Guía</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          className="text-[11px] uppercase tracking-wider py-1 px-1.5 whitespace-nowrap transition-colors flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:text-stone-400"
        >
          <Settings className="w-3 h-3" />
          <span>Ajustes</span>
        </button>
      </div>
    </header>
  );
};
