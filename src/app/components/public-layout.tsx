import type { ReactNode } from 'react';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
    </div>
  );
}
