import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Users, ArrowLeft, Image, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo2.png';
import { Button } from '@/components/ui/button';

const menuItems = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/banners', icon: Image, label: 'Banners' },
  { path: '/admin/properties', icon: Building2, label: 'Imóveis' },
  { path: '/admin/users', icon: Users, label: 'Usuários' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const SidebarContent = (
    <>
      <div className="mb-8">
        <Link to="/admin" onClick={() => setOpen(false)}>
          <img src={logo} alt="AlugMe" className="h-16 object-contain" />
        </Link>
        <p className="text-sm text-muted-foreground mt-2">
          Painel Administrativo
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
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
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao site</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Botão menu (mobile) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card border border-border rounded-lg p-2"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 transform transition-transform',
          'lg:static lg:translate-x-0 lg:z-auto lg:block',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button (mobile) */}
        <div className="flex justify-end lg:hidden mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {SidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
