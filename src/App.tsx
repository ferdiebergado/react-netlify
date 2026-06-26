import { useEffect } from 'react';
import LoginPage from './login-page';

function App() {
  useEffect(() => {
    const fetchHello = async () => {
      const res = await fetch('/api/hello');
      const msg = await res.text();
      console.log(msg);
    };

    fetchHello().catch(e => console.error(e));
  }, []);

  return <LoginPage />;
}

export default App;
