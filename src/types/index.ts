export type Continent = 'África' | 'América' | 'Asia' | 'Europa' | 'Oceanía' | 'Antártida';

export type Subregion =
  // África
  | 'África del Norte'
  | 'África Occidental'
  | 'África Central'
  | 'África Oriental'
  | 'África Austral'
  // América
  | 'América del Norte'
  | 'Centroamérica'
  | 'Caribe'
  | 'América del Sur'
  // Asia
  | 'Asia Occidental (Medio Oriente)'
  | 'Asia Central'
  | 'Asia del Sur'
  | 'Sudeste Asiático'
  | 'Asia Oriental'
  // Europa
  | 'Europa Occidental'
  | 'Europa del Norte'
  | 'Europa del Sur'
  | 'Europa del Este'
  // Oceanía
  | 'Australia y Nueva Zelanda'
  | 'Melanesia'
  | 'Micronesia'
  | 'Polinesia';

export interface RegionFilter {
  mode: 'world' | 'custom';
  continents: Continent[];
  subregions: Subregion[];
}

export interface Country {
  id: string; // e.g., 'es', 'jp'
  name: string; // Spanish name
  officialName?: string;
  capital: string;
  continent: Continent;
  subregion: Subregion;
  iso2: string; // lowercase for flagcdn
  iso3: string;
  isoNumeric: string; // e.g., "724" for Spain, used in Natural Earth TopoJSON
  coords: [number, number]; // [latitude, longitude]
  population: number;
  areaKm2: number;
  curiosity: string; // Spanish fun fact or key geographical feature
  flagUrl?: string; // Optional custom SVG or URL
}

export type MasteryStatus = 'new' | 'learning' | 'mastered';

export type FlashcardRating = 'no_lo_sabia' | 'dificil' | 'bien' | 'facil';

export interface CountryStudyData {
  correctCount: number;
  wrongCount: number;
  lastStudied?: number; // timestamp
  level: number; // 0: new, 1: learning, 2: confident, 3: mastered
  flaggedForReview?: boolean;
  // SM-2 / Leitner scheduling fields:
  repetitions?: number; // consecutive correct reviews
  interval?: number; // in days
  easeFactor?: number; // SM-2 EF, default 2.5, min 1.3
  nextReviewDate?: number; // timestamp in ms when review is due
  leitnerBox?: number; // Box 1 to 5
  lastRating?: FlashcardRating;
}

export interface UserProgress {
  masteredIds: string[]; // country ids
  reviewIds: string[]; // country ids needing review
  studyStats: Record<string, CountryStudyData>;
  score: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  bestStreak: number;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  cardsStudiedToday?: number;
  lastDailyReviewDate?: string;
  weeklyHistory?: Record<string, number>; // date 'YYYY-MM-DD' -> count of cards/answers
}

export type QuizQuestionType = 
  | 'flag_to_country'
  | 'country_to_capital'
  | 'map_to_country'
  | 'capital_to_country';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  country: Country;
  prompt: string;
  subPrompt?: string;
  options: Country[];
  correctCountryId: string;
  correctAnswerText: string;
}

export type AppExperienceMode = 'simple' | 'advanced';

export type ActiveTab =
  | 'inicio'
  | 'continents'
  | 'guided-practice'
  | 'flashcards'
  | 'quiz'
  | 'map-game'
  | 'contrarreloj'
  | 'spaced-review'
  | 'daily-review'
  | 'progress';
