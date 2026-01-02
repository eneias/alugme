import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
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
              Política de Privacidade
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
                  1. Informações que Coletamos
                </h2>
                <p className="leading-relaxed">
                  Coletamos informações que você nos fornece diretamente, incluindo nome, endereço 
                  de e-mail, número de telefone e outras informações de contato quando você se 
                  cadastra em nossa plataforma ou entra em contato conosco.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  2. Como Usamos suas Informações
                </h2>
                <p className="leading-relaxed mb-4">Utilizamos as informações coletadas para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer, manter e melhorar nossos serviços</li>
                  <li>Processar transações e enviar notificações relacionadas</li>
                  <li>Enviar comunicações promocionais (com seu consentimento)</li>
                  <li>Responder a suas perguntas e solicitações</li>
                  <li>Detectar e prevenir fraudes e atividades ilegais</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  3. Compartilhamento de Informações
                </h2>
                <p className="leading-relaxed">
                  Não vendemos suas informações pessoais. Podemos compartilhar suas informações 
                  com terceiros apenas nas seguintes circunstâncias: com seu consentimento, para 
                  cumprir obrigações legais, para proteger nossos direitos, ou com prestadores 
                  de serviços que nos auxiliam em nossas operações.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  4. Segurança dos Dados
                </h2>
                <p className="leading-relaxed">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger 
                  suas informações pessoais contra acesso não autorizado, alteração, divulgação 
                  ou destruição. No entanto, nenhum método de transmissão pela Internet é 100% seguro.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  5. Seus Direitos
                </h2>
                <p className="leading-relaxed mb-4">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou desatualizados</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Solicitar a portabilidade de seus dados</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  6. Cookies
                </h2>
                <p className="leading-relaxed">
                  Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em 
                  nosso site, analisar o tráfego e personalizar conteúdo. Você pode gerenciar 
                  suas preferências de cookies através das configurações do seu navegador.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  7. Contato
                </h2>
                <p className="leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
                  seus dados, entre em contato conosco através do e-mail: privacidade@casafacil.com.br
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

export default Privacy;
