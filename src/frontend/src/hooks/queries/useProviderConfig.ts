import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { IngestionProviderConfig } from '../../backend';

export function useProviderConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<IngestionProviderConfig | null>({
    queryKey: ['providerConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProviderConfig();
    },
    enabled: !!actor && !actorFetching,
  });
}
