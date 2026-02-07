import { useParlay } from '../state/parlay/ParlayProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Layers, Trash2, AlertCircle, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { CopySummaryButton } from '../components/parlay/CopySummaryButton';
import { ConfidenceBadge } from '../components/props/ConfidenceBadge';
import { isHighConfidence } from '../lib/verification/highConfidence';
import { ShowLogic } from '../components/props/ShowLogic';
import { calculateCombinedHitRate } from '../lib/parlay/combinedHitRate';

export default function ParlayBuilderPage() {
  const { legs, removeLeg, clearAll } = useParlay();

  if (legs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="rounded-full bg-muted p-6">
          <Layers className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Legs Selected</h2>
          <p className="text-muted-foreground max-w-md">
            Start building your parlay by adding props from the Prop Board. Select 2-6 picks to
            bundle with projected combined hit-rate.
          </p>
        </div>
        <Link to="/props">
          <Button>Browse Prop Board</Button>
        </Link>
      </div>
    );
  }

  const highConfidenceCount = legs.filter((leg) => isHighConfidence(leg.verification)).length;
  const confidenceScores = legs.map((leg) => leg.confidenceScore);
  const combinedHitRate = calculateCombinedHitRate(confidenceScores);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parlay Builder</h1>
          <p className="text-muted-foreground mt-1">
            {legs.length} {legs.length === 1 ? 'leg' : 'legs'} selected
            {highConfidenceCount > 0 && ` • ${highConfidenceCount} high confidence`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopySummaryButton legs={legs} />
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {legs.length < 2 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Select at least 2 picks to bundle</AlertTitle>
          <AlertDescription>
            Parlays require a minimum of 2 legs. Add more picks from the Prop Board to see the
            projected combined hit-rate.
          </AlertDescription>
        </Alert>
      )}

      {legs.length >= 2 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Manual Entry Required</AlertTitle>
          <AlertDescription>
            Copy your parlay summary and manually enter it on PrizePicks. This tool does not place
            bets automatically.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {legs.map((leg, index) => {
          const highConfidence = isHighConfidence(leg.verification);
          const edgeColor = leg.edgePercentage > 0 ? 'text-green-500' : 'text-red-500';

          // Create a mock edge object for ShowLogic component
          const mockEdge = {
            prop: {
              id: BigInt(leg.propId),
              playerName: leg.playerName,
              team: leg.team,
              statCategory: leg.statCategory as any,
              line: leg.prizePicksLine,
              source: 'PrizePicks',
              lineType: 'prizePicks' as any,
              propType: 'playerPoints' as any,
              sport: 'nba' as any,
              lineString: '',
              lastUpdated: BigInt(0),
              tournament: '',
            },
            edge: {
              edgePercentage: leg.edgePercentage,
              calcTime: BigInt(0),
              propId: BigInt(leg.propId),
              edgeScore: '',
              isValid: true,
            },
            projection: leg.consensusLine
              ? {
                  value: leg.consensusLine,
                  calcTime: BigInt(0),
                  projectionType: 'algoGenerated' as any,
                  propId: BigInt(leg.propId),
                  isValid: true,
                }
              : null,
            verification: leg.verification,
          };

          return (
            <Card key={leg.propId} className={highConfidence ? 'border-accent/50 bg-accent/5' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Leg {index + 1}
                      </Badge>
                      <CardTitle className="text-lg">{leg.playerName}</CardTitle>
                      {highConfidence && <ConfidenceBadge />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{leg.team}</span>
                      <span>•</span>
                      <span className="capitalize">{leg.statCategory}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLeg(leg.propId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">PrizePicks</p>
                    <p className="text-base font-bold">{leg.prizePicksLine.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Consensus</p>
                    <p className="text-base font-bold">
                      {leg.consensusLine ? leg.consensusLine.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Edge</p>
                    <p className={`text-base font-bold ${edgeColor}`}>
                      {Math.abs(leg.edgePercentage).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-base font-bold">
                      {leg.confidenceScore ? `${(leg.confidenceScore * 100).toFixed(0)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
                <ShowLogic edge={mockEdge} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {legs.length >= 2 && (
        <Card className="border-accent/50 bg-accent/10">
          <CardHeader>
            <CardTitle>Parlay Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Legs</p>
                <p className="text-2xl font-bold">{legs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">High Confidence</p>
                <p className="text-2xl font-bold">{highConfidenceCount}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Edge</p>
              <p className="text-lg font-semibold">
                {(
                  legs.reduce((sum, leg) => sum + Math.abs(leg.edgePercentage), 0) / legs.length
                ).toFixed(1)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Projected Combined Hit-Rate</p>
              {combinedHitRate.available ? (
                <p className="text-2xl font-bold text-accent">
                  {combinedHitRate.percentage!.toFixed(1)}%
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Not available (missing confidence data for {combinedHitRate.missingCount}{' '}
                  {combinedHitRate.missingCount === 1 ? 'leg' : 'legs'})
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
