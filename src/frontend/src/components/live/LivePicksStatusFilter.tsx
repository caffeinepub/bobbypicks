import { Button } from '@/components/ui/button';
import { GameStatus } from '../../backend';

type StatusFilterOption = 'all' | GameStatus;

interface LivePicksStatusFilterProps {
  selected: StatusFilterOption;
  onSelect: (status: StatusFilterOption) => void;
}

export function LivePicksStatusFilter({ selected, onSelect }: LivePicksStatusFilterProps) {
  const options: { value: StatusFilterOption; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: GameStatus.inProgress, label: 'Live' },
    { value: GameStatus.completed, label: 'Final' },
    { value: GameStatus.notStarted, label: 'Upcoming' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selected === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(option.value)}
          className={
            selected === option.value
              ? 'bg-accent text-accent-foreground hover:bg-accent/90'
              : ''
          }
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
