import {
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SplashScreen } from './components/splash-screen';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { queryClient } from './lib/query-client';
import { Page } from './page';
import { Fallback } from './pages/fallback';
import { ThemeProvider } from './theme/theme-provider';

export function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ThemeProvider>
      <ErrorBoundary
        FallbackComponent={Fallback}
        onError={(error, info) => {
          console.error('Error caught by boundary:', error, info);
          // TODO: Send to error tracking service
        }}
        onReset={reset}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Suspense fallback={<SplashScreen />}>
              <Page />
            </Suspense>
          </TooltipProvider>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
