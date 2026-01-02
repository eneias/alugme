import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Bed, Bath, Maximize } from "lucide-react";
import { Property } from "@/data/properties";
import PropertyGallery from "./PropertyGallery";

interface PropertyCardProps {
  property: Property;
  index: number;
}

const PropertyCard = ({ property, index }: PropertyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/property/${property.id}`}>
        <div className="overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500 border border-border/50">
          <PropertyGallery images={property.images} name={property.name} />
          
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">{property.rating}</span>
                <span className="text-muted-foreground">({property.reviews})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm line-clamp-1">{property.address}, {property.neighborhood}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} quartos</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} banhos</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{property.area}m²</span>
              </div>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-bold text-primary">
                  R$ {property.price.toLocaleString('pt-BR')}
                </span>
                <span className="text-muted-foreground text-sm">/mês</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {property.city}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
