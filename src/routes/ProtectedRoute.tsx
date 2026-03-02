import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  allowedRoles: Array<'admin' | 'locador' | 'locatario'>;
  redirectTo?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'locador' | 'locatario';
}

const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');

    if (stored) {
      setUser(JSON.parse(stored));
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  // Não logado
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Sem permissão
  if (!allowedRoles.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;