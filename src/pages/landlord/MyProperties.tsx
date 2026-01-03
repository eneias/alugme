import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Building2, Eye, Edit, FileText, 
  Upload, Trash2, MapPin, Home, DollarSign, CheckCircle, 
  Clock, XCircle, History
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { landlordProperties, landlords, LandlordProperty, RentalContract, BankAccount } from '@/data/landlords';
import { users } from '@/data/users';

const MyProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [properties, setProperties] = useState<LandlordProperty[]>(landlordProperties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<LandlordProperty | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<LandlordProperty | null>(null);
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);
  const [currentLandlord, setCurrentLandlord] = useState<typeof landlords[0] | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    city: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: '',
    bankAccountId: '',
  });

  // Verificar se usuário está logado e é locador
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

    const landlord = landlords.find(l => l.userId === loggedUserId);
    if (!landlord) {
      toast({
        title: 'Cadastro incompleto',
        description: 'Complete seu cadastro de locador para continuar.',
        variant: 'destructive',
      });
      navigate('/landlord');
      return;
    }

    if (!landlord.validated || landlord.bankAccounts.length === 0 || !landlord.bankAccounts.some(b => b.validated)) {
      toast({
        title: 'Conta não validada',
        description: 'Você precisa ter uma conta bancária validada para gerenciar imóveis.',
        variant: 'destructive',
      });
      navigate('/landlord/bank-account');
      return;
    }

    setCurrentLandlord(landlord);
  }, [navigate, toast]);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = availabilityFilter === 'all' || property.availability === availabilityFilter;
      
      // Filter by current landlord
      const matchesLandlord = currentLandlord ? property.landlordId === currentLandlord.id : true;
      
      return matchesSearch && matchesAvailability && matchesLandlord;
    });
  }, [properties, searchTerm, availabilityFilter, currentLandlord]);

  const handleOpenDialog = (property?: LandlordProperty) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        address: property.address,
        neighborhood: property.neighborhood,
        city: property.city,
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        description: property.description,
        amenities: property.amenities.join(', '),
        bankAccountId: property.bankAccountId,
      });
      setUploadedImages(property.images);
    } else {
      setEditingProperty(null);
      setFormData({
        name: '',
        address: '',
        neighborhood: '',
        city: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        amenities: '',
        bankAccountId: currentLandlord?.bankAccounts[0]?.id || '',
      });
      setUploadedImages([]);
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simular upload - em produção, faria upload para storage
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!currentLandlord) return;

    const newProperty: LandlordProperty = {
      id: editingProperty?.id || Date.now().toString(),
      landlordId: currentLandlord.id,
      bankAccountId: formData.bankAccountId,
      name: formData.name,
      address: formData.address,
      neighborhood: formData.neighborhood,
      city: formData.city,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseFloat(formData.area),
      rating: editingProperty?.rating || 0,
      reviews: editingProperty?.reviews || 0,
      createdAt: editingProperty?.createdAt || new Date().toISOString().split('T')[0],
      description: formData.description,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      images: uploadedImages.length > 0 ? uploadedImages : [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
      ],
      coordinates: { lat: -23.5505, lng: -46.6333 },
      availability: editingProperty?.availability || 'available',
      rentalHistory: editingProperty?.rentalHistory || [],
    };

    if (editingProperty) {
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? newProperty : p));
      toast({ title: 'Imóvel atualizado com sucesso!' });
    } else {
      setProperties(prev => [...prev, newProperty]);
      toast({ title: 'Imóvel cadastrado com sucesso!' });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property?.availability === 'rented') {
      toast({
        title: 'Não é possível excluir',
        description: 'Este imóvel possui um contrato ativo.',
        variant: 'destructive',
      });
      return;
    }
    setProperties(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Imóvel removido com sucesso!' });
  };

  const handleViewHistory = (property: LandlordProperty) => {
    setSelectedProperty(property);
    setIsHistoryDialogOpen(true);
  };

  const handleViewContract = (contract: RentalContract) => {
    setSelectedContract(contract);
    setIsContractDialogOpen(true);
  };

  const getAvailabilityBadge = (availability: LandlordProperty['availability']) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Disponível</Badge>;
      case 'rented':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Alugado</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><XCircle className="w-3 h-3 mr-1" /> Manutenção</Badge>;
    }
  };

  const getContractStatusBadge = (status: RentalContract['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Ativo</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">Finalizado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Cancelado</Badge>;
    }
  };

  if (!currentLandlord) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">    
      <main className="flex-1 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Meus Imóveis</h1>
              <p className="text-muted-foreground">Gerencie seus imóveis cadastrados na plataforma</p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Imóvel
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, endereço ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Disponibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="rented">Alugado</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredProperties.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Imóveis</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredProperties.filter(p => p.availability === 'available').length}</p>
                  <p className="text-sm text-muted-foreground">Disponíveis</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredProperties.filter(p => p.availability === 'rented').length}</p>
                  <p className="text-sm text-muted-foreground">Alugados</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    R$ {filteredProperties.filter(p => p.availability === 'rented').reduce((sum, p) => sum + p.price, 0).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">Receita Mensal</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Table */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imóvel</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contratos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.bedrooms} quartos • {property.area}m²
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{property.neighborhood}, {property.city}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">R$ {property.price.toLocaleString('pt-BR')}</span>
                      <span className="text-muted-foreground text-sm">/mês</span>
                    </TableCell>
                    <TableCell>{getAvailabilityBadge(property.availability)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{property.rentalHistory.length} contrato(s)</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/property/${property.id}`)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewHistory(property)}
                          title="Histórico de Locações"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(property)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(property.id)}
                          disabled={property.availability === 'rented'}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </main>

      {/* Property Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}</DialogTitle>
            <DialogDescription>
              {editingProperty ? 'Atualize as informações do imóvel' : 'Cadastre um novo imóvel para locação'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagens do Imóvel</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Clique ou arraste imagens aqui</span>
                </label>
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative">
                        <img src={img} alt="" className="w-full h-20 object-cover rounded" />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Imóvel</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Casa Vista Mar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Valor Mensal (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 4500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Rua das Palmeiras, 120"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Ex: Copacabana"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Rio de Janeiro"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o imóvel..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Comodidades (separadas por vírgula)</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Ex: Piscina, Churrasqueira, Garagem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Conta Bancária para Repasse</Label>
              <Select
                value={formData.bankAccountId}
                onValueChange={(value) => setFormData({ ...formData, bankAccountId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {currentLandlord.bankAccounts.filter(b => b.validated).map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank} - Ag: {account.agency} | CC: {account.account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingProperty ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rental History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Histórico de Locações</DialogTitle>
            <DialogDescription>
              {selectedProperty?.name} - {selectedProperty?.address}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedProperty?.rentalHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Este imóvel ainda não possui histórico de locações.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locatário</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contrato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProperty?.rentalHistory.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.tenantName}</p>
                          <p className="text-sm text-muted-foreground">{contract.tenantEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                          <p className="text-muted-foreground">até {new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </TableCell>
                      <TableCell>{contract.duration} meses</TableCell>
                      <TableCell>R$ {contract.monthlyRent.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{getContractStatusBadge(contract.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContract(contract)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract View Dialog */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contrato de Locação</DialogTitle>
            <DialogDescription>
              Contrato #{selectedContract?.id} - Assinado em {selectedContract?.signedAt && new Date(selectedContract.signedAt).toLocaleDateString('pt-BR')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Contract Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Locatário</p>
                <p className="font-medium">{selectedContract?.tenantName}</p>
                <p className="text-sm">{selectedContract?.tenantCpf}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contato</p>
                <p className="font-medium">{selectedContract?.tenantEmail}</p>
                <p className="text-sm">{selectedContract?.tenantPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-medium">
                  {selectedContract?.startDate && new Date(selectedContract.startDate).toLocaleDateString('pt-BR')} - {selectedContract?.endDate && new Date(selectedContract.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Mensal</p>
                <p className="font-medium">R$ {selectedContract?.monthlyRent.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm bg-card p-6 rounded-lg border">
                {selectedContract?.contractTerms}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => window.print()}>
              Imprimir Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProperties;