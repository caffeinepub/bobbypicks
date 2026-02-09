import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';

// Local type definition until backend implements SettlementMetrics
export interface SettlementMetrics {
  sevenDayWinRate: number;
  totalROI: number;
  totalSettled: bigint;
  totalWon: bigint;
  totalLost: bigint;
  totalPush: bigint;
}

export function useSettlementMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SettlementMetrics>({
    queryKey: ['settlementMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if backend method exists
      if (typeof (actor as any).getSettlementMetrics === 'function') {
        return (actor as any).getSettlementMetrics();
      }
      
      // Return placeholder data until backend is implemented
      return {
        sevenDayWinRate: 0,
        totalROI: 0,
        totalSettled: BigInt(0),
        totalWon: BigInt(0),
        totalLost: BigInt(0),
        totalPush: BigInt(0),
      };
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
