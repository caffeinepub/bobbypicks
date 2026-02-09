import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useSettlementMetrics } from '../../hooks/queries/useSettlementMetrics';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SettlementMetricsModule() {
  const { data: metrics, isLoading, isError } = useSettlementMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Performance Tracker
          </CardTitle>
          <CardDescription>Loading settlement metrics...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Performance Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load performance metrics. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no settled results yet
  if (!metrics || metrics.totalSettled === BigInt(0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Performance Tracker
          </CardTitle>
          <CardDescription>Track your prediction success rate and ROI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No settled results yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Performance metrics will appear once predictions are settled.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const winRatePercentage = (metrics.sevenDayWinRate * 100).toFixed(1);
  const roiPercentage = (metrics.totalROI * 100).toFixed(1);
  const roiIsPositive = metrics.totalROI >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Performance Tracker
        </CardTitle>
        <CardDescription>
          Real-time success metrics from settled predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 7-Day Win Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">7-Day Win Rate</span>
              <Target className="h-4 w-4 text-accent" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{winRatePercentage}%</span>
              <span className="text-xs text-muted-foreground">
                ({Number(metrics.totalWon)} wins / {Number(metrics.totalWon) + Number(metrics.totalLost)} settled)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${winRatePercentage}%` }}
              />
            </div>
          </div>

          {/* Total ROI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total ROI</span>
              <TrendingUp className={`h-4 w-4 ${roiIsPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold tracking-tight ${roiIsPositive ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                {roiIsPositive ? '+' : ''}{roiPercentage}%
              </span>
              <span className="text-xs text-muted-foreground">
                across {Number(metrics.totalSettled)} predictions
              </span>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>Won: {Number(metrics.totalWon)}</span>
              <span>•</span>
              <span>Lost: {Number(metrics.totalLost)}</span>
              <span>•</span>
              <span>Push: {Number(metrics.totalPush)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
