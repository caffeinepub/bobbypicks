export interface CombinedHitRateResult {
  available: boolean;
  percentage: number | null;
  missingCount: number;
}

/**
 * Calculates the projected combined hit-rate for a parlay by multiplying
 * individual leg confidence scores (probabilities).
 * 
 * @param confidenceScores - Array of confidence scores (0-1 range) for each leg
 * @returns Result object with availability status, percentage, and missing count
 */
export function calculateCombinedHitRate(
  confidenceScores: (number | null)[]
): CombinedHitRateResult {
  // Filter out null values and count missing
  const validScores = confidenceScores.filter((score): score is number => score !== null);
  const missingCount = confidenceScores.length - validScores.length;

  // If any scores are missing, return not available
  if (missingCount > 0) {
    return {
      available: false,
      percentage: null,
      missingCount,
    };
  }

  // If no valid scores, return not available
  if (validScores.length === 0) {
    return {
      available: false,
      percentage: null,
      missingCount: confidenceScores.length,
    };
  }

  // Calculate combined probability by multiplying all confidence scores
  const combinedProbability = validScores.reduce((product, score) => product * score, 1);
  const percentage = combinedProbability * 100;

  return {
    available: true,
    percentage,
    missingCount: 0,
  };
}
