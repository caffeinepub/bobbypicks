import type { EdgeWithDetails } from '../../hooks/queries/useEdges';

/**
 * Filters edges by absolute edge percentage against the saved threshold.
 * A threshold of 1% means no additional filtering (show all edges).
 */
export function applyEdgeThreshold(
  edges: EdgeWithDetails[],
  thresholdPercentage: number
): EdgeWithDetails[] {
  // If threshold is 1%, show all edges (no filtering)
  if (thresholdPercentage <= 1) {
    return edges;
  }

  // Filter by absolute edge percentage
  return edges.filter((edge) => {
    const absEdge = Math.abs(edge.edge.edgePercentage);
    return absEdge >= thresholdPercentage;
  });
}
