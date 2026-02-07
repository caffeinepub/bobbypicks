interface ValueBarProps {
  confidenceScore: number | null;
  edgePercentage: number;
}

export function ValueBar({ confidenceScore, edgePercentage }: ValueBarProps) {
  if (confidenceScore === null) {
    return (
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Not available</div>
      </div>
    );
  }

  const percentage = confidenceScore * 100;
  const edgeColor = edgePercentage > 0 ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="space-y-1 min-w-[120px]">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Confidence</span>
        <span className="font-semibold">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${edgeColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
