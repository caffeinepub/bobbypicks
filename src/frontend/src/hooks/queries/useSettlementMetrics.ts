import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { SettlementMetrics } from '../../backend';

export function useSettlementMetrics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SettlementMetrics>({
    queryKey: ['settlementMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSettlementMetrics();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}
