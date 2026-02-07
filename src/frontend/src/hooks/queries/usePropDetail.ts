import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { PlayerPropsWithEdgesView } from '../../backend';

export function usePropDetail(propId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PlayerPropsWithEdgesView | null>({
    queryKey: ['propDetail', propId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPlayerPropsWithEdges(BigInt(propId));
    },
    enabled: !!actor && !actorFetching && !!propId,
  });
}
