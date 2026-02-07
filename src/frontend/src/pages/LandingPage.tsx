import { useEdges } from '../hooks/queries/useEdges';
import { LoadingState } from '../components/loading/LoadingState';
import { ErrorState } from '../components/error/ErrorState';
import { DailyTopParlay } from '../components/landing/DailyTopParlay';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { TrendingUp, Target, Zap } from 'lucide-react';

export default function LandingPage() {
  const { data: edges, isLoading, error } = useEdges();

  if (isLoading) {
    return <LoadingState message="Loading today's opportunities..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Get top 3 edges by absolute edge percentage
  const topEdges = edges
    ? [...edges]
        .sort((a, b) => Math.abs(b.edge.edgePercentage) - Math.abs(a.edge.edgePercentage))
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-accent/10 border border-accent/20">
        <div className="absolute inset-0 bg-[url('/assets/generated/bobbypicks-bg-texture.dim_1024x1024.png')] opacity-5" />
        <div className="relative px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              AI-Powered Edge Detection
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Find the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
                Edge
              </span>
              <br />
              Before Everyone Else
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Advanced analytics reveal line discrepancies between PrizePicks and sharp sportsbooks.
              Build smarter parlays with confidence.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link to="/props">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Explore Prop Board
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                  <Target className="mr-2 h-5 w-5" />
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Top 3 Parlay */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Daily Top 3 Parlay
          </h2>
          <p className="text-muted-foreground text-lg">
            Today's highest-edge opportunities, ready to bundle
          </p>
        </div>
        <DailyTopParlay edges={topEdges} />
      </section>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur space-y-3">
          <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-xl font-bold">Edge Detection</h3>
          <p className="text-muted-foreground">
            Automatically identify props where PrizePicks lines differ significantly from sharp
            consensus.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur space-y-3">
          <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-xl font-bold">Confidence Scoring</h3>
          <p className="text-muted-foreground">
            Every pick includes a confidence score based on verification data and historical
            performance.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur space-y-3">
          <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-xl font-bold">Parlay Builder</h3>
          <p className="text-muted-foreground">
            Bundle 2-6 picks with projected combined hit-rate and transparent logic for each
            selection.
          </p>
        </div>
      </section>
    </div>
  );
}
