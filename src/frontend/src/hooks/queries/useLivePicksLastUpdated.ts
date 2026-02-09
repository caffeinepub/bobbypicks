import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';

export function useLivePicksLastUpdated() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['livePicksLastUpdated'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLivePicksLastUpdated();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15000, // Poll every 15 seconds to keep timestamp fresh
  });
}
