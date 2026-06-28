import { LinkBreakIcon } from '@phosphor-icons/react';
import { useLocation } from 'wouter';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function PageNotFound() {
  const [, navigate] = useLocation();

  return (
    <Empty className="flex h-dvh items-center justify-center">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LinkBreakIcon className="size-10 bg-background" />
        </EmptyMedia>
        <EmptyTitle className="text-4xl font-semibold">Page not found</EmptyTitle>
        <EmptyDescription>The page you're looking for doesn't exist.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-8">
        <Button onClick={() => navigate('/')}>Home</Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </EmptyContent>
    </Empty>
  );
}
