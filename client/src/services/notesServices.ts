import { Note } from '../context/notesContext';
import api from './api';

interface APIResponse<T> {
  success: boolean;
  deletedCount?: number;
  message?: string;
  data?: T;
}

interface OptionalNotes extends Partial<Note> {}

export const deleteNote = async (
  notes: string[],
): Promise<APIResponse<null>> => {
  const response = await api.delete(`/notes/`, { data: { notes }});
  return response.data;
};

export const createNote = async (
  title: string,
  content: string,
): Promise<APIResponse<Note>> => {
  const response = await api.post('/notes', { title, content });
  return response.data;
};

export const updateNote = async (
  note: OptionalNotes,
): Promise<APIResponse<Note>> => {
  const response = await api.patch(`/notes/${note._id}`, note);
  return response.data;
};

export const getAllNotes = async (): Promise<APIResponse<Note[]>> => {
  const response = await api.get('/notes');
  return response.data;
};

export const restoreNote = async (
  notes: string[],
): Promise<APIResponse<Note>> => {
  const response = await api.patch(`/notes/restore`, { notes });
  return response.data;
};

export const deletePermanentNote = async (
  notes: string[],
): Promise<APIResponse<Note[]>> => {
  const response = await api.delete(`/notes/permanent`, { data: { notes } });
  return response.data;
};
