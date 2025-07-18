import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import {  useUser } from './userContext';
import { getAllNotes } from '../services/notesServices';

export interface Note {
  _id: string;
  title: string;
  content: string;
  pinned: boolean;
  isDeleted: boolean;
  tags: string[];
  updatedAt: string | Date;
  createdAt: string | Date;
  deletedAt: string | Date | null;
  isTemporary?: boolean;
}

interface NotesContextProps {
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

const NotesContext = createContext<NotesContextProps | null>(null);

const getNotesFromServer = async () => {
  try {
    const response = await getAllNotes();
    if (!response.success) {
      console.error('Erro ao obter notas do servidor:', response.message);
      return [];
    }
    const data = response.data?.map((note: Note) => ({
      ...note,
    })) as Note[];
    console.log(data);
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
    <NotesContext.Provider
      value={{ notes, setNotes, selectedNote, setSelectedNote }}
    >
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
