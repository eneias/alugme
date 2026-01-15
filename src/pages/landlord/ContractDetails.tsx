import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Home,
  User,
  Calendar,
  ArrowLeft,
  ClipboardCheck,
  Handshake,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { rentalContracts, landlords, getContractSignedDate } from '@/data/landlords';
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

const ContractDetails = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();

  /** 🔐 Auth */
  const loggedUserId = localStorage.getItem('loggedUserId');
  const loggedUserType = localStorage.getItem('loggedUserType');

  if (loggedUserType !== 'locador') {
    navigate(-1);
    return null;
  }

  /** 👤 Locador */
  const landlord = landlords.find(l => l.userId === loggedUserId);

  /** 🏠 Propriedades do locador */
  const myPropertyIds = properties
    .filter(p => p.landlordId === landlord?.id)
    .map(p => p.id);

  /** 📄 Contrato */
  const contract = rentalContracts.find(c => c.id === contractId);

  if (!contract || !myPropertyIds.includes(contract.propertyId)) {
    return (
      <div className="min-h-screen flex bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Contrato não encontrado.</p>
        </div>
      </div>
    );
  }

  const property = properties.find(p => p.id === contract.propertyId);

  const formatSignatureDate = () => {
    const signedDate = getContractSignedDate(contract);
    if (signedDate) {
      return new Date(signedDate).toLocaleDateString('pt-BR');
    }
    return 'Não assinado';
  };

  return (
    <div className="min-h-screen flex bg-background">

      <div className="flex-1 flex flex-col">

        <main className="flex-1 container py-8 max-w-4xl space-y-6">

          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Handshake className="h-6 w-6" />
                Contrato
              </h1>
              <p className="text-muted-foreground">
                ID: {contract.id}
              </p>
            </div>

            <Badge variant={statusVariant[contract.status]}>
              {statusLabel[contract.status]}
            </Badge>
          </div>

          {/* Imóvel */}
          {property && (
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {property.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {property.address}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Informações do contrato */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Locatário: {contract.tenantName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Vigência: {contract.startDate} → {contract.endDate}
                </span>
              </div>

              <div>
                <span className="font-medium">Valor mensal:</span>{' '}
                R$ {contract.monthlyRent}
              </div>

              <div>
                <span className="font-medium">Assinado em:</span>{' '}
                {formatSignatureDate()}
              </div>
            </CardContent>
          </Card>

          {/* Assinaturas */}
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Assinatura do Locador</p>
                {contract.signatures.landlord ? (
                  <div>
                    <p className="font-medium text-green-600">✓ Assinado</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(contract.signatures.landlord.signedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-600">Pendente</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Assinatura do Locatário</p>
                {contract.signatures.tenant ? (
                  <div>
                    <p className="font-medium text-green-600">✓ Assinado</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(contract.signatures.tenant.signedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-600">Pendente</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-2">
            <Link to="/landlord/inspection-create">
              <Button variant="outline" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Criar vistoria
              </Button>
            </Link>
          </div>
        </main>

      </div>
    </div>
  );
};

export default ContractDetails;
