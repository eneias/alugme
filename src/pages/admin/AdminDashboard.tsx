import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { properties } from '@/data/properties';
import { users } from '@/data/users';

const AdminDashboard = () => {
  const locadores = users.filter((u) => u.type === 'locador').length;
  const locatarios = users.filter((u) => u.type === 'locatario').length;
  const avgPrice = properties.reduce((acc, p) => acc + p.price, 0) / properties.length;

  const stats = [
    {
      title: 'Total de Imóveis',
      value: properties.length,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      title: 'Total de Usuários',
      value: users.length,
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: 'Locadores',
      value: locadores,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Preço Médio',
      value: `R$ ${avgPrice.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'text-amber-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
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
          <CardHeader>
            <CardTitle>Últimos Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center gap-4">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{property.name}</p>
                    <p className="text-sm text-muted-foreground">{property.neighborhood}</p>
                  </div>
                  <p className="font-semibold text-primary">
                    R$ {property.price.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'admin'
                        ? 'bg-gray-600 text-gray-100'
                        : user.type === 'locador' ?
                          'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.type === 'admin' ? 'Admin' : user.type === 'locador' ? 'Locador' : 'Locatário'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
