import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo2.png";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error("Email ou senha inválidos");
      }

      const data = await response.json();

      // Esperado do backend:
      // { token: "...", user: {...} }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirecionar: priorizar redirectTo, senão baseado no tipo de usuário
      const redirectTo = (location.state as { redirectTo?: string })?.redirectTo;

      if (redirectTo) {
        navigate(redirectTo);
      } else if (data.user.type === "locador") {
        navigate("/landlord");
      } else if (data.user.type === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao realizar login");
      } else {
        setError(String(err) || "Erro ao realizar login");
      }
    } finally {
      setIsLoading(false);
    }
  }

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

              {error && (
                <div className="text-sm text-red-500 text-center">
                  {error}
                </div>
              )}

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
}
