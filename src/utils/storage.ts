import { UserProgress, CountryStudyData, FlashcardRating, AppExperienceMode } from '../types';
import { COUNTRIES } from '../data/countries';
import { calculateSM2 } from './sm2';

const STORAGE_KEY = 'geomundo_user_progress_v1';
const THEME_KEY = 'geomundo_theme_mode';
const EXPERIENCE_MODE_KEY = 'geomundo_experience_mode_v1';
const ONBOARDING_KEY = 'geomundo_onboarding_completed_v1';

export function loadSavedExperienceMode(): AppExperienceMode {
  try {
    const saved = localStorage.getItem(EXPERIENCE_MODE_KEY);
    if (saved === 'advanced' || saved === 'simple') return saved;
    // Default must be 'simple' per user specification
    return 'simple';
  } catch {
    return 'simple';
  }
}

export function saveExperienceMode(mode: AppExperienceMode): void {
  try {
    localStorage.setItem(EXPERIENCE_MODE_KEY, mode);
  } catch (err) {
    console.error('Error saving experience mode:', err);
  }
}

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
  } catch (err) {
    console.error('Error saving onboarding state:', err);
  }
}

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultProgress(): UserProgress {
  const today = getTodayString();
  return {
    masteredIds: [],
    reviewIds: [],
    studyStats: {},
    score: 0,
    currentStreak: 1,
    lastActiveDate: today,
    bestStreak: 1,
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    cardsStudiedToday: 0,
    lastDailyReviewDate: '',
    weeklyHistory: { [today]: 0 },
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultProgress();
      saveUserProgress(initial);
      return initial;
    }
    const parsed: UserProgress = JSON.parse(raw);

    // Validate and update streak
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (!parsed.weeklyHistory) {
      parsed.weeklyHistory = { [today]: parsed.cardsStudiedToday || 0 };
    }

    if (parsed.lastActiveDate === today) {
      // already active today, streak unchanged
    } else if (parsed.lastActiveDate === yesterday) {
      parsed.currentStreak = (parsed.currentStreak || 0) + 1;
      parsed.lastActiveDate = today;
      parsed.cardsStudiedToday = 0; // reset daily counter
      if (parsed.currentStreak > (parsed.bestStreak || 1)) {
        parsed.bestStreak = parsed.currentStreak;
      }
      saveUserProgress(parsed);
    } else {
      // Streak broken
      parsed.currentStreak = 1;
      parsed.lastActiveDate = today;
      parsed.cardsStudiedToday = 0;
      saveUserProgress(parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Error loading progress from localStorage:', err);
    return getDefaultProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving progress to localStorage:', err);
  }
}

/**
 * Record a 4-button flashcard response using Leitner / SM-2 algorithm:
 * ratings: 'no_lo_sabia' | 'dificil' | 'bien' | 'facil'
 */
export function recordSM2Result(
  countryId: string,
  rating: FlashcardRating,
  currentProgress: UserProgress
): UserProgress {
  const now = Date.now();
  const today = getTodayString();
  const prevStats = currentProgress.studyStats[countryId] || {
    correctCount: 0,
    wrongCount: 0,
    level: 0,
  };

  const isSuccess = rating !== 'no_lo_sabia';
  const sm2 = calculateSM2(prevStats, rating, now);

  let mastered = [...currentProgress.masteredIds];
  let review = [...currentProgress.reviewIds];
  let scoreGain = 0;

  let newLevel = prevStats.level;
  if (rating === 'facil') {
    newLevel = 3;
    scoreGain = 25;
  } else if (rating === 'bien') {
    newLevel = Math.min(3, Math.max(1, prevStats.level + 1));
    scoreGain = 15;
  } else if (rating === 'dificil') {
    newLevel = Math.max(1, prevStats.level);
    scoreGain = 10;
  } else {
    // no_lo_sabia
    newLevel = 0;
    scoreGain = 0;
  }

  // Update masteredIds
  if (sm2.leitnerBox >= 3 || newLevel >= 2) {
    if (!mastered.includes(countryId)) {
      mastered.push(countryId);
      scoreGain += 20; // bonus for reaching mastery
    }
  } else if (rating === 'no_lo_sabia') {
    mastered = mastered.filter(id => id !== countryId);
  }

  // Update review queue
  if (rating === 'no_lo_sabia') {
    if (!review.includes(countryId)) {
      review.push(countryId);
    }
  } else if (rating === 'facil' || (rating === 'bien' && sm2.leitnerBox >= 2)) {
    review = review.filter(id => id !== countryId);
  }

  const updatedStats: CountryStudyData = {
    ...prevStats,
    correctCount: prevStats.correctCount + (isSuccess ? 1 : 0),
    wrongCount: prevStats.wrongCount + (isSuccess ? 0 : 1),
    lastStudied: now,
    level: newLevel,
    flaggedForReview: rating === 'no_lo_sabia',
    repetitions: sm2.repetitions,
    interval: sm2.interval,
    easeFactor: sm2.easeFactor,
    nextReviewDate: sm2.nextReviewDate,
    leitnerBox: sm2.leitnerBox,
    lastRating: rating,
  };

  const prevWeekly = currentProgress.weeklyHistory || {};
  const updatedWeekly = {
    ...prevWeekly,
    [today]: (prevWeekly[today] || 0) + 1,
  };

  const updatedProgress: UserProgress = {
    ...currentProgress,
    masteredIds: mastered,
    reviewIds: review,
    studyStats: {
      ...currentProgress.studyStats,
      [countryId]: updatedStats,
    },
    score: Math.max(0, currentProgress.score + scoreGain),
    lastActiveDate: today,
    cardsStudiedToday: (currentProgress.cardsStudiedToday || 0) + 1,
    totalQuestionsAnswered: currentProgress.totalQuestionsAnswered + 1,
    totalCorrectAnswers: currentProgress.totalCorrectAnswers + (isSuccess ? 1 : 0),
    weeklyHistory: updatedWeekly,
  };

  saveUserProgress(updatedProgress);
  return updatedProgress;
}

/**
 * Record a study result for a country (e.g. from quiz).
 * isCorrect: true if user knew it / answered right
 */
export function recordCountryResult(
  countryId: string,
  isCorrect: boolean,
  currentProgress: UserProgress
): UserProgress {
  const rating: FlashcardRating = isCorrect ? 'bien' : 'no_lo_sabia';
  return recordSM2Result(countryId, rating, currentProgress);
}

export function toggleMasteredStatus(countryId: string, currentProgress: UserProgress): UserProgress {
  const isMastered = currentProgress.masteredIds.includes(countryId);
  let mastered = [...currentProgress.masteredIds];
  let review = [...currentProgress.reviewIds];
  const stats = currentProgress.studyStats[countryId] || { correctCount: 0, wrongCount: 0, level: 0 };

  if (isMastered) {
    mastered = mastered.filter(id => id !== countryId);
    stats.level = 1;
  } else {
    mastered.push(countryId);
    stats.level = 3;
    review = review.filter(id => id !== countryId);
  }

  stats.lastStudied = Date.now();

  const updated: UserProgress = {
    ...currentProgress,
    masteredIds: mastered,
    reviewIds: review,
    studyStats: {
      ...currentProgress.studyStats,
      [countryId]: stats,
    },
    score: currentProgress.score + (isMastered ? 0 : 25),
  };

  saveUserProgress(updated);
  return updated;
}

export function toggleReviewStatus(countryId: string, currentProgress: UserProgress): UserProgress {
  const inReview = currentProgress.reviewIds.includes(countryId);
  let review = [...currentProgress.reviewIds];

  if (inReview) {
    review = review.filter(id => id !== countryId);
  } else {
    review.push(countryId);
  }

  const updated: UserProgress = {
    ...currentProgress,
    reviewIds: review,
  };

  saveUserProgress(updated);
  return updated;
}

/**
 * Get countries prioritized for Spaced Repetition Review.
 * Countries with mistakes or flagged for review appear first.
 */
export function getSpacedRepetitionQueue(progress: UserProgress, limit = 20) {
  const now = Date.now();

  // Score each country: higher score = higher priority to study
  const scored = COUNTRIES.map(c => {
    const stat = progress.studyStats[c.id];
    let priority = 0;

    if (!stat) {
      // Unstudied country: medium priority
      priority = 50;
    } else {
      const wrong = stat.wrongCount || 0;
      const correct = stat.correctCount || 0;
      const level = stat.level || 0;
      const inReview = progress.reviewIds.includes(c.id);

      // Flagged or wrong counts boost priority heavily
      if (inReview) priority += 100;
      priority += wrong * 25;
      priority -= correct * 5;
      priority -= level * 20;

      // Time factor: older studied time increases need for review
      if (stat.lastStudied) {
        const hoursSince = (now - stat.lastStudied) / (1000 * 60 * 60);
        priority += Math.min(40, hoursSince * 2);
      }
    }

    return { country: c, priority };
  });

  scored.sort((a, b) => b.priority - a.priority);
  return scored.slice(0, limit).map(item => item.country);
}

// Theme storage
export function loadSavedTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Error saving theme:', err);
  }
}

export function resetAllProgress(): UserProgress {
  const initial = getDefaultProgress();
  saveUserProgress(initial);
  return initial;
}
