import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LivePick } from '../../backend';

interface LivePickCardProps {
  pick: LivePick;
  selection?: 'higher' | 'lower' | null;
  onSelectHigher: () => void;
  onSelectLower: () => void;
}

export function LivePickCard({ pick, selection, onSelectHigher, onSelectLower }: LivePickCardProps) {
  const isInProgress = pick.gameStatus === 'inProgress';
  const sportBadge = pick.sport.toString().toUpperCase();
  const statDisplay = pick.statCategory.toString().replace(/([A-Z])/g, ' $1').trim();

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isInProgress ? 'ring-2 ring-accent/50' : ''}`}>
      <CardContent className="p-0">
        {/* Header with status */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <Badge variant="secondary" className="text-xs font-mono">
            {sportBadge}
          </Badge>
          <Badge
            variant={
              pick.gameStatus === 'inProgress'
                ? 'default'
                : pick.gameStatus === 'completed'
                  ? 'secondary'
                  : 'outline'
            }
            className={
              pick.gameStatus === 'inProgress'
                ? 'bg-accent text-accent-foreground animate-pulse'
                : ''
            }
          >
            {pick.gameStatus === 'inProgress'
              ? 'Live'
              : pick.gameStatus === 'completed'
                ? 'Final'
                : 'Upcoming'}
          </Badge>
        </div>

        {/* Player info */}
        <div className="px-4 py-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg leading-tight">{pick.playerName}</h3>
            <p className="text-sm text-muted-foreground">{pick.team}</p>
          </div>

          {/* Stat category and line */}
          <div className="flex items-baseline justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                {statDisplay}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums">{pick.line.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">{pick.lineString}</span>
              </div>
            </div>
          </div>

          {/* Moneyline odds if available */}
          {(pick.homeMoneylineOdds !== undefined || pick.awayMoneylineOdds !== undefined) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono pt-2 border-t border-border/50">
              {pick.homeMoneylineOdds !== undefined && (
                <span>
                  H: {pick.homeMoneylineOdds > 0 ? '+' : ''}
                  {pick.homeMoneylineOdds}
                </span>
              )}
              {pick.awayMoneylineOdds !== undefined && (
                <span>
                  A: {pick.awayMoneylineOdds > 0 ? '+' : ''}
                  {pick.awayMoneylineOdds}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Higher/Lower selection controls */}
        <div className="grid grid-cols-2 gap-0 border-t border-border">
          <Button
            variant="ghost"
            size="lg"
            onClick={onSelectHigher}
            className={`rounded-none h-14 flex items-center justify-center gap-2 transition-all ${
              selection === 'higher'
                ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground font-bold'
                : 'hover:bg-muted/50'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Higher</span>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onSelectLower}
            className={`rounded-none h-14 flex items-center justify-center gap-2 border-l border-border transition-all ${
              selection === 'lower'
                ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground font-bold'
                : 'hover:bg-muted/50'
            }`}
          >
            <TrendingDown className="h-5 w-5" />
            <span>Lower</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
