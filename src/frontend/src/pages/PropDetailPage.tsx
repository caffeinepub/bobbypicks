import { useParams, Link } from '@tanstack/react-router';
import { usePropDetail } from '../hooks/queries/usePropDetail';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Target, CheckCircle2 } from 'lucide-react';
import { AddToParlayButton } from '../components/parlay/AddToParlayButton';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function PropDetailPage() {
  const { propId } = useParams({ from: '/prop/$propId' });
  const { data: propDetail, isLoading, error } = usePropDetail(propId);

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
        <Link to="/props">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prop Board
          </Button>
        </Link>
      </div>
    );
  }

  const { prop, edges, projections, verificationResults } = propDetail;
  const edge = edges[0];
  const projection = projections[0];
  const verification = verificationResults[0];
  const highConfidence = isHighConfidence(verification);

  const edgeDirection = edge && edge.edgePercentage > 0 ? 'Over' : 'Under';
  const edgeColor = edge && edge.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/props">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">{prop.playerName}</h1>
            {highConfidence && <ConfidenceBadge size="lg" />}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-lg">{prop.team}</span>
            <span>•</span>
            <span className="text-lg capitalize">
              {prop.statCategory.toString().replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span>•</span>
            <Badge variant="secondary">{prop.sport.toString().toUpperCase()}</Badge>
          </div>
        </div>
        {edge && <AddToParlayButton edge={{ prop, edge, projection, verification }} size="lg" />}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PrizePicks Line
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{prop.line.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-1">{prop.lineString}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sharp Consensus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {projection ? projection.value.toFixed(1) : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {projection ? 'Algo Generated' : 'Not Available'}
            </p>
          </CardContent>
        </Card>

        <Card className={edge ? 'border-accent/50 bg-accent/5' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Edge Magnitude
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${edgeColor}`}>
              {edge ? `${Math.abs(edge.edgePercentage).toFixed(1)}%` : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {edge ? `Favor ${edgeDirection}` : 'No edge calculated'}
            </p>
          </CardContent>
        </Card>
      </div>

      {verification && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Verification Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Confidence Score</p>
                <Badge variant={highConfidence ? 'default' : 'secondary'}>
                  {(verification.confidenceScore * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${verification.confidenceScore * 100}%` }}
                />
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Summary</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {verification.verificationSummary || 'No verification summary available.'}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                Verified{' '}
                {formatDistanceToNow(new Date(Number(verification.verificationTime) / 1000000), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {edge && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Edge Calculation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Edge Score</p>
                <p className="text-lg font-semibold">{edge.edgeScore}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={edge.isValid ? 'default' : 'destructive'}>
                  {edge.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                Calculated{' '}
                {formatDistanceToNow(new Date(Number(edge.calcTime) / 1000000), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Source Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm font-medium">{prop.source}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tournament</span>
            <span className="text-sm font-medium">{prop.tournament || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(Number(prop.lastUpdated) / 1000000), {
                addSuffix: true,
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
