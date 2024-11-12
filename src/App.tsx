import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Checkout } from './pages/Checkout';
import { ChristmasBanner } from './components/ChristmasBanner';
import { useThemeStore } from './store/theme-store';
import { useAuthStore } from './store/auth-store';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useEffect, useState } from 'react';

export default function App() {
  const theme = useThemeStore((state) => state.theme);
  const { isAuthInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthInitialized) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthInitialized]);

  return (
    <Router>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-zinc-950 transition-colors`}>
        <ChristmasBanner />
        <Navbar />
        {isLoading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}