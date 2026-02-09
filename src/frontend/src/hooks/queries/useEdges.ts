import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { EdgeCalculation, PlayerProps, Projection, VerificationResult } from '../../backend';

export interface EdgeWithDetails {
  prop: PlayerProps;
  edge: EdgeCalculation;
  projection: Projection | null;
  verification: VerificationResult | null;
}

export function useEdges() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<EdgeWithDetails[]>({
    queryKey: ['edges'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');

      // Get all valid edges
      const edges = await actor.getEdgesSorted(false);

      // For each edge, fetch the associated prop, projection, and verification
      const edgesWithDetails = await Promise.all(
        edges.map(async (edge) => {
          const [prop, projection, verification] = await Promise.all([
            actor.getPlayerProp(edge.propId),
            actor.getProjection(edge.propId),
            actor.getVerificationResult(edge.propId),
          ]);

          if (!prop) {
            throw new Error(`Prop not found for edge ${edge.propId}`);
          }

          return {
            prop,
            edge,
            projection,
            verification,
          };
        })
      );

      return edgesWithDetails;
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
