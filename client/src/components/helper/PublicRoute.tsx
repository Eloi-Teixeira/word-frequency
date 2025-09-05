import { JSX } from 'react';
import { useUser } from '../../context/userContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingPage from '../../pages/LoadingPage';

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useUser();
  const location = useLocation();
  let from = location.state?.from?.pathname || '/notes';

  console.log(location.pathname);
  if (isLoading) {
    return <LoadingPage />;
  }
  return user ? <Navigate to={from} replace /> : children;
}
