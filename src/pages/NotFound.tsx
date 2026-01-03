import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "@/assets/logo2.png";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted bg-login">

      <div className="text-center mb-8">
        <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
          <img src={logo} alt="AlugMe" className="h-20 object-contain mx-auto" />
        </Link>
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground text-secondary">Oops! Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
