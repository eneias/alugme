import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Home, FileText, ImagePlus, X } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

import { rentalContracts, landlords, landlordProperties } from '@/data/landlords';
import { properties } from '@/data/properties';
import { mockInspections } from '@/data/inspections';

interface PhotoUpload {
  id: string;
  file: File;
  url: string;          // preview
  description: string;
  room: string;
}

const MAX_PHOTOS = 10;

const CreateInspection = () => {
  const navigate = useNavigate();

  /** 🔐 Autenticação */
  const loggedUserId = localStorage.getItem('loggedUserId');
  const loggedUserType = localStorage.getItem('loggedUserType');

  if (loggedUserType !== 'locador') {
    navigate(-1);
  }

  /** 👤 Locador */
  const landlord = landlords.find(l => l.userId === loggedUserId);

  /** 🏠 Contratos do locador */
  const myProperties = landlordProperties.filter(
    lp => lp.landlordId === landlord?.id
  );

  const myContracts = rentalContracts.filter(contract =>
    myProperties.some(p => p.id === contract.propertyId)
  );

  /** 🧠 Estado do formulário */
  const [contractId, setContractId] = useState('');
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [generalDescription, setGeneralDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);

  const selectedContract = myContracts.find(c => c.id === contractId);
  const selectedProperty = properties.find(
    p => p.id === selectedContract?.propertyId
  );

  /** 📸 Upload de fotos */
  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const remaining = MAX_PHOTOS - photos.length;

    const newPhotos: PhotoUpload[] = Array.from(files)
      .slice(0, remaining)
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        description: '',
        room: '',
      }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  /** 🧾 Criar vistoria */
  const handleCreateInspection = () => {
    if (!contractId || !generalDescription || photos.length === 0) return;

    mockInspections.push({
      id: crypto.randomUUID(),
      contractId,
      propertyId: selectedContract!.propertyId,

      type,

      generalDescription,
      observations: '',

      photos: photos.map(photo => ({
        id: crypto.randomUUID(),
        url: photo.url, // já é base64 / objectURL
        description: photo.description,
        room: photo.room,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'landlord', // criação sempre pelo locador
      })),

      status: 'pending_tenant',
      createdAt: new Date().toISOString(),

      signatures: {},
      locked: false
    });

    navigate('/inspection-history');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {loggedUserType === 'locatario' && (
        <>
          <Header />
          <br/><br/>
        </>
      )}

      <main className="flex-1 container py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            Criar Vistoria
          </h1>
          <p className="text-muted-foreground">
            Registre a vistoria de entrada ou saída do imóvel
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">

            {/* 📄 Contrato */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contrato *</label>
              <Select value={contractId} onValueChange={setContractId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o contrato" />
                </SelectTrigger>
                <SelectContent>
                  {myContracts.map(contract => {
                    const property = properties.find(
                      p => p.id === contract.propertyId
                    );
                    return (
                      <SelectItem key={contract.id} value={contract.id}>
                        {property?.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* 🏠 Imóvel */}
            {selectedProperty && (
              <div className="flex items-center gap-4 border rounded-lg p-4">
                <img
                  src={selectedProperty.images[0]}
                  className="h-20 w-28 object-cover rounded"
                />
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {selectedProperty.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProperty.address}
                  </p>
                </div>
              </div>
            )}

            {/* 🔄 Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de vistoria *</label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 📝 Descrição */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição geral *</label>
              <Textarea
                placeholder="Descreva o estado geral do imóvel..."
                rows={5}
                value={generalDescription}
                onChange={e => setGeneralDescription(e.target.value)}
              />
            </div>

            {/* 📸 Fotos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Fotos do imóvel (até {MAX_PHOTOS}) *
              </label>

              <Input
                type="file"
                accept="image/*"
                multiple
                disabled={photos.length >= MAX_PHOTOS}
                onChange={e => handlePhotoUpload(e.target.files)}
              />

              <div className="grid grid-cols-3 gap-3">
                {photos.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      className="h-24 w-full object-cover rounded border"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1
                                opacity-0 group-hover:opacity-100 transition"
                      title="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                {photos.length} / {MAX_PHOTOS} fotos adicionadas
              </p>
            </div>

            {/* ✅ Ações */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateInspection}>
                <FileText className="h-4 w-4 mr-2" />
                Criar vistoria
              </Button>
            </div>

          </CardContent>
        </Card>
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

export default CreateInspection;
