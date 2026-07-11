import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Suspense, type ReactNode } from 'react';
import { ThemeMenu } from '../theme/theme-menu';
import SkeletonCard from './skeleton-card';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="px-4">
            <ThemeMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Suspense fallback={<SkeletonCard />}>{children}</Suspense>
        </main>
        <footer className="flex h-16 shrink-0 items-center justify-center gap-2 px-4">
          <p className="text-muted-foreground text-sm">
            &copy; 2026 to present by {import.meta.env.VITE_APP_DEVELOPER}.
          </p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
