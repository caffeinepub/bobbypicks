import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useIsAdmin } from '../useIsAdmin';
import type { SettlementDiagnostics } from '../../backend';

export function useSettlementDiagnostics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: isAdmin, isFetching: isAdminFetching } = useIsAdmin();

  return useQuery<SettlementDiagnostics>({
    queryKey: ['settlementDiagnostics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSettlementDiagnostics();
    },
    enabled: !!actor && !actorFetching && !isAdminFetching && isAdmin === true,
    retry: false,
  });
}
