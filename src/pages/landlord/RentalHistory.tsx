import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Home, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { rentalContracts, landlordProperties } from '@/data/landlords';
import { properties } from '@/data/properties';
import { users } from '@/data/users';

const RentalHistory = () => {
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<typeof rentalContracts[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock: pegar contratos do locador logado
  const loggedUserId = localStorage.getItem('loggedUserId');
  
  // Pegar propriedades do locador
  const myPropertyIds = landlordProperties
    .filter(lp => lp.landlordId === loggedUserId)
    .map(lp => lp.id);

  // Pegar contratos dessas propriedades
  const myContracts = rentalContracts.filter(contract => 
    myPropertyIds.includes(contract.propertyId)
  );

  // Aplicar filtros
  const filteredContracts = myContracts.filter(contract => {
    const property = properties.find(p => p.id === contract.propertyId);
    const tenant = users.find(u => u.id === contract.tenantId);
    
    const matchesSearch = 
      property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'completed':
        return <Badge variant="secondary">Finalizado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-1 container">
        <div className="mb-6">    
          <h1 className="text-3xl font-bold">Histórico de Locações</h1>
          <p className="text-muted-foreground mt-1">
            Veja todos os imóveis que foram locados e seus respectivos contratos
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por imóvel ou locatário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="completed">Finalizados</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma locação encontrada</h3>
              <p className="text-muted-foreground">
                {myContracts.length === 0 
                  ? 'Você ainda não possui histórico de locações.'
                  : 'Nenhuma locação corresponde aos filtros aplicados.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map(contract => {
              const property = properties.find(p => p.id === contract.propertyId);
              const tenant = users.find(u => u.id === contract.tenantId);

              return (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Imagem do imóvel */}
                      <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property?.images[0] || '/placeholder.svg'}
                          alt={property?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{property?.name}</h3>
                            <p className="text-sm text-muted-foreground">{property?.address}</p>
                          </div>
                          {getStatusBadge(contract.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">Locatário: </span>
                              {tenant?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">Período: </span>
                              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">Valor: </span>
                              R$ {contract.monthlyRent.toLocaleString('pt-BR')}/mês
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedContract(contract)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Contrato
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal do Contrato */}
        <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrato de Locação
              </DialogTitle>
            </DialogHeader>
            
            {selectedContract && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Contrato Nº</p>
                    <p className="font-medium">{selectedContract.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedContract.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Início</p>
                    <p className="font-medium">{formatDate(selectedContract.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Término</p>
                    <p className="font-medium">{formatDate(selectedContract.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Mensal</p>
                    <p className="font-medium">R$ {selectedContract.monthlyRent.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assinado em</p>
                    <p className="font-medium">{formatDate(selectedContract.signedAt)}</p>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <div 
                    className="p-6 border rounded-lg bg-white text-foreground whitespace-pre-wrap"
                  >
                    {selectedContract.contractTerms}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedContract(null)}>
                    Fechar
                  </Button>
                  <Button onClick={() => window.print()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
    </div>
  );
};

export default RentalHistory;
