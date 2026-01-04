import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { users } from '@/data/users';
import { toast } from 'sonner';

const ProfileEdit = () => {
  const navigate = useNavigate();
  
  // Simula usuário logado
  const loggedUserId = localStorage.getItem('loggedUserId') || '1';
  const loggedUserType = localStorage.getItem('loggedUserType');
  const profileRoute = loggedUserType === 'locador' ? '/landlord/profile' : '/profile';
  const user = users.find(u => u.id === loggedUserId) || users[0];

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    photo: user.photo,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    // Aqui salvaria os dados (PoC - apenas simula)
    toast.success('Perfil atualizado com sucesso!');
    navigate(profileRoute);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {loggedUserType !== 'locador' && (
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl border border-border p-8">
            <h1 className="text-2xl font-bold mb-8 text-center">Editar Perfil</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={formData.photo} alt={formData.name} />
                  <AvatarFallback className="text-2xl">
                    {formData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="w-full max-w-md">
                  <Label htmlFor="photo">URL da Foto</Label>
                  <Input
                    id="photo"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

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

              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4">Alterar Senha</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
