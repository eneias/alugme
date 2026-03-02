import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Building2, CreditCard, History, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const UserMenu = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isLocador = user?.type === 'locador';
  const isLocatario = user?.type === 'locatario';
  const profileRoute = isLocador ? '/landlord/profile' : '/profile';

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <User className="h-4 w-4" />
        Entrar
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-muted p-1 transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photo ?? undefined} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <div className="flex items-center gap-2">
            <p className="font-medium">{user.name}</p>
            {isLocador && (
              <Badge variant="secondary" className="text-xs">Locador</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(profileRoute)}>
          <User className="mr-2 h-4 w-4" />
          Meu Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(profileRoute + '/edit')}>
          <Settings className="mr-2 h-4 w-4" />
          Editar Perfil
        </DropdownMenuItem>
        {isLocador && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/landlord')}>
              <FileText className="mr-2 h-4 w-4" />
              Contrato Padrão
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/landlord/bank-account')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Contas Bancárias
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/landlord/properties')}>
              <Building2 className="mr-2 h-4 w-4" />
              Meus Imóveis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/landlord/rental-history')}>
              <History className="mr-2 h-4 w-4" />
              Histórico de Locações
            </DropdownMenuItem>
          </>
        )}
        {isLocatario && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/rental-history')}>
              <History className="mr-2 h-4 w-4" />
              Locações
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
