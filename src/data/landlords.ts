export interface BankAccount {
  id: string;
  bank: string;
  agency: string;
  account: string;
  accountType: 'corrente' | 'poupanca';
  holderName: string;
  holderCpf: string;
  validated: boolean;
  createdAt: string;
}

export interface ContractSignature {
  userId: string;
  signedAt: string;
  ip?: string;
}

export interface RentalContract {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantCpf: string;
  tenantPhone: string;
  startDate: string;
  endDate: string;
  duration: number; // meses
  monthlyRent: number;
  status: 'active' | 'completed' | 'cancelled';
  signatures: {
    landlord?: ContractSignature;
    tenant?: ContractSignature;
  };
  contractTerms: string;
}

export interface Landlord {
  id: string;
  userId: string;
  bankAccounts: BankAccount[];
  socialContractAccepted: boolean;
  socialContractAcceptedAt: string;
  validated: boolean;
}

// Mock data
export const landlords: Landlord[] = [
  {
    id: 'landlord-1',
    userId: '1', // Carlos Silva
    bankAccounts: [
      {
        id: 'bank-1',
        bank: 'Banco do Brasil',
        agency: '1234-5',
        account: '12345-6',
        accountType: 'corrente',
        holderName: 'Carlos Silva',
        holderCpf: '123.456.789-00',
        validated: true,
        createdAt: '2024-01-20',
      }
    ],
    socialContractAccepted: true,
    socialContractAcceptedAt: '2024-01-15',
    validated: true,
  },
  {
    id: 'landlord-2',
    userId: '3', // João Oliveira
    bankAccounts: [
      {
        id: 'bank-2',
        bank: 'Itaú',
        agency: '4567-8',
        account: '98765-4',
        accountType: 'corrente',
        holderName: 'João Oliveira',
        holderCpf: '987.654.321-00',
        validated: true,
        createdAt: '2024-03-15',
      }
    ],
    socialContractAccepted: true,
    socialContractAcceptedAt: '2024-03-10',
    validated: true,
  }
];

export const rentalContracts: RentalContract[] = [
  {
    id: 'contract-1',
    propertyId: '1',
    tenantId: '2',
    tenantName: 'Maria Santos',
    tenantEmail: 'maria@email.com',
    tenantCpf: '111.222.333-44',
    tenantPhone: '(11) 99999-2222',
    startDate: '2024-06-01',
    endDate: '2025-06-01',
    duration: 12,
    monthlyRent: 4500,
    status: 'active',
    signatures: {
      landlord: {
        userId: '1',
        signedAt: '2024-05-28T10:30:00Z',
        ip: '192.168.1.100'
      },
      tenant: {
        userId: '2',
        signedAt: '2024-05-28T14:45:00Z',
        ip: '192.168.1.101'
      }
    },
    contractTerms: `CONTRATO DE LOCAÇÃO RESIDENCIAL

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem como objeto a locação do imóvel Casa Vista Mar, situado em Rua das Palmeiras, 120, Copacabana - Rio de Janeiro.

CLÁUSULA SEGUNDA - DO PRAZO
A locação é feita pelo prazo de 12 meses, com início em 01/06/2024 e término em 01/06/2025.

CLÁUSULA TERCEIRA - DO ALUGUEL
O aluguel mensal é de R$ 4.500,00, que deverá ser pago até o dia 10 de cada mês.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES
O LOCATÁRIO obriga-se a:
- Pagar pontualmente o aluguel e demais encargos;
- Servir-se do imóvel para uso exclusivamente residencial;
- Restituir o imóvel no estado em que o recebeu;
- Comunicar ao LOCADOR qualquer dano ou defeito.

CLÁUSULA QUINTA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.`,
  },
  {
    id: 'contract-2',
    propertyId: '1',
    tenantId: '4',
    tenantName: 'Ana Costa',
    tenantEmail: 'ana@email.com',
    tenantCpf: '555.666.777-88',
    tenantPhone: '(11) 99999-4444',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    duration: 12,
    monthlyRent: 4200,
    status: 'completed',
    signatures: {
      landlord: {
        userId: '1',
        signedAt: '2022-12-20T09:00:00Z',
        ip: '192.168.1.100'
      },
      tenant: {
        userId: '4',
        signedAt: '2022-12-20T11:30:00Z',
        ip: '192.168.1.102'
      }
    },
    contractTerms: `CONTRATO DE LOCAÇÃO RESIDENCIAL

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem como objeto a locação do imóvel Casa Vista Mar, situado em Rua das Palmeiras, 120, Copacabana - Rio de Janeiro.

CLÁUSULA SEGUNDA - DO PRAZO
A locação é feita pelo prazo de 12 meses, com início em 01/01/2023 e término em 01/01/2024.

CLÁUSULA TERCEIRA - DO ALUGUEL
O aluguel mensal é de R$ 4.200,00, que deverá ser pago até o dia 10 de cada mês.`,
  },
  {
    id: 'contract-3',
    propertyId: '3',
    tenantId: '2',
    tenantName: 'Maria Santos',
    tenantEmail: 'maria@email.com',
    tenantCpf: '111.222.333-44',
    tenantPhone: '(11) 99999-2222',
    startDate: '2024-08-01',
    endDate: '2026-08-01',
    duration: 24,
    monthlyRent: 8500,
    status: 'active',
    signatures: {
      landlord: {
        userId: '1',
        signedAt: '2024-07-25T16:00:00Z',
        ip: '192.168.1.100'
      },
      tenant: {
        userId: '2',
        signedAt: '2024-07-25T18:20:00Z',
        ip: '192.168.1.101'
      }
    },
    contractTerms: `CONTRATO DE LOCAÇÃO RESIDENCIAL

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem como objeto a locação do imóvel Cobertura Jardins, situado em Rua Oscar Freire, 800, Jardins - São Paulo.

CLÁUSULA SEGUNDA - DO PRAZO
A locação é feita pelo prazo de 24 meses, com início em 01/08/2024 e término em 01/08/2026.

CLÁUSULA TERCEIRA - DO ALUGUEL
O aluguel mensal é de R$ 8.500,00, que deverá ser pago até o dia 10 de cada mês.`,
  },
];

