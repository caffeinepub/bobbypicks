import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { LivePick } from '../../backend';

export function useLivePicks() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<LivePick[]>({
    queryKey: ['livePicks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLivePicks();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: 15000, // Poll every 15 seconds
  });
}
