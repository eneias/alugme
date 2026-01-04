import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/data/users";
import { LogIn } from "lucide-react";
import logo from "@/assets/logo2.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Pegar URL de redirecionamento se existir
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock authentication - verificar se o usuário existe
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (!user.status) {
        toast({
          title: "Conta desativada",
          description: "Sua conta está desativada. Entre em contato com o administrador.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Salvar sessão fake no localStorage
      localStorage.setItem("loggedUserId", user.id);
      localStorage.setItem("loggedUserType", user.type);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${user.name}!`,
      });

      // Redirecionar: priorizar redirectTo, senão baseado no tipo de usuário
      if (redirectTo) {
        navigate(redirectTo);
      } else if (user.type === "locador") {
        navigate("/landlord");
      } else if (user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4 bg-login">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <img src={logo} alt="AlugMe" className="h-20 object-contain mx-auto" />
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-2">Usuários de teste:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p><strong>Admin:</strong> eneias@email.com / 123456</p>
                  <p><strong>Locador ativo:</strong> carlos@email.com / 123456</p>
                  <p><strong>Locatário atvo:</strong> maria@email.com / 123456</p>
                  <p><strong>Locador inativo:</strong> joao@email.com / 123456</p>
                  <p><strong>Locatário inativo:</strong> ana@email.com / 123456</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </span>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Esqueci minha senha
                </Link>
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
