import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Layers, Shield, Zap, BarChart3 } from 'lucide-react';
import { useEdges } from '../hooks/queries/useEdges';
import { DailyTopParlay } from '../components/landing/DailyTopParlay';
import { SettlementMetricsModule } from '../components/landing/SettlementMetricsModule';
import { LivePicksPreview } from '../components/landing/LivePicksPreview';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function LandingPage() {
  const { identity } = useInternetIdentity();
  const { data: edges } = useEdges();

  // Only show top 3 edges if authenticated and data is available
  const topEdges = identity && edges ? edges.slice(0, 3) : [];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-accent/5 to-background border border-accent/20 p-12 md:p-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(/assets/generated/bobbypicks-bg-texture.dim_1024x1024.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find Your Edge in{' '}
            <span className="text-accent">Player Props</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            BobbyPicks analyzes PrizePicks lines against real-time sportsbook odds to surface
            high-confidence opportunities. Built for sharp bettors who want data-driven insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/edges">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Edge Board
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Performance Tracker - Public Metrics */}
      <section>
        <SettlementMetricsModule />
      </section>

      {/* Live Picks Preview - Only shown when authenticated and data available */}
      <LivePicksPreview />

      {/* Daily Top 3 Parlay - Only shown when authenticated */}
      {identity && topEdges.length > 0 && (
        <section>
          <DailyTopParlay edges={topEdges} />
        </section>
      )}

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Why BobbyPicks?
          </h2>
          <p className="text-muted-foreground">
            Powerful tools and transparent methodology to help you make smarter prop bets
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Edge Detection</CardTitle>
              </div>
              <CardDescription>
                Compare PrizePicks lines to sportsbook odds in real-time. Identify mispriced props
                where the market disagrees with the DFS line.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Verification Analysis</CardTitle>
              </div>
              <CardDescription>
                Every pick includes a confidence score based on recent performance data. Filter by
                your preferred rolling window (Last 3 Games or Season Average).
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Layers className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Parlay Builder</CardTitle>
              </div>
              <CardDescription>
                Stack 2-6 legs with projected combined hit-rate calculations. Export your parlay
                summary to clipboard for easy entry on PrizePicks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Transparent Logic</CardTitle>
              </div>
              <CardDescription>
                See exactly how each edge is calculated. No black boxes—every confidence score
                shows the underlying data and methodology.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Live Picks</CardTitle>
              </div>
              <CardDescription>
                Track in-game player props as they update in real-time. Monitor live opportunities
                and adjust your strategy on the fly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Sensitivity Controls</CardTitle>
              </div>
              <CardDescription>
                Customize your edge threshold (1-10%) and verification window. Tailor the platform
                to match your risk tolerance and betting style.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Find Your Edge?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join BobbyPicks today and start making data-driven prop bets with confidence.
        </p>
        <Button asChild size="lg" className="text-lg px-8">
          <Link to="/edges">
            <TrendingUp className="mr-2 h-5 w-5" />
            Get Started
          </Link>
        </Button>
      </section>
    </div>
  );
}
