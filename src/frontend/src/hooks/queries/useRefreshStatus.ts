import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function useRefreshStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['refreshStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');

      // Get NBA props to derive last update time
      const props = await actor.getNBAPlayerProps();

      if (props.length === 0) {
        return null;
      }

      // Find the most recent lastUpdated timestamp
      const mostRecent = props.reduce((latest, prop) => {
        return prop.lastUpdated > latest ? prop.lastUpdated : latest;
      }, props[0].lastUpdated);

      return mostRecent;
    },
    enabled: !!actor && !actorFetching,
  });
}
