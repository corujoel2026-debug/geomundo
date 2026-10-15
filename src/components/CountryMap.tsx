import React, { useMemo, useState } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import { Country } from '../types';
import { COUNTRIES } from '../data/countries';
import { CONTINENTS_META } from '../data/continents';
import { Target, Globe, ZoomIn, ZoomOut } from 'lucide-react';

interface CountryMapProps {
  country?: Country;
  highlightCountryId?: string;
  height?: number;
  width?: number;
  mode?: 'continental' | 'world';
  showControls?: boolean;
  interactive?: boolean;
  quizMode?: boolean;
  accentColor?: string;
  onCountryClick?: (isoNumeric: string) => void;
  className?: string;
}

const worldGeo = topojson.feature(
  worldAtlasData as any,
  (worldAtlasData as any).objects.countries
) as any;

// Pre-filter small territories (< 35,000 km2) for global overview markers
const smallTerritoriesList = COUNTRIES.filter(c => c.areaKm2 < 35000);

export const CountryMap: React.FC<CountryMapProps> = ({
  country,
  highlightCountryId,
  height = 360,
  width = 640,
  mode: initialMode = 'continental',
  showControls = true,
  interactive = true,
  quizMode = false,
  accentColor,
  onCountryClick,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'continental' | 'world'>(initialMode);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const targetLat = country ? country.coords[0] : 15;
  const targetLng = country ? country.coords[1] : 0;
  const continent = country?.continent || 'Europa';
  const meta = CONTINENTS_META[continent] || CONTINENTS_META['Europa'];
  const activeAccent = accentColor || meta?.theme?.accentHex || '#047857';

  const targetIsoNumeric = useMemo(() => {
    if (country) return country.isoNumeric;
    if (highlightCountryId) {
      return highlightCountryId.toLowerCase().padStart(3, '0');
    }
    return '';
  }, [country, highlightCountryId]);

  const { pathGenerator, projection } = useMemo(() => {
    let proj: d3Geo.GeoProjection;

    if (viewMode === 'world') {
      // Scale 105 in 640x360 fits the entire globe (-180 to +180) with zero clipping of Pacific islands
      const worldScale = Math.min((width / 640) * 105, (height / 360) * 105) * zoomLevel;
      proj = d3Geo.geoNaturalEarth1()
        .scale(worldScale)
        .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
    } else {
      let autoZoomScale = (meta?.zoomScale || 300);
      if (country) {
        if (country.areaKm2 < 100) {
          autoZoomScale = Math.max(autoZoomScale, 3800);
        } else if (country.areaKm2 < 1000) {
          autoZoomScale = Math.max(autoZoomScale, 2400);
        } else if (country.areaKm2 < 5000) {
          autoZoomScale = Math.max(autoZoomScale, 1600);
        } else if (country.areaKm2 < 30000) {
          autoZoomScale = Math.max(autoZoomScale, 900);
        } else if (country.areaKm2 < 100000) {
          autoZoomScale = Math.max(autoZoomScale, 550);
        }
      }

      const baseScale = autoZoomScale * zoomLevel;
      // Using rotate([-targetLng, 0]).center([0, targetLat]) guarantees NO antimeridian splitting for Pacific islands (Niue, Tokelau, Pitcairn, etc.)
      proj = d3Geo.geoMercator()
        .rotate([-targetLng, 0])
        .center([0, targetLat])
        .scale(baseScale)
        .translate([width / 2 + panOffset.x, height / 2 + panOffset.y]);
    }

    const pathGen = d3Geo.geoPath().projection(proj);
    return { pathGenerator: pathGen, projection: proj };
  }, [viewMode, targetLng, targetLat, zoomLevel, panOffset, width, height, meta, country]);

  // Projected position of target country
  const pinPos = useMemo(() => {
    if (!country) return null;
    const projected = projection([country.coords[1], country.coords[0]]);
    return projected ? { x: projected[0], y: projected[1] } : null;
  }, [projection, country]);

  // Render world polygons
  const renderedPaths = useMemo(() => {
    if (!worldGeo || !worldGeo.features) return null;

    return worldGeo.features.map((feature: any, idx: number) => {
      const featureId = String(feature.id).padStart(3, '0');
      const isTarget = targetIsoNumeric && (featureId === targetIsoNumeric || featureId === String(parseInt(targetIsoNumeric, 10)));
      const pathD = pathGenerator(feature);
      if (!pathD) return null;

      let fill = 'var(--map-country-bg, #f5f5f4)';
      let stroke = 'var(--map-border, #d6d3d1)';
      let strokeWidth = '0.5';

      if (isTarget) {
        fill = activeAccent;
        stroke = '#ffffff';
        strokeWidth = '1.2';
      }

      return (
        <path
          key={feature.id || idx}
          d={pathD}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className="transition-colors duration-150"
          onClick={() => onCountryClick && onCountryClick(featureId)}
        />
      );
    });
  }, [worldGeo, pathGenerator, targetIsoNumeric, activeAccent, onCountryClick]);

  // In full world view, render subtle markers for all small territories and islands
  const smallTerritoryWorldMarkers = useMemo(() => {
    if (viewMode !== 'world') return null;

    return smallTerritoriesList.map(t => {
      // Target country is rendered separately with the prominent 12px pulsing marker
      if (country && t.id === country.id) return null;
      const pt = projection([t.coords[1], t.coords[0]]);
      if (!pt) return null;
      const [x, y] = pt;
      if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return null;

      const tMeta = CONTINENTS_META[t.continent] || CONTINENTS_META['Europa'];
      const tColor = tMeta?.theme?.accentHex || '#78716c';

      return (
        <g key={`small-terr-${t.id}`} transform={`translate(${x}, ${y})`} className="pointer-events-none">
          <circle r={5} fill="none" stroke={tColor} strokeWidth={0.8} strokeOpacity={0.6} />
          <circle r={3} fill={tColor} stroke="#ffffff" strokeWidth={0.8} />
        </g>
      );
    });
  }, [viewMode, country, projection, width, height]);

  return (
    <div
      className={`relative w-full overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 select-none ${className}`}
      style={
        {
          '--map-country-bg': 'var(--tw-mode-bg, #e7e5e4)',
          '--map-border': 'var(--tw-mode-border, #d6d3d1)',
        } as React.CSSProperties
      }
    >
      {/* Zoom and Navigation Controls: "Acercar al territorio" & "Ver en el mundo" */}
      {showControls && (
        <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between text-xs pointer-events-none">
          {/* Action buttons */}
          <div className="flex items-center gap-1.5 bg-white/95 dark:bg-stone-900/95 p-1 border border-stone-200 dark:border-stone-800 shadow-sm pointer-events-auto">
            <button
              type="button"
              onClick={() => {
                setViewMode('continental');
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Acercar al territorio con zoom de detalle"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors ${
                viewMode === 'continental'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Acercar al territorio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('world');
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Ver el territorio en el mapa completo del mundo"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-colors ${
                viewMode === 'world'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ver en el mundo</span>
            </button>
          </div>

          {/* Continuous +/- zoom buttons */}
          {interactive && (
            <div className="flex items-center gap-1 bg-white/95 dark:bg-stone-900/95 p-1 border border-stone-200 dark:border-stone-800 shadow-sm pointer-events-auto font-mono text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(4, prev + 0.3))}
                title="Aumentar zoom"
                className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.3))}
                title="Reducir zoom"
                className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SVG Map Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ maxHeight: height }}
      >
        {/* Ocean Background */}
        <rect
          width={width}
          height={height}
          fill="none"
        />

        {/* World Countries Layers */}
        <g className="countries-layer">{renderedPaths}</g>

        {/* Subtle markers for all other small territories in full world view */}
        <g className="small-territories-layer">{smallTerritoryWorldMarkers}</g>

        {/* PROMINENT HIGH-VISIBILITY TARGET MARKER: Fixed pixel radius (12px), outer ring, pulse, and crosshairs */}
        {pinPos && pinPos.x >= -40 && pinPos.x <= width + 40 && pinPos.y >= -40 && pinPos.y <= height + 40 && (
          <g transform={`translate(${pinPos.x}, ${pinPos.y})`} className="pointer-events-none select-none">
            {/* 1. Large expanding sonar pulse ring */}
            <circle
              r={28}
              fill="none"
              stroke={activeAccent}
              strokeWidth={1.5}
              className="animate-ping opacity-35"
            />

            {/* 2. Outer dashed radar ring that surrounds the marker */}
            <circle
              r={20}
              fill="none"
              stroke={activeAccent}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              className="animate-pulse opacity-85"
            />

            {/* 3. Outer white contrast halo so it stands out distinctly over deep oceans and land */}
            <circle
              r={15}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              className="opacity-95"
            />

            {/* 4. Main solid circular marker with FIXED visual radius (12px) in SVG pixels */}
            <circle
              r={12}
              fill={activeAccent}
              fillOpacity={0.9}
              stroke="#ffffff"
              strokeWidth={2.2}
              style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))' }}
            />

            {/* 5. Inner bright white core dot */}
            <circle r={4} fill="#ffffff" />

            {/* 6. Precision crosshair guidelines extending outward */}
            <line x1="-18" y1="0" x2="-14" y2="0" stroke="#ffffff" strokeWidth={1.5} />
            <line x1="14" y1="0" x2="18" y2="0" stroke="#ffffff" strokeWidth={1.5} />
            <line x1="0" y1="-18" x2="0" y2="-14" stroke="#ffffff" strokeWidth={1.5} />
            <line x1="0" y1="14" x2="0" y2="18" stroke="#ffffff" strokeWidth={1.5} />

            {/* 7. Label badge (only when not in quiz mode) */}
            {!quizMode && country && (
              <g transform="translate(0, -22)" className="transition-opacity">
                <rect
                  x={-(country.name.length * 3.4 + 10)}
                  y={-14}
                  width={country.name.length * 6.8 + 20}
                  height={18}
                  fill="rgba(24, 24, 27, 0.88)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth={0.8}
                  rx={9}
                />
                <text
                  textAnchor="middle"
                  y={-1.5}
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="600"
                  letterSpacing="0.02em"
                >
                  {country.name}
                </text>
              </g>
            )}
          </g>
        )}
      </svg>

      {/* Coordinates Caption (hidden during quiz mode) */}
      {!quizMode && country && (
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-stone-400 font-mono pointer-events-none">
          <span>
            {country.coords[0] >= 0 ? `${country.coords[0].toFixed(2)}° N` : `${Math.abs(country.coords[0]).toFixed(2)}° S`},{' '}
            {country.coords[1] >= 0 ? `${country.coords[1].toFixed(2)}° E` : `${Math.abs(country.coords[1]).toFixed(2)}° W`}
          </span>
          <span>{viewMode === 'continental' ? `Vista de detalle (${country.continent})` : 'Vista completa del mundo'}</span>
        </div>
      )}
    </div>
  );
};
