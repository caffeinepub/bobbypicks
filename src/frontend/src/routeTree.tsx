import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import EdgeBoardPage from './pages/EdgeBoardPage';
import PropBoardPage from './pages/PropBoardPage';
import PropDetailPage from './pages/PropDetailPage';
import ParlayBuilderPage from './pages/ParlayBuilderPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

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

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/board',
  component: EdgeBoardPage,
});

const propsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/props',
  component: PropBoardPage,
});

const propDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/prop/$propId',
  component: PropDetailPage,
});

const parlayBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parlay',
  component: ParlayBuilderPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  boardRoute,
  propsRoute,
  propDetailRoute,
  parlayBuilderRoute,
  settingsRoute,
  aboutRoute,
]);
