import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

type UserType = 'admin' | 'locador' | 'locatario';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  type: UserType;
  status: boolean;
  createdAt: string;
  lastAccess: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filtros (digitando)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtros aplicados (disparam API)
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedType, setAppliedType] = useState<string>('all');
  const [appliedStatus, setAppliedStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',
    type: 'locatario' as UserType,
    status: true,
    password: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (appliedSearch)
        params.append('search', appliedSearch);

      if (appliedType !== 'all') {
        const role =
          appliedType === 'locador' ? 'Locador' : 'Locatario';
        params.append('role', role);
      }

      if (appliedStatus !== 'all') {
        params.append('status', appliedStatus);
      }

      const response = await fetch(
        `http://localhost:5000/api/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Busca usuários
  useEffect(() => {
    fetchUsers();
  }, [appliedSearch, appliedType, appliedStatus]);

  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedType(filterType);
    setAppliedStatus(filterStatus);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      photo: '',
      type: 'locatario',
      status: true,
      password: '',
    });
    setEditingUser(null);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        type: user.type,
        status: user.status,
        password: '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const payload: {
        name: string;
        phone: string;
        photo: string;
        role: string;
        status: string;
        password: string;
        email?: string;
      } = {
        name: formData.name,
        phone: formData.phone || "",
        photo: formData.photo || "",
        role:
          formData.type === 'locador'
            ? 'Locador'
            : formData.type === 'admin'
            ? 'Admin'
            : 'Locatario',
        status: formData.status ? 'Active' : 'Inactive',
        password: formData.password,
      };

      if (editingUser) {
        // UPDATE
        const response = await fetch(
          `http://localhost:5000/api/users/${editingUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error();

        toast.success('Usuário atualizado com sucesso!');
      } else {
        // CREATE
        payload.email = formData.email; // email só é enviado na criação
        
        const response = await fetch(
          `http://localhost:5000/api/users`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) throw new Error();

        toast.success('Usuário criado com sucesso!');
      }

      await fetchUsers();
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error();

      toast.success('Usuário removido com sucesso!');
      handleSearch();
    } catch {
      toast.error('Erro ao remover usuário');
    }
  };
  
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/users/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: currentStatus ? 'Inactive' : 'Active',
          }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success('Status atualizado com sucesso!');
      handleSearch();
    } catch {
      toast.error('Erro ao atualizar status');
    }
  };

  if (loading) {
    return <div className="p-8">Carregando usuários...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border border-border p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              {/* Ícone esquerdo */}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="pl-10 pr-24"
              />

              {/* Botão dentro do input */}
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
              >
                {loading ? '...' : 'Buscar'}
              </Button>
            </div>
          </div>

          <Select 
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value);
              setAppliedType(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="locador">Locador</SelectItem>
              <SelectItem value="locatario">Locatário</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setAppliedStatus(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Active">Ativos</SelectItem>
              <SelectItem value="Inactive">Inativos</SelectItem>
              <SelectItem value="Pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {(searchTerm || filterType !== 'all' || filterStatus !== 'all') && (
          <div className="mt-2 text-sm text-muted-foreground">
            {users.length} usuário(s) encontrado(s)
          </div>
        )}
      </div>

      {/* Tabela permanece exatamente igual */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Último Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photo} alt={user.name} className="rounded-full object-cover" />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'locador'
                        ? 'bg-purple-100 text-purple-700'
                        : user.type === 'admin'
                        ? 'bg-gray-300 text-gray-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.type === 'locador'
                      ? 'Locador'
                      : user.type === 'admin'
                      ? 'Admin'
                      : 'Locatário'}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(user.id, user.status)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      user.status
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.status ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {user.status ? 'Ativo' : 'Inativo'}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.lastAccess).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(user)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="password">
                {editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Usuário</Label>
              <Select
                value={formData.type}
                onValueChange={(value: UserType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locador">Locador (oferece imóvel)</SelectItem>
                  <SelectItem value="locatario">Locatário (inquilino)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="photo">URL da Foto</Label>
              <Input
                id="photo"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
              <Label htmlFor="status">Usuário Ativo</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingUser ? 'Salvar Alterações' : 'Cadastrar Usuário'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;