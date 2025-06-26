import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import { UserProvider } from './context/userContext';
import { NotesProvider } from './context/notesContext';

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
                    <h1>DSFwe</h1>Home
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
