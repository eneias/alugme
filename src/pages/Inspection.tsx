import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ClipboardCheck, 
  Camera, 
  Upload, 
  X, 
  Check, 
  Download, 
  Printer,
  AlertTriangle,
  Clock,
  FileCheck,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { properties } from "@/data/properties";
import { users } from "@/data/users";
import { rentalContracts } from "@/data/landlords";
import { mockInspections, roomOptions, InspectionPhoto, Inspection as InspectionType } from "@/data/inspections";
import { useToast } from "@/hooks/use-toast";

interface PhotoUpload {
  id: string;
  file?: File;
  url: string;
  description: string;
  room: string;
}

const Inspection = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [step, setStep] = useState<"form" | "review" | "signed">("form");
  const [inspectionType, setInspectionType] = useState<"entrada" | "saida">("entrada");
  const [generalDescription, setGeneralDescription] = useState("");
  const [observations, setObservations] = useState("");
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signatureData, setSignatureData] = useState({ name: "", cpf: "" });
  const [existingInspection, setExistingInspection] = useState<InspectionType | null>(null);
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeComment, setDisputeComment] = useState("");

  // Get logged user info
  const loggedUserId = localStorage.getItem("loggedUserId");
  const loggedUser = users.find(u => u.id === loggedUserId);
  const isLandlord = loggedUser?.type === "locador";

  // Find contract and property
  const contract = rentalContracts.find(c => c.id === contractId);
  const property = contract ? properties.find(p => p.id === contract.propertyId) : null;

  // Check for existing inspection
  useEffect(() => {
    if (contractId) {
      const existing = mockInspections.find(i => i.contractId === contractId);
      if (existing) {
        setExistingInspection(existing);
        if (existing.status === 'completed') {
          setStep("signed");
        } else if (existing.status === 'pending_tenant' && !isLandlord) {
          setStep("review");
        } else if (existing.status === 'pending_landlord' && isLandlord) {
          setStep("review");
        }
      }
    }
  }, [contractId, isLandlord]);

  // Verify login
  useEffect(() => {
    if (!loggedUserId) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para registrar uma vistoria.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [loggedUserId, navigate, toast]);

  if (!contract || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Contrato não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (photos.length + files.length > 10) {
      toast({
        title: "Limite de fotos",
        description: "Você pode enviar no máximo 10 fotos.",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: PhotoUpload = {
          id: `photo-${Date.now()}-${Math.random()}`,
          file,
          url: event.target?.result as string,
          description: "",
          room: "",
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const updatePhoto = (id: string, field: keyof PhotoUpload, value: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmitForm = () => {
    if (!generalDescription.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva o estado geral do imóvel.",
        variant: "destructive",
      });
      return;
    }

    if (photos.length === 0) {
      toast({
        title: "Fotos obrigatórias",
        description: "Por favor, adicione pelo menos uma foto do imóvel.",
        variant: "destructive",
      });
      return;
    }

    const incompletePhotos = photos.filter(p => !p.room || !p.description);
    if (incompletePhotos.length > 0) {
      toast({
        title: "Fotos incompletas",
        description: "Preencha o cômodo e a descrição de todas as fotos.",
        variant: "destructive",
      });
      return;
    }

    setStep("review");
  };

  const handleSign = () => {
    if (!signatureData.name.trim() || !signatureData.cpf.trim()) {
      toast({
        title: "Dados obrigatórios",
        description: "Preencha seu nome completo e CPF para assinar.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa concordar com os termos para assinar a vistoria.",
        variant: "destructive",
      });
      return;
    }

    // Mock sign
    toast({
      title: "Vistoria assinada!",
      description: "A vistoria foi registrada e assinada com sucesso.",
    });
    setStep("signed");
  };

  const handleDispute = () => {
    if (!disputeComment.trim()) {
      toast({
        title: "Comentário obrigatório",
        description: "Por favor, descreva o motivo da divergência.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Divergência registrada",
      description: "Sua divergência foi registrada. O locador será notificado.",
    });
    setShowDisputeDialog(false);
    navigate(-1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_landlord':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" /> Aguardando locador</Badge>;
      case 'pending_tenant':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><Clock className="w-3 h-3 mr-1" /> Aguardando locatário</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><AlertTriangle className="w-3 h-3 mr-1" /> Em divergência</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><FileCheck className="w-3 h-3 mr-1" /> Concluída</Badge>;
      default:
        return null;
    }
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Render completed inspection
  if (step === "signed" && existingInspection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link 
              to={-1 as any}
              onClick={(e) => { e.preventDefault(); navigate(-1); }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>

            {/* Inspection Document */}
            <div className="p-8 md:p-12 rounded-2xl bg-card border border-border/50 shadow-elevated print:shadow-none">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">TERMO DE VISTORIA</h1>
                  <p className="text-muted-foreground">
                    Vistoria de {existingInspection.type === 'entrada' ? 'Entrada' : 'Saída'} - 
                    Contrato nº {contract.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                {getStatusBadge(existingInspection.status)}
              </div>

              {/* Property Info */}
              <div className="p-6 rounded-xl bg-secondary/30 border border-border mb-8">
                <h3 className="font-semibold mb-3">Imóvel</h3>
                <p className="font-medium text-lg">{property.name}</p>
                <p className="text-muted-foreground">{property.address}, {property.neighborhood} - {property.city}</p>
              </div>

              {/* General Description */}
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold mb-4">Estado Geral do Imóvel</h3>
                <p className="text-foreground leading-relaxed">{existingInspection.generalDescription}</p>
              </div>

              {/* Observations */}
              {existingInspection.observations && (
                <div className="mb-8">
                  <h3 className="font-display text-xl font-semibold mb-4">Observações Adicionais</h3>
                  <p className="text-foreground leading-relaxed">{existingInspection.observations}</p>
                </div>
              )}

              {/* Photos */}
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold mb-4">Registro Fotográfico ({existingInspection.photos.length} fotos)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingInspection.photos.map((photo) => (
                    <div key={photo.id} className="rounded-xl overflow-hidden border border-border">
                      <img src={photo.url} alt={photo.description} className="w-full h-40 object-cover" />
                      <div className="p-3 bg-secondary/30">
                        <p className="text-sm font-medium">{photo.room}</p>
                        <p className="text-xs text-muted-foreground">{photo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div className="border-t border-border pt-8">
                <h3 className="font-display text-xl font-semibold mb-6">Assinaturas Eletrônicas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {existingInspection.landlordSignature ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">Locador</span>
                      </div>
                      <p className="font-semibold">{existingInspection.landlordSignature.signedBy}</p>
                      <p className="text-sm text-muted-foreground">
                        Assinado em: {formatDateTime(existingInspection.landlordSignature.signedAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-600">Locador</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Aguardando assinatura</p>
                    </div>
                  )}

                  {existingInspection.tenantSignature ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">Locatário</span>
                      </div>
                      <p className="font-semibold">{existingInspection.tenantSignature.signedBy}</p>
                      <p className="text-sm text-muted-foreground">
                        Assinado em: {formatDateTime(existingInspection.tenantSignature.signedAt)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-600">Locatário</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Aguardando assinatura</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-6 text-center">
                  Este documento foi assinado eletronicamente conforme Medida Provisória nº 2.200-2/2001 e possui validade jurídica.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render review step (for tenant reviewing landlord's inspection)
  if (step === "review" && existingInspection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link 
              to={-1 as any}
              onClick={(e) => { e.preventDefault(); navigate(-1); }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </div>
              <span className="font-medium">Vistoria criada</span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center gap-2 text-primary">
              <div className="h-8 w-8 rounded-full flex items-center justify-center gradient-hero text-primary-foreground">
                2
              </div>
              <span className="font-medium">Revisar e assinar</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Info Card */}
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-600 mb-1">Revise a Vistoria</h3>
                  <p className="text-sm text-muted-foreground">
                    O locador registrou a vistoria de {existingInspection.type} do imóvel. 
                    Revise as informações e fotos abaixo. Se concordar, assine eletronicamente. 
                    Caso encontre divergências, você pode contestar.
                  </p>
                </div>
              </div>
            </div>

            {/* Inspection Content */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              {/* Property */}
              <div className="flex gap-4 mb-8 pb-8 border-b border-border">
                <img 
                  src={property.images[0]} 
                  alt={property.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Vistoria de {existingInspection.type === 'entrada' ? 'Entrada' : 'Saída'}
                  </p>
                  <h2 className="font-display text-xl font-semibold mb-1">{property.name}</h2>
                  <p className="text-muted-foreground text-sm">{property.address}, {property.neighborhood}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Estado Geral do Imóvel</h3>
                <p className="text-muted-foreground">{existingInspection.generalDescription}</p>
              </div>

              {existingInspection.observations && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <p className="text-muted-foreground">{existingInspection.observations}</p>
                </div>
              )}

              {/* Photos */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Fotos ({existingInspection.photos.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingInspection.photos.map((photo) => (
                    <div key={photo.id} className="rounded-xl overflow-hidden border border-border">
                      <img src={photo.url} alt={photo.description} className="w-full h-32 object-cover" />
                      <div className="p-2 bg-secondary/30">
                        <p className="text-sm font-medium">{photo.room}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{photo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Form */}
              <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                <h3 className="font-semibold mb-4">Assinar Vistoria</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="signName">Nome completo *</Label>
                    <Input 
                      id="signName"
                      value={signatureData.name}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signCpf">CPF *</Label>
                    <Input 
                      id="signCpf"
                      value={signatureData.cpf}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="acceptTerms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-muted-foreground leading-none"
                  >
                    Declaro que revisei e concordo com todas as informações da vistoria. 
                    Entendo que após assinada, a vistoria não poderá ser alterada.
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSign}
                    className="flex-1 gradient-hero text-primary-foreground"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Assinar Vistoria
                  </Button>
                  <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Contestar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contestar Vistoria</DialogTitle>
                        <DialogDescription>
                          Descreva as divergências encontradas. O locador será notificado para revisar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Textarea 
                          placeholder="Descreva o que está em desacordo com a vistoria..."
                          value={disputeComment}
                          onChange={(e) => setDisputeComment(e.target.value)}
                          rows={5}
                        />
                        <Button onClick={handleDispute} className="w-full" variant="destructive">
                          Enviar Contestação
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render form step (landlord creating inspection)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 max-w-4xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to={-1 as any}
            onClick={(e) => { e.preventDefault(); navigate(-1); }}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className={`flex items-center gap-2 ${step === "form" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step === "form" ? "gradient-hero text-primary-foreground" : "bg-primary text-primary-foreground"
            }`}>
              {step !== "form" ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="font-medium">Registrar vistoria</span>
          </div>
          <div className="h-px w-12 bg-border" />
          <div className={`flex items-center gap-2 ${step === "review" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step === "review" ? "gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              2
            </div>
            <span className="font-medium">Assinar</span>
          </div>
        </motion.div>

        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Property Summary */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex gap-4">
                <img 
                  src={property.images[0]} 
                  alt={property.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contrato nº {contract.id.slice(-8).toUpperCase()}</p>
                  <h2 className="font-display text-xl font-semibold mb-1">{property.name}</h2>
                  <p className="text-muted-foreground text-sm">{property.address}, {property.neighborhood}</p>
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">Locatário:</span>{" "}
                    <span className="font-medium">{contract.tenantName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">Registrar Vistoria</h2>
                  <p className="text-muted-foreground">Preencha as informações da vistoria do imóvel</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Type */}
                <div className="space-y-2">
                  <Label>Tipo de Vistoria *</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={inspectionType === "entrada" ? "default" : "outline"}
                      className={inspectionType === "entrada" ? "gradient-hero text-primary-foreground" : ""}
                      onClick={() => setInspectionType("entrada")}
                    >
                      Entrada
                    </Button>
                    <Button
                      type="button"
                      variant={inspectionType === "saida" ? "default" : "outline"}
                      className={inspectionType === "saida" ? "gradient-hero text-primary-foreground" : ""}
                      onClick={() => setInspectionType("saida")}
                    >
                      Saída
                    </Button>
                  </div>
                </div>

                {/* General Description */}
                <div className="space-y-2">
                  <Label htmlFor="generalDescription">Descrição Geral do Estado do Imóvel *</Label>
                  <Textarea 
                    id="generalDescription"
                    value={generalDescription}
                    onChange={(e) => setGeneralDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o estado geral do imóvel, incluindo paredes, pisos, instalações elétricas e hidráulicas, etc."
                    rows={5}
                  />
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Fotos do Imóvel * ({photos.length}/10)</Label>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={photos.length >= 10}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        disabled={photos.length >= 10}
                        asChild
                      >
                        <span>
                          <Camera className="h-4 w-4" />
                          Adicionar fotos
                        </span>
                      </Button>
                    </label>
                  </div>

                  {photos.length === 0 ? (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">Clique para fazer upload ou arraste as fotos aqui</p>
                        <p className="text-sm text-muted-foreground mt-1">Máximo de 10 fotos</p>
                      </div>
                    </label>
                  ) : (
                    <div className="space-y-4">
                      {photos.map((photo, index) => (
                        <div key={photo.id} className="flex gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
                          <div className="relative">
                            <img 
                              src={photo.url} 
                              alt={`Foto ${index + 1}`}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.id)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Cômodo *</Label>
                              <Select
                                value={photo.room}
                                onValueChange={(value) => updatePhoto(photo.id, 'room', value)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Selecione o cômodo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomOptions.map((room) => (
                                    <SelectItem key={room} value={room}>{room}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Descrição *</Label>
                              <Input 
                                value={photo.description}
                                onChange={(e) => updatePhoto(photo.id, 'description', e.target.value)}
                                placeholder="Ex: Parede com pintura nova"
                                className="h-9"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Observations */}
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações Adicionais</Label>
                  <Textarea 
                    id="observations"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Chaves entregues, controles remotos, manuais de equipamentos, etc."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitForm}
                  size="lg"
                  className="w-full gradient-hero text-primary-foreground font-semibold text-lg h-14 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
                >
                  Continuar para Assinatura
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === "review" && !existingInspection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Review Summary */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">Revisar e Assinar</h2>
                  <p className="text-muted-foreground">Confira os dados e assine eletronicamente</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-6 mb-8">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                  <p className="font-medium">Vistoria de {inspectionType === 'entrada' ? 'Entrada' : 'Saída'}</p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Estado Geral</p>
                  <p>{generalDescription}</p>
                </div>

                {observations && (
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p>{observations}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Fotos ({photos.length})</p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img 
                          src={photo.url} 
                          alt={photo.description}
                          className="w-full h-20 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs text-center px-1">{photo.room}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signature Form */}
              <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="font-semibold mb-4">Assinatura Eletrônica</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="signName">Nome completo *</Label>
                    <Input 
                      id="signName"
                      value={signatureData.name}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signCpf">CPF *</Label>
                    <Input 
                      id="signCpf"
                      value={signatureData.cpf}
                      onChange={(e) => setSignatureData(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-2 mb-6">
                  <Checkbox 
                    id="acceptTerms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    Declaro que as informações prestadas são verdadeiras e que realizei a vistoria do imóvel. 
                    Estou ciente de que após assinada por ambas as partes, esta vistoria não poderá ser alterada e 
                    terá validade jurídica conforme Medida Provisória nº 2.200-2/2001.
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1"
                  >
                    Voltar e Editar
                  </Button>
                  <Button 
                    onClick={handleSign}
                    className="flex-1 gradient-hero text-primary-foreground"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Assinar Vistoria
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Após sua assinatura, o locatário receberá uma notificação para revisar e assinar a vistoria.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Inspection;
