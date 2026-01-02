import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, Users, Shield, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Building2,
      title: "Qualidade",
      description: "Selecionamos apenas os melhores imóveis para você"
    },
    {
      icon: Users,
      title: "Atendimento",
      description: "Suporte humanizado e dedicado em todas as etapas"
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Transações seguras e contratos transparentes"
    },
    {
      icon: Award,
      title: "Experiência",
      description: "Anos de expertise no mercado imobiliário"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 gradient-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Sobre Nós
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Conectando pessoas aos seus lares dos sonhos desde 2020
            </p>
          </motion.div>
        </div>
      </section>

      {/* História */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">
              Nossa História
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              A CasaFácil nasceu com uma missão clara: simplificar o processo de encontrar o imóvel 
              ideal para alugar. Fundada em 2020, nossa plataforma surgiu da percepção de que o 
              mercado imobiliário precisava de mais transparência, agilidade e humanização.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hoje, somos referência no setor, conectando milhares de locadores e locatários 
              em todo o Brasil. Nossa equipe trabalha incansavelmente para oferecer a melhor 
              experiência possível, desde a busca do imóvel até a assinatura do contrato.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-bold text-foreground mb-12 text-center"
          >
            Nossos Valores
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-card p-6 rounded-xl shadow-card text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-4xl font-bold text-primary mb-2">5.000+</p>
              <p className="text-muted-foreground">Imóveis Cadastrados</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-4xl font-bold text-primary mb-2">15.000+</p>
              <p className="text-muted-foreground">Clientes Satisfeitos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-4xl font-bold text-primary mb-2">50+</p>
              <p className="text-muted-foreground">Cidades Atendidas</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-muted-foreground">Taxa de Satisfação</p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
