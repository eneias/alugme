import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import RentalContract from "./pages/RentalContract";
import Inspection from "./pages/Inspection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import LandlordLayout from "./pages/admin/LandlordLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import MyProperties from "./pages/landlord/MyProperties";
import BankAccount from "./pages/landlord/BankAccount";
import LandlordSetup from "./pages/landlord/LandlordSetup";
import RentalHistory from "./pages/landlord/RentalHistory";
import NotFound from "./pages/NotFound";
import ProtectedRoute from '@/routes/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/rent/:id" element={<RentalContract />} />
          <Route path="/inspection/:contractId" element={<Inspection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          <Route element={<ProtectedRoute allowedRoles={['admin', 'locador', 'locatario']} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
          </Route>
          
          {/* Landlord Routes */}
          <Route element={<ProtectedRoute allowedRoles={['locador']} />}>
            <Route path="/landlord" element={<LandlordLayout />}>
              <Route index element={<LandlordSetup />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<ProfileEdit />} />
              <Route path="bank-account" element={<BankAccount />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="rental-history" element={<RentalHistory />} />
            </Route>
          </Route>
          
          {/* Tenant Routes */}
          <Route element={<ProtectedRoute allowedRoles={['locatario']} />}>
            <Route index path="rental-history" element={<RentalHistory />} />
          </Route>

          {/* Admin Routes */}          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
