import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Calendar,
  Home,
  Eye,
  FileCheck,
  AlertTriangle,
  Clock,
  CircleCheckBig,
  CircleMinus
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { mockInspections } from '@/data/inspections';
import { rentalContracts, landlords, rentals } from '@/data/landlords';
import { properties } from '@/data/properties';
import { users } from '@/data/users';

const InspectionHistory = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  const loggedUserId = localStorage.getItem('loggedUserId');
  const loggedUserType = localStorage.getItem('loggedUserType');

  const landlord = landlords.find(l => l.userId === loggedUserId);

  const myPropertyIds = properties
    .filter(p => p.landlordId === landlord?.id)
    .map(p => p.id);

  const myRentals = rentals.filter(c =>
    myPropertyIds.includes(c.propertyId)
  );
  console.log('myRentals', myRentals)
  const myContractIds = myRentals.map(c => c.propertyId);
  console.log('myContractIds', myContractIds)

  const inspectionsToShow =
    loggedUserType === 'locatario'
      ? mockInspections.filter(i =>
          rentalContracts.find(c => c.id === i.propertyId)?.tenantId === loggedUserId
        )
      : mockInspections.filter(i => myContractIds.includes(i.propertyId));

  const filteredInspections = inspectionsToShow.filter(i => {
    const property = properties.find(p => p.id === i.propertyId);

    const matchesSearch =
      property?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_landlord':
        return <Badge className="bg-yellow-500/10 text-yellow-600"><Clock className="h-3 w-3 mr-1"/>Locador</Badge>;
      case 'pending_tenant':
        return <Badge className="bg-blue-500/10 text-blue-600"><Clock className="h-3 w-3 mr-1"/>Locatário</Badge>;
      case 'disputed':
        return <Badge className="bg-red-500/10 text-red-600"><AlertTriangle className="h-3 w-3 mr-1"/>Divergência</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600"><FileCheck className="h-3 w-3 mr-1"/>Concluída</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {loggedUserType === 'locatario' && (
        <>
          <Header />
          <br/><br/>
        </>
      )}

      <main className="flex-1 container py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Vistorias</h1>
          <p className="text-muted-foreground">
            Consulte todas as vistorias realizadas nos imóveis
          </p>
        </div>

        {loggedUserType === 'locador' && (
          <Button onClick={() => navigate('/landlord/inspection-create')}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Criar vistoria
          </Button>
        )}
      </div>


        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar por imóvel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-[220px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="pending_landlord">Aguardando locador</SelectItem>
                <SelectItem value="pending_tenant">Aguardando locatário</SelectItem>
                <SelectItem value="disputed">Em divergência</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {filteredInspections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma vistoria encontrada
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInspections.map(inspection => {
              const property = properties.find(p => p.id === inspection.propertyId);

              return (
                <Card key={inspection.id} className="hover:shadow-md transition">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <img
                        src={property?.images[0]}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                        alt={property?.name}
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {property?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">

                              {inspection.type === 'entrada' ? 
                                <CircleCheckBig className="h-4 w-4 text-green-500 inline mr-2" /> 
                                : 
                                <CircleMinus className="h-4 w-4 text-red-500 inline mr-2" />
                              }
                              
                              Vistoria de {inspection.type === 'entrada' ? 'Entrada' : 'Saída'}
                            </p>
                          </div>
                          {getStatusBadge(inspection.status)}
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(inspection.createdAt)}
                          </div>

                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            Contrato #{inspection.propertyId.slice(-6)}
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInspection(inspection)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => navigate(`/inspection/${inspection.id}`)}
                          >
                            Abrir vistoria
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

        {/* Modal resumo */}
        <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Resumo da Vistoria</DialogTitle>
            </DialogHeader>

            {selectedInspection && (
              <div className="space-y-4 text-sm">
                <p><b>Tipo:</b> {selectedInspection.type}</p>
                <p><b>Status:</b> {getStatusBadge(selectedInspection.status)}</p>
                <p><b>Descrição geral:</b></p>
                <p className="p-3 rounded bg-muted">
                  {selectedInspection.generalDescription}
                </p>
                {selectedInspection.observations && (
                  <>
                    <p><b>Observações:</b></p>
                    <p className="p-3 rounded bg-muted">
                      {selectedInspection.observations}
                    </p>
                  </>
                )}
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

export default InspectionHistory;
