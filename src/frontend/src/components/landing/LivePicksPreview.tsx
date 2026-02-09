import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radio, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useLivePicks } from '../../hooks/queries/useLivePicks';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { LivePick } from '../../backend';

export function LivePicksPreview() {
  const { identity } = useInternetIdentity();
  const { data: livePicks, isLoading } = useLivePicks();

  // Only render for authenticated users
  if (!identity) {
    return null;
  }

  // Don't render during loading
  if (isLoading) {
    return null;
  }

  // Don't render if no live picks available
  if (!livePicks || livePicks.length === 0) {
    return null;
  }

  // Show up to 3 live picks
  const previewPicks = livePicks.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Radio className="h-6 w-6 text-accent animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Live Picks</h2>
            <p className="text-sm text-muted-foreground">Real-time player props from active games</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to="/live">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewPicks.map((pick) => (
          <LivePickPreviewCard key={pick.id.toString()} pick={pick} />
        ))}
      </div>
    </section>
  );
}

interface LivePickPreviewCardProps {
  pick: LivePick;
}

function LivePickPreviewCard({ pick }: LivePickPreviewCardProps) {
  const isInProgress = pick.gameStatus === 'inProgress';
  const sportBadge = pick.sport.toString().toUpperCase();
  const statDisplay = pick.statCategory.toString().replace(/([A-Z])/g, ' $1').trim();

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isInProgress ? 'ring-2 ring-accent/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
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
        <CardTitle className="text-lg leading-tight">{pick.playerName}</CardTitle>
        <CardDescription>{pick.team}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
            {statDisplay}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums">{pick.line.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{pick.lineString}</span>
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

        {/* Quick action indicators */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Higher</span>
          </div>
          <span className="text-muted-foreground">or</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingDown className="h-3 w-3" />
            <span>Lower</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
