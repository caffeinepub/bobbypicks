import { Link } from '@tanstack/react-router';
import { Heart, TrendingUp, Layers, Settings, Info, Home, User, Radio } from 'lucide-react';
import { LoginButton } from '../auth/LoginButton';
import { useParlay } from '../../state/parlay/ParlayProvider';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { legs } = useParlay();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/bobbypicks-logo.dim_512x512.png"
                alt="Bobbypicks"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold tracking-tight">Bobbypicks</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </div>
              </Link>
              <Link
                to="/props"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Prop Board
                </div>
              </Link>
              <Link
                to="/live"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Live Picks
                </div>
              </Link>
              <Link
                to="/parlay"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent relative"
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Parlay Builder
                  {legs.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                      {legs.length}
                    </span>
                  )}
                </div>
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </div>
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-accent-foreground [&.active]:text-accent"
              >
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </div>
              </Link>
            </nav>
          </div>
          <LoginButton />
        </div>
      </header>

      <main className="flex-1 container py-8">{children}</main>

      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              <strong className="text-destructive">Gamble responsibly.</strong> This tool is for
              informational purposes only.{' '}
              <Link to="/about" className="underline hover:text-foreground">
                Read our disclaimer
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              © 2026. Built with <Heart className="inline h-3 w-3 text-accent" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
