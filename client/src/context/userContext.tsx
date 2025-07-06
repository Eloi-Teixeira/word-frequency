import { createContext, useState, ReactNode, useContext, useEffect } from 'react';

export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWM4MjMyZmEwMGIzZmI1ZGZjZjBkMCIsImlhdCI6MTc1MTgxNjcxNiwiZXhwIjoxNzUyMDc1OTE2fQ.xku8It9IgxqETWWISawGMcGgBFpCa9m-5rtoqiRYbGA';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const getUserFromServer = async (): Promise<User | null> => {
  try {
    const response = await fetch(
      'http://localhost:8000/api/users/685c81fad4792738ba2974be',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error('Erro ao obter usuário do servidor');
    }
    const data = (await response.json()).data as User;
    return data;
  } catch (error) {
    console.error('Erro ao obter usuário do servidor:', error);
    return null;
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromServer();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
