import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
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
import { users as initialUsers, User, UserType } from '@/data/users';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',
    type: 'locatario' as UserType,
    status: true,
    password: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: User = {
      id: editingUser?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      type: formData.type,
      status: formData.status,
      password: formData.password || editingUser?.password || '123456',
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0],
      lastAccess: editingUser?.lastAccess || new Date().toISOString().split('T')[0],
    };

    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? userData : u)));
      toast.success('Usuário atualizado com sucesso!');
    } else {
      setUsers([...users, userData]);
      toast.success('Usuário cadastrado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    toast.success('Usuário removido com sucesso!');
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: !u.status } : u)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

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
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'locador'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.type === 'locador' ? 'Locador' : 'Locatário'}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleStatus(user.id)}
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
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
                required
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
