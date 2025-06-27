import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import { UserProvider } from './context/userContext';
import { NotesProvider } from './context/notesContext';
import { Link } from 'react-router-dom';

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
                    <h1>Home</h1><Link to={"/notes"}>Lodf</Link>
                  </div>
                }
              />
              <Route path="/login" element={<div>Login</div>} />
              <Route path="/notes/*" element={<NotesPage />} />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </UserProvider>
    </div>
  );
}

export default App;
