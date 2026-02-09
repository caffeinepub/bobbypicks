import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { Time } from '../../backend';

// Local type definition until backend implements SettlementDiagnostics
export interface SettlementDiagnostics {
  lastAttempt: Time;
  lastSuccess: Time;
  lastFailure: Time;
  lastFailureMessage: string;
  numActivePredictions: bigint;
  numSettledInLastRun: bigint;
  totalAttempts: bigint;
  totalSuccesses: bigint;
  totalFailures: bigint;
}

export function useSettlementDiagnostics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SettlementDiagnostics>({
    queryKey: ['settlementDiagnostics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if backend method exists
      if (typeof (actor as any).getSettlementDiagnostics === 'function') {
        return (actor as any).getSettlementDiagnostics();
      }
      
      // Return placeholder data until backend is implemented
      return {
        lastAttempt: BigInt(0),
        lastSuccess: BigInt(0),
        lastFailure: BigInt(0),
        lastFailureMessage: '',
        numActivePredictions: BigInt(0),
        numSettledInLastRun: BigInt(0),
        totalAttempts: BigInt(0),
        totalSuccesses: BigInt(0),
        totalFailures: BigInt(0),
      };
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}