// Helper para obter contratos de uma propriedade
export const getPropertyContracts = (propertyId: string): RentalContract[] => {
  return rentalContracts.filter(c => c.propertyId === propertyId);
};

// Helper para verificar se contrato está assinado por ambas as partes
export const isContractFullySigned = (contract: RentalContract): boolean => {
  return !!(contract.signatures.landlord && contract.signatures.tenant);
};

// Helper para obter data de assinatura formatada
export const getContractSignedDate = (contract: RentalContract): string | null => {
  if (contract.signatures.tenant?.signedAt) {
    return contract.signatures.tenant.signedAt;
  }
  if (contract.signatures.landlord?.signedAt) {
    return contract.signatures.landlord.signedAt;
  }
  return null;
};

export const contractTemplates = {
  default: `CONTRATO DE LOCAÇÃO RESIDENCIAL

Pelo presente instrumento particular de contrato de locação residencial, de um lado como LOCADOR(A): {{landlordName}}, portador(a) do CPF nº {{landlordCpf}}, e de outro lado como LOCATÁRIO(A): {{tenantName}}, portador(a) do CPF nº {{tenantCpf}}.

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem como objeto a locação do imóvel {{propertyName}}, situado em {{propertyAddress}}, {{propertyNeighborhood}} - {{propertyCity}}.

O imóvel possui {{bedrooms}} quarto(s), {{bathrooms}} banheiro(s) e área total de {{area}}m².

CLÁUSULA SEGUNDA - DO PRAZO
A locação é feita pelo prazo de {{duration}} meses, com início em {{startDate}} e término em {{endDate}}, data em que o(a) LOCATÁRIO(A) se obriga a restituir o imóvel completamente desocupado, nas mesmas condições em que o recebeu.

CLÁUSULA TERCEIRA - DO ALUGUEL
O aluguel mensal é de R$ {{monthlyRent}}, que deverá ser pago até o dia 10 (dez) de cada mês, através de boleto bancário ou PIX.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DO LOCATÁRIO
O(A) LOCATÁRIO(A) obriga-se a:
- Pagar pontualmente o aluguel e demais encargos da locação;
- Servir-se do imóvel para uso exclusivamente residencial;
- Restituir o imóvel, finda a locação, no estado em que o recebeu;
- Comunicar ao LOCADOR qualquer dano ou defeito cuja reparação a este incumba;
- Não modificar a forma interna ou externa do imóvel sem consentimento prévio do LOCADOR.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO LOCADOR
O(A) LOCADOR(A) obriga-se a:
- Entregar ao LOCATÁRIO o imóvel em perfeitas condições de uso;
- Garantir o uso pacífico do imóvel locado;
- Manter a forma e o destino do imóvel locado.

CLÁUSULA SEXTA - DA RESCISÃO
O presente contrato poderá ser rescindido por qualquer das partes, mediante aviso prévio de 30 (trinta) dias, por escrito.

CLÁUSULA SÉTIMA - DO FORO
Fica eleito o foro da comarca de {{propertyCity}} para dirimir quaisquer questões oriundas do presente contrato.

E, por estarem assim justos e contratados, firmam o presente instrumento em 2 (duas) vias de igual teor.

{{city}}, {{signDate}}

_____________________________
LOCADOR(A): {{landlordName}}

_____________________________
LOCATÁRIO(A): {{tenantName}}`,
};
