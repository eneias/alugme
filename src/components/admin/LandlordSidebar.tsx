import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo2.png';

const menuItems = [
  { path: '/landlord', icon: Users, label: 'Contrato Padrão' },
  { path: '/landlord/bank-account', icon: Users, label: 'Contas bancárias' },
  { path: '/landlord/properties', icon: Building2, label: 'Meus Imóveis' },
  { path: '/landlord/rental-history', icon: Users, label: 'Histórico de Locações' },
  { path: '/landlord/profile', icon: Users, label: 'Meu Perfil' },
];

const LandlordSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
          'fixed md:static top-0 left-0 z-50 md:z-auto w-64 bg-card border-r border-border min-h-screen p-4 transition-transform',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/landlord" onClick={() => setOpen(false)}>
            <img src={logo} alt="AlugMe" className="h-16 object-contain" />
          </Link>

          {/* Botão fechar (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Painel do Locador
        </p>

        {/* Menu */}
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

        {/* Voltar ao site */}
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
      </aside>
    </>
  );
};

export default LandlordSidebar;
