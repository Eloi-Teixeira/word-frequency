import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { getCurrentUser } from '../services/userServices';

export interface User {
  _id: string;
  name: string;
  email: string;
  configuration: {
    theme: 'light' | 'dark';
    language: string;
    fontSize: string;
    fontFamily: string;
    highlightColor: string;
    boldHighlightColor: string;
    hasBoldHighlightColor: boolean;
    autoSaveInterval: number;
    autosave: boolean;
  };
}

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const getUserFromServer = async (): Promise<User | null> => {
  try {
    const response = await getCurrentUser();
    if (!response.success || !response.data) {
      throw new Error('Erro ao obter usuário do servidor');
    }
    const data = response.data;
    return data;
  } catch (error) {
    return null;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromServer();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }
  return context;
};
