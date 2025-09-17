import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import { UserProvider } from './context/userContext';
import { NotesProvider } from './context/notesContext';
import { AuthPage } from './pages/AuthPage';
import ProtectedRoute from './components/helper/ProtectedRoute';
import PublicRoute from './components/helper/PublicRoute';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <NotesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/auth/*"
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/notes/*"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </UserProvider>
    </div>
  );
}

export default App;
