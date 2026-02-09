import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { LivePicksDiagnostics } from '../../backend';

export function useLivePicksDiagnostics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<LivePicksDiagnostics>({
    queryKey: ['livePicksDiagnostics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLivePicksDiagnostics();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}
