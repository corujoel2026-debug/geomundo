/**
 * Fuzzy text matching utility for Spanish geography quiz.
 * Tolerates:
 * 1. Accents / Diacritics (á, é, í, ó, ú, ü)
 * 2. Casing (uppercase/lowercase)
 * 3. Leading/trailing whitespace and punctuation (., -)
 * 4. Small typos (Levenshtein distance <= 1 for short words, <= 2 for longer words)
 * 5. Common Spanish articles ("la", "el", "los", "las")
 */

/**
 * Normalizes string: trims, lowercases, removes diacritics and punctuation
 */
export function normalizeSpanishText(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    // Normalize unicode accents (á -> a, etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special symbols and punctuation with space
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips common leading articles
 */
export function stripArticles(normalizedText: string): string {
  return normalizedText
    .replace(/^(el|la|los|las|un|una)\s+/i, '')
    .trim();
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface MatchResult {
  isCorrect: boolean;
  isExact: boolean;
  isNearMatch: boolean; // slight typo tolerated
  similarityScore: number;
}

/**
 * Checks whether user input matches the expected answer or any accepted variants.
 */
export function checkQuizAnswer(
  userInput: string,
  targetAnswer: string,
  alternativeVariants: string[] = []
): MatchResult {
  const normUser = normalizeSpanishText(userInput);
  const normUserNoArt = stripArticles(normUser);

  if (!normUser) {
    return { isCorrect: false, isExact: false, isNearMatch: false, similarityScore: 0 };
  }

  const targetsToCheck = [targetAnswer, ...alternativeVariants].filter(Boolean);

  let bestResult: MatchResult = {
    isCorrect: false,
    isExact: false,
    isNearMatch: false,
    similarityScore: 0,
  };

  for (const target of targetsToCheck) {
    const normTarget = normalizeSpanishText(target);
    const normTargetNoArt = stripArticles(normTarget);

    // 1. Direct or accent-free match
    if (normUser === normTarget || normUserNoArt === normTargetNoArt) {
      return {
        isCorrect: true,
        isExact: true,
        isNearMatch: false,
        similarityScore: 1.0,
      };
    }

    // 2. Secondary check: target contains user input or vice versa for compound capital names
    // e.g. "Washington" for "Washington D.C." or "Ciudad de Guatemala" vs "Guatemala"
    if (
      (normTargetNoArt.length > 5 && normUserNoArt.length > 4 && normTargetNoArt.includes(normUserNoArt)) ||
      (normUserNoArt.length > 5 && normTargetNoArt.length > 4 && normUserNoArt.includes(normTargetNoArt))
    ) {
      return {
        isCorrect: true,
        isExact: false,
        isNearMatch: true,
        similarityScore: 0.9,
      };
    }

    // 3. Levenshtein edit distance check on normalized forms
    const dist = levenshteinDistance(normUserNoArt, normTargetNoArt);
    const maxLen = Math.max(normUserNoArt.length, normTargetNoArt.length);
    const similarity = maxLen > 0 ? (maxLen - dist) / maxLen : 0;

    // Allowed tolerance:
    // For words length <= 4: max 1 typo (distance <= 1)
    // For words length 5-8: max 1 typo (distance <= 1) or 2 if length >= 7
    // For words length > 8: max 2 typos (distance <= 2)
    let maxAllowedDistance = 1;
    if (maxLen >= 8) {
      maxAllowedDistance = 2;
    } else if (maxLen <= 3) {
      maxAllowedDistance = 0; // very short words like "Chad", "Fiyi", "Roma" require accuracy
    }

    if (dist <= maxAllowedDistance && similarity >= 0.75) {
      return {
        isCorrect: true,
        isExact: false,
        isNearMatch: true,
        similarityScore: similarity,
      };
    }

    if (similarity > bestResult.similarityScore) {
      bestResult = {
        isCorrect: false,
        isExact: false,
        isNearMatch: false,
        similarityScore: similarity,
      };
    }
  }

  return bestResult;
}
