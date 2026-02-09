import { useEdges } from '../hooks/queries/useEdges';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSensitivitySettings } from '../hooks/queries/useSensitivitySettings';
import { LoginRequiredState } from '../components/auth/LoginRequiredState';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { AlertCircle, TrendingUp, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { AddToParlayButton } from '../components/parlay/AddToParlayButton';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { applyEdgeThreshold } from '../lib/edges/applyEdgeThreshold';
import { formatDistanceToNow } from 'date-fns';

export default function EdgeBoardPage() {
  const { identity } = useInternetIdentity();
  const { data: edges, isLoading, error } = useEdges();
  const { data: settings } = useSensitivitySettings();

  if (!identity) {
    return <LoginRequiredState />;
  }

  if (isLoading) {
    return <LoadingState message="Loading edge opportunities..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!edges || edges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-full bg-muted p-6">
          <TrendingUp className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Edges Available</h2>
          <p className="text-muted-foreground max-w-md">
            There are currently no flagged props with significant line discrepancies. Check back
            later or refresh the data from Settings.
          </p>
        </div>
        <Link to="/settings">
          <Button>Go to Settings</Button>
        </Link>
      </div>
    );
  }

  // Apply edge threshold filtering
  const threshold = settings ? Number(settings.edgeThresholdPercentage) : 1;
  const filteredEdges = applyEdgeThreshold(edges, threshold);

  // Show empty state if filtering removed all edges
  if (filteredEdges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-full bg-muted p-6">
          <Filter className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Picks Meet Your Threshold</h2>
          <p className="text-muted-foreground max-w-md">
            Your current edge threshold is set to {threshold}%. No picks currently meet this
            criteria. Try lowering your threshold in Settings to see more opportunities.
          </p>
        </div>
        <Link to="/settings">
          <Button>Adjust Settings</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edge Board</h1>
          <p className="text-muted-foreground mt-1">
            High-value opportunities based on line discrepancies
          </p>
        </div>
        <div className="flex items-center gap-3">
          {threshold > 1 && (
            <Badge variant="outline" className="text-sm">
              Min Edge: {threshold}%
            </Badge>
          )}
          <Badge variant="outline" className="text-lg px-4 py-2">
            {filteredEdges.length} {filteredEdges.length === 1 ? 'Edge' : 'Edges'}
          </Badge>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>How to use this board</AlertTitle>
        <AlertDescription>
          Props are flagged when PrizePicks lines differ significantly from sharp sportsbook
          consensus. High Confidence picks have supporting verification data.
          {threshold > 1 && ` Currently showing edges ≥${threshold}%.`}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {filteredEdges.map((edge) => {
          const highConfidence = isHighConfidence(edge.verification);
          const edgeDirection =
            edge.edge.edgePercentage > 0 ? 'PrizePicks Higher' : 'PrizePicks Lower';
          const edgeColor = edge.edge.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';

          return (
            <Card
              key={edge.prop.id.toString()}
              className={`transition-all hover:shadow-lg ${
                highConfidence ? 'border-accent/50 bg-accent/5' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl">{edge.prop.playerName}</CardTitle>
                      {highConfidence && <ConfidenceBadge />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{edge.prop.team}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {edge.prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        {edge.prop.sport.toString().toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <AddToParlayButton edge={edge} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
                    <p className="text-lg font-bold">{edge.prop.line.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Consensus Line</p>
                    <p className="text-lg font-bold">
                      {edge.projection ? edge.projection.value.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Edge</p>
                    <p className={`text-lg font-bold ${edgeColor}`}>
                      {Math.abs(edge.edge.edgePercentage).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{edgeDirection}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-lg font-bold">
                      {edge.verification
                        ? `${(edge.verification.confidenceScore * 100).toFixed(0)}%`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Updated{' '}
                    {formatDistanceToNow(new Date(Number(edge.prop.lastUpdated) / 1000000), {
                      addSuffix: true,
                    })}
                  </p>
                  <Link to="/prop/$propId" params={{ propId: edge.prop.id.toString() }}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
