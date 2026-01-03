import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Bed, 
  Bath, 
  Maximize, 
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { properties } from "@/data/properties";
import { users } from "@/data/users";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Imóvel não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleRentClick = () => {
    const loggedUserId = localStorage.getItem("loggedUserId");
    if (!loggedUserId) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para alugar um imóvel.",
        variant: "destructive",
      });
      navigate("/login", { state: { redirectTo: `/rent/${property.id}` } });
      return;
    }
    
    const user = users.find(u => u.id === loggedUserId);
    if (!user) {
      toast({
        title: "Usuário não encontrado",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      localStorage.removeItem("loggedUserId");
      navigate("/login", { state: { redirectTo: `/rent/${property.id}` } });
      return;
    }

    navigate(`/rent/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para imóveis
          </Link>
        </motion.div>

        {/* Main Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-8 group"
        >
          <div className="aspect-[16/9] relative">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.name} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 gradient-overlay opacity-30" />
            
            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-background/90 px-3 py-1.5 rounded-full text-sm font-medium">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {property.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex 
                    ? 'border-primary shadow-card' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {property.name}
                </h1>
                <div className="flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-full shrink-0">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviews} avaliações)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{property.address}, {property.neighborhood} - {property.city}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bed className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                  <p className="text-sm text-muted-foreground">Quartos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bath className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                  <p className="text-sm text-muted-foreground">Banheiros</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Maximize className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.area}m²</p>
                  <p className="text-sm text-muted-foreground">Área</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {new Date(property.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">Cadastrado</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Sobre o imóvel</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div 
                    key={amenity}
                    className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Localização</h2>
              <PropertyMap 
                lat={property.coordinates.lat} 
                lng={property.coordinates.lng} 
                name={property.name}
              />
            </div>
          </motion.div>

          {/* Sidebar - Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border/50 shadow-elevated">
              <div className="mb-6">
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-bold text-primary">
                    R$ {property.price.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taxas e impostos inclusos
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full gradient-hero text-primary-foreground font-semibold text-lg h-14 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
                onClick={handleRentClick}
              >
                Alugar este imóvel
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Você não será cobrado ainda
              </p>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aluguel mensal</span>
                  <span className="text-foreground">R$ {property.price.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de serviço</span>
                  <span className="text-foreground">R$ 0</span>
                </div>
                <div className="flex justify-between font-semibold pt-3 border-t border-border">
                  <span>Total mensal</span>
                  <span className="text-primary">R$ {property.price.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PropertyDetails;
