import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 gradient-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Termos de Uso
            </h1>
            <p className="text-primary-foreground/90">
              Última atualização: Janeiro de 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="leading-relaxed">
                  Ao acessar e usar a plataforma CasaFácil, você concorda em cumprir e estar 
                  vinculado a estes Termos de Uso. Se você não concordar com qualquer parte 
                  destes termos, não poderá acessar ou usar nossos serviços.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. Descrição do Serviço
                </h2>
                <p className="leading-relaxed">
                  A CasaFácil é uma plataforma online que conecta locadores (proprietários de 
                  imóveis) e locatários (pessoas que buscam alugar imóveis). Atuamos como 
                  intermediários, facilitando a comunicação e o processo de locação.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. Cadastro e Conta
                </h2>
                <p className="leading-relaxed mb-4">Para usar nossos serviços, você deve:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ter pelo menos 18 anos de idade</li>
                  <li>Fornecer informações precisas e completas</li>
                  <li>Manter suas credenciais de acesso em segurança</li>
                  <li>Notificar imediatamente sobre uso não autorizado da conta</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. Responsabilidades do Usuário
                </h2>
                <p className="leading-relaxed mb-4">Ao usar nossa plataforma, você concorda em:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Não publicar informações falsas ou enganosas</li>
                  <li>Não usar a plataforma para atividades ilegais</li>
                  <li>Respeitar os direitos de outros usuários</li>
                  <li>Não interferir no funcionamento da plataforma</li>
                  <li>Cumprir com todas as leis e regulamentos aplicáveis</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. Anúncios de Imóveis
                </h2>
                <p className="leading-relaxed">
                  Os locadores são responsáveis pela veracidade das informações publicadas em 
                  seus anúncios. A CasaFácil não se responsabiliza por informações incorretas 
                  ou desatualizadas fornecidas pelos usuários. Reservamo-nos o direito de 
                  remover anúncios que violem nossos termos.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. Limitação de Responsabilidade
                </h2>
                <p className="leading-relaxed">
                  A CasaFácil não é parte nos contratos de locação firmados entre usuários. 
                  Não nos responsabilizamos por disputas, danos ou perdas decorrentes das 
                  negociações ou contratos realizados através da plataforma.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. Propriedade Intelectual
                </h2>
                <p className="leading-relaxed">
                  Todo o conteúdo da plataforma, incluindo textos, gráficos, logotipos, ícones 
                  e software, é propriedade da CasaFácil ou de seus licenciadores e está 
                  protegido por leis de direitos autorais.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  8. Modificações dos Termos
                </h2>
                <p className="leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão notificadas aos usuários. O uso continuado 
                  da plataforma após as alterações constitui aceitação dos novos termos.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  9. Lei Aplicável
                </h2>
                <p className="leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                  Qualquer disputa será resolvida nos tribunais da comarca de São Paulo, SP.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  10. Contato
                </h2>
                <p className="leading-relaxed">
                  Para dúvidas sobre estes Termos de Uso, entre em contato através do e-mail: 
                  termos@casafacil.com.br
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
