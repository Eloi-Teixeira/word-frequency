import { useState } from 'react';
import { Note, useNotes } from '../context/notesContext';
import {
  createNote,
  deleteNote,
  deletePermanentNote,
  restoreNote,
} from '../services/notesServices';
import { SubmitMessageStatus, useSubmitMessage } from './useMessage';
import { useNavigate } from 'react-router-dom';

export const useManageNote = () => {
  const { setNotes, setSelectedNote, notes } = useNotes();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Erro ao criar nota');
  const [status, setStatus] = useState<SubmitMessageStatus>(null);
  const [successMessage, setSuccessMessage] = useState(
    'Nota criada com sucesso!',
  );

  const navigate = useNavigate();
  const Feedback = useSubmitMessage({
    successMessage: successMessage,
    errorMessage: errorMessage,
    type: status,
    displayTime: 2000,
  });

    const navigateToNote = (id: string) => {
    setSelectedNote(
      notes.find((note) => note._id.toString() === id.toString()) || null,
    );
    navigate(`/notes`);
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setStatus('error');
      if (error.message.includes('401'))
        return setErrorMessage(
          'Usuário o token não autorizado. Faça o login novamente',
        );
      setErrorMessage(error.message);
    }
  };

  const handleCreateNote = async (
    title: string = 'Nova nota',
    content: string = '',
  ) => {
    if (isLoading) return;

    setIsLoading(true);

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
      } else {
        throw new Error(response.message || 'Erro ao criar nota');
      }
    } catch (error) {
      setNotes((n) => n.filter((n) => n.isTemporary !== true));
      setSelectedNote(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const permanentlyDeleteNote = async (notes: Note[]) => {
    if (isLoading) return null;
    setIsLoading(true);

    try {
      if (notes.length === 0) {
        setIsLoading(false);
        return;
      }
      const response = await deletePermanentNote(notes.map((note) => note._id));
      if (!response.success) {
        console.error('Erro ao deletar nota:', response.message);
        setIsLoading(false);
        throw new Error(response.message);
      }

      if (response.data) setNotes(response.data);
      setSelectedNote(null);
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const temporaryDeleteNote = async (notes: Note[]) => {
    if (isLoading) return null;
    setIsLoading(true);
    try {
      const response = await deleteNote(notes.map((note) => note._id));
      if (!response.success) {
        console.error('Erro ao deletar nota:', response.message);
        setIsLoading(false);
        throw new Error(response.message);
      }
      setNotes((prevNotes) =>
        prevNotes.map((prevNote) =>
          notes.some((note) => prevNote._id === note._id)
            ? { ...prevNote, isDeleted: true, deletedAt: new Date() }
            : prevNote,
        ),
      );
      setSelectedNote(null);
    } catch (error) {
      console.error('Erro ao deletar nota:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreNote = async (notes: Note[]) => {
    if (isLoading) return null;
    setIsLoading(true);
    try {
      const response = await restoreNote(notes.map((note) => note._id));
      if (!response.success) {
        console.error('Erro ao restaurar nota:', response.message);
        setIsLoading(false);
        throw new Error(response.message);
      }
      setNotes((prevNotes) =>
        prevNotes.map((prevNote) =>
          notes.some((note) => prevNote._id === note._id)
            ? { ...prevNote, isDeleted: false, deletedAt: null }
            : prevNote,
        ),
      );
      setSelectedNote(null);
    } catch (error) {
      console.error('Erro ao restaurar nota:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onRestoreNote = async (notes: Note[]) => {
    setStatus(null);
    try {
      await handleRestoreNote(notes);
      setSuccessMessage('Nota restaurada com sucesso!');
      setStatus('success');
      navigate('/notes');
    } catch (error) {
      handleError(error);
      console.error('Erro ao restaurar nota:', error);
    }
  };

  const onCreateNote = async () => {
    setStatus(null);
    try {
      await handleCreateNote();
      navigate('/notes');
    } catch (error) {
      handleError(error);
      console.error('Erro ao criar nota:', error);
    }
  };

  const onDeleteTemporaryNotes = async (notes: Note[]) => {
    setStatus(null);
    try {
      await temporaryDeleteNote(notes);
      setSuccessMessage('Nota movida para o lixo com sucesso!');
      setStatus('success');
    } catch (error) {
      handleError(error);
      console.error('Erro ao mover para o lixo nota:', error);
    }
  };

  const onDeletePermanentlyNotes = async (notes: Note[]) => {
    setStatus(null);
    try {
      await permanentlyDeleteNote(notes);
      setStatus('success');
      setSuccessMessage('Nota deletada com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      }
      console.error('Erro ao deletar nota:', error);
    }
  };
  return {
    isLoading,
    onDeletePermanentlyNotes,
    onDeleteTemporaryNotes,
    navigateToNote,
    onCreateNote,
    onRestoreNote,
    Feedback,
  };
};
