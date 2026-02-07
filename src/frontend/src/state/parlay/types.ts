import type { VerificationResult } from '../../backend';

export interface ParlayLeg {
  propId: string;
  playerName: string;
  team: string;
  statCategory: string;
  prizePicksLine: number;
  consensusLine: number | null;
  edgePercentage: number;
  confidenceScore: number | null;
  verification: VerificationResult | null;
}
