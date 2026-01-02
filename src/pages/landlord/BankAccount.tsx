import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit, Trash2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { landlords, BankAccount } from '@/data/landlords';
import { users } from '@/data/users';

const banks = [
  'Banco do Brasil',
  'Bradesco',
  'Caixa Econômica',
  'Itaú',
  'Santander',
  'Nubank',
  'Inter',
  'C6 Bank',
  'Original',
  'Safra',
];

const BankAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [currentUser, setCurrentUser] = useState<typeof users[0] | null>(null);
  
  const [formData, setFormData] = useState({
    bank: '',
    agency: '',
    account: '',
    accountType: 'corrente' as 'corrente' | 'poupanca',
    holderName: '',
    holderCpf: '',
  });

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

    const landlord = landlords.find(l => l.userId === loggedUserId);
    if (landlord) {
      setBankAccounts(landlord.bankAccounts);
    }
  }, [navigate, toast]);

  const handleOpenDialog = (account?: BankAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        bank: account.bank,
        agency: account.agency,
        account: account.account,
        accountType: account.accountType,
        holderName: account.holderName,
        holderCpf: account.holderCpf,
      });
    } else {
      setEditingAccount(null);
      setFormData({
        bank: '',
        agency: '',
        account: '',
        accountType: 'corrente',
        holderName: currentUser?.name || '',
        holderCpf: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.bank || !formData.agency || !formData.account || !formData.holderName || !formData.holderCpf) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    const newAccount: BankAccount = {
      id: editingAccount?.id || `bank-${Date.now()}`,
      bank: formData.bank,
      agency: formData.agency,
      account: formData.account,
      accountType: formData.accountType,
      holderName: formData.holderName,
      holderCpf: formData.holderCpf,
      validated: editingAccount?.validated || false,
      createdAt: editingAccount?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingAccount) {
      setBankAccounts(prev => prev.map(a => a.id === editingAccount.id ? newAccount : a));
      toast({ title: 'Conta atualizada com sucesso!' });
    } else {
      setBankAccounts(prev => [...prev, newAccount]);
      toast({ 
        title: 'Conta cadastrada com sucesso!',
        description: 'A validação será feita em até 24 horas.',
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setBankAccounts(prev => prev.filter(a => a.id !== id));
    toast({ title: 'Conta removida com sucesso!' });
  };

  const handleValidate = (id: string) => {
    // Simular validação
    setBankAccounts(prev => prev.map(a => 
      a.id === id ? { ...a, validated: true } : a
    ));
    toast({ title: 'Conta validada com sucesso!' });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Contas Bancárias</h1>
              <p className="text-muted-foreground">Gerencie suas contas para recebimento de aluguéis</p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Conta
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <CreditCard className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Por que cadastrar uma conta bancária?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Para receber os repasses dos aluguéis dos seus imóveis, é necessário ter pelo menos uma conta bancária validada. 
                    Os repasses são feitos automaticamente após o pagamento do locatário.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Accounts List */}
          <div className="space-y-4">
            {bankAccounts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Você ainda não cadastrou nenhuma conta bancária.</p>
                  <Button className="mt-4" onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Conta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              bankAccounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{account.bank}</CardTitle>
                          <CardDescription>
                            {account.accountType === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}
                          </CardDescription>
                        </div>
                      </div>
                      {account.validated ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Validada
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <XCircle className="w-3 h-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Agência</p>
                        <p className="font-medium">{account.agency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conta</p>
                        <p className="font-medium">{account.account}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Titular</p>
                        <p className="font-medium">{account.holderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CPF</p>
                        <p className="font-medium">{account.holderCpf}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {!account.validated && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleValidate(account.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Simular Validação
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(account)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'Editar Conta' : 'Nova Conta Bancária'}</DialogTitle>
            <DialogDescription>
              {editingAccount ? 'Atualize os dados da conta' : 'Cadastre uma conta para receber seus aluguéis'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Banco</Label>
              <Select
                value={formData.bank}
                onValueChange={(value) => setFormData({ ...formData, bank: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agency">Agência</Label>
                <Input
                  id="agency"
                  value={formData.agency}
                  onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                  placeholder="0000-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Conta</Label>
                <Input
                  id="account"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  placeholder="00000-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Tipo de Conta</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => setFormData({ ...formData, accountType: value as 'corrente' | 'poupanca' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrente">Conta Corrente</SelectItem>
                  <SelectItem value="poupanca">Conta Poupança</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holderName">Nome do Titular</Label>
              <Input
                id="holderName"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holderCpf">CPF do Titular</Label>
              <Input
                id="holderCpf"
                value={formData.holderCpf}
                onChange={(e) => setFormData({ ...formData, holderCpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingAccount ? 'Salvar' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccountPage;