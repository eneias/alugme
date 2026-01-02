import { motion } from "framer-motion";
import { Filter, MapPin, Star, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { neighborhoods } from "@/data/properties";

interface FilterBarProps {
  selectedNeighborhood: string;
  setSelectedNeighborhood: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const FilterBar = ({
  selectedNeighborhood,
  setSelectedNeighborhood,
  sortBy,
  setSortBy,
}: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-wrap gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 shadow-card"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
          <SelectTrigger className="w-[180px] border-border/50 bg-background">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os bairros</SelectItem>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood} value={neighborhood}>
                {neighborhood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-accent" />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border-border/50 bg-background">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Relevância</SelectItem>
            <SelectItem value="rating-desc">Maior avaliação</SelectItem>
            <SelectItem value="rating-asc">Menor avaliação</SelectItem>
            <SelectItem value="date-desc">Mais recentes</SelectItem>
            <SelectItem value="date-asc">Mais antigos</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default FilterBar;
