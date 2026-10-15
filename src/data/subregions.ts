import { Continent, Subregion, RegionFilter, Country } from '../types';

export const SUBREGIONS_BY_CONTINENT: Record<Continent, Subregion[]> = {
  'África': [
    'África del Norte',
    'África Occidental',
    'África Central',
    'África Oriental',
    'África Austral',
  ],
  'América': [
    'América del Norte',
    'Centroamérica',
    'Caribe',
    'América del Sur',
  ],
  'Asia': [
    'Asia Occidental (Medio Oriente)',
    'Asia Central',
    'Asia del Sur',
    'Sudeste Asiático',
    'Asia Oriental',
  ],
  'Europa': [
    'Europa Occidental',
    'Europa del Norte',
    'Europa del Sur',
    'Europa del Este',
  ],
  'Oceanía': [
    'Australia y Nueva Zelanda',
    'Melanesia',
    'Micronesia',
    'Polinesia',
  ],
  'Antártida': [],
};

export const COUNTRY_SUBREGION_MAP: Record<string, Subregion> = {
  // AFRICA
  // África del Norte
  dz: 'África del Norte', eg: 'África del Norte', ly: 'África del Norte', ma: 'África del Norte',
  sd: 'África del Norte', tn: 'África del Norte', eh: 'África del Norte', 'es-ce': 'África del Norte', 'es-ml': 'África del Norte',

  // África Occidental
  bj: 'África Occidental', bf: 'África Occidental', cv: 'África Occidental', ci: 'África Occidental',
  gm: 'África Occidental', gh: 'África Occidental', gn: 'África Occidental', gw: 'África Occidental',
  lr: 'África Occidental', ml: 'África Occidental', mr: 'África Occidental', ne: 'África Occidental',
  ng: 'África Occidental', sn: 'África Occidental', sl: 'África Occidental', tg: 'África Occidental',
  sh: 'África Occidental',

  // África Central
  ao: 'África Central', cm: 'África Central', cf: 'África Central', td: 'África Central',
  cg: 'África Central', cd: 'África Central', gq: 'África Central', ga: 'África Central', st: 'África Central',

  // África Austral
  bw: 'África Austral', sz: 'África Austral', ls: 'África Austral', na: 'África Austral', za: 'África Austral',

  // África Oriental
  bi: 'África Oriental', km: 'África Oriental', dj: 'África Oriental', er: 'África Oriental',
  et: 'África Oriental', ke: 'África Oriental', mg: 'África Oriental', mw: 'África Oriental',
  mu: 'África Oriental', yt: 'África Oriental', mz: 'África Oriental', re: 'África Oriental',
  rw: 'África Oriental', sc: 'África Oriental', so: 'África Oriental', 'so-sl': 'África Oriental',
  ss: 'África Oriental', tz: 'África Oriental', ug: 'África Oriental', zm: 'África Oriental', zw: 'África Oriental',

  // AMÉRICA
  // América del Norte
  ca: 'América del Norte', us: 'América del Norte', mx: 'América del Norte', bm: 'América del Norte',
  gl: 'América del Norte', pm: 'América del Norte',

  // Centroamérica
  bz: 'Centroamérica', cr: 'Centroamérica', sv: 'Centroamérica', gt: 'Centroamérica',
  hn: 'Centroamérica', ni: 'Centroamérica', pa: 'Centroamérica',

  // Caribe
  ag: 'Caribe', bs: 'Caribe', bb: 'Caribe', cu: 'Caribe', dm: 'Caribe', do: 'Caribe',
  gd: 'Caribe', ht: 'Caribe', jm: 'Caribe', kn: 'Caribe', lc: 'Caribe', vc: 'Caribe',
  tt: 'Caribe', ai: 'Caribe', aw: 'Caribe', bq: 'Caribe', cw: 'Caribe', gp: 'Caribe',
  mq: 'Caribe', ms: 'Caribe', pr: 'Caribe', bl: 'Caribe', mf: 'Caribe', sx: 'Caribe',
  ky: 'Caribe', tc: 'Caribe', vg: 'Caribe', vi: 'Caribe',

  // América del Sur
  ar: 'América del Sur', bo: 'América del Sur', br: 'América del Sur', cl: 'América del Sur',
  co: 'América del Sur', ec: 'América del Sur', gy: 'América del Sur', py: 'América del Sur',
  pe: 'América del Sur', sr: 'América del Sur', uy: 'América del Sur', ve: 'América del Sur',
  gf: 'América del Sur', fk: 'América del Sur', gs: 'América del Sur',

  // ASIA
  // Asia Occidental (Medio Oriente)
  sa: 'Asia Occidental (Medio Oriente)', am: 'Asia Occidental (Medio Oriente)', az: 'Asia Occidental (Medio Oriente)',
  bh: 'Asia Occidental (Medio Oriente)', qa: 'Asia Occidental (Medio Oriente)', cy: 'Asia Occidental (Medio Oriente)',
  'cy-nc': 'Asia Occidental (Medio Oriente)', ae: 'Asia Occidental (Medio Oriente)', ge: 'Asia Occidental (Medio Oriente)',
  iq: 'Asia Occidental (Medio Oriente)', il: 'Asia Occidental (Medio Oriente)', jo: 'Asia Occidental (Medio Oriente)',
  kw: 'Asia Occidental (Medio Oriente)', lb: 'Asia Occidental (Medio Oriente)', om: 'Asia Occidental (Medio Oriente)',
  ps: 'Asia Occidental (Medio Oriente)', sy: 'Asia Occidental (Medio Oriente)', tr: 'Asia Occidental (Medio Oriente)',
  ye: 'Asia Occidental (Medio Oriente)',

  // Asia Central
  kz: 'Asia Central', kg: 'Asia Central', tj: 'Asia Central', tm: 'Asia Central', uz: 'Asia Central',

  // Asia del Sur
  af: 'Asia del Sur', bd: 'Asia del Sur', bt: 'Asia del Sur', in: 'Asia del Sur',
  ir: 'Asia del Sur', mv: 'Asia del Sur', np: 'Asia del Sur', pk: 'Asia del Sur', lk: 'Asia del Sur',
  io: 'Asia del Sur',

  // Sudeste Asiático
  bn: 'Sudeste Asiático', kh: 'Sudeste Asiático', ph: 'Sudeste Asiático', id: 'Sudeste Asiático',
  la: 'Sudeste Asiático', my: 'Sudeste Asiático', mm: 'Sudeste Asiático', sg: 'Sudeste Asiático',
  th: 'Sudeste Asiático', tl: 'Sudeste Asiático', vn: 'Sudeste Asiático',

  // Asia Oriental
  cn: 'Asia Oriental', kp: 'Asia Oriental', kr: 'Asia Oriental', jp: 'Asia Oriental',
  mn: 'Asia Oriental', tw: 'Asia Oriental', hk: 'Asia Oriental', mo: 'Asia Oriental',

  // EUROPA
  // Europa Occidental
  de: 'Europa Occidental', at: 'Europa Occidental', be: 'Europa Occidental', fr: 'Europa Occidental',
  li: 'Europa Occidental', lu: 'Europa Occidental', mc: 'Europa Occidental', nl: 'Europa Occidental',
  ch: 'Europa Occidental',

  // Europa del Norte
  dk: 'Europa del Norte', ee: 'Europa del Norte', fi: 'Europa del Norte', is: 'Europa del Norte',
  ie: 'Europa del Norte', lv: 'Europa del Norte', lt: 'Europa del Norte', no: 'Europa del Norte',
  se: 'Europa del Norte', gb: 'Europa del Norte', 'gb-eng': 'Europa del Norte', 'gb-sct': 'Europa del Norte',
  'gb-wls': 'Europa del Norte', 'gb-nir': 'Europa del Norte', fo: 'Europa del Norte', im: 'Europa del Norte',
  gg: 'Europa del Norte', je: 'Europa del Norte', ax: 'Europa del Norte', sj: 'Europa del Norte',

  // Europa del Sur
  al: 'Europa del Sur', ad: 'Europa del Sur', ba: 'Europa del Sur', hr: 'Europa del Sur',
  si: 'Europa del Sur', es: 'Europa del Sur', gi: 'Europa del Sur', gr: 'Europa del Sur',
  it: 'Europa del Sur', mt: 'Europa del Sur', me: 'Europa del Sur', mk: 'Europa del Sur',
  pt: 'Europa del Sur', sm: 'Europa del Sur', rs: 'Europa del Sur', va: 'Europa del Sur', xk: 'Europa del Sur',

  // Europa del Este
  by: 'Europa del Este', bg: 'Europa del Este', cz: 'Europa del Este', sk: 'Europa del Este',
  hu: 'Europa del Este', md: 'Europa del Este', pl: 'Europa del Este', ro: 'Europa del Este',
  ru: 'Europa del Este', ua: 'Europa del Este',

  // OCEANÍA
  // Australia y Nueva Zelanda
  au: 'Australia y Nueva Zelanda', nz: 'Australia y Nueva Zelanda', nf: 'Australia y Nueva Zelanda',
  cx: 'Australia y Nueva Zelanda', cc: 'Australia y Nueva Zelanda',

  // Melanesia
  fj: 'Melanesia', pg: 'Melanesia', sb: 'Melanesia', vu: 'Melanesia', nc: 'Melanesia',

  // Micronesia
  fm: 'Micronesia', gu: 'Micronesia', mh: 'Micronesia', mp: 'Micronesia', nr: 'Micronesia',
  pw: 'Micronesia', ki: 'Micronesia',

  // Polinesia
  ws: 'Polinesia', to: 'Polinesia', tv: 'Polinesia', 'as': 'Polinesia', ck: 'Polinesia',
  pf: 'Polinesia', nu: 'Polinesia', pn: 'Polinesia', tk: 'Polinesia', wf: 'Polinesia',
};

