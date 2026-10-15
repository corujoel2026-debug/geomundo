import { Country, CountryStudyData, FlashcardRating, UserProgress } from '../types';
import { COUNTRIES } from '../data/countries';

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export interface SM2CalculationResult {
  interval: number; // in days
  repetitions: number;
  easeFactor: number;
  nextReviewDate: number; // ms timestamp
  leitnerBox: number; // 1 - 5
  intervalLabel: string;
}

/**
 * Maps interval in days to a clean, minimal label
 */
export function formatIntervalLabel(days: number): string {
  if (days <= 0) return 'Hoy';
  if (days === 1) return '1 d';
  if (days < 7) return `${days} d`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? 'sem' : 'sem'}`;
  }
  const months = Math.round(days / 30);
  return `${months} ${months === 1 ? 'mes' : 'meses'}`;
}

/**
 * Computes Leitner Box (1 to 5) from interval in days
 */
export function getLeitnerBox(interval: number): number {
  if (interval <= 1) return 1;
  if (interval <= 3) return 2;
  if (interval <= 8) return 3;
  if (interval <= 21) return 4;
  return 5;
}

/**
 * Calculates next SM-2 parameters for a given rating
 */
export function calculateSM2(
  currentStats: Partial<CountryStudyData> | undefined,
  rating: FlashcardRating,
  baseTime: number = Date.now()
): SM2CalculationResult {
  const currentRepetitions = currentStats?.repetitions ?? 0;
  const currentInterval = currentStats?.interval ?? 0;
  const currentEF = currentStats?.easeFactor ?? DEFAULT_EASE_FACTOR;

  let repetitions = currentRepetitions;
  let interval = currentInterval;
  let easeFactor = currentEF;

  // Rating quality mapping (0 to 5)
  // no_lo_sabia: 1 (failure)
  // dificil: 3 (hard, passing)
  // bien: 4 (good, standard)
  // facil: 5 (easy, rapid mastery)
  let q = 4;
  if (rating === 'no_lo_sabia') q = 1;
  else if (rating === 'dificil') q = 3;
  else if (rating === 'bien') q = 4;
  else if (rating === 'facil') q = 5;

  if (q < 3) {
    // Failure (No lo sabía) -> Reset repetition chain to 0, schedule tomorrow
    repetitions = 0;
    interval = 1;
    easeFactor = Math.max(MIN_EASE_FACTOR, currentEF - 0.2);
  } else {
    // Success -> Increment repetition and calculate interval
    repetitions = currentRepetitions + 1;

    if (repetitions === 1) {
      if (q === 5) interval = 3; // Easy starts with 3 days
      else if (q === 4) interval = 1; // Good starts with 1 day
      else interval = 1; // Hard starts with 1 day
    } else if (repetitions === 2) {
      if (q === 5) interval = 6;
      else if (q === 4) interval = 3;
      else interval = 2;
    } else {
      // repetitions >= 3
      const multiplier = q === 5 ? currentEF * 1.3 : q === 3 ? Math.max(1.1, currentEF * 0.85) : currentEF;
      interval = Math.max(currentInterval + 1, Math.round(currentInterval * multiplier));
    }

    // Update Ease Factor using standard SM-2 formula:
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    easeFactor = Math.max(MIN_EASE_FACTOR, Number((currentEF + efDelta).toFixed(2)));
  }

  const leitnerBox = getLeitnerBox(interval);
  const nextReviewDate = baseTime + interval * 24 * 60 * 60 * 1000;

  return {
    interval,
    repetitions,
    easeFactor,
    nextReviewDate,
    leitnerBox,
    intervalLabel: formatIntervalLabel(interval),
  };
}

/**
 * Returns preview of intervals for all 4 buttons for UI display
 */
export function getRatingIntervalPreviews(
  currentStats: Partial<CountryStudyData> | undefined
): Record<FlashcardRating, string> {
  return {
    no_lo_sabia: calculateSM2(currentStats, 'no_lo_sabia').intervalLabel,
    dificil: calculateSM2(currentStats, 'dificil').intervalLabel,
    bien: calculateSM2(currentStats, 'bien').intervalLabel,
    facil: calculateSM2(currentStats, 'facil').intervalLabel,
  };
}

/**
 * Get countries due for the "Repaso del día" (Daily Review).
 * Prioritizes:
 * 1. Overdue cards (nextReviewDate <= end of today)
 * 2. Explicit reviewIds
 * 3. Supplements up to `targetBatchSize` with unstudied or lowest mastery countries
 */
export function getDailyReviewQueue(
  progress: UserProgress,
  targetBatchSize: number = 15
): { dueCountries: Country[]; isOverdueOnly: boolean; pendingDueCount: number } {
  const now = Date.now();
  // End of today timestamp
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const endOfTodayMs = endOfToday.getTime();

  const dueList: { country: Country; priority: number }[] = [];
  const unstudiedList: Country[] = [];

  for (const country of COUNTRIES) {
    const stat = progress.studyStats[country.id];
    const isFlaggedReview = progress.reviewIds.includes(country.id);

    if (stat && stat.nextReviewDate) {
      if (stat.nextReviewDate <= endOfTodayMs || isFlaggedReview) {
        // Due for review!
        const overdueDays = Math.max(0, (endOfTodayMs - stat.nextReviewDate) / (24 * 60 * 60 * 1000));
        let priority = 100 + overdueDays * 10;
        if (isFlaggedReview) priority += 50;
        if (stat.wrongCount > 0) priority += stat.wrongCount * 5;
        dueList.push({ country, priority });
      }
    } else if (isFlaggedReview) {
      dueList.push({ country, priority: 90 });
    } else if (!stat) {
      unstudiedList.push(country);
    }
  }

  // Sort due by priority descending
  dueList.sort((a, b) => b.priority - a.priority);
  const pendingDueCount = dueList.length;

  let selected = dueList.map(d => d.country);

  // If there are fewer due cards than target batch size, supplement with unstudied countries
  if (selected.length < targetBatchSize) {
    const needed = targetBatchSize - selected.length;
    // Pick unstudied countries
    const additional = unstudiedList.slice(0, needed);
    selected = [...selected, ...additional];
  }

  return {
    dueCountries: selected.slice(0, targetBatchSize),
    isOverdueOnly: dueList.length >= targetBatchSize,
    pendingDueCount,
  };
}

/**
 * Returns Leitner Box summary counts for dashboard & review mode
 */
export function getLeitnerDistribution(progress: UserProgress): {
  box1: number; // daily
  box2: number; // 2-3 days
  box3: number; // ~1 week
  box4: number; // 2-3 weeks
  box5: number; // 1+ month
  unstudied: number;
} {
  const counts = { box1: 0, box2: 0, box3: 0, box4: 0, box5: 0, unstudied: 0 };

  for (const country of COUNTRIES) {
    const stat = progress.studyStats[country.id];
    if (!stat || !stat.leitnerBox) {
      counts.unstudied += 1;
    } else {
      const box = Math.max(1, Math.min(5, stat.leitnerBox));
      if (box === 1) counts.box1 += 1;
      else if (box === 2) counts.box2 += 1;
      else if (box === 3) counts.box3 += 1;
      else if (box === 4) counts.box4 += 1;
      else if (box === 5) counts.box5 += 1;
    }
  }

  return counts;
}
