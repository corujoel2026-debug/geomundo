import { Country } from '../types';

/**
 * Returns candidate URLs in priority order for loading a country flag:
 * 1. flagcdn.com (or local/embedded SVG for special non-standard territories)
 * 2. flagpedia.net
 * 3. Local fallback version (/flags/<id>.svg or /flags/<iso2>.svg)
 */
export function getFlagSources(country: Country, width: number = 320): string[] {
  const sources: string[] = [];
  const iso2 = (country.iso2 || '').toLowerCase();
  const id = (country.id || '').toLowerCase();

  // Special handling for territories without standard ISO flagcdn codes:
  if (id === 'so-sl' || country.name.toLowerCase().includes('somaliland')) {
    sources.push('/flags/so-sl.svg');
    if (country.flagUrl) {
      sources.push(sanitizeDataUrl(country.flagUrl));
    }
    sources.push(`https://flagcdn.com/w${width}/so.png`);
    return sources;
  }

  if (id === 'cy-nc' || country.name.toLowerCase().includes('norte de chipre')) {
    sources.push('/flags/cy-nc.svg');
    if (country.flagUrl) {
      sources.push(sanitizeDataUrl(country.flagUrl));
    }
    sources.push(`https://flagcdn.com/w${width}/cy.png`);
    return sources;
  }

  // 1. Primary: flagcdn.com (w160, w320, etc.)
  if (iso2) {
    sources.push(`https://flagcdn.com/w${width}/${iso2}.png`);
  }

  // 2. Alternative: flagpedia.net
  if (iso2) {
    sources.push(`https://flagpedia.net/data/flags/w${width}/${iso2}.png`);
  }

  // 3. Local version in /flags/
  sources.push(`/flags/${id}.svg`);
  if (iso2 && iso2 !== id) {
    sources.push(`/flags/${iso2}.svg`);
  }

  // 4. Custom flagUrl if provided in country record
  if (country.flagUrl) {
    sources.push(sanitizeDataUrl(country.flagUrl));
  }

  return Array.from(new Set(sources));
}

/**
 * Safely encodes SVG data URLs to prevent parsing errors in browsers.
 */
function sanitizeDataUrl(url: string): string {
  if (url.startsWith('data:image/svg+xml;utf8,<svg')) {
    const rawSvg = url.substring('data:image/svg+xml;utf8,'.length);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawSvg)}`;
  }
  return url;
}

/**
 * Default flag URL for simple src attributes
 */
export function getFlagUrl(country: Country, width: number = 160): string {
  const sources = getFlagSources(country, width);
  return sources[0] || `https://flagcdn.com/w${width}/${country.iso2}.png`;
}

/**
 * Formats country code for fallback badge
 */
export function getCountryCode(country: Country): string {
  const id = (country.id || '').toLowerCase();
  if (id === 'so-sl' || country.name.toLowerCase().includes('somaliland')) {
    return 'SO-SL';
  }
  if (id === 'cy-nc' || country.name.toLowerCase().includes('norte de chipre')) {
    return 'CY-NC';
  }
  if (country.iso2 && country.iso2.length <= 3) {
    return country.iso2.toUpperCase();
  }
  if (country.id) {
    return country.id.toUpperCase();
  }
  if (country.iso3) {
    return country.iso3.toUpperCase();
  }
  return country.name.slice(0, 2).toUpperCase();
}
