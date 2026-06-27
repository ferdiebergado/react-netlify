import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Dashboard() {
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
