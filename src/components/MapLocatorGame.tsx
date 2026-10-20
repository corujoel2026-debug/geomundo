import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import { Country, Continent, UserProgress, RegionFilter, Subregion } from '../types';
import { COUNTRIES } from '../data/countries';
import { CONTINENTS_LIST } from '../data/continents';
import { getCountriesForRegionFilter, SUBREGION_MAP_VIEWS } from '../data/subregions';
import { recordCountryResult } from '../utils/storage';
import { getFlagUrl } from '../utils/flags';
import { RegionFilterBadge } from './RegionSelectorModal';
import { EspacioPublicitario } from './EspacioPublicitario';
import { RefreshCw, ZoomIn, ZoomOut, Eye, ArrowRight, Check, X, Target, Globe } from 'lucide-react';

interface MapLocatorGameProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  initialContinent?: Continent;
  onNavigateContinents?: () => void;
  regionFilter: RegionFilter;
  onOpenRegionSelector: () => void;
}

const worldGeo = topojson.feature(
  worldAtlasData as any,
  (worldAtlasData as any).objects.countries
) as any;

// Pre-index country by ISO numeric
const countriesByIsoNumeric = new Map<string, Country>();
COUNTRIES.forEach(c => {
  countriesByIsoNumeric.set(c.isoNumeric.padStart(3, '0'), c);
  countriesByIsoNumeric.set(String(parseInt(c.isoNumeric, 10)), c);
});

// Set of ISO numerics that have polygon representation
const countriesWithPolygon = new Set<string>();
worldGeo.features.forEach((f: any) => {
  const fId = String(f.id).padStart(3, '0');
  countriesWithPolygon.add(fId);
  countriesWithPolygon.add(String(parseInt(fId, 10)));
});

