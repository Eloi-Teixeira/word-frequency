import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import { AnimatePresence, motion } from 'framer-motion';
import Slider from '../components/auth/Slider';
import { useUser } from '../context/userContext';

export const AuthPage = () => {
  const { isLoading, user } = useUser();

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
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};
