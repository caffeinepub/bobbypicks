import type { VerificationResult } from '../../backend';

const HIGH_CONFIDENCE_THRESHOLD = 0.7;

export function isHighConfidence(verification: VerificationResult | null | undefined): boolean {
  if (!verification) {
    return false;
  }

  return verification.confidenceScore >= HIGH_CONFIDENCE_THRESHOLD;
}
