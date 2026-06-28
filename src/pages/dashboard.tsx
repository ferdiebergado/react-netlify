import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'wouter';

export default function Dashboard() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const msg = searchParams.get('success');
    if (msg) toast.success(msg);
  }, [searchParams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>This is the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Welcome to your dashboard!</p>
      </CardContent>
    </Card>
  );
}
