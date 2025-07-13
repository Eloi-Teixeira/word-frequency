import { Route, Routes } from 'react-router-dom';
import AsideNotes from '../components/notes/AsideNotes';
import MainNotes from '../components/notes/MainNotes';
import { EditorNotes } from '../components/notes/EditorNotes';
import { Note, useNotes } from '../context/notesContext';
import { useCallback, useState } from 'react';
import { ConfigModal } from '../components/notes/ConfigModal';
import { TrashNotes } from '../components/notes/TrashNotes';
import { useManageNote } from '../hook/useManageNote';

export default function NotesPage() {
  const { selectedNote, notes, setNotes } = useNotes();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { onCreateNote, isLoading } = useManageNote();

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
        <Route
          path="/"
          element={<MainNotes search={search} setSearch={setSearch} />}
        />
        <Route path="/tags" element={<div>Tags</div>} />
        <Route
          path="/trash"
          element={<TrashNotes search={search} setSearch={setSearch} />}
        />
      </Routes>
      {selectedNote ? (
        <EditorNotes
          note={selectedNote}
          saveNote={saveNote}
          setSearch={setSearch}
        />
      ) : (
        <section className="empty-notes" onClick={onCreateNote}>
          <h1>Está tão vazio aqui...</h1>
          <p>
            Selecione uma nota para editar <br />
            ou <span>clique aqui</span> para criar uma nova nota
          </p>
        </section>
      )}
      <ConfigModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
