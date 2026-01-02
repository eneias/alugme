import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import UserMenu from "./UserMenu";
import logo from "@/assets/logo1.png";

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img src={logo} alt="AlugMe" className="h-10 object-contain" />
        </Link>

        <nav className="flex items-center gap-4">
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
          <UserMenu />
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
