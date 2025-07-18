import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import { UserProvider } from './context/userContext';
import { NotesProvider } from './context/notesContext';
import { Link } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import ProtectedRoute from './components/helper/ProtectedRoute';

function App() {


  return (
    <div className="App">
      <UserProvider>
        <NotesProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h1>Home</h1>
                    <Link to={'/notes'}>Lodf</Link>
                    <h1>Login</h1>
                    <Link to={'/auth/login'}>Faça login</Link>
                  </div>
                }
              />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route
                path="/notes/*"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </UserProvider>
    </div>
  );
}

export default App;
