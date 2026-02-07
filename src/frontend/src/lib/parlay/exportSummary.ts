import type { ParlayLeg } from '../../state/parlay/types';

export function exportParlayToText(legs: ParlayLeg[]): string {
  if (legs.length === 0) {
    return 'No legs selected';
  }

  const header = `Bobbypicks Parlay - ${legs.length} Leg${legs.length > 1 ? 's' : ''}\n${'='.repeat(50)}\n\n`;

  const legsSummary = legs
    .map((leg, index) => {
      const direction = leg.edgePercentage > 0 ? 'OVER' : 'UNDER';
      const confidence = leg.confidenceScore
        ? `${(leg.confidenceScore * 100).toFixed(0)}%`
        : 'N/A';

      return `Leg ${index + 1}: ${leg.playerName} (${leg.team})
Stat: ${leg.statCategory}
Line: ${direction} ${leg.prizePicksLine.toFixed(1)}
Edge: ${Math.abs(leg.edgePercentage).toFixed(1)}%
Confidence: ${confidence}
`;
    })
    .join('\n');

  const avgEdge = (
    legs.reduce((sum, leg) => sum + Math.abs(leg.edgePercentage), 0) / legs.length
  ).toFixed(1);

  const highConfidenceCount = legs.filter((leg) => leg.confidenceScore && leg.confidenceScore >= 0.7).length;

  const footer = `\n${'='.repeat(50)}
Summary:
- Total Legs: ${legs.length}
- High Confidence: ${highConfidenceCount}
- Average Edge: ${avgEdge}%

Disclaimer: For informational purposes only. Not financial advice.
Always gamble responsibly.`;

  return header + legsSummary + footer;
}
