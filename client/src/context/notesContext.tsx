import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { token, useUser } from './userContext';

export interface Note {
  _id: string;
  title: string;
  content: string;
  pinned: boolean;
  isDeleted: boolean;
  tags: string[];
  updatedAt: string;
}

interface NotesContextProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
}

const NotesContext = createContext<NotesContextProps | null>(null);

const getNotesFromServer = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/notes/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.log(response)
      throw new Error('Erro ao obter notas do servidor');
    }
    const data = (await response.json()).data as Note[];
    return data;
  } catch (error) {
    console.error('Erro ao obter notas do servidor:', error);
    return [];
  }
};

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const fetchNotes = async () => {
        const fetchedNotes = await getNotesFromServer();
        setNotes(fetchedNotes);
      };
      fetchNotes();
    }
  }, [user]);

  return (
    <NotesContext.Provider value={{ notes, setNotes, selectedNote, setSelectedNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextProps => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes deve ser usado dentro de NotesProvider');
  }
  return context;
};
