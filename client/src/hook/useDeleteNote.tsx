import { useState } from 'react';
import { Note, useNotes } from '../context/notesContext';
import { deleteNote, deletePermanentNote } from '../services/notesServices';

export const useDeleteNote = () => {
  const { setNotes, setSelectedNote } = useNotes();
  const [isDeleting, setisDeleting] = useState(false);

  const permanentlyDeleteNote = async (notes: Note[]) => {
    if (isDeleting) return null;
    setisDeleting(true);

    try {
      if (notes.length === 0) {
        setisDeleting(false);
        return;
      }
      const response = await deletePermanentNote(notes.map((note) => note._id));
      if (!response.success) {
        console.error('Erro ao deletar nota:', response.message);
        setisDeleting(false);
        throw new Error(response.message);
      }

      if (response.data) setNotes(response.data);
      setSelectedNote(null);
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      throw error;
    } finally {
      setisDeleting(false);
    }
  };

  const temporaryDeleteNote = async (note: Note) => {
    if (isDeleting) return null;
    setisDeleting(true);
    try {
      const response = await deleteNote(note._id);
      if (!response.success) {
        console.error('Erro ao deletar nota:', response.message);
        setisDeleting(false);
        throw new Error(response.message);
      }
      setNotes((prevNotes) =>
        prevNotes.map((prevNote) =>
          prevNote._id === note._id
            ? { ...prevNote, isDeleted: true }
            : prevNote,
        ),
      );
      setSelectedNote(null);
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      throw error;
    } finally {
      setisDeleting(false);
    }
  };

  return { permanentlyDeleteNote, temporaryDeleteNote, isDeleting };
};
