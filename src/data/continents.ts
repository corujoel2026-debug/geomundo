import { Continent } from '../types';

export interface ContinentMeta {
  id: Continent;
  name: Continent;
  countryCount: number;
  description: string;
  curiosity: string;
  theme: {
    accentHex: string;
    borderHex: string;
    subtleBg: string;
    labelColor: string;
  };
  center: [number, number]; // [lat, lng]
  zoomScale: number;
}

export const CONTINENTS_META: Record<Continent, ContinentMeta> = {
  'África': {
    id: 'África',
    name: 'África',
    countryCount: 58,
    description: 'Cuna de la humanidad, caracterizada por la cuenca del Nilo, el valle del Rift y la meseta sahariana.',
    curiosity: 'Cuenta con 58 países y territorios reconocidos, con una extraordinaria diversidad geográfica y cultural.',
    theme: {
      accentHex: '#b45309', // Warm ochre / ámbar sobrio
      borderHex: 'rgba(180, 83, 9, 0.25)',
      subtleBg: 'rgba(180, 83, 9, 0.05)',
      labelColor: 'text-amber-800 dark:text-amber-300',
    },
    center: [2.0, 20.0],
    zoomScale: 280,
  },
  'América': {
    id: 'América',
    name: 'América',
    countryCount: 56,
    description: 'Masa continental extendida de polo a polo, articulada por la cordillera de los Andes y la cuenca amazónica.',
    curiosity: 'Conecta las masas oceánicas Glacial Ártica, Atlántica y Pacífica a lo largo de ambos hemisferios a través de 56 países y territorios insulares y continentales.',
    theme: {
      accentHex: '#047857', // Sage / Verde pino sobrio
      borderHex: 'rgba(4, 120, 87, 0.25)',
      subtleBg: 'rgba(4, 120, 87, 0.05)',
      labelColor: 'text-emerald-800 dark:text-emerald-300',
    },
    center: [15.0, -85.0],
    zoomScale: 200,
  },
  'Asia': {
    id: 'Asia',
    name: 'Asia',
    countryCount: 54,
    description: 'El continente más extenso y poblado, vertebrado por el nudo orográfico del Himalaya y grandes cuencas fluviales.',
    curiosity: 'Alberga tanto la máxima elevación terrestre (Everest, 8.848 m) como la mayor depresión continental (Mar Muerto).',
    theme: {
      accentHex: '#be123c', // Carmín profundo / Borgoña tenue
      borderHex: 'rgba(190, 18, 60, 0.25)',
      subtleBg: 'rgba(190, 18, 60, 0.05)',
      labelColor: 'text-rose-800 dark:text-rose-300',
    },
    center: [34.0, 95.0],
    zoomScale: 220,
  },
  'Europa': {
    id: 'Europa',
    name: 'Europa',
    countryCount: 56,
    description: 'Península occidental de Eurasia delimitada por los Urales, el Cáucaso y una densa red de mares interiores.',
    curiosity: 'Presenta un perímetro costero recortado de más de 37.000 kilómetros frente al Atlántico y el Mediterráneo.',
    theme: {
      accentHex: '#1d4ed8', // Azul pizarra / cobalto sobrio
      borderHex: 'rgba(29, 78, 216, 0.25)',
      subtleBg: 'rgba(29, 78, 216, 0.05)',
      labelColor: 'text-blue-800 dark:text-blue-300',
    },
    center: [52.0, 15.0],
    zoomScale: 400,
  },
  'Oceanía': {
    id: 'Oceanía',
    name: 'Oceanía',
    countryCount: 25,
    description: 'Región insular del Pacífico configurada por la masa continental australiana y los archipiélagos de Melanesia, Micronesia y Polinesia.',
    curiosity: 'Es la división territorial con menor altitud media global y mayor dispersión marítima territorial.',
    theme: {
      accentHex: '#0e7490', // Azul petróleo / cian sobrio
      borderHex: 'rgba(14, 116, 144, 0.25)',
      subtleBg: 'rgba(14, 116, 144, 0.05)',
      labelColor: 'text-cyan-800 dark:text-cyan-300',
    },
    center: [-20.0, 150.0],
    zoomScale: 320,
  },
  'Antártida': {
    id: 'Antártida',
    name: 'Antártida',
    countryCount: 0,
    description: 'Casquete polar austral consagrado por tratado internacional exclusivamente a la investigación científica y la preservación.',
    curiosity: 'Concentra aproximadamente el 70% del agua dulce del planeta en forma de indlandsis.',
    theme: {
      accentHex: '#475569', // Pizarra neutral / Slate sobrio
      borderHex: 'rgba(71, 85, 105, 0.25)',
      subtleBg: 'rgba(71, 85, 105, 0.05)',
      labelColor: 'text-slate-800 dark:text-slate-300',
    },
    center: [-80.0, 0.0],
    zoomScale: 300,
  }
};

export const CONTINENTS_LIST: Continent[] = ['África', 'América', 'Asia', 'Europa', 'Oceanía', 'Antártida'];
