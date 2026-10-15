import React, { useState, useEffect, useMemo } from 'react';
import { Continent, Country, ActiveTab, UserProgress, RegionFilter } from './types';
import { CONTINENTS_LIST } from './data/continents';
import { COUNTRIES, COUNTRIES_BY_CONTINENT, TOTAL_COUNTRIES_COUNT } from './data/countries';
import {
  loadUserProgress,
  saveUserProgress,
  toggleMasteredStatus,
  toggleReviewStatus,
  loadSavedTheme,
  saveTheme,
} from './utils/storage';
import { getDailyReviewQueue } from './utils/sm2';
import { loadSavedRegionFilter, saveRegionFilter } from './data/subregions';
import { Header } from './components/Header';
import { ContinentCard } from './components/ContinentCard';
import { ContinentView } from './components/ContinentView';
import { CountryDetailModal } from './components/CountryDetailModal';
import { FlashcardMode } from './components/FlashcardMode';
import { DailyReviewMode } from './components/DailyReviewMode';
import { QuizMode } from './components/QuizMode';
import { TimeTrialMode } from './components/TimeTrialMode';
import { MapLocatorGame } from './components/MapLocatorGame';
import { SpacedRepetitionMode } from './components/SpacedRepetitionMode';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SettingsModal } from './components/SettingsModal';
import { RegionSelectorModal, RegionFilterBadge } from './components/RegionSelectorModal';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<ActiveTab>('continents');
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>(loadSavedRegionFilter);
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [studyContinent, setStudyContinent] = useState<Continent | undefined>(undefined);

  useEffect(() => {
    const saved = loadSavedTheme();
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  };

  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveUserProgress(updated);
  };

  const handleApplyRegionFilter = (newFilter: RegionFilter) => {
    setRegionFilter(newFilter);
    saveRegionFilter(newFilter);
  };

  const handleToggleMastered = (countryId: string) => {
    const updated = toggleMasteredStatus(countryId, progress);
    handleUpdateProgress(updated);
  };

  const handleToggleReview = (countryId: string) => {
    const updated = toggleReviewStatus(countryId, progress);
    handleUpdateProgress(updated);
  };

  const handleStartFlashcards = (continent?: Continent) => {
    if (continent) {
      const next: RegionFilter = { mode: 'custom', continents: [continent], subregions: [] };
      handleApplyRegionFilter(next);
    }
    setStudyContinent(continent);
    setActiveTab('flashcards');
    setSelectedContinent(null);
  };

  const handleStartQuiz = (continent?: Continent) => {
    if (continent) {
      const next: RegionFilter = { mode: 'custom', continents: [continent], subregions: [] };
      handleApplyRegionFilter(next);
    }
    setStudyContinent(continent);
    setActiveTab('quiz');
    setSelectedContinent(null);
  };

  const handleStartMapGame = (continent?: Continent) => {
    if (continent) {
      const next: RegionFilter = { mode: 'custom', continents: [continent], subregions: [] };
      handleApplyRegionFilter(next);
    }
    setStudyContinent(continent);
    setActiveTab('map-game');
    setSelectedContinent(null);
  };

  const totalMastered = progress.masteredIds.length;
  const globalPercent = Math.round((totalMastered / TOTAL_COUNTRIES_COUNT) * 100);

  const { dueCountries, pendingDueCount } = useMemo(
    () => getDailyReviewQueue(progress, 15),
    [progress]
  );

  const modalContinentCountries = selectedCountry
    ? COUNTRIES_BY_CONTINENT[selectedCountry.continent] || COUNTRIES
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'continents') {
            setSelectedContinent(null);
          }
        }}
        progress={progress}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <main className="flex-1 pb-24">
        {/* CONTINENTS TAB */}
        {activeTab === 'continents' && (
          <>
            {selectedContinent ? (
              <ContinentView
                continent={selectedContinent}
                progress={progress}
                onBack={() => setSelectedContinent(null)}
                onOpenDetails={(c) => setSelectedCountry(c)}
                onStartFlashcards={handleStartFlashcards}
                onStartQuiz={handleStartQuiz}
                onStartMapGame={handleStartMapGame}
                onToggleMastered={handleToggleMastered}
                onToggleReview={handleToggleReview}
              />
            ) : (
              <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-20 space-y-16">
                {/* Hero section */}
                <div className="space-y-6 max-w-3xl">
                  <span className="text-xs uppercase tracking-widest font-mono text-stone-400 block">
                    Atlas geográfico & estudio
                  </span>

                  <h1 className="text-4xl sm:text-6xl font-serif font-normal text-stone-900 dark:text-stone-100 leading-[1.15]">
                    Memoriza los Estados del mundo por continentes.
                  </h1>

                  <p className="text-base text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                    Repertorio completo de los {TOTAL_COUNTRIES_COUNT} países del mundo. Banderas oficiales, capitales administrativas y emplazamiento cartográfico.
                  </p>

                  <div className="pt-2 flex items-center gap-8 text-xs font-mono text-stone-500">
                    <div>
                      <span className="text-stone-900 dark:text-stone-100 font-medium">
                        {totalMastered}
                      </span>
                      <span> / {TOTAL_COUNTRIES_COUNT} países</span>
                    </div>
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <div>
                      <span>Dominio global: </span>
                      <span className="text-stone-900 dark:text-stone-100 font-medium">
                        {globalPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Minimalist Daily Review Banner */}
                <div className="border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Repetición Espaciada SM-2
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span className="text-xs font-mono text-stone-600 dark:text-stone-300">
                        {pendingDueCount > 0 ? `${pendingDueCount} por repasar hoy` : 'Al día'}
                      </span>
                    </div>
                    <h2 className="text-xl font-serif text-stone-900 dark:text-stone-100">
                      Repaso del día
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
                      Sesión programada de {dueCountries.length} países para afianzar la memoria a largo plazo según la curva de olvido.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRegionModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-700 dark:text-stone-300 transition-colors"
                    >
                      Elegir región
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartMapGame()}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-900 dark:text-stone-100 transition-colors"
                    >
                      Mapa mudo
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('daily-review')}
                      className="w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors"
                    >
                      Comenzar sesión
                    </button>
                  </div>
                </div>

                {/* 6 Continent Cards Grid */}
                <div className="space-y-6 pt-6 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-baseline justify-between text-xs text-stone-400 font-mono">
                    <span className="uppercase tracking-wider">
                      Continentes
                    </span>
                    <span>
                      6 divisiones territoriales
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CONTINENTS_LIST.map((cont) => (
                      <ContinentCard
                        key={cont}
                        continent={cont}
                        progress={progress}
                        onSelectContinent={(c) => setSelectedContinent(c)}
                        onStartFlashcards={(c) => handleStartFlashcards(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* DAILY REVIEW MODE */}
        {activeTab === 'daily-review' && (
          <DailyReviewMode
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onNavigateContinents={() => {
              setActiveTab('continents');
              setSelectedContinent(null);
            }}
            onNavigateQuiz={() => setActiveTab('quiz')}
            regionFilter={regionFilter}
            onOpenRegionSelector={() => setShowRegionModal(true)}
          />
        )}

        {/* FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <FlashcardMode
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            initialContinent={studyContinent}
            regionFilter={regionFilter}
            onOpenRegionSelector={() => setShowRegionModal(true)}
          />
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <QuizMode
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            initialContinent={studyContinent}
            regionFilter={regionFilter}
            onOpenRegionSelector={() => setShowRegionModal(true)}
          />
        )}

        {/* CONTRARRELOJ (TIME TRIAL) */}
        {activeTab === 'contrarreloj' && (
          <TimeTrialMode
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            regionFilter={regionFilter}
            onOpenRegionSelector={() => setShowRegionModal(true)}
          />
        )}

        {/* MAP LOCATOR GAME (MAPA MUDO) */}
        {activeTab === 'map-game' && (
          <MapLocatorGame
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            initialContinent={studyContinent}
            onNavigateContinents={() => {
              setActiveTab('continents');
              setSelectedContinent(null);
            }}
            regionFilter={regionFilter}
            onOpenRegionSelector={() => setShowRegionModal(true)}
          />
        )}

        {/* SPACED REPETITION */}
        {activeTab === 'spaced-review' && (
          <SpacedRepetitionMode
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenDetails={(c) => setSelectedCountry(c)}
            onStartDailyReview={() => setActiveTab('daily-review')}
          />
        )}

        {/* PROGRESS DASHBOARD */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onSelectContinent={(c) => {
              setSelectedContinent(c);
              setActiveTab('continents');
            }}
            onOpenDetails={(c) => setSelectedCountry(c)}
          />
        )}
      </main>

      {/* Modals */}
      {selectedCountry && (
        <CountryDetailModal
          country={selectedCountry}
          continentCountries={modalContinentCountries}
          progress={progress}
          onClose={() => setSelectedCountry(null)}
          onSelectCountry={(c) => setSelectedCountry(c)}
          onToggleMastered={handleToggleMastered}
          onToggleReview={handleToggleReview}
        />
      )}

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <RegionSelectorModal
        isOpen={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        currentFilter={regionFilter}
        onApplyFilter={handleApplyRegionFilter}
      />

      <OfflineBanner />

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-baseline justify-between gap-4 text-xs font-mono text-stone-400">
          <div className="flex items-center gap-4">
            <span>GeoMundo · {TOTAL_COUNTRIES_COUNT} países del mundo</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="hover:underline hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              Ajustes
            </button>
          </div>

          <div>
            <span>Datos cartográficos Natural Earth / D3.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
