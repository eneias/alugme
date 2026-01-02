import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-card group-hover:shadow-card-hover transition-shadow duration-300">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">
            Casa<span className="text-primary">Fácil</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Imóveis
          </Link>
          <button className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
