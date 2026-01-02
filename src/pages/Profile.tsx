import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Clock, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { users } from '@/data/users';

const Profile = () => {
  const navigate = useNavigate();
  
  // Simula usuário logado (pegando do localStorage ou primeiro usuário)
  const loggedUserId = localStorage.getItem('loggedUserId') || '1';
  const user = users.find(u => u.id === loggedUserId) || users[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <span
                className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  user.type === 'locador'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user.type === 'locador' ? 'Locador' : 'Locatário'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Membro desde</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Último acesso</p>
                  <p className="font-medium">
                    {new Date(user.lastAccess).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button onClick={() => navigate('/profile/edit')}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
