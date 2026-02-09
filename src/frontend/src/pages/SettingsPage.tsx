import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminOnly } from '../components/auth/AdminOnly';
import { useRefreshStatus } from '../hooks/queries/useRefreshStatus';
import { useManualRefresh } from '../hooks/mutations/useManualRefresh';
import { useRefreshLivePicks } from '../hooks/mutations/useRefreshLivePicks';
import { useLivePicksDiagnostics } from '../hooks/queries/useLivePicksDiagnostics';
import { useSettlementDiagnostics } from '../hooks/queries/useSettlementDiagnostics';
import { useSettlementMetrics } from '../hooks/queries/useSettlementMetrics';
import { useRunSettlementNow } from '../hooks/mutations/useRunSettlementNow';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield, Key, UserPlus, Radio, Wifi, CheckCircle2, XCircle, AlertTriangle, Clock, TrendingUp, Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { useProviderConfig } from '../hooks/queries/useProviderConfig';
import { useSaveProviderConfig } from '../hooks/mutations/useSaveProviderConfig';
import { useTestOpticOddsConnection } from '../hooks/mutations/useTestOpticOddsConnection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { PrincipalIdCard } from '../components/account/PrincipalIdCard';
import { useGrantAdmin } from '../hooks/mutations/useGrantAdmin';
import { SensitivitySettingsCard } from '../components/settings/SensitivitySettingsCard';
import { MarketAlertsPanel } from '../components/alerts/MarketAlertsPanel';
import { useSensitivitySettings } from '../hooks/queries/useSensitivitySettings';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { OpticOddsConnectionResult } from '../backend';

