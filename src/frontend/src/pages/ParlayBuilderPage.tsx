import { useParlay } from '../state/parlay/ParlayProvider';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LoginRequiredState } from '../components/auth/LoginRequiredState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Layers, X, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { CopySummaryButton } from '../components/parlay/CopySummaryButton';
import { calculateCombinedHitRate } from '../lib/parlay/combinedHitRate';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function ParlayBuilderPage() {
  const { identity } = useInternetIdentity();
  const { legs, removeLeg, clearAll } = useParlay();

  if (!identity) {
    return <LoginRequiredState />;
  }

  if (legs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-full bg-muted p-6">
          <Layers className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Legs Added</h2>
          <p className="text-muted-foreground max-w-md">
            Start building your parlay by adding props from the Prop Board or Edge Board.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/props">
            <Button>Browse Props</Button>
          </Link>
          <Link to="/edges">
            <Button variant="outline">View Edges</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extract confidence scores for combined hit rate calculation
  const confidenceScores = legs.map((leg) => leg.confidenceScore);
  const combinedHitRateResult = calculateCombinedHitRate(confidenceScores);
  const hasMinimumLegs = legs.length >= 2;
  const hasMaximumLegs = legs.length >= 6;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layers className="h-8 w-8" />
            Parlay Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Build your parlay with 2-6 legs for optimal value
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {legs.length} / 6 Legs
          </Badge>
          {legs.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {!hasMinimumLegs && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Minimum Legs Required</AlertTitle>
          <AlertDescription>
            Add at least 2 legs to build a valid parlay. Browse the Prop Board or Edge Board to add
            more picks.
          </AlertDescription>
        </Alert>
      )}

      {hasMinimumLegs && combinedHitRateResult.available && combinedHitRateResult.percentage !== null && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Projected Combined Hit-Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{combinedHitRateResult.percentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on individual confidence scores
                </p>
              </div>
              <CopySummaryButton legs={legs} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {legs.map((leg, index) => {
          const highConfidence = isHighConfidence(leg.verification);
          const edgeDirection = leg.edgePercentage > 0 ? 'Over' : 'Under';
          const edgeColor = leg.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';

          return (
            <Card
              key={leg.propId}
              className={highConfidence ? 'border-accent/50 bg-accent/5' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Leg {index + 1}
                      </Badge>
                      <CardTitle className="text-lg">{leg.playerName}</CardTitle>
                      {highConfidence && <ConfidenceBadge size="sm" />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{leg.team}</span>
                      <span>•</span>
                      <span className="capitalize">{leg.statCategory}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">
                        NBA
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLeg(leg.propId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
                    <p className="text-lg font-bold">{leg.prizePicksLine.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Consensus</p>
                    <p className="text-lg font-bold">
                      {leg.consensusLine !== null ? leg.consensusLine.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Edge</p>
                    <p className={`text-lg font-bold ${edgeColor}`}>
                      {Math.abs(leg.edgePercentage).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">{edgeDirection}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-lg font-bold">
                      {leg.confidenceScore !== null
                        ? `${(leg.confidenceScore * 100).toFixed(0)}%`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      <span className="text-xs">Show Logic</span>
                      <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Separator className="my-3" />
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">PrizePicks Line</p>
                          <p className="font-medium">{leg.prizePicksLine.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Sharp Consensus</p>
                          <p className="font-medium">
                            {leg.consensusLine !== null ? leg.consensusLine.toFixed(1) : 'Not available'}
                          </p>
                        </div>
                      </div>
                      {leg.verification && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Verification Summary
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            {leg.verification.verificationSummary}
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!hasMaximumLegs && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Add more legs to increase your parlay potential (up to 6 total)
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/props">
              <Button variant="outline" size="sm">
                Browse Props
              </Button>
            </Link>
            <Link to="/edges">
              <Button variant="outline" size="sm">
                View Edges
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
