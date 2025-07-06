import { Route, Routes } from 'react-router-dom';
import AsideNotes from '../components/notes/AsideNotes';
import MainNotes from '../components/notes/MainNotes';
import { EditorNotes } from '../components/notes/EditorNotes';
import { Note, useNotes } from '../context/notesContext';
import { useCallback, useEffect, useState } from 'react';

export default function NotesPage() {
  const { selectedNote, notes, setNotes } = useNotes();

  const saveNote = useCallback((updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note._id === updatedNote._id ? { ...updatedNote } : note,
    );
    console.log(updatedNote.content);
    setNotes(updatedNotes);
  }, [notes]);

  return (
    <div className="notes-page">
      <AsideNotes />
      <Routes>
        <Route path="/" element={<MainNotes />} />
        <Route path="/tags" element={<div>Tags</div>} />
        <Route path="/trash" element={<div>Lixeira</div>} />
      </Routes>
      {selectedNote ? (
        <EditorNotes note={selectedNote} saveNote={saveNote} />
      ) : null}
    </div>
  );
}
