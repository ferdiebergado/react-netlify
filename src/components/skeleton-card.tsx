import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-50 h-7" />
        <Skeleton className="w-60 h-6" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-130 h-5" />
      </CardContent>
    </Card>
  );
}
