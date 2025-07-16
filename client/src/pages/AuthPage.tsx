import { Route, Routes } from 'react-router-dom';
import LoginPage from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Slider from '../components/auth/Slider';

const slides = [
  { title: 'Organize suas ideias', description: 'Com nosso app de anotações' },
  { title: 'Acesse de qualquer lugar', description: 'Sincronização em nuvem' },
  { title: 'Segurança garantida', description: 'Seus dados estão protegidos' },
];

export const AuthPage = () => {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Atualiza index e registra direção ANTES
  const paginate = (newDirection: number) => {
    setIndex(([prevIndex]) => {
      const nextIndex =
        (prevIndex + newDirection + slides.length) % slides.length;
      return [nextIndex, newDirection];
    });
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => paginate(1), 6000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <div className="auth-page">
        <Slider />

      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/login"
            element={
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
              >
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/signup"
            element={
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm"
              >
                <Signup />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
};
