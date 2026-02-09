import { LivePickCard } from './LivePickCard';
import type { LivePick } from '../../backend';

interface LivePicksGridProps {
  picks: LivePick[];
  selections: Record<string, 'higher' | 'lower' | null>;
  onToggleSelection: (pickId: string, direction: 'higher' | 'lower') => void;
}

export function LivePicksGrid({ picks, selections, onToggleSelection }: LivePicksGridProps) {
  if (picks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No live picks match your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {picks.map((pick) => {
        const pickId = pick.id.toString();
        return (
          <LivePickCard
            key={pickId}
            pick={pick}
            selection={selections[pickId] || null}
            onSelectHigher={() => onToggleSelection(pickId, 'higher')}
            onSelectLower={() => onToggleSelection(pickId, 'lower')}
          />
        );
      })}
    </div>
  );
}
