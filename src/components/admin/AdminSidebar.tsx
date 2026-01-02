import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Users, ArrowLeft, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo2.png';

const menuItems = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/banners', icon: Image, label: 'Banners' },
  { path: '/admin/properties', icon: Building2, label: 'Imóveis' },
  { path: '/admin/users', icon: Users, label: 'Usuários' },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4">
      <div className="mb-8">
        <Link to="/admin">
          <img src={logo} alt="AlugMe" className="h-16 object-contain" />
        </Link>
        <p className="text-sm text-muted-foreground mt-2">Painel Administrativo</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              location.pathname === item.path
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao site</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
