import { JSX } from 'react';
import { useUser } from '../../context/userContext';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();

  return user ? <Navigate to="/notes" /> : children;
}
