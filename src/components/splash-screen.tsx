import { Logo } from './logo';

export function SplashScreen() {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center">
      <h1 className="font-heading flex animate-pulse items-center justify-center gap-3 text-center text-3xl font-bold text-shadow-lg">
        <Logo />
        {import.meta.env.VITE_APP_TITLE}
      </h1>
    </section>
  );
}
