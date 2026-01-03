import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserMenu from '@/components/UserMenu';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/data/users';


const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se usuário está logado e é locador
  useEffect(() => {
    const loggedUserId = localStorage.getItem('loggedUserId');
    if (!loggedUserId) {
      toast({
        title: 'Acesso negado',
        description: 'Você precisa estar logado para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const user = users.find(u => u.id === loggedUserId);
    if (!user || user.type !== 'admin') {
      toast({
        title: 'Acesso negado',
        description: 'Apenas Administradores podem acessar esta página.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    //setCurrentLandlord(landlord);
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-8">
          <UserMenu />
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
