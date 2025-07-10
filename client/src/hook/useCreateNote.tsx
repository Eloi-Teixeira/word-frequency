import { useState } from 'react';
import { Note, useNotes } from '../context/notesContext';
import { createNote } from '../services/notesServices';

export const useCreateNote = () => {
  const { setNotes, setSelectedNote } = useNotes();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = async (
    title: string = 'Nova nota',
    content: string = '',
  ) => {
    if (isCreating) return null;

    setIsCreating(true);

    const tempId = `temp-${Date.now()}`;
    let tempNote: Note = {
      _id: tempId,
      title,
      content,
      tags: [],
      pinned: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemporary: true,
    };

    setNotes((n) => [...n, tempNote]);
    setSelectedNote(tempNote);
    try {
      const response = await createNote(title, content);

      if (response.success && response.data) {
        tempNote = {
          ...tempNote,
          _id: response.data._id,
          isTemporary: false,
        };
        setNotes((n) => n.map((n) => (n.isTemporary === true ? tempNote : n)));
        setSelectedNote(response.data);
        return response.data;
      } else {
        setNotes((n) => n.filter((n) => n.isTemporary !== true));
        setSelectedNote(null);
        throw new Error(response.message || 'Erro ao criar nota');
      }
    } catch (error) {
      setNotes((n) => n.filter((n) => n.isTemporary !== true));
      setSelectedNote(null);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { handleCreateNote, isCreating };
};
