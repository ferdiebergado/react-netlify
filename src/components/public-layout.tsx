import type { ReactNode } from 'react';
import { Toaster } from './ui/sonner';

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {children}
      <Toaster position="top-center" richColors />
    </div>
  );
}
