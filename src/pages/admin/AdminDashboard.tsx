import { useEffect, useState } from 'react';
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { properties } from '@/data/properties';
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar';

interface ApiUser {
  id: string;
  name: string;
  email: string;
  type: string; // Admin | Locador | Locatario
  photo?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/users/last', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar usuários');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const locadores = users.filter((u) => u.type === 'locador').length;
  const locatarios = users.filter((u) => u.type === 'locatario').length;

  const avgPrice =
    properties.length > 0
      ? properties.reduce((acc, p) => acc + p.price, 0) / properties.length
      : 0;

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

  if (loading) {
    return <p>Carregando...</p>;
  }

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
            <CardTitle>Últimos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 10).map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photo} alt={user.name}  className="rounded-full object-cover"/>
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'admin'
                        ? 'bg-gray-600 text-gray-100'
                        : user.type === 'locador'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.type}
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