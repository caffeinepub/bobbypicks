import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import { useSensitivitySettings } from './useSensitivitySettings';

// Placeholder type for market alerts (backend will provide actual structure)
export interface MarketAlert {
  propId: bigint;
  playerName: string;
  previousLine: number;
  newLine: number;
  percentageChange: number;
  timestamp: bigint;
}

export function useMarketAlerts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: settings } = useSensitivitySettings();

  // Only enable polling when market alerts are enabled
  const isEnabled = !!actor && !actorFetching && !!identity && settings?.marketAlertsEnabled;

  return useQuery<MarketAlert[]>({
    queryKey: ['marketAlerts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend API not yet implemented - return empty array for now
      // TODO: Replace with actual backend call when available
      return [];
    },
    enabled: isEnabled,
    refetchInterval: isEnabled ? 30000 : false, // Poll every 30 seconds when enabled
    retry: false,
  });
}
