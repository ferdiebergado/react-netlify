import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-50" />
        <Skeleton className="h-6 w-60" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-5 w-130" />
      </CardContent>
    </Card>
  );
}
