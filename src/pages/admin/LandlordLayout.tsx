import { Outlet } from 'react-router-dom';
import LandlordSidebar from '@/components/admin/LandlordSidebar';
import UserMenu from '@/components/UserMenu';

const LandlordLayout = () => {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <LandlordSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-end px-4 sm:px-8">
          <UserMenu />
        </header>
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LandlordLayout;
