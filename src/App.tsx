import { useEffect } from 'react';
import Layout from './components/layout';
import { TooltipProvider } from './components/ui/tooltip';

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
    <TooltipProvider>
      <Layout />
    </TooltipProvider>
  );
}

export default App;
