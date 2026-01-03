import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/data/users';

const LandlordSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accepted, setAccepted] = useState(false);
  const [currentUser, setCurrentUser] = useState<typeof users[0] | null>(null);

  useEffect(() => {
    const loggedUserId = localStorage.getItem('loggedUserId');
    if (!loggedUserId) {
      toast({
        title: 'Acesso negado',
        description: 'Você precisa estar logado para acessar esta página.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const user = users.find(u => u.id === loggedUserId);
    if (!user || user.type !== 'locador') {
      toast({
        title: 'Acesso negado',
        description: 'Apenas locadores podem acessar esta página.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    setCurrentUser(user);
  }, [navigate, toast]);

  const handleContinue = () => {
    if (!accepted) {
      toast({
        title: 'Aceite os termos',
        description: 'Você precisa aceitar o contrato social para continuar.',
        variant: 'destructive',
      });
      return;
    }

    // Em produção, salvaria no backend
    toast({ title: 'Contrato aceito com sucesso!' });
    navigate('/landlord/bank-account');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <main className="flex-1 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold">Bem-vindo, Locador!</h1>
            <p className="text-muted-foreground mt-2">
              Complete seu cadastro para começar a anunciar seus imóveis
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <div className="h-8 w-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-bold">
                1
              </div>
              <span className="font-medium">Contrato Social</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold">
                2
              </div>
              <span>Conta Bancária</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold">
                3
              </div>
              <span>Cadastrar Imóveis</span>
            </div>
          </div>

          {/* Contract Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Contrato Social Digital</CardTitle>
                  <CardDescription>Termos e condições para locadores da plataforma</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none bg-secondary/30 p-6 rounded-lg max-h-96 overflow-y-auto border">
                <h3>CONTRATO SOCIAL DIGITAL - ALUGME</h3>
                
                <h4>1. DO OBJETO</h4>
                <p>
                  O presente contrato tem por objeto estabelecer as condições gerais para a utilização 
                  da plataforma AlugMe por parte dos LOCADORES, visando a intermediação de locações 
                  de imóveis residenciais e comerciais.
                </p>

                <h4>2. DAS OBRIGAÇÕES DO LOCADOR</h4>
                <p>O LOCADOR se compromete a:</p>
                <ul>
                  <li>Fornecer informações verdadeiras e atualizadas sobre os imóveis cadastrados;</li>
                  <li>Manter os imóveis em condições adequadas de habitabilidade;</li>
                  <li>Respeitar os direitos dos locatários conforme a Lei do Inquilinato;</li>
                  <li>Manter documentação do imóvel regularizada;</li>
                  <li>Comunicar qualquer alteração nas condições do imóvel;</li>
                  <li>Responder às solicitações de locatários em tempo hábil.</li>
                </ul>

                <h4>3. DOS REPASSES FINANCEIROS</h4>
                <p>
                  Os valores referentes aos aluguéis serão repassados ao LOCADOR em até 5 (cinco) dias 
                  úteis após a confirmação do pagamento pelo locatário, descontada a taxa de administração 
                  da plataforma de 8% (oito por cento) sobre o valor do aluguel.
                </p>

                <h4>4. DA CONTA BANCÁRIA</h4>
                <p>
                  O LOCADOR deverá cadastrar ao menos uma conta bancária válida para recebimento dos 
                  repasses. A conta deve estar em nome do LOCADOR ou de pessoa jurídica da qual seja 
                  sócio administrador.
                </p>

                <h4>5. DAS RESPONSABILIDADES DA PLATAFORMA</h4>
                <p>A AlugMe se responsabiliza por:</p>
                <ul>
                  <li>Intermediar a comunicação entre locadores e locatários;</li>
                  <li>Processar os pagamentos de forma segura;</li>
                  <li>Fornecer suporte técnico para uso da plataforma;</li>
                  <li>Garantir a segurança dos dados cadastrados;</li>
                  <li>Gerar contratos padronizados e personalizáveis.</li>
                </ul>

                <h4>6. DA RESCISÃO</h4>
                <p>
                  Este contrato pode ser rescindido por qualquer das partes, mediante aviso prévio de 
                  30 (trinta) dias. Em caso de descumprimento das obrigações aqui estabelecidas, a 
                  rescisão poderá ser imediata.
                </p>

                <h4>7. DO FORO</h4>
                <p>
                  Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões 
                  oriundas do presente contrato.
                </p>
              </div>

              <div className="flex items-start space-x-3 mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Checkbox 
                  id="accept" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label
                  htmlFor="accept"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Declaro que li, compreendi e aceito integralmente os termos e condições deste 
                  Contrato Social Digital, comprometendo-me a cumprir todas as obrigações aqui 
                  estabelecidas.
                </label>
              </div>

              <Button 
                onClick={handleContinue} 
                disabled={!accepted}
                className="w-full mt-6 h-12"
              >
                Aceitar e Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

    </div>
  );
};

export default LandlordSetup;