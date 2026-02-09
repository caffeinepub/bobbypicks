import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { AppLayout } from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import EdgeBoardPage from './pages/EdgeBoardPage';
import PropBoardPage from './pages/PropBoardPage';
import PropDetailPage from './pages/PropDetailPage';
import ParlayBuilderPage from './pages/ParlayBuilderPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import LivePicksPage from './pages/LivePicksPage';
import { RequireAuth } from './components/auth/RequireAuth';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const edgesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edges',
  component: () => (
    <RequireAuth>
      <EdgeBoardPage />
    </RequireAuth>
  ),
});

const propsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/props',
  component: () => (
    <RequireAuth>
      <PropBoardPage />
    </RequireAuth>
  ),
});

const propDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prop/$propId',
  component: () => (
    <RequireAuth>
      <PropDetailPage />
    </RequireAuth>
  ),
});

const parlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parlay',
  component: () => (
    <RequireAuth>
      <ParlayBuilderPage />
    </RequireAuth>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

const liveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/live',
  component: () => (
    <RequireAuth>
      <LivePicksPage />
    </RequireAuth>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  edgesRoute,
  propsRoute,
  propDetailRoute,
  parlayRoute,
  settingsRoute,
  profileRoute,
  liveRoute,
  aboutRoute,
]);

export const router = createRouter({ routeTree });

export type Router = typeof router;
