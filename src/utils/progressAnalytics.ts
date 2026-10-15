import { Continent, Country, UserProgress } from '../types';
import { COUNTRIES, COUNTRIES_BY_CONTINENT } from '../data/countries';
import { CONTINENTS_LIST, CONTINENTS_META } from '../data/continents';

export interface ContinentAccuracyData {
  continent: Continent;
  accentColor: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number | null; // null if 0 answers yet
  masteredCount: number;
  totalCountries: number;
  masteryPercent: number;
}

export interface FailedCountryData {
  country: Country;
  wrongCount: number;
  correctCount: number;
  totalAttempts: number;
  accuracy: number;
  leitnerBox?: number;
  inReview: boolean;
}

export interface DailyActivityPoint {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Lun 28"
  weekday: string; // "Lun", "Mar", etc.
  count: number;
  isToday: boolean;
}

export interface WeeklyActivitySummary {
  days: DailyActivityPoint[];
  weeklyTotal: number;
  dailyAverage: number;
  maxDailyCount: number;
  activeDaysCount: number;
}

/**
 * Calculates accuracy and mastery statistics per continent.
 */
export function getContinentAccuracyStats(progress: UserProgress): ContinentAccuracyData[] {
  return CONTINENTS_LIST.filter(c => c !== 'Antártida').map((cont) => {
    const meta = CONTINENTS_META[cont];
    const countries = COUNTRIES_BY_CONTINENT[cont] || [];

    let totalQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let masteredCount = 0;

    countries.forEach((country) => {
      if (progress.masteredIds.includes(country.id)) {
        masteredCount += 1;
      }

      const stat = progress.studyStats[country.id];
      if (stat) {
        correctAnswers += stat.correctCount || 0;
        wrongAnswers += stat.wrongCount || 0;
        totalQuestions += (stat.correctCount || 0) + (stat.wrongCount || 0);
      }
    });

    const accuracy =
      totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : null;
    const masteryPercent =
      countries.length > 0 ? Math.round((masteredCount / countries.length) * 100) : 0;

    return {
      continent: cont,
      accentColor: meta.theme.accentHex,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      accuracy,
      masteredCount,
      totalCountries: countries.length,
      masteryPercent,
    };
  });
}

/**
 * Returns the countries with the highest failure rates.
 */
export function getMostFailedCountries(
  progress: UserProgress,
  limit: number = 8
): FailedCountryData[] {
  const result: FailedCountryData[] = [];

  for (const country of COUNTRIES) {
    const stat = progress.studyStats[country.id];
    if (stat && stat.wrongCount > 0) {
      const wrongCount = stat.wrongCount;
      const correctCount = stat.correctCount || 0;
      const totalAttempts = wrongCount + correctCount;
      const accuracy = Math.round((correctCount / totalAttempts) * 100);

      result.push({
        country,
        wrongCount,
        correctCount,
        totalAttempts,
        accuracy,
        leitnerBox: stat.leitnerBox,
        inReview: progress.reviewIds.includes(country.id),
      });
    }
  }

  // Sort descending by wrongCount, then ascending by accuracy
  result.sort((a, b) => {
    if (b.wrongCount !== a.wrongCount) {
      return b.wrongCount - a.wrongCount;
    }
    return a.accuracy - b.accuracy;
  });

  return result.slice(0, limit);
}

/**
 * Calculates daily activity for the past 7 days.
 */
