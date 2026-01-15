import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, Home, Eye, ClipboardCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { rentalContracts, landlords, getContractSignedDate } from '@/data/landlords';
import { properties } from '@/data/properties';
import { users } from '@/data/users';
import { mockInspections, Inspection } from '@/data/inspections';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper para obter vistorias de um contrato
const getContractInspections = (contractId: string) => {
  return mockInspections.filter(i => i.contractId === contractId);
};

const getInspectionStatusIcon = (inspection: Inspection | undefined, type: 'entrada' | 'saida') => {
  if (!inspection) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Pendente</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Vistoria de {type} não realizada</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (inspection.status === 'completed') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs">Concluída</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Vistoria de {type} concluída e assinada</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (inspection.status === 'disputed') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Divergência</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Vistoria de {type} com divergência</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Aguardando</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Vistoria de {type} aguardando assinatura</p>
      </TooltipContent>
    </Tooltip>
  );
};

const RentalHistory = () => {
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<typeof rentalContracts[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock: pegar contratos do locador logado
  const loggedUserId = localStorage.getItem('loggedUserId');
  const loggedUserType = localStorage.getItem('loggedUserType');

  const landlord = landlords.find(l => l.userId === loggedUserId);
  
  // Pegar propriedades do locador
  const myPropertyIds = properties
    .filter(p => p.landlordId === landlord?.id)
    .map(p => p.id);

  // Pegar contratos dessas propriedades
  const myContracts = rentalContracts.filter(contract => 
    myPropertyIds.includes(contract.propertyId)
  );

  const tenantContracts = rentalContracts.filter(
    contract => contract.tenantId === loggedUserId
  );

  const contractsToShow =
  loggedUserType === 'locatario'
    ? tenantContracts
    : myContracts;

  // Aplicar filtros
  const filteredContracts = contractsToShow.filter(contract => {
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

  const formatSignatureDate = (contract: typeof rentalContracts[0]) => {
    const signedDate = getContractSignedDate(contract);
    if (signedDate) {
      return formatDate(signedDate);
    }
    return 'Não assinado';
  };

  const goToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {loggedUserType === 'locatario' && (
        <>
          <Header />
          <br/><br/>
        </>
      )}

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
              const contractInspections = getContractInspections(contract.id);
              const entradaInspection = contractInspections.find(i => i.type === 'entrada');
              const saidaInspection = contractInspections.find(i => i.type === 'saida');

              return (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Imagem do imóvel */}
                      <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={property?.images[0] || '/placeholder.svg'}
                          alt={property?.name}
                          onClick={() => goToProperty(property!.id)}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{property?.name}</h3>
                            <p className="text-sm text-muted-foreground">{property?.address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(contract.status)}
                          </div>
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

                        {/* Indicadores de Vistoria */}
                        <TooltipProvider>
                          <div className="flex items-center gap-4 p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-medium">Vistorias:</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Entrada:</span>
                                {getInspectionStatusIcon(entradaInspection, 'entrada')}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">Saída:</span>
                                {getInspectionStatusIcon(saidaInspection, 'saida')}
                              </div>
                            </div>
                          </div>
                        </TooltipProvider>

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
                    <p className="font-medium">{formatSignatureDate(selectedContract)}</p>
                  </div>
                </div>

                {/* Signatures Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Assinatura do Locador</p>
                    {selectedContract.signatures.landlord ? (
                      <div>
                        <p className="font-medium text-green-600">✓ Assinado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedContract.signatures.landlord.signedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-yellow-600">Pendente</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assinatura do Locatário</p>
                    {selectedContract.signatures.tenant ? (
                      <div>
                        <p className="font-medium text-green-600">✓ Assinado</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(selectedContract.signatures.tenant.signedAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-yellow-600">Pendente</p>
                    )}
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
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/inspection/${selectedContract.id}`)}
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Registrar Vistoria
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
      
      {loggedUserType === 'locatario' && (
        <>
          <br/><br/>
          <Footer />
        </>
      )}
    </div>
  );
};

export default RentalHistory;
