import { Suspense, useEffect } from 'react';
import FullpageSpinner from './components/fullpage-spinner';
import Header from './components/header';
import Page from './page';

function App() {
  useEffect(() => {
    const fetchHello = async () => {
      const res = await fetch('/api/hello');
      const msg = await res.text();
      console.log(msg);
    };

    fetchHello().catch(e => console.error(e));
  }, []);

  return (
    <div className="bg-secondary flex flex-col h-dvh items-center">
      <Header />
      <main className="flex-1 p-5 w-full">
        <Suspense fallback={<FullpageSpinner />}>
          <Page />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
