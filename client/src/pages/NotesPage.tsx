import { Route, Routes, useNavigate } from 'react-router-dom';
import AsideNotes from '../components/notes/AsideNotes';
import MainNotes from '../components/notes/MainNotes';
import { EditorNotes } from '../components/notes/EditorNotes';
import { Note, useNotes } from '../context/notesContext';
import { useCallback, useEffect, useState } from 'react';
import { ConfigModal } from '../components/notes/ConfigModal';

export default function NotesPage() {
  const { selectedNote, notes, setNotes } = useNotes();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const saveNote = useCallback(
    (updatedNote: Note) => {
      // const updatedNotes = notes.map((note) =>
      //   note._id === updatedNote._id ? { ...updatedNote } : note,
      // );
      // setNotes(updatedNotes);
    },
    [notes],
  );

  return (
    <div className="notes-page">
      <AsideNotes setOpenConfig={setIsMenuOpen} setTagToSearch={setSearch} />
      <Routes>
        <Route path="/" element={<MainNotes search={search} setSearch={setSearch} />} />
        <Route path="/tags" element={<div>Tags</div>} />
        <Route path="/trash" element={<div>Lixeira</div>} />
      </Routes>
      {selectedNote ? (
        <EditorNotes note={selectedNote} saveNote={saveNote} setSearch={setSearch} />
      ) : null}
      <ConfigModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
