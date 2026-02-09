import { useState } from 'react';
import { useLivePicks } from '../hooks/queries/useLivePicks';
import { useLivePicksLastUpdated } from '../hooks/queries/useLivePicksLastUpdated';
import { useLivePicksDiagnostics } from '../hooks/queries/useLivePicksDiagnostics';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { LoginRequiredState } from '../components/auth/LoginRequiredState';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { Input } from '@/components/ui/input';
import { Search, Radio, Settings, AlertTriangle } from 'lucide-react';
import { LivePicksGrid } from '../components/live/LivePicksGrid';
import { LivePicksStatusFilter } from '../components/live/LivePicksStatusFilter';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GameStatus } from '../backend';

type StatusFilterOption = 'all' | GameStatus;

export default function LivePicksPage() {
  const { identity } = useInternetIdentity();
  const { data: livePicks, isLoading: picksLoading, error: picksError } = useLivePicks();
  const { data: lastUpdated, isLoading: timestampLoading, error: timestampError } = useLivePicksLastUpdated();
  const { data: diagnostics, isLoading: diagnosticsLoading, error: diagnosticsError } = useLivePicksDiagnostics();
  const { data: isAdmin } = useIsAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [selections, setSelections] = useState<Record<string, 'higher' | 'lower' | null>>({});

  if (!identity) {
    return <LoginRequiredState />;
  }

  const isLoading = picksLoading || timestampLoading || diagnosticsLoading;

  if (isLoading) {
    return <LoadingState message="Loading live picks..." />;
  }

  // Handle errors from any of the queries
  if (picksError) {
    return <ErrorState error={picksError} />;
  }

  if (timestampError) {
    return <ErrorState error={timestampError} />;
  }

  if (diagnosticsError) {
    return <ErrorState error={diagnosticsError} />;
  }

  // Check if the most recent ingestion attempt failed
  const hasRecentFailure =
    diagnostics &&
    diagnostics.lastFailure > BigInt(0) &&
    diagnostics.lastFailure >= diagnostics.lastSuccess;

  // Show failure state if most recent attempt failed
  if (hasRecentFailure) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-4 max-w-2xl">
          <AlertTriangle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Live Picks Ingestion Failed</h2>
          <p className="text-muted-foreground">
            The most recent attempt to fetch Live Picks data failed.
            {isAdmin
              ? ' Check the Settings page for detailed error information and verify your OpticOdds API configuration.'
              : ' Please contact an administrator to resolve the ingestion issue.'}
          </p>
          {isAdmin && diagnostics?.lastFailureMessage && (
            <Alert variant="destructive" className="text-left mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">{diagnostics.lastFailureMessage}</AlertDescription>
            </Alert>
          )}
          {isAdmin && (
            <Button asChild className="mt-4">
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Check if Live Picks have never been ingested (strictly based on lastUpdated === 0)
  const hasNeverBeenIngested =
    (!lastUpdated || lastUpdated === BigInt(0)) && (!livePicks || livePicks.length === 0);

  // Show "never ingested" state
  if (hasNeverBeenIngested) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-4 max-w-lg">
          <Radio className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Live Picks Not Yet Available</h2>
          <p className="text-muted-foreground">
            Live Picks have not been refreshed yet.{' '}
            {isAdmin
              ? 'As an admin, you can refresh the Live Picks data to populate this page.'
              : 'Please contact an administrator to refresh the Live Picks data.'}
          </p>
          {isAdmin && (
            <Button asChild className="mt-4">
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Go to Settings to Refresh
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show "no current picks" state (data has been ingested but currently empty)
  if (!livePicks || livePicks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-2">
          <Radio className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">No Live Picks Available</h2>
          <p className="text-muted-foreground max-w-md">
            There are currently no live picks available. Live picks will appear here when games are
            in progress.
          </p>
        </div>
      </div>
    );
  }

  // Filter live picks by search query and status
  const filteredPicks = livePicks.filter((pick) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      pick.playerName.toLowerCase().includes(query) || pick.team.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'all' || pick.gameStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleToggleSelection = (pickId: string, direction: 'higher' | 'lower') => {
    setSelections((prev) => {
      const current = prev[pickId];
      // Toggle: if same direction is clicked, deselect; otherwise select the new direction
      return {
        ...prev,
        [pickId]: current === direction ? null : direction,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Radio className="h-8 w-8 text-accent animate-pulse" />
            Live Picks
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time player props updating during active games
          </p>
        </div>
        {lastUpdated !== undefined && lastUpdated !== null && lastUpdated > BigInt(0) && (
          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">
              {formatDistanceToNow(new Date(Number(lastUpdated) / 1000000), {
                addSuffix: true,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by player name or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <LivePicksStatusFilter selected={statusFilter} onSelect={setStatusFilter} />
      </div>

      {/* Grid */}
      <LivePicksGrid
        picks={filteredPicks}
        selections={selections}
        onToggleSelection={handleToggleSelection}
      />

      {/* Footer count */}
      {filteredPicks.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredPicks.length} of {livePicks.length} live picks
        </p>
      )}
    </div>
  );
}