export const MapLocatorGame: React.FC<MapLocatorGameProps> = ({
  progress,
  onUpdateProgress,
  initialContinent,
  onNavigateContinents,
  regionFilter,
  onOpenRegionSelector,
}) => {
  const [roundLength, setRoundLength] = useState<number>(10);
  const [deck, setDeck] = useState<Country[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [clickedCountry, setClickedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [failedCountries, setFailedCountries] = useState<Country[]>([]);

  // Map viewport & pan/zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Pool of countries filtered by region and subregion
  const pool = useMemo(() => {
    return getCountriesForRegionFilter(regionFilter, COUNTRIES);
  }, [regionFilter]);

  // Initialize round from all countries and territories in pool
  const initRound = useCallback((count: number) => {
    const activePool = pool.length > 0 ? pool : COUNTRIES;
    const shuffled = [...activePool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(count, activePool.length));

    setDeck(chosen);
    setCurrentIndex(0);
    setIsAnswered(false);
    setClickedCountry(null);
    setHoveredCountry(null);
    setIsCorrect(false);
    setScore(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setShowHint(false);
    setSessionCompleted(false);
    setFailedCountries([]);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [pool]);

  // Auto-reset and auto-zoom when region filter changes
  useEffect(() => {
    initRound(roundLength);
  }, [pool, roundLength, initRound]);

  const currentCountry = deck[currentIndex];

  // Auto-zoom projection presets based on region / subregion
  const projectionConfig = useMemo(() => {
    const width = 800;
    const height = 480;

    let proj: d3Geo.GeoProjection = d3Geo.geoNaturalEarth1().scale(130).translate([width / 2, height / 2]);

    // 1. Single Subregion Auto-zoom
    if (regionFilter.subregions && regionFilter.subregions.length === 1) {
      const sub = regionFilter.subregions[0];
      const view = SUBREGION_MAP_VIEWS[sub];

      if (view) {
        const isPacific = sub === 'Polinesia' || sub === 'Micronesia' || sub === 'Melanesia' || sub === 'Australia y Nueva Zelanda';
        if (isPacific) {
          proj = d3Geo.geoMercator()
            .rotate([-170, 0])
            .center([view.centerLng > 0 ? view.centerLng - 170 : view.centerLng + 190, view.centerLat])
            .scale(320 * view.zoomLevel * zoomLevel)
            .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
        } else {
          proj = d3Geo.geoMercator()
            .center([view.centerLng, view.centerLat])
            .scale(300 * view.zoomLevel * zoomLevel)
            .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
        }
      }
    }
    // 2. Single Continent Auto-zoom
    else if (
      regionFilter.continents &&
      regionFilter.continents.length === 1 &&
      (!regionFilter.subregions || regionFilter.subregions.length === 0)
    ) {
      const singleContinent = regionFilter.continents[0];
      let centerLng = 15;
      let centerLat = 50;
      let baseScale = 450;

      switch (singleContinent) {
        case 'Europa':
          centerLng = 16;
          centerLat = 53;
          baseScale = 520;
          break;
        case 'América':
          centerLng = -75;
          centerLat = 12;
          baseScale = 220;
          break;
        case 'Asia':
          centerLng = 88;
          centerLat = 32;
          baseScale = 270;
          break;
        case 'África':
          centerLng = 20;
          centerLat = 4;
          baseScale = 360;
          break;
        case 'Oceanía':
          proj = d3Geo.geoMercator()
            .rotate([-170, 0])
            .center([0, -20])
            .scale(300 * zoomLevel)
            .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
          break;
        case 'Antártida':
          centerLng = 0;
          centerLat = -85;
          baseScale = 300;
          break;
      }

      if (singleContinent !== 'Oceanía') {
        proj = d3Geo.geoMercator()
          .center([centerLng, centerLat])
          .scale(baseScale * zoomLevel)
          .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
      }
    }
    // 3. Multi-continent or World View
    else {
      proj = d3Geo.geoNaturalEarth1()
        .scale(130 * zoomLevel)
        .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
    }

    const pathGen = d3Geo.geoPath().projection(proj);
    return { projection: proj, pathGenerator: pathGen, width, height };
  }, [regionFilter, zoomLevel, panOffset]);

  // Click on any country (polygon or marker)
  const handleCountrySelect = (matched: Country) => {
    if (isAnswered || !currentCountry) return;

    const correct = matched.id === currentCountry.id;
    setClickedCountry(matched);
    setIsCorrect(correct);
    setIsAnswered(true);

    const updated = recordCountryResult(currentCountry.id, correct, progress);
    onUpdateProgress(updated);

    if (correct) {
      setScore(prev => prev + 1);
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);
    } else {
      setCurrentStreak(0);
      setFailedCountries(prev => [...prev, currentCountry]);
    }
  };

  // Click on a map country polygon
  const handleFeatureClick = (feature: any) => {
    if (isAnswered || !currentCountry) return;

    const featId = String(feature.id).padStart(3, '0');
    const matched = countriesByIsoNumeric.get(featId) || countriesByIsoNumeric.get(String(parseInt(featId, 10)));

    if (!matched) return;
    handleCountrySelect(matched);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= deck.length) {
      setSessionCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setClickedCountry(null);
      setHoveredCountry(null);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  // Auto-focus on country location
  const handleFocusCountry = () => {
    if (!currentCountry) return;
    const newZoom = 2.8;
    setZoomLevel(newZoom);
    const width = projectionConfig.width;
    const height = projectionConfig.height;

    let centerLng = currentCountry.coords[1];
    let centerLat = currentCountry.coords[0];

    // Center on target country coordinates
    const pt = projectionConfig.projection([centerLng, centerLat]);
    if (pt) {
      const offsetX = (width / 2) - pt[0] + panOffset.x;
      const offsetY = (height / 2) - pt[1] + panOffset.y;
      setPanOffset({ x: offsetX, y: offsetY });
    }
  };

  const handleResetWorld = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Keyboard shortcut for Next question [Enter] or [Space]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentIndex, deck.length]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render SVG polygon features
  const mapElements = useMemo(() => {
    if (!worldGeo?.features) return null;

    const targetIso = currentCountry ? currentCountry.isoNumeric.padStart(3, '0') : '';
    const targetIsoInt = currentCountry ? String(parseInt(currentCountry.isoNumeric, 10)) : '';

    const clickedIso = clickedCountry ? clickedCountry.isoNumeric.padStart(3, '0') : '';
    const clickedIsoInt = clickedCountry ? String(parseInt(clickedCountry.isoNumeric, 10)) : '';

    return worldGeo.features.map((feature: any, idx: number) => {
      const featId = String(feature.id).padStart(3, '0');
      const featIdInt = String(parseInt(featId, 10));
      const pathD = projectionConfig.pathGenerator(feature);
      if (!pathD) return null;

      const matchedCountry = countriesByIsoNumeric.get(featId) || countriesByIsoNumeric.get(featIdInt);
      const isTarget = isAnswered && (featId === targetIso || featIdInt === targetIsoInt);
      const isClicked = isAnswered && (featId === clickedIso || featIdInt === clickedIsoInt);

      // SOBER STYLING: No names printed on countries
      let fill = 'var(--map-neutral-bg, #ebe8e5)';
      let stroke = 'var(--map-neutral-stroke, #cfcbc6)';
      let strokeWidth = '0.6';
      let cursor = isAnswered ? 'default' : 'pointer';

      if (isAnswered) {
        if (isTarget) {
          fill = '#10b981';
          stroke = '#047857';
          strokeWidth = '1.4';
        } else if (isClicked && !isCorrect) {
          fill = '#ef4444';
          stroke = '#b91c1c';
          strokeWidth = '1.4';
        } else {
          fill = 'var(--map-dim-bg, #f5f4f2)';
          stroke = 'var(--map-dim-stroke, #e5e3df)';
        }
      }

      return (
        <path
          key={feature.id || idx}
          d={pathD}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={{ cursor }}
          className={`transition-colors duration-150 ${
            !isAnswered ? 'hover:fill-stone-300 dark:hover:fill-stone-700' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleFeatureClick(feature);
          }}
          onMouseEnter={() => {
            if (!isAnswered && matchedCountry) {
              setHoveredCountry(matchedCountry);
            }
          }}
          onMouseLeave={() => {
            if (!isAnswered) {
              setHoveredCountry(null);
            }
          }}
        />
      );
    });
  }, [worldGeo, projectionConfig, currentCountry, clickedCountry, isAnswered, isCorrect]);

  // Clickable territory nodes (for small territories, islands, and enclaves)
  const territoryNodes = useMemo(() => {
    const list = pool;

    // Filter to small or island territories or those without large polygon, or autonomous regions
    return list
      .filter((c: Country) => c.areaKm2 < 40000 || c.id === 'so-sl' || !countriesWithPolygon.has(c.isoNumeric.padStart(3, '0')))
      .map((c: Country) => {
        const pt = projectionConfig.projection([c.coords[1], c.coords[0]]);
        if (!pt) return null;
        const [x, y] = pt;
        if (x < -20 || x > projectionConfig.width + 20 || y < -20 || y > projectionConfig.height + 20) {
          return null;
        }

        const isTarget = isAnswered && c.id === currentCountry?.id;
        const isClicked = isAnswered && c.id === clickedCountry?.id;

        return (
          <g
            key={`node-${c.id}`}
            transform={`translate(${x}, ${y})`}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              handleCountrySelect(c);
            }}
            onMouseEnter={() => !isAnswered && setHoveredCountry(c)}
            onMouseLeave={() => !isAnswered && setHoveredCountry(null)}
          >
            {/* Generous invisible hit circle for easy clicking (at least 20px radius) */}
            <circle r={22} fill="transparent" className="cursor-pointer" />

            {/* Subtle outer ring so it is clearly distinct over the ocean */}
            <circle
              r={zoomLevel > 1.8 ? 8 : 6.5}
              fill="none"
              stroke={
                isTarget
                  ? '#10b981'
                  : isClicked && !isCorrect
                  ? '#ef4444'
                  : 'var(--map-neutral-stroke, #a8a29e)'
              }
              strokeWidth={1}
              strokeDasharray={isTarget ? undefined : '2 2'}
              className="opacity-70"
            />

            {/* Visual dot (fixed visible pixel size) */}
            <circle
              r={zoomLevel > 1.8 ? 5.5 : 4}
              fill={
                isTarget
                  ? '#10b981'
                  : isClicked && !isCorrect
                  ? '#ef4444'
                  : 'var(--map-neutral-stroke, #78716c)'
              }
              stroke="#ffffff"
              strokeWidth={1.5}
              className="transition-transform group-hover:scale-125"
            />
          </g>
        );
      });
  }, [pool, projectionConfig, currentCountry, clickedCountry, isAnswered, isCorrect, zoomLevel]);

  // Target and clicked coordinates for indicator rings
  const targetRingPos = useMemo(() => {
    if (!currentCountry) return null;
    const pt = projectionConfig.projection([currentCountry.coords[1], currentCountry.coords[0]]);
    return pt ? { x: pt[0], y: pt[1] } : null;
  }, [currentCountry, projectionConfig]);

  const clickedRingPos = useMemo(() => {
    if (!clickedCountry || isCorrect) return null;
    const pt = projectionConfig.projection([clickedCountry.coords[1], clickedCountry.coords[0]]);
    return pt ? { x: pt[0], y: pt[1] } : null;
  }, [clickedCountry, isCorrect, projectionConfig]);

  if (!currentCountry && !sessionCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center text-xs font-mono text-stone-400">
        Cargando mapa sin nombres...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14">
      {/* Persistent Region Filter Badge */}
      <RegionFilterBadge
        filter={regionFilter}
        onOpenSelector={onOpenRegionSelector}
        className="mb-6"
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-normal text-stone-900 dark:text-stone-100">
              Localiza en el Mapa
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 border border-stone-200 dark:border-stone-800 px-2 py-0.5">
              Mapa Mudo
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Haz clic directamente en el territorio del país o isla sobre el mapa sin rótulos
          </p>
        </div>

        {/* Round size selector */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <select
            value={roundLength}
            onChange={(e) => setRoundLength(Number(e.target.value))}
            className="bg-transparent border-b border-stone-300 dark:border-stone-700 py-1 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
          >
            <option value={10} className="bg-white dark:bg-stone-900">10 países</option>
            <option value={20} className="bg-white dark:bg-stone-900">20 países</option>
            <option value={30} className="bg-white dark:bg-stone-900">30 países</option>
            {pool.length > 5 && (
              <option value={pool.length} className="bg-white dark:bg-stone-900">
                Todos ({pool.length})
              </option>
            )}
          </select>
        </div>
      </div>

      {sessionCompleted ? (
        /* Round Completed Summary */
        <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 p-10 sm:p-14 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 block mb-2">
            Sesión de localización concluida
          </span>
          <h3 className="text-3xl font-serif font-normal text-stone-900 dark:text-stone-100 mb-2">
            {score} de {deck.length} aciertos
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-10">
            {pool.length} países disponibles en esta selección
          </p>

          <div className="flex justify-center gap-12 font-mono text-center mb-10">
            <div>
              <span className="text-4xl font-light text-stone-900 dark:text-stone-100 block">
                {Math.round((score / deck.length) * 100)}%
              </span>
              <span className="text-xs text-stone-400">Precisión cartográfica</span>
            </div>
            <div className="w-px h-12 bg-stone-200 dark:bg-stone-800 my-auto" />
            <div>
              <span className="text-4xl font-light text-stone-900 dark:text-stone-100 block">
                {bestStreak}
              </span>
              <span className="text-xs text-stone-400">Mejor racha de aciertos</span>
            </div>
          </div>

          {failedCountries.length > 0 && (
            <div className="max-w-md mx-auto mb-10 text-left border-t border-stone-100 dark:border-stone-800 pt-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-3">
                Países que conviene revisar:
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
                {Array.from(new Set(failedCountries.map(c => c.name))).map((name, i, arr) => (
                  <span key={name}>
                    {name}{i < arr.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenRegionSelector}
              className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-700 dark:text-stone-300 transition-colors"
            >
              Cambiar región
            </button>
            <button
              type="button"
              onClick={() => initRound(roundLength)}
              className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors"
            >
              Comenzar nueva ronda
            </button>
            {onNavigateContinents && (
              <button
                type="button"
                onClick={onNavigateContinents}
                className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium border border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-100 text-stone-900 dark:text-stone-100 transition-colors"
              >
                Volver a continentes
              </button>
            )}
          </div>

          <EspacioPublicitario position="resumen-sesion" id="ad-resumen-map-locator" />
        </div>
      ) : (
        /* Active Game Arena */
        <div className="space-y-4">
          {/* Target Country Prompt Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                  Haz clic en el mapa sobre:
                </span>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <span className="text-xs font-mono text-stone-500">
                  {currentCountry.continent}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 dark:text-stone-100 tracking-tight">
                {currentCountry.name}
              </h3>
            </div>

            {/* Metrics & Helper Buttons */}
            <div className="flex items-center gap-4 text-xs font-mono">
              {/* Focus on zone button for small islands/territories */}
              {!isAnswered && (
                <button
                  type="button"
                  onClick={handleFocusCountry}
                  title="Centrar y hacer zoom en la zona del país o territorio"
                  className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
                    currentCountry.areaKm2 < 40000
                      ? 'border-stone-400 dark:border-stone-600 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Zoom automático</span>
                </button>
              )}

              {/* Hint button */}
              {!isAnswered && (
                <button
                  type="button"
                  onClick={() => setShowHint(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-600 dark:text-stone-400 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Ocultar' : 'Pista'}</span>
                </button>
              )}

              {/* Progress counter */}
              <div className="text-right">
                <span className="text-stone-400 block text-[10px] uppercase">Progreso</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {currentIndex + 1} / {deck.length}
                </span>
              </div>

              {/* Streak */}
              <div className="text-right">
                <span className="text-stone-400 block text-[10px] uppercase">Racha</span>
                <span className="text-stone-900 dark:text-stone-100 font-medium">
                  {currentStreak}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Hint Dropdown */}
          {showHint && !isAnswered && (
            <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center gap-6 text-xs animate-fadeIn">
              <div className="w-9 h-6 border border-stone-200 dark:border-stone-700 shrink-0 overflow-hidden">
                <img
                  src={getFlagUrl(currentCountry, 160)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-stone-400 font-mono text-[10px] uppercase block">Capital</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {currentCountry.capital}
                </span>
              </div>
              <div className="ml-auto text-[11px] font-mono text-stone-400">
                Superficie: {currentCountry.areaKm2.toLocaleString('es-ES')} km²
              </div>
            </div>
          )}

          {/* Interactive Map Box */}
          <div
            ref={mapContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`relative w-full h-[480px] sm:h-[540px] border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950 overflow-hidden select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-default'
            }`}
          >
            {/* View Controls Toolbar */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 p-1 text-xs shadow-sm font-mono">
              <button
                type="button"
                onClick={handleFocusCountry}
                title="Acercar al territorio objetivo con zoom centrado"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Acercar al territorio</span>
              </button>

              <button
                type="button"
                onClick={handleResetWorld}
                title="Volver a la vista completa del mundo"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Ver en el mundo</span>
              </button>

              <div className="w-px h-3.5 bg-stone-200 dark:border-stone-800 bg-stone-300 dark:bg-stone-700 my-auto" />

              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(5, prev + 0.4))}
                title="Aumentar zoom"
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.4))}
                title="Reducir zoom"
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetWorld}
                title="Restablecer vista"
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Instruction tooltip badge */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none text-[11px] font-mono text-stone-400 bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 px-2.5 py-1">
              {!isAnswered ? 'Haz clic en el país o isla · Arrastra para mover' : 'Respuesta registrada'}
            </div>

            {/* SVG Canvas */}
            <svg
              viewBox={`0 0 ${projectionConfig.width} ${projectionConfig.height}`}
              className="w-full h-full"
            >
              {/* Polygons */}
              <g className="countries-group">{mapElements}</g>

              {/* Territory & Island click nodes */}
              <g className="territory-nodes-group">{territoryNodes}</g>

              {/* Concentric rings when answered */}
              {isAnswered && targetRingPos && (
                <g transform={`translate(${targetRingPos.x}, ${targetRingPos.y})`} className="pointer-events-none">
                  {currentCountry.areaKm2 < 40000 && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                      className="animate-ping opacity-40"
                    />
                  )}
                  <circle
                    r="18"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                    className="animate-pulse"
                  />
                  <circle
                    r="9"
                    fill="#10b981"
                    fillOpacity="0.25"
                    stroke="#047857"
                    strokeWidth="1.5"
                  />
                  <circle r="3.5" fill="#047857" />
                  {/* Crosshairs */}
                  <line x1="-16" y1="0" x2="-8" y2="0" stroke="#047857" strokeWidth="1.2" />
                  <line x1="8" y1="0" x2="16" y2="0" stroke="#047857" strokeWidth="1.2" />
                  <line x1="0" y1="-16" x2="0" y2="-8" stroke="#047857" strokeWidth="1.2" />
                  <line x1="0" y1="8" x2="0" y2="16" stroke="#047857" strokeWidth="1.2" />
                </g>
              )}

              {isAnswered && clickedRingPos && (
                <g transform={`translate(${clickedRingPos.x}, ${clickedRingPos.y})`} className="pointer-events-none">
                  <circle
                    r="14"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <circle
                    r="6"
                    fill="#ef4444"
                    fillOpacity="0.3"
                    stroke="#b91c1c"
                    strokeWidth="1.2"
                  />
                  <circle r="2.5" fill="#b91c1c" />
                </g>
              )}
            </svg>
          </div>

          {/* Feedback Bar & Next Step */}
          {isAnswered && (
            <div
              className={`p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all animate-fadeIn ${
                isCorrect
                  ? 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                  }`}
                >
                  {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>

                <div>
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100 block">
                    {isCorrect ? (
                      `¡Correcto! Has localizado ${currentCountry.name}.`
                    ) : (
                      <>
                        Has pulsado sobre{' '}
                        <strong>{clickedCountry ? clickedCountry.name : 'otro territorio'}</strong>.
                        La ubicación de {currentCountry.name} ha sido señalada con el círculo verde en el mapa.
                      </>
                    )}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    Capital: {currentCountry.capital} · Pulsa [Espacio] o [Enter] para continuar
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleFocusCountry}
                  title="Enfocar y hacer zoom sobre la ubicación exacta en el mapa"
                  className="px-3.5 py-2 text-xs font-mono border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Zoom en mapa</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{currentIndex + 1 >= deck.length ? 'Ver resultados' : 'Siguiente'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
