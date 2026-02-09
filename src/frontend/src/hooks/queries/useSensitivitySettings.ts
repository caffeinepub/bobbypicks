import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { SensitivitySettings } from '../../backend';

export function useSensitivitySettings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<SensitivitySettings | null>({
    queryKey: ['sensitivitySettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserSensitivitySettings();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