// Map View coordinates and zoom presets for automatic zooming in Map Locator Game
export const SUBREGION_MAP_VIEWS: Record<Subregion, { centerLat: number; centerLng: number; zoomLevel: number }> = {
  // África
  'África del Norte': { centerLat: 28, centerLng: 12, zoomLevel: 2.2 },
  'África Occidental': { centerLat: 12, centerLng: -3, zoomLevel: 2.8 },
  'África Central': { centerLat: 1, centerLng: 18, zoomLevel: 2.5 },
  'África Oriental': { centerLat: -2, centerLng: 38, zoomLevel: 2.3 },
  'África Austral': { centerLat: -25, centerLng: 24, zoomLevel: 2.6 },

  // América
  'América del Norte': { centerLat: 46, centerLng: -98, zoomLevel: 1.8 },
  'Centroamérica': { centerLat: 13, centerLng: -86, zoomLevel: 3.8 },
  'Caribe': { centerLat: 18, centerLng: -70, zoomLevel: 3.5 },
  'América del Sur': { centerLat: -20, centerLng: -60, zoomLevel: 1.9 },

  // Asia
  'Asia Occidental (Medio Oriente)': { centerLat: 31, centerLng: 42, zoomLevel: 2.6 },
  'Asia Central': { centerLat: 42, centerLng: 66, zoomLevel: 2.4 },
  'Asia del Sur': { centerLat: 22, centerLng: 78, zoomLevel: 2.4 },
  'Sudeste Asiático': { centerLat: 8, centerLng: 108, zoomLevel: 2.5 },
  'Asia Oriental': { centerLat: 34, centerLng: 115, zoomLevel: 2.1 },

  // Europa
  'Europa Occidental': { centerLat: 48, centerLng: 6, zoomLevel: 3.4 },
  'Europa del Norte': { centerLat: 60, centerLng: 12, zoomLevel: 2.6 },
  'Europa del Sur': { centerLat: 40, centerLng: 15, zoomLevel: 3.0 },
  'Europa del Este': { centerLat: 50, centerLng: 28, zoomLevel: 2.4 },

  // Oceanía
  'Australia y Nueva Zelanda': { centerLat: -28, centerLng: 140, zoomLevel: 2.0 },
  'Melanesia': { centerLat: -12, centerLng: 160, zoomLevel: 3.0 },
  'Micronesia': { centerLat: 8, centerLng: 155, zoomLevel: 3.2 },
  'Polinesia': { centerLat: -18, centerLng: -150, zoomLevel: 2.6 },
};

