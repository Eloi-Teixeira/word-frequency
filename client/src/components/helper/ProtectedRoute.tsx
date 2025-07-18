import { JSX, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/userContext';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return user !== null ? children : <Navigate to="/auth/login" />;
}
