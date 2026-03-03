import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, Building2, Eye, Edit, FileText,
  Upload, Trash2, MapPin, Home, DollarSign, CheckCircle,
  Clock, XCircle, History, ClipboardCheck, X, ImagePlus,
} from 'lucide-react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { RentalContract, getPropertyContracts, getContractSignedDate } from '@/data/landlords';
import { mockInspections } from '@/data/inspections';

const MAX_IMAGES = 10;

interface Property {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  rating: number;
  reviews: number;
  createdAt: string;
  description: string;
  amenities: string[];
  images: string[];
  lat: number;
  lng: number;
  landlordId: string | null;
  bankAccountId: string | null;
  availability: string;
}

interface PendingFile {
  file: File;
  preview: string; // URL.createObjectURL — apenas local
}

interface CurrentUser {
  id: string;
  type: string;
  name?: string;
}

const MyProperties = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  // History / Contract / Inspection dialogs
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isInspectionsDialogOpen, setIsInspectionsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);

  // Search / filter
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const handleSearch = () => setAppliedSearch(searchTerm);
  const handleClearSearch = () => { setSearchTerm(''); setAppliedSearch(''); };

  // Form state
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
    amenities: [] as string[],
    bankAccountId: '',
    images: [] as string[],
  });
  const [amenityInput, setAmenityInput] = useState('');

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImages = formData.images.length + pendingFiles.length;

  const revokePendingPreviews = (files: PendingFile[]) => {
    files.forEach((pf) => URL.revokeObjectURL(pf.preview));
  };

  // Load user
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user) {
      toast.error('Você precisa estar logado para acessar esta página.');
      navigate('/login');
      return;
    }

    if (user.type !== 'locador' && user.type !== 'admin') {
      toast.error('Apenas locadores podem acessar esta página.');
      navigate('/');
      return;
    }

    setCurrentUser(user);
  }, [navigate]);

  useEffect(() => {
    if (currentUser) fetchProperties();
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/properties', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error();
      const all: Property[] = await res.json();
      // Normalize availability to lowercase
      const normalized = all.map(p => ({ ...p, availability: p.availability.toLowerCase() }));
      // Locadores só veem seus próprios imóveis
      setProperties(
        currentUser?.type === 'locador'
          ? normalized.filter(p => p.landlordId === currentUser.id)
          : normalized
      );
    } catch {
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch =
        !appliedSearch ||
        p.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        p.address.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesAvailability = availabilityFilter === 'all' || p.availability === availabilityFilter;
      return matchesSearch && matchesAvailability;
    });
  }, [properties, appliedSearch, availabilityFilter]);

  const resetForm = () => {
    revokePendingPreviews(pendingFiles);
    setPendingFiles([]);
    setUrlInput('');
    setAmenityInput('');
    setFormData({
      name: '', address: '', neighborhood: '', city: '',
      price: '', bedrooms: '', bathrooms: '', area: '', description: '',
      amenities: [], bankAccountId: '', images: [],
    });
    setEditingProperty(null);
  };

  const handleOpenDialog = (property?: Property) => {
    revokePendingPreviews(pendingFiles);
    setPendingFiles([]);
    setUrlInput('');
    setAmenityInput('');
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
        amenities: property.amenities ?? [],
        bankAccountId: property.bankAccountId ?? '',
        images: property.images ?? [],
      });
    } else {
      setFormData({
        name: '', address: '', neighborhood: '', city: '',
        price: '', bedrooms: '', bathrooms: '', area: '', description: '',
        amenities: [], bankAccountId: '', images: [],
      });
      setEditingProperty(null);
    }
    setIsDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (totalImages >= MAX_IMAGES) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens por imóvel`);
      return;
    }
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => [...prev, { file, preview }]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (totalImages >= MAX_IMAGES) {
      toast.error(`Máximo de ${MAX_IMAGES} imagens por imóvel`);
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setUrlInput('');
  };

  const handleRemoveSavedImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');

      let uploadedUrls: string[] = [];
      if (pendingFiles.length > 0) {
        uploadedUrls = await Promise.all(
          pendingFiles.map(async ({ file }) => {
            const body = new FormData();
            body.append('file', file);
            const res = await fetch('http://localhost:5000/api/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body,
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.message || 'Erro ao fazer upload');
            }
            const { url } = await res.json();
            return url as string;
          })
        );
      }

      const payload = {
        name: formData.name,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        description: formData.description,
        images: [...formData.images, ...uploadedUrls],
        amenities: formData.amenities,
        rating: editingProperty?.rating ?? 0,
        reviews: editingProperty?.reviews ?? 0,
        createdAt: editingProperty?.createdAt ?? new Date().toISOString(),
        lat: editingProperty?.lat ?? -23.5505,
        lng: editingProperty?.lng ?? -46.6333,
        landlordId: currentUser?.type === 'locador'
          ? currentUser.id
          : (editingProperty?.landlordId ?? null),
        bankAccountId: formData.bankAccountId.trim() || null,
        availability: editingProperty?.availability ?? 'available',
      };

      if (editingProperty) {
        const res = await fetch(`http://localhost:5000/api/properties/${editingProperty.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success('Imóvel atualizado com sucesso!');
      } else {
        const res = await fetch('http://localhost:5000/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        toast.success('Imóvel cadastrado com sucesso!');
      }

      await fetchProperties();
      setIsDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar imóvel');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success('Imóvel removido com sucesso!');
      await fetchProperties();
    } catch {
      toast.error('Erro ao remover imóvel');
    }
  };

  const handleViewHistory = (property: Property) => {
    setSelectedProperty(property);
    setIsHistoryDialogOpen(true);
  };

  const handleViewContract = (contract: RentalContract) => {
    setSelectedContract(contract);
    setIsContractDialogOpen(true);
  };

  const handleViewContracts = (property: Property) => {
    setSelectedProperty(property);
    const contracts = getPropertyContracts(property.id);
    if (contracts.length > 0) setSelectedContract(contracts[0]);
    setIsContractDialogOpen(true);
  };

  const handleViewInspections = (property: Property) => {
    setSelectedProperty(property);
    setIsInspectionsDialogOpen(true);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Disponível</Badge>;
      case 'rented':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Alugado</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><XCircle className="w-3 h-3 mr-1" /> Manutenção</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
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

  const formatSignatureDate = (contract: RentalContract) => {
    const signedDate = getContractSignedDate(contract);
    return signedDate ? new Date(signedDate).toLocaleDateString('pt-BR') : 'Não assinado';
  };

  if (!currentUser) return null;

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
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="pl-10 pr-24"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {(searchTerm || appliedSearch) && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleClearSearch}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" onClick={handleSearch} className="h-8">
                  Buscar
                </Button>
              </div>
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
          {!loading && (
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
          )}

          {/* Properties Table */}
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando imóveis...</div>
          ) : (
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
                          {property.images[0] ? (
                            <img
                              src={property.images[0]}
                              alt={property.name}
                              onClick={() => navigate(`/property/${property.id}`)}
                              className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              Sem foto
                            </div>
                          )}
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
                        <span className="text-sm">{getPropertyContracts(property.id).length} contrato(s)</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/property/${property.id}`)} title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleViewHistory(property)} title="Histórico de Locações">
                            <History className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleViewContracts(property)} title="Contratos">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleViewInspections(property)} title="Vistorias">
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(property)} title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeletingPropertyId(property.id)} title="Excluir">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingPropertyId}
        onOpenChange={(open) => { if (!open) setDeletingPropertyId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deletingPropertyId) handleDelete(deletingPropertyId); setDeletingPropertyId(null); }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Property Form Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) { revokePendingPreviews(pendingFiles); setPendingFiles([]); }
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}</DialogTitle>
            <DialogDescription>
              {editingProperty ? 'Atualize as informações do imóvel' : 'Cadastre um novo imóvel para locação'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              <div>
                <Label htmlFor="name">Nome do Imóvel</Label>
                <Input id="name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Casa Vista Mar" required />
              </div>

              <div>
                <Label htmlFor="price">Valor Mensal (R$)</Label>
                <Input id="price" type="number" value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: 4500" required />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Rua das Palmeiras, 120" required />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Ex: Copacabana" required />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ex: Rio de Janeiro" required />
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input id="bedrooms" type="number" value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input id="bathrooms" type="number" value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input id="area" type="number" value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
                  </div>
                </div>
              </div>

              {/* Gerenciador de imagens */}
              <div className="col-span-2 space-y-3">
                <Label>
                  Imagens{' '}
                  <span className="text-muted-foreground font-normal">
                    ({totalImages}/{MAX_IMAGES})
                  </span>
                </Label>

                {totalImages > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((url, i) => (
                      <div key={`saved-${i}`} className="relative group">
                        <img src={url} alt="" className="w-20 h-16 object-cover rounded border border-border" />
                        {i === 0 && pendingFiles.length === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/60 text-white rounded-b">
                            Principal
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {pendingFiles.map((pf, i) => (
                      <div key={`pending-${i}`} className="relative group">
                        <img src={pf.preview} alt="" className="w-20 h-16 object-cover rounded border border-dashed border-primary/50" />
                        {formData.images.length === 0 && i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/60 text-white rounded-b">
                            Principal
                          </span>
                        )}
                        <span className="absolute top-0 left-0 text-[10px] bg-primary/80 text-primary-foreground px-1 rounded-br">
                          Pendente
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePendingFile(i)}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {totalImages < MAX_IMAGES && (
                  <div className="flex gap-2 items-center p-3 rounded-lg border border-dashed border-border bg-muted/30">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="shrink-0">
                      <Upload className="w-4 h-4 mr-1" />
                      Selecionar
                    </Button>
                    <span className="text-muted-foreground text-sm shrink-0">ou</span>
                    <Input
                      placeholder="Cole a URL da imagem..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddUrl} disabled={!urlInput.trim()} className="shrink-0">
                      <ImagePlus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  A primeira imagem será a capa. Formatos: JPG, PNG, WEBP, GIF (máx. 5MB). Os arquivos selecionados serão enviados ao salvar.
                </p>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o imóvel..."
                  rows={3} required />
              </div>

              <div className="col-span-2">
                <Label>Comodidades</Label>
                <div
                  className="min-h-10 flex flex-wrap gap-1.5 items-center rounded-md border border-input bg-background px-3 py-2 cursor-text"
                  onClick={() => document.getElementById('amenity-input')?.focus()}
                >
                  {formData.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-sm font-medium"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, amenities: prev.amenities.filter((_, idx) => idx !== i) }));
                        }}
                        className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    id="amenity-input"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ',') && amenityInput.trim()) {
                        e.preventDefault();
                        const value = amenityInput.trim().replace(/,$/, '');
                        if (value && !formData.amenities.includes(value)) {
                          setFormData(prev => ({ ...prev, amenities: [...prev.amenities, value] }));
                        }
                        setAmenityInput('');
                      } else if (e.key === 'Backspace' && !amenityInput && formData.amenities.length > 0) {
                        setFormData(prev => ({ ...prev, amenities: prev.amenities.slice(0, -1) }));
                      }
                    }}
                    placeholder={formData.amenities.length === 0 ? 'Ex: Piscina, Churrasqueira...' : ''}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Pressione Enter ou vírgula para adicionar</p>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? (pendingFiles.length > 0 ? 'Enviando imagens...' : 'Salvando...')
                  : editingProperty ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
              </Button>
            </div>
          </form>
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
            {selectedProperty && getPropertyContracts(selectedProperty.id).length === 0 ? (
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
                    <TableHead>Vistoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedProperty && getPropertyContracts(selectedProperty.id).map((contract) => (
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
                        <Button variant="ghost" size="sm" onClick={() => handleViewContract(contract)}>
                          <FileText className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => selectedProperty && handleViewInspections(selectedProperty)}>
                          <ClipboardCheck className="h-4 w-4 mr-1" /> Ver
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
              Contrato #{selectedContract?.id} - Assinado em {selectedContract && formatSignatureDate(selectedContract)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
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
                  {selectedContract?.startDate && new Date(selectedContract.startDate).toLocaleDateString('pt-BR')} -{' '}
                  {selectedContract?.endDate && new Date(selectedContract.endDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Mensal</p>
                <p className="font-medium">R$ {selectedContract?.monthlyRent.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {selectedContract && (
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
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
            )}

            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm bg-card p-6 rounded-lg border">
                {selectedContract?.contractTerms}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContractDialogOpen(false)}>Fechar</Button>
            <Button onClick={() => window.print()}>Imprimir Contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspections Dialog */}
      <Dialog open={isInspectionsDialogOpen} onOpenChange={setIsInspectionsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vistorias do Imóvel</DialogTitle>
            <DialogDescription>{selectedProperty?.name}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {mockInspections.filter(i => i.propertyId === selectedProperty?.id).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhuma vistoria registrada para este imóvel.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criada em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInspections
                    .filter(i => i.propertyId === selectedProperty?.id)
                    .map(inspection => (
                      <TableRow key={inspection.id}>
                        <TableCell className="capitalize">{inspection.type}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{inspection.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(inspection.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProperties;