export default function SettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: refreshStatus } = useRefreshStatus();
  const { mutate: refresh, isPending } = useManualRefresh();
  const { mutate: refreshLivePicks, isPending: isRefreshingLivePicks } = useRefreshLivePicks();
  const { data: livePicksDiagnostics } = useLivePicksDiagnostics();
  const { data: settlementDiagnostics } = useSettlementDiagnostics();
  const { data: settlementMetrics } = useSettlementMetrics();
  const { mutate: runSettlement, isPending: isRunningSettlement } = useRunSettlementNow();
  const { data: providerConfig } = useProviderConfig();
  const { mutate: saveConfig, isPending: isSaving } = useSaveProviderConfig();
  const { mutate: grantAdmin, isPending: isGranting } = useGrantAdmin();
  const { mutate: testConnection, isPending: isTesting, data: testResult } = useTestOpticOddsConnection();
  const { data: sensitivitySettings } = useSensitivitySettings();

  const [oddsApiKey, setOddsApiKey] = useState('');
  const [dailyFantasyApiKey, setDailyFantasyApiKey] = useState('');
  const [opticOddsApiKey, setOpticOddsApiKey] = useState('');
  const [principalToPromote, setPrincipalToPromote] = useState('');

  useEffect(() => {
    if (providerConfig) {
      setOddsApiKey(providerConfig.oddsApiKey);
      setDailyFantasyApiKey(providerConfig.dailyFantasyApiKey);
      setOpticOddsApiKey(providerConfig.opticOddsApiKey);
    }
  }, [providerConfig]);

  const handleSaveConfig = () => {
    saveConfig({
      oddsApiKey,
      dailyFantasyApiKey,
      opticOddsApiKey,
    });
  };

  const handleGrantAdmin = () => {
    if (!principalToPromote.trim()) {
      return;
    }
    grantAdmin(principalToPromote.trim(), {
      onSuccess: () => {
        setPrincipalToPromote('');
      },
    });
  };

  const handleTestConnection = () => {
    testConnection();
  };

  const handleRunSettlement = () => {
    runSettlement();
  };

  const formatTestResult = (result: OpticOddsConnectionResult) => {
    const checkedAt = formatDistanceToNow(new Date(Number(result.timestamp) / 1000000), {
      addSuffix: true,
    });

    if (!result.healthy) {
      if (result.message.includes('configuration not found') || result.message.includes('not found')) {
        return {
          title: 'Configuration Missing',
          description: 'Please save your OpticOdds API key in the API Configuration section above before testing the connection.',
          variant: 'destructive' as const,
        };
      }
      return {
        title: 'Connection Failed',
        description: `${result.message}${result.statusCode ? ` (Status: ${result.statusCode})` : ''} • Checked ${checkedAt}`,
        variant: 'destructive' as const,
      };
    }

    return {
      title: 'Connection Successful',
      description: `${result.message} • Checked ${checkedAt}`,
      variant: 'default' as const,
    };
  };

  const formatTimestamp = (timestamp: bigint) => {
    if (timestamp === BigInt(0)) return 'Never';
    return formatDistanceToNow(new Date(Number(timestamp) / 1000000), { addSuffix: true });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and data refresh</p>
      </div>

      <PrincipalIdCard />

      {/* Sensitivity Settings - Available to all authenticated users */}
      {identity && <SensitivitySettingsCard />}

      {/* Market Alerts Panel - Only shown when alerts are enabled */}
      {identity && sensitivitySettings?.marketAlertsEnabled && <MarketAlertsPanel />}

      <Card>
        <CardHeader>
          <CardTitle>Data Status</CardTitle>
          <CardDescription>View the current state of prop data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Refresh</span>
            <span className="text-sm font-medium">
              {refreshStatus
                ? formatDistanceToNow(new Date(Number(refreshStatus) / 1000000), {
                    addSuffix: true,
                  })
                : 'Never'}
            </span>
          </div>
        </CardContent>
      </Card>

      <AdminOnly>
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-accent" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API keys for data providers (The Odds API, DailyFantasyAPI.io, OpticOdds)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oddsApiKey">The Odds API Key</Label>
              <Input
                id="oddsApiKey"
                type="password"
                placeholder="Enter your Odds API key"
                value={oddsApiKey}
                onChange={(e) => setOddsApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyFantasyApiKey">DailyFantasyAPI.io Key</Label>
              <Input
                id="dailyFantasyApiKey"
                type="password"
                placeholder="Enter your DailyFantasyAPI.io key"
                value={dailyFantasyApiKey}
                onChange={(e) => setDailyFantasyApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opticOddsApiKey">OpticOdds API Key</Label>
              <Input
                id="opticOddsApiKey"
                type="password"
                placeholder="Enter your OpticOdds API key"
                value={opticOddsApiKey}
                onChange={(e) => setOpticOddsApiKey(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveConfig} disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-accent" />
              OpticOdds Connection Test
            </CardTitle>
            <CardDescription>
              Test your OpticOdds API connection and verify credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleTestConnection} 
              disabled={isTesting} 
              className="w-full"
              variant="outline"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Test OpticOdds Connection
                </>
              )}
            </Button>

            {testResult && (
              <Alert variant={formatTestResult(testResult).variant}>
                <div className="flex items-start gap-2">
                  {testResult.healthy ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertTitle>{formatTestResult(testResult).title}</AlertTitle>
                    <AlertDescription className="mt-1">
                      {formatTestResult(testResult).description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-accent" />
              Live Picks Ingestion Status
            </CardTitle>
            <CardDescription>
              Monitor the status of Live Picks data ingestion from OpticOdds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {livePicksDiagnostics ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Attempt</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimestamp(livePicksDiagnostics.lastAttempt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Success</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      {formatTimestamp(livePicksDiagnostics.lastSuccess)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Failure</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                      {formatTimestamp(livePicksDiagnostics.lastFailure)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Live Picks Count</p>
                    <p className="text-sm font-medium">
                      {Number(livePicksDiagnostics.numLivePicks)} picks
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Attempts</p>
                    <p className="text-sm font-medium">{Number(livePicksDiagnostics.totalAttempts)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Successes</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {Number(livePicksDiagnostics.totalSuccesses)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Failures</p>
                    <p className="text-sm font-medium text-destructive">
                      {Number(livePicksDiagnostics.totalFailures)}
                    </p>
                  </div>
                </div>

                {livePicksDiagnostics.lastFailureMessage && livePicksDiagnostics.lastFailure > BigInt(0) && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Last Failure Message</AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                      {livePicksDiagnostics.lastFailureMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading diagnostics...</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Settlement Engine Status
            </CardTitle>
            <CardDescription>
              Monitor the automatic settlement engine that grades predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settlementDiagnostics ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Attempt</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimestamp(settlementDiagnostics.lastAttempt)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Success</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      {formatTimestamp(settlementDiagnostics.lastSuccess)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Failure</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                      {formatTimestamp(settlementDiagnostics.lastFailure)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Active Predictions</p>
                    <p className="text-sm font-medium">
                      {Number(settlementDiagnostics.numActivePredictions)} active
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Run</p>
                    <p className="text-sm font-medium">{Number(settlementDiagnostics.numSettledInLastRun)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                    <p className="text-sm font-medium">{Number(settlementDiagnostics.totalAttempts)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Successes</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {Number(settlementDiagnostics.totalSuccesses)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Failures</p>
                    <p className="text-sm font-medium text-destructive">
                      {Number(settlementDiagnostics.totalFailures)}
                    </p>
                  </div>
                </div>

                {settlementDiagnostics.lastFailureMessage && settlementDiagnostics.lastFailure > BigInt(0) && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Last Failure Message</AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                      {settlementDiagnostics.lastFailureMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {settlementMetrics && settlementMetrics.totalSettled > BigInt(0) && (
                  <div className="pt-4 border-t space-y-3">
                    <p className="text-sm font-medium">Latest Settlement Metrics</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">7-Day Win Rate</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-accent" />
                          {(settlementMetrics.sevenDayWinRate * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total ROI</p>
                        <p className={`text-sm font-medium flex items-center gap-2 ${settlementMetrics.totalROI >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                          <TrendingUp className="h-3.5 w-3.5" />
                          {settlementMetrics.totalROI >= 0 ? '+' : ''}{(settlementMetrics.totalROI * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading diagnostics...</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent" />
              Admin Management
            </CardTitle>
            <CardDescription>
              Grant administrator privileges to other users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Grant Admin Access</AlertTitle>
              <AlertDescription>
                Enter a Principal ID to promote a user to administrator. They will gain full access to admin controls after their next login.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="principalId">Principal ID</Label>
              <Input
                id="principalId"
                type="text"
                placeholder="Enter Principal ID to promote"
                value={principalToPromote}
                onChange={(e) => setPrincipalToPromote(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleGrantAdmin} 
              disabled={isGranting || !principalToPromote.trim()} 
              className="w-full"
            >
              {isGranting ? 'Granting Admin...' : 'Grant Admin'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Admin Controls
            </CardTitle>
            <CardDescription>
              These controls are only visible to authenticated administrators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>Manual Data Refresh</AlertTitle>
              <AlertDescription>
                Trigger a manual refresh to fetch the latest lines from PrizePicks and sportsbook
                providers. This may take a few moments.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refresh()} disabled={isPending} className="w-full">
              <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
              {isPending ? 'Refreshing Data...' : 'Refresh Data Now'}
            </Button>

            <Alert>
              <AlertTitle>Refresh Live Picks</AlertTitle>
              <AlertDescription>
                Trigger a manual refresh to populate the Live Picks dataset with current in-game player props.
              </AlertDescription>
            </Alert>
            <Button onClick={() => refreshLivePicks()} disabled={isRefreshingLivePicks} className="w-full">
              <Radio className={`mr-2 h-4 w-4 ${isRefreshingLivePicks ? 'animate-spin' : ''}`} />
              {isRefreshingLivePicks ? 'Refreshing Live Picks...' : 'Refresh Live Picks Now'}
            </Button>

            <Alert>
              <AlertTitle>Run Settlement Now</AlertTitle>
              <AlertDescription>
                Manually trigger the settlement engine to check for completed games and grade active predictions.
              </AlertDescription>
            </Alert>
            <Button onClick={handleRunSettlement} disabled={isRunningSettlement} className="w-full">
              <Target className={`mr-2 h-4 w-4 ${isRunningSettlement ? 'animate-spin' : ''}`} />
              {isRunningSettlement ? 'Running Settlement...' : 'Run Settlement Now'}
            </Button>
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}
