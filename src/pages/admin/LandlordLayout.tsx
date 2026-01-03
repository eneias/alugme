import { Outlet } from 'react-router-dom';
import LandlordSidebar from '@/components/admin/LandlordSidebar';
import UserMenu from '@/components/UserMenu';

const LandlordLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <LandlordSidebar />
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

export default LandlordLayout;
