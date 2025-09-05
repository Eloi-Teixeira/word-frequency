import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/userContext';
import LoadingPage from '../../pages/LoadingPage';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, isLoading } = useUser();
  const location = useLocation();
  if (isLoading) {
    return <LoadingPage />;
  }
  return user !== null ? children : <Navigate to="/auth/login" state={{ from: location }} replace/>;
}
