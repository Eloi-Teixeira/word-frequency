import { useRef, useState } from 'react';
import { useNotes, Note } from '../context/notesContext';
import {
  createNote,
  deleteNote,
  deletePermanentNote,
  restoreNote,
} from '../services/notesServices';
import { SubmitMessageStatus, useSubmitMessage } from './useMessage';
import { useNavigate } from 'react-router-dom';

export const useManageNote = () => {
  const { setNotes, notes, setSelectedNote } = useNotes();
  const [status, setStatus] = useState<SubmitMessageStatus>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const isLoadingRef = useRef(false);
  const setLoading = (val: boolean) => {
    isLoadingRef.current = val;
  };

  const Feedback = useSubmitMessage({
    successMessage,
    errorMessage,
    type: status,
    displayTime: 2000,
  });

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setErrorMessage(error.message);
      setStatus('error');
      console.error(error);
    } else {
      setErrorMessage('Erro inesperado');
      setStatus('error');
      console.error('Erro desconhecido:', error);
    }
  };

  const executeWithFeedback = async (
    action: () => Promise<void>,
    successMsg: string,
    redirectPath?: string,
  ) => {
    if (isLoadingRef.current) return;

    setStatus(null);
    setLoading(true);
    try {
      await action();
      setSuccessMessage(successMsg);
      setStatus('success');
      if (redirectPath) navigate(redirectPath);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (title = 'Nova nota', content = '') => {
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
      deletedAt: null,
    };

    setNotes((prev) => [...prev, tempNote]);
    setSelectedNote(tempNote);

    const response = await createNote(title, content);

    if (!response.success || !response.data) {
      setNotes((prev) => prev.filter((note) => note._id !== tempId));
      setSelectedNote(null);
      throw new Error(response.message || 'Erro ao criar nota');
    }

    const newNote = notes.filter((note) => note._id === tempId)[0];
    newNote._id = response.data._id;
    newNote.isTemporary = false;
    newNote.createdAt = new Date(response.data.createdAt);

    setNotes((prev) =>
      prev.map((note) => (note._id === tempId ? newNote : note)),
    );
    setSelectedNote(newNote);
  };

  const handleBulkUpdate = async (
    notes: Note[],
    serviceFn: (ids: string[]) => Promise<any>,
    updateFn: (prevNote: Note) => Note,
  ) => {
    if (notes.length === 0) return;

    const ids = notes.map((note) => note._id);
    const response = await serviceFn(ids);

    if (!response.success) {
      throw new Error(response.message || 'Erro na operação');
    }

    setNotes((prev) =>
      prev.map((note) => (ids.includes(note._id) ? updateFn(note) : note)),
    );
    setSelectedNote(null);
  };

  const temporaryDeleteNote = async (notes: Note[]) => {
    await handleBulkUpdate(notes, deleteNote, (note) => ({
      ...note,
      isDeleted: true,
      deletedAt: new Date(),
    }));
  };

  const handleRestoreNote = async (notes: Note[]) => {
    await handleBulkUpdate(notes, restoreNote, (note) => ({
      ...note,
      isDeleted: false,
      deletedAt: null,
    }));
  };

  const permanentlyDeleteNote = async (notes: Note[]) => {
    if (notes.length === 0) return;

    const ids = notes.map((note) => note._id);
    const response = await deletePermanentNote(ids);

    if (!response.success) {
      throw new Error(response.message || 'Erro ao deletar notas');
    }
    
    setNotes((prevNotes) =>
      prevNotes.filter((prevNote) => prevNote._id !== notes[0]._id),
    );
    setSelectedNote(null);
  };

  // Public handlers com feedback
  const onCreateNote = () =>
    executeWithFeedback(
      () => handleCreateNote(),
      'Nota criada com sucesso!',
      '/notes',
    );

  const onDeleteTemporaryNotes = (notes: Note[]) =>
    executeWithFeedback(() => temporaryDeleteNote(notes), '');

  const onRestoreNote = (notes: Note[]) =>
    executeWithFeedback(
      () => handleRestoreNote(notes),
      'Nota restaurada com sucesso!',
      '/notes',
    );

  const onDeletePermanentlyNotes = (notes: Note[]) =>
    executeWithFeedback(
      () => permanentlyDeleteNote(notes),
      'Notas deletadas com sucesso!',
    );

  return {
    isLoading: isLoadingRef.current,
    onDeletePermanentlyNotes,
    onDeleteTemporaryNotes,
    onCreateNote,
    onRestoreNote,
    Feedback,
  };
};
