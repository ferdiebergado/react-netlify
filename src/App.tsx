import {
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import 'sonner/dist/styles.css';
import SplashScreen from './components/splash-screen';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { queryClient } from './lib/query-client';
import Page from './page';
import Fallback from './pages/fallback';
import ThemeProvider from './theme/theme-provider';

function App() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      // onError={(error, info) => {
      //   // Log the error to your error reporting service
      // }}
      onReset={reset}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Suspense fallback={<SplashScreen />}>
              <Page />
            </Suspense>
          </TooltipProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
