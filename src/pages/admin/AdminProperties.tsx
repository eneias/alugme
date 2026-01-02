import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { properties as initialProperties, Property } from '@/data/properties';
import { toast } from 'sonner';

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    mainImage: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      neighborhood: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      mainImage: '',
    });
    setEditingProperty(null);
  };

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        address: property.address,
        neighborhood: property.neighborhood,
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        area: property.area.toString(),
        description: property.description,
        mainImage: property.images[0],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const propertyData: Property = {
      id: editingProperty?.id || Date.now().toString(),
      name: formData.name,
      address: formData.address,
      neighborhood: formData.neighborhood,
      city: 'São Paulo',
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      area: Number(formData.area),
      description: formData.description,
      images: formData.mainImage ? [formData.mainImage] : editingProperty?.images || [],
      amenities: editingProperty?.amenities || ['Wi-Fi', 'Estacionamento'],
      reviews: editingProperty?.reviews || 0,
      rating: editingProperty?.rating || 4.5,
      createdAt: editingProperty?.createdAt || new Date().toISOString().split('T')[0],
      coordinates: editingProperty?.coordinates || { lat: -23.5505, lng: -46.6333 },
    };

    if (editingProperty) {
      setProperties(properties.map((p) => (p.id === editingProperty.id ? propertyData : p)));
      toast.success('Imóvel atualizado com sucesso!');
    } else {
      setProperties([...properties, propertyData]);
      toast.success('Imóvel cadastrado com sucesso!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
    toast.success('Imóvel removido com sucesso!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Imóveis</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Bairro</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Quartos</TableHead>
              <TableHead>Área</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-16 h-12 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.neighborhood}</TableCell>
                <TableCell>R$ {property.price.toLocaleString('pt-BR')}</TableCell>
                <TableCell>{property.bedrooms}</TableCell>
                <TableCell>{property.area} m²</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(property)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do Imóvel</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mainImage">URL da Imagem Principal</Label>
                <Input
                  id="mainImage"
                  value={formData.mainImage}
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProperty ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProperties;
