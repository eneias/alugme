import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProperties } from '@/hooks/useProperties';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { data: properties = [] } = useProperties();
  
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: userRoles = [] } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });

  const locadores = userRoles.filter(r => r.role === 'locador').length;
  const avgPrice = properties.length > 0
    ? properties.reduce((acc, p) => acc + p.price, 0) / properties.length
    : 0;

  const stats = [
    { title: 'Total de Imóveis', value: properties.length, icon: Building2, color: 'text-blue-500' },
    { title: 'Total de Usuários', value: profiles.length, icon: Users, color: 'text-green-500' },
    { title: 'Locadores', value: locadores, icon: TrendingUp, color: 'text-purple-500' },
    { title: 'Preço Médio', value: `R$ ${avgPrice.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Últimos Imóveis</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center gap-4">
                  <img src={property.images[0]} alt={property.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{property.name}</p>
                    <p className="text-sm text-muted-foreground">{property.neighborhood}</p>
                  </div>
                  <p className="font-semibold text-primary">R$ {property.price.toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimos Usuários</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.slice(0, 5).map((profile) => {
                const role = userRoles.find(r => r.user_id === profile.user_id);
                return (
                  <div key={profile.id} className="flex items-center gap-4">
                    <img src={profile.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'} alt={profile.name} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role?.role === 'admin' ? 'bg-gray-600 text-gray-100' :
                      role?.role === 'locador' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {role?.role === 'admin' ? 'Admin' : role?.role === 'locador' ? 'Locador' : 'Locatário'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
