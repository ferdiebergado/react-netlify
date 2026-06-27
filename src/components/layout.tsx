import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Suspense } from 'react';
import Page from '../page';
import SkeletonCard from './skeleton-card';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Suspense fallback={<SkeletonCard />}>
            <Page />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
