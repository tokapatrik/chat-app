import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { LoadingSpinner } from './components/LoadingSpinner';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: {
      queryClient
    },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: () => <div>Something went wrong...</div>,
    defaultPendingMs: 300,
    defaultPendingMinMs: 400,
    defaultPendingComponent: () => (
      <div className="border-muted flex flex-col items-center justify-center gap-2 rounded border p-4">
        <LoadingSpinner />
        Loading...
      </div>
    ),
    defaultNotFoundComponent: () => <div>Page not found</div>
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
