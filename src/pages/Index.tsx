import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/FilterBar";
import { properties } from "@/data/properties";

const Index = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Filter by neighborhood
    if (selectedNeighborhood !== "all") {
      result = result.filter((p) => p.neighborhood === selectedNeighborhood);
    }

    // Sort
    switch (sortBy) {
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [selectedNeighborhood, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Encontre seu novo{" "}
              <span className="text-gradient">lar</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Descubra casas e apartamentos incríveis para alugar nas melhores localizações do Brasil
            </p>
          </motion.div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12 px-4">
        <div className="container">
          <FilterBar
            selectedNeighborhood={selectedNeighborhood}
            setSelectedNeighborhood={setSelectedNeighborhood}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 mb-6 flex items-center justify-between"
          >
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProperties.length}</span>{" "}
              imóveis encontrados
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2024 CasaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
