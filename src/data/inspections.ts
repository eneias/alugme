export interface InspectionPhoto {
  id: string;
  url: string;
  description: string;
  room: string;
  uploadedAt: string;
  uploadedBy: 'landlord' | 'tenant';
}

export interface Inspection {
  id: string;
  contractId: string;
  propertyId: string;
  type: 'entrada' | 'saida';
  status: 'pending_landlord' | 'pending_tenant' | 'disputed' | 'completed';
  generalDescription: string;
  observations: string;
  photos: InspectionPhoto[];
  createdAt: string;
  createdBy: string;
  landlordSignature?: {
    signedAt: string;
    signedBy: string;
    ip?: string;
  };
  tenantSignature?: {
    signedAt: string;
    signedBy: string;
    ip?: string;
  };
  disputeComments?: string;
}

export const roomOptions = [
  'Sala de estar',
  'Cozinha',
  'Quarto 1',
  'Quarto 2',
  'Quarto 3',
  'Banheiro social',
  'Banheiro suíte',
  'Área de serviço',
  'Varanda',
  'Garagem',
  'Área externa',
  'Outro',
];

export const conditionOptions = [
  { value: 'excellent', label: 'Excelente', color: 'bg-green-500' },
  { value: 'good', label: 'Bom', color: 'bg-blue-500' },
  { value: 'regular', label: 'Regular', color: 'bg-yellow-500' },
  { value: 'bad', label: 'Ruim', color: 'bg-red-500' },
];

// Mock data
export const mockInspections: Inspection[] = [
  {
    id: 'inspection-1',
    contractId: 'contract-1',
    propertyId: '1',
    type: 'entrada',
    status: 'completed',
    generalDescription: 'Imóvel em excelente estado de conservação. Paredes recém pintadas, piso em perfeitas condições. Instalações elétricas e hidráulicas funcionando normalmente.',
    observations: 'Foi entregue com 2 conjuntos de chaves. Portão eletrônico com 2 controles. Ar condicionado funcionando em todos os quartos.',
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        description: 'Sala de estar com sofá e móveis',
        room: 'Sala de estar',
        uploadedAt: '2024-05-28T10:00:00Z',
        uploadedBy: 'landlord',
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        description: 'Cozinha completa com armários',
        room: 'Cozinha',
        uploadedAt: '2024-05-28T10:05:00Z',
        uploadedBy: 'landlord',
      },
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        description: 'Quarto principal com cama king',
        room: 'Quarto 1',
        uploadedAt: '2024-05-28T10:10:00Z',
        uploadedBy: 'landlord',
      },
    ],
    createdAt: '2024-05-28T09:00:00Z',
    createdBy: 'landlord-1',
    landlordSignature: {
      signedAt: '2024-05-28T11:00:00Z',
      signedBy: 'Carlos Silva',
      ip: '192.168.1.1',
    },
    tenantSignature: {
      signedAt: '2024-05-28T14:30:00Z',
      signedBy: 'Maria Santos',
      ip: '192.168.1.2',
    },
  },
  {
    id: 'inspection-2',
    contractId: 'contract-2',
    propertyId: '1',
    type: 'saida',
    status: 'completed',
    generalDescription: 'Imóvel devolvido em boas condições. Pequenos desgastes naturais de uso. Limpeza geral realizada.',
    observations: 'Pequena marca na parede do quarto 1 (não considerada dano). Todas as chaves e controles devolvidos.',
    photos: [
      {
        id: 'photo-4',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        description: 'Fachada do imóvel na saída',
        room: 'Área externa',
        uploadedAt: '2024-01-02T09:00:00Z',
        uploadedBy: 'landlord',
      },
    ],
    createdAt: '2024-01-02T08:00:00Z',
    createdBy: 'landlord-1',
    landlordSignature: {
      signedAt: '2024-01-02T10:00:00Z',
      signedBy: 'Carlos Silva',
      ip: '192.168.1.1',
    },
    tenantSignature: {
      signedAt: '2024-01-02T10:30:00Z',
      signedBy: 'Ana Costa',
      ip: '192.168.1.3',
    },
  },
  {
    id: 'inspection-3',
    contractId: 'contract-3',
    propertyId: '3',
    type: 'entrada',
    status: 'pending_tenant',
    generalDescription: 'Cobertura entregue em perfeito estado. Todos os acabamentos de alto padrão em excelente conservação. Piscina limpa e aquecedor funcionando.',
    observations: 'Entregue com manual de instruções dos equipamentos. 4 vagas de garagem demarcadas. Sistema de segurança ativo.',
    photos: [
      {
        id: 'photo-5',
        url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        description: 'Vista do terraço',
        room: 'Varanda',
        uploadedAt: '2024-07-26T10:00:00Z',
        uploadedBy: 'landlord',
      },
      {
        id: 'photo-6',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        description: 'Suite principal',
        room: 'Quarto 1',
        uploadedAt: '2024-07-26T10:15:00Z',
        uploadedBy: 'landlord',
      },
    ],
    createdAt: '2024-07-26T09:00:00Z',
    createdBy: 'landlord-1',
    landlordSignature: {
      signedAt: '2024-07-26T11:00:00Z',
      signedBy: 'Carlos Silva',
      ip: '192.168.1.1',
    },
  },
];

export const inspectionTemplates = {
  default: `TERMO DE VISTORIA DE IMÓVEL

TIPO: {{type}}
DATA: {{date}}

IDENTIFICAÇÃO DO IMÓVEL
Endereço: {{propertyAddress}}
Bairro: {{propertyNeighborhood}}
Cidade: {{propertyCity}}

PARTES ENVOLVIDAS
Locador(a): {{landlordName}}
Locatário(a): {{tenantName}}

ESTADO GERAL DO IMÓVEL
{{generalDescription}}

OBSERVAÇÕES ADICIONAIS
{{observations}}

REGISTRO FOTOGRÁFICO
Total de {{photoCount}} foto(s) anexada(s) a este termo.

{{#photos}}
- {{room}}: {{description}}
{{/photos}}

DECLARAÇÃO
As partes declaram que vistoriaram o imóvel e concordam com as condições descritas neste termo. Este documento é irrevogável após assinado por ambas as partes.

ASSINATURAS ELETRÔNICAS

_____________________________
Locador(a): {{landlordSignature}}
Data/Hora: {{landlordSignedAt}}
IP: {{landlordIp}}

_____________________________
Locatário(a): {{tenantSignature}}
Data/Hora: {{tenantSignedAt}}
IP: {{tenantIp}}

Este documento foi assinado eletronicamente conforme Medida Provisória nº 2.200-2/2001 e possui validade jurídica.`,
};