export const DEFAULT_REGION_FILTER: RegionFilter = {
  mode: 'world',
  continents: [],
  subregions: [],
};

const STORAGE_KEY = 'geomundo_active_region_filter';

export function loadSavedRegionFilter(): RegionFilter {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_REGION_FILTER;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        mode: parsed.mode === 'custom' ? 'custom' : 'world',
        continents: Array.isArray(parsed.continents) ? parsed.continents : [],
        subregions: Array.isArray(parsed.subregions) ? parsed.subregions : [],
      };
    }
  } catch (e) {
    console.error('Error loading region filter:', e);
  }
  return DEFAULT_REGION_FILTER;
}

export function saveRegionFilter(filter: RegionFilter): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
  } catch (e) {
    console.error('Error saving region filter:', e);
  }
}

export function getCountriesForRegionFilter(
  filter: RegionFilter,
  allCountries: Country[]
): Country[] {
  if (filter.mode === 'world' || (!filter.continents?.length && !filter.subregions?.length)) {
    return allCountries;
  }

  const selectedSubs = new Set(filter.subregions || []);
  const selectedConts = new Set(filter.continents || []);

  // Determine which continents have specific subregions selected
  const contsWithSpecificSubs = new Set<Continent>();
  selectedSubs.forEach(sub => {
    for (const [cont, subs] of Object.entries(SUBREGIONS_BY_CONTINENT)) {
      if ((subs as Subregion[]).includes(sub)) {
        contsWithSpecificSubs.add(cont as Continent);
      }
    }
  });

  const filtered = allCountries.filter(c => {
    // If the country's subregion was explicitly selected
    if (selectedSubs.has(c.subregion)) return true;

    // If the country's continent was selected, and that continent has NO specific subregions filtered
    if (selectedConts.has(c.continent) && !contsWithSpecificSubs.has(c.continent)) {
      return true;
    }

    return false;
  });

  return filtered.length > 0 ? filtered : allCountries;
}

export function getRegionFilterSummary(
  filter: RegionFilter,
  allCountries: Country[]
): { label: string; count: number } {
  const filtered = getCountriesForRegionFilter(filter, allCountries);

  if (filter.mode === 'world' || (filter.continents.length === 0 && filter.subregions.length === 0)) {
    return {
      label: 'Todo el mundo',
      count: filtered.length,
    };
  }

  if (filter.subregions.length === 1 && filter.continents.length <= 1) {
    return {
      label: filter.subregions[0],
      count: filtered.length,
    };
  }

  if (filter.subregions.length > 1 && filter.continents.length <= 1) {
    return {
      label: `${filter.continents[0] || 'Región'} (${filter.subregions.length} subregiones)`,
      count: filtered.length,
    };
  }

  if (filter.continents.length === 1 && filter.subregions.length === 0) {
    return {
      label: filter.continents[0],
      count: filtered.length,
    };
  }

  if (filter.subregions.length > 0) {
    return {
      label: `${filter.continents.length} cont. (${filter.subregions.length} subregiones)`,
      count: filtered.length,
    };
  }

  return {
    label: filter.continents.join(', '),
    count: filtered.length,
  };
}
