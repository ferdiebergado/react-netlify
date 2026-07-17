import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  ArrowClockwiseIcon,
  ArrowsClockwiseIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import type { FallbackProps } from 'react-error-boundary';

export function Fallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Empty className="flex h-dvh items-center justify-center border">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-destructive">
          <WarningIcon className="bg-background size-12" />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-xl font-semibold text-pretty">
          Something went wrong.
        </EmptyTitle>
        <EmptyDescription className="max-w-xs text-balance">
          Please try again or reload the page. Contact support if the problem
          persists.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-8">
        <Button onClick={() => resetErrorBoundary()}>
          <ArrowsClockwiseIcon data-icon="inline-start" />
          Try again
        </Button>
        <Button variant="outline" onClick={() => globalThis.location.reload()}>
          <ArrowClockwiseIcon data-icon="inline-start" />
          Reload page
        </Button>
      </EmptyContent>
    </Empty>
  );
}
