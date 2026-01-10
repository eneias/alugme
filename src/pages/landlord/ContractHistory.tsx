import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Calendar,
  Clock,
  ArrowRight,
  Handshake,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandlordSidebar from '@/components/admin/LandlordSidebar';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { rentalContracts, landlords, landlordProperties } from '@/data/landlords';
import { properties } from '@/data/properties';

const statusLabel: Record<string, string> = {
  active: 'Ativo',
  completed: 'Encerrado',
  pending: 'Pendente',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  completed: 'secondary',
  pending: 'outline',
};

const ContractHistory = () => {
  const navigate = useNavigate();

  /** 🔐 Autenticação */
  const loggedUserId = localStorage.getItem('loggedUserId');
  const loggedUserType = localStorage.getItem('loggedUserType');

  if (loggedUserType !== 'locador') {
    return null;
  }

  /** 👤 Locador */
  const landlord = landlords.find(l => l.userId === loggedUserId);

  /** 🏠 Propriedades do locador */
  const myProperties = landlordProperties.filter(
    lp => lp.landlordId === landlord?.id
  );

  /** 📄 Contratos do locador */
  const myContracts = useMemo(() => {
    return rentalContracts.filter(contract =>
      myProperties.some(p => p.id === contract.propertyId)
    );
  }, [myProperties]);

  const goToProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen flex bg-background">

      <div className="flex-1 flex flex-col">
      {loggedUserType !== 'locador' && (
        <>
          <br/><br/>
          <Header />
        </>
      )}

        <main className="flex-1 container py-8 max-w-5xl space-y-6">
          {/* Cabeçalho */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Handshake className="h-6 w-6" />
              Contratos
            </h1>
            <p className="text-muted-foreground">
              Visualize todos os contratos vinculados aos seus imóveis
            </p>
          </div>

          {/* Lista */}
          {myContracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum contrato encontrado.
            </p>
          ) : (
            <div className="space-y-4">
              {myContracts.map(contract => {
                const property = properties.find(
                  p => p.id === contract.propertyId
                );

                return (
                  <Card
                    key={contract.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* 🖼 Imagem do imóvel */}
                        <div className="w-full lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={property?.images?.[0] || '/placeholder.svg'}
                            alt={property?.name}
                            onClick={() => goToProperty(property!.id)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Informações */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                {property?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {property?.address}
                              </p>
                            </div>

                            <Badge variant={statusVariant[contract.status]}>
                              {statusLabel[contract.status]}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Locatário: {contract.tenantId}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {contract.startDate} → {contract.endDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Criado em{' '}
                                {new Date(
                                  contract.startDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Ação */}
                          <div className="flex justify-end">
                            <Link
                              to={`/landlord/contract/${contract.id}`}
                              className="text-sm flex items-center gap-1 text-primary hover:underline"
                            >
                              Ver contrato
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>

      {loggedUserType !== 'locador' && (
        <>
          <br/><br/>
          <Footer />
        </>
      )}
      </div>
    </div>
  );
};

export default ContractHistory;
