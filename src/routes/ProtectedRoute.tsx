import { Navigate, Outlet } from 'react-router-dom';
import { users } from '@/data/users';

interface ProtectedRouteProps {
  allowedRoles: Array<'admin' | 'locador' | 'locatario'>;
  redirectTo?: string;
}

const ProtectedRoute = ({
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const loggedUserId = localStorage.getItem('loggedUserId');

  console.log('ProtectedRoute check, userId:', loggedUserId);

  // Não logado
  if (!loggedUserId) {
    return <Navigate to={redirectTo} replace />;
  }

  const user = users.find(u => u.id === loggedUserId);

  // Sem permissão
  if (!user || !allowedRoles.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  // Autorizado
  return <Outlet />;
};

export default ProtectedRoute;