export function getWeeklyActivitySummary(progress: UserProgress): WeeklyActivitySummary {
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const days: DailyActivityPoint[] = [];

  const weeklyMap = progress.weeklyHistory || {};
  let weeklyTotal = 0;
  let activeDaysCount = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;

    let count = weeklyMap[dateStr] || 0;

    // If it's today and count is 0 but cardsStudiedToday > 0, use cardsStudiedToday
    if (i === 0 && count === 0 && (progress.cardsStudiedToday || 0) > 0) {
      count = progress.cardsStudiedToday || 0;
    }

    if (count > 0) {
      activeDaysCount += 1;
    }
    weeklyTotal += count;

    const weekday = dayNames[d.getDay()];
    const dayLabel = `${weekday} ${d.getDate()}`;

    days.push({
      dateStr,
      dayLabel,
      weekday,
      count,
      isToday: i === 0,
    });
  }

  const maxDailyCount = Math.max(1, ...days.map(d => d.count));
  const dailyAverage = Math.round((weeklyTotal / 7) * 10) / 10;

  return {
    days,
    weeklyTotal,
    dailyAverage,
    maxDailyCount,
    activeDaysCount,
  };
}

/**
 * Triggers a browser download of the user's progress as a JSON file.
 */
export function downloadProgressFile(progress: UserProgress): void {
  const exportPayload = {
    app: 'GeoMundo',
    version: '1.0',
    exportDate: new Date().toISOString(),
    progress,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const todayStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `geomundo_progreso_${todayStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and parses imported JSON data.
 */
export function parseAndValidateProgressJSON(jsonString: string): {
  success: boolean;
  data?: UserProgress;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'El archivo no contiene un objeto JSON válido.' };
    }

    // Support either direct UserProgress or wrapper { app, progress }
    const rawProgress: any = parsed.progress && typeof parsed.progress === 'object'
      ? parsed.progress
      : parsed;

    if (!Array.isArray(rawProgress.masteredIds)) {
      return { success: false, error: 'Falta la lista de países dominados (masteredIds).' };
    }

    if (!rawProgress.studyStats || typeof rawProgress.studyStats !== 'object') {
      return { success: false, error: 'Faltan las estadísticas de estudio (studyStats).' };
    }

    // Sanitize and construct clean UserProgress
    const sanitized: UserProgress = {
      masteredIds: Array.isArray(rawProgress.masteredIds)
        ? rawProgress.masteredIds.filter((id: any) => typeof id === 'string')
        : [],
      reviewIds: Array.isArray(rawProgress.reviewIds)
        ? rawProgress.reviewIds.filter((id: any) => typeof id === 'string')
        : [],
      studyStats: typeof rawProgress.studyStats === 'object' && rawProgress.studyStats !== null
        ? rawProgress.studyStats
        : {},
      score: typeof rawProgress.score === 'number' ? Math.max(0, rawProgress.score) : 0,
      currentStreak: typeof rawProgress.currentStreak === 'number' ? Math.max(1, rawProgress.currentStreak) : 1,
      lastActiveDate: typeof rawProgress.lastActiveDate === 'string'
        ? rawProgress.lastActiveDate
        : new Date().toISOString().split('T')[0],
      bestStreak: typeof rawProgress.bestStreak === 'number' ? Math.max(1, rawProgress.bestStreak) : 1,
      totalQuizzesTaken: typeof rawProgress.totalQuizzesTaken === 'number' ? rawProgress.totalQuizzesTaken : 0,
      totalQuestionsAnswered: typeof rawProgress.totalQuestionsAnswered === 'number' ? rawProgress.totalQuestionsAnswered : 0,
      totalCorrectAnswers: typeof rawProgress.totalCorrectAnswers === 'number' ? rawProgress.totalCorrectAnswers : 0,
      cardsStudiedToday: typeof rawProgress.cardsStudiedToday === 'number' ? rawProgress.cardsStudiedToday : 0,
      lastDailyReviewDate: rawProgress.lastDailyReviewDate || '',
      weeklyHistory: typeof rawProgress.weeklyHistory === 'object' && rawProgress.weeklyHistory !== null
        ? rawProgress.weeklyHistory
        : {},
    };

    return { success: true, data: sanitized };
  } catch (err: any) {
    return { success: false, error: `Error de sintaxis JSON: ${err.message || 'formato inválido'}` };
  }
}
