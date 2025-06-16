import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/contexts/auth/hook';

export function ProtectedRoute() {
  const { currentUserData } = useAuth();

  if (!currentUserData) {
    return <Navigate to="/" />;
  }

  return <Outlet context={currentUserData} />;
}
