import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Calendar,
  ArrowRight,
  Handshake,
  FileText,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { landlords, rentals, Rental } from '@/data/landlords';
import { properties } from '@/data/properties';

const statusLabel: Record<string, string> = {
  active: 'Ativo',
  completed: 'Encerrado',
  cancelled: 'Cancelado',
};

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  active: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
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
  const myProperties = properties.filter(
    p => p.landlordId === landlord?.id
  );

  /** 📋 Locações do locador */
  const myRentals: Rental[] = rentals.filter(rental =>
    myProperties.some(p => p.id === rental.propertyId)
  );

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
              Locações
            </h1>
            <p className="text-muted-foreground">
              Visualize todas as locações vinculadas aos seus imóveis
            </p>
          </div>

          {/* Lista de Locações */}
          {myRentals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma locação encontrada.
            </p>
          ) : (
            <div className="space-y-4">
              {myRentals.map(rental => {
                const property = properties.find(
                  p => p.id === rental.propertyId
                );

                return (
                  <Card
                    key={rental.id}
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

                            <Badge variant={statusVariant[rental.status]}>
                              {statusLabel[rental.status]}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Locatário: {rental.contracts[0]?.tenantName || rental.tenantId}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {rental.startDate} → {rental.endDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {rental.contracts.length} contrato(s)
                              </span>
                            </div>
                          </div>

                          {/* Ação */}
                          <div className="flex justify-end">
                            {rental.contracts.length > 0 && (
                              <Link
                                to={`/landlord/contract/${rental.contracts[0].id}`}
                                className="text-sm flex items-center gap-1 text-primary hover:underline"
                              >
                                Ver contrato
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            )}
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
