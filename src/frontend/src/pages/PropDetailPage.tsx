import { useParams, Link } from '@tanstack/react-router';
import { usePropDetail } from '../hooks/queries/usePropDetail';
import { useSensitivitySettings } from '../hooks/queries/useSensitivitySettings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoginRequiredState } from '../components/auth/LoginRequiredState';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { AddToParlayButton } from '../components/parlay/AddToParlayButton';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { formatDistanceToNow } from 'date-fns';
import { VerificationRollingWindow } from '../backend';

export default function PropDetailPage() {
  const { propId } = useParams({ from: '/prop/$propId' });
  const { identity } = useInternetIdentity();
  const { data: propDetail, isLoading, error } = usePropDetail(propId);
  const { data: settings } = useSensitivitySettings();

  if (!identity) {
    return <LoginRequiredState />;
  }

  if (isLoading) {
    return <LoadingState message="Loading prop details..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!propDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Prop Not Found</h2>
          <p className="text-muted-foreground">
            The requested prop could not be found or has been removed.
          </p>
        </div>
        <Link to="/edges">
          <Button>Back to Edge Board</Button>
        </Link>
      </div>
    );
  }

  const { prop, projections, edges: propEdges, verificationResults } = propDetail;
  const edge = propEdges[0];
  const projection = projections[0];
  const verification = verificationResults[0];
  const highConfidence = isHighConfidence(verification);

  const edgeDirection = edge && edge.edgePercentage > 0 ? 'higher' : 'lower';
  const edgeColor = edge && edge.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';
  const EdgeIcon = edge && edge.edgePercentage > 0 ? TrendingUp : TrendingDown;

  // Get rolling window label
  const rollingWindowLabel =
    settings?.verificationRollingWindow === VerificationRollingWindow.last3Games
      ? 'Last 3 Games'
      : 'Season Average';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/edges">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{prop.playerName}</h1>
          <p className="text-muted-foreground mt-1">
            {prop.team} • {prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim()}
          </p>
        </div>
        {edge && (
          <AddToParlayButton
            edge={{
              prop,
              edge,
              projection,
              verification,
            }}
          />
        )}
      </div>

      {highConfidence && (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-accent" />
              <div>
                <p className="font-semibold">High Confidence Pick</p>
                <p className="text-sm text-muted-foreground">
                  This prop has strong verification data supporting the edge
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Line Information</CardTitle>
            <CardDescription>Current lines and projections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">PrizePicks Line</p>
              <p className="text-3xl font-bold">{prop.line.toFixed(1)}</p>
              <Badge variant="secondary" className="mt-2">
                {prop.lineType.toString()}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Consensus Projection</p>
              <p className="text-3xl font-bold">
                {projection ? projection.value.toFixed(1) : 'N/A'}
              </p>
              {projection && (
                <Badge variant="outline" className="mt-2">
                  {projection.projectionType === 'algoGenerated' ? 'Algorithm' : 'Custom'}
                </Badge>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(Number(prop.lastUpdated) / 1000000), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edge Analysis</CardTitle>
            <CardDescription>Calculated edge and confidence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {edge ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Edge Percentage</p>
                  <div className="flex items-center gap-3">
                    <p className={`text-3xl font-bold ${edgeColor}`}>
                      {Math.abs(edge.edgePercentage).toFixed(1)}%
                    </p>
                    <EdgeIcon className={`h-6 w-6 ${edgeColor}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    PrizePicks line is {edgeDirection} than consensus
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Edge Score</p>
                  <p className="text-lg font-semibold">{edge.edgeScore}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">Edge data not available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Verification Analysis</span>
            {highConfidence && <ConfidenceBadge />}
          </CardTitle>
          <CardDescription>
            Statistical verification based on {rollingWindowLabel}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verification ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${verification.confidenceScore * 100}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold">
                    {(verification.confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Verification Summary</p>
                <p className="text-sm leading-relaxed">
                  {verification.verificationSummary || 'N/A'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verification Window</p>
                <Badge variant="outline">{rollingWindowLabel}</Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {settings?.verificationRollingWindow === VerificationRollingWindow.last3Games
                    ? 'Analysis based on recent performance and hot streaks'
                    : 'Analysis based on season-wide consistency and long-term trends'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verified</p>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(Number(verification.verificationTime) / 1000000), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Verification data not available for this prop</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
          <CardDescription>Sport and tournament information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sport</span>
            <Badge variant="secondary">{prop.sport.toString().toUpperCase()}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tournament</span>
            <span className="text-sm font-medium">{prop.tournament}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Prop Type</span>
            <span className="text-sm font-medium capitalize">
              {prop.propType.toString().replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm font-medium">{prop.source}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
