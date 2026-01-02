import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Check, Download, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { properties } from "@/data/properties";
import { users } from "@/data/users";
import { useToast } from "@/hooks/use-toast";

interface ContractFormData {
  fullName: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  duration: string;
}

const RentalContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "contract">("form");
  const [contractData, setContractData] = useState<ContractFormData | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ContractFormData>();

  // Verificar se usuário está logado e preencher dados
  useEffect(() => {
    const loggedUserId = localStorage.getItem("loggedUserId");
    if (!loggedUserId) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para alugar um imóvel.",
        variant: "destructive",
      });
      navigate("/login", { state: { redirectTo: `/rent/${id}` } });
      return;
    }

    const user = users.find(u => u.id === loggedUserId);
    if (user) {
      setValue("fullName", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone);
    }
  }, [navigate, id, setValue, toast]);

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

  const onSubmit = (data: ContractFormData) => {
    setContractData(data);
    setStep("contract");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 max-w-4xl">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to={`/property/${property.id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para detalhes
          </Link>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className={`flex items-center gap-2 ${step === "form" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step === "form" ? "gradient-hero text-primary-foreground" : "bg-primary text-primary-foreground"
            }`}>
              {step === "contract" ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className="font-medium">Dados pessoais</span>
          </div>
          <div className="h-px w-12 bg-border" />
          <div className={`flex items-center gap-2 ${step === "contract" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              step === "contract" ? "gradient-hero text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              2
            </div>
            <span className="font-medium">Contrato</span>
          </div>
        </motion.div>

        {step === "form" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Property Summary */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-card mb-8">
              <div className="flex gap-4">
                <img 
                  src={property.images[0]} 
                  alt={property.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h2 className="font-display text-xl font-semibold mb-1">{property.name}</h2>
                  <p className="text-muted-foreground text-sm mb-2">{property.address}, {property.neighborhood}</p>
                  <p className="text-primary font-bold text-lg">R$ {property.price.toLocaleString('pt-BR')}/mês</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">Dados do Locatário</h2>
                  <p className="text-muted-foreground">Preencha seus dados para gerar o contrato</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo *</Label>
                    <Input 
                      id="fullName" 
                      {...register("fullName", { required: "Nome é obrigatório" })}
                      placeholder="Seu nome completo"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input 
                      id="cpf" 
                      {...register("cpf", { required: "CPF é obrigatório" })}
                      placeholder="000.000.000-00"
                    />
                    {errors.cpf && (
                      <p className="text-sm text-destructive">{errors.cpf.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input 
                      id="rg" 
                      {...register("rg", { required: "RG é obrigatório" })}
                      placeholder="00.000.000-0"
                    />
                    {errors.rg && (
                      <p className="text-sm text-destructive">{errors.rg.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email" 
                      type="email"
                      {...register("email", { required: "E-mail é obrigatório" })}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input 
                      id="phone" 
                      {...register("phone", { required: "Telefone é obrigatório" })}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço atual *</Label>
                    <Input 
                      id="address" 
                      {...register("address", { required: "Endereço é obrigatório" })}
                      placeholder="Seu endereço completo"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data de início *</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      {...register("startDate", { required: "Data é obrigatória" })}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração do contrato *</Label>
                    <select 
                      id="duration"
                      {...register("duration", { required: "Duração é obrigatória" })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecione</option>
                      <option value="12">12 meses</option>
                      <option value="24">24 meses</option>
                      <option value="36">36 meses</option>
                    </select>
                    {errors.duration && (
                      <p className="text-sm text-destructive">{errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Concordo com os termos e condições do contrato de locação
                  </label>
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={!acceptedTerms}
                  className="w-full gradient-hero text-primary-foreground font-semibold text-lg h-14 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
                >
                  Gerar Contrato
                </Button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Action buttons */}
            <div className="flex gap-4 mb-8">
              <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Baixar PDF
              </Button>
            </div>

            {/* Contract */}
            <div className="p-8 md:p-12 rounded-2xl bg-card border border-border/50 shadow-elevated print:shadow-none">
              <div className="text-center mb-12">
                <h1 className="font-display text-3xl font-bold mb-2">CONTRATO DE LOCAÇÃO RESIDENCIAL</h1>
                <p className="text-muted-foreground">Contrato nº {Date.now().toString().slice(-8)}</p>
              </div>

              <div className="space-y-6 text-foreground leading-relaxed">
                <p>
                  Pelo presente instrumento particular de contrato de locação residencial, de um lado como <strong>LOCADOR(A)</strong>: 
                  CasaFácil Imobiliária LTDA, inscrita no CNPJ sob nº 00.000.000/0001-00, com sede na Av. Principal, 1000, Centro, 
                  São Paulo - SP, neste ato representada por seu representante legal, e de outro lado como <strong>LOCATÁRIO(A)</strong>:
                </p>

                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome completo</p>
                      <p className="font-semibold">{contractData?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-semibold">{contractData?.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RG</p>
                      <p className="font-semibold">{contractData?.rg}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-semibold">{contractData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-semibold">{contractData?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço atual</p>
                      <p className="font-semibold">{contractData?.address}</p>
                    </div>
                  </div>
                </div>

                <p>
                  Têm entre si justo e contratado o seguinte:
                </p>

                <h2 className="font-display text-xl font-semibold pt-4">CLÁUSULA PRIMEIRA - DO OBJETO</h2>
                <p>
                  O presente contrato tem como objeto a locação do imóvel situado em:
                </p>
                <div className="p-6 rounded-xl bg-secondary/30 border border-border">
                  <p className="font-semibold text-lg">{property.name}</p>
                  <p className="text-muted-foreground">{property.address}, {property.neighborhood} - {property.city}</p>
                  <p className="mt-2">
                    Contendo {property.bedrooms} quarto(s), {property.bathrooms} banheiro(s), 
                    área total de {property.area}m².
                  </p>
                </div>

                <h2 className="font-display text-xl font-semibold pt-4">CLÁUSULA SEGUNDA - DO PRAZO</h2>
                <p>
                  A locação é feita pelo prazo de <strong>{contractData?.duration} meses</strong>, 
                  com início em <strong>{contractData?.startDate && formatDate(contractData.startDate)}</strong>, 
                  terminando em{" "}
                  <strong>
                    {contractData?.startDate && formatDate(
                      new Date(new Date(contractData.startDate).setMonth(
                        new Date(contractData.startDate).getMonth() + parseInt(contractData.duration || "12")
                      )).toISOString()
                    )}
                  </strong>, 
                  data em que o(a) LOCATÁRIO(A) se obriga a restituir o imóvel completamente desocupado, 
                  nas mesmas condições em que o recebeu.
                </p>

                <h2 className="font-display text-xl font-semibold pt-4">CLÁUSULA TERCEIRA - DO ALUGUEL</h2>
                <p>
                  O aluguel mensal é de <strong>R$ {property.price.toLocaleString('pt-BR')}</strong> (
                  {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()} reais), 
                  que deverá ser pago até o dia 10 (dez) de cada mês, através de boleto bancário ou PIX.
                </p>

                <h2 className="font-display text-xl font-semibold pt-4">CLÁUSULA QUARTA - DAS OBRIGAÇÕES</h2>
                <p>
                  O(A) LOCATÁRIO(A) obriga-se a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pagar pontualmente o aluguel e demais encargos da locação;</li>
                  <li>Servir-se do imóvel para uso exclusivamente residencial;</li>
                  <li>Restituir o imóvel, finda a locação, no estado em que o recebeu;</li>
                  <li>Comunicar ao LOCADOR qualquer dano ou defeito cuja reparação a este incumba;</li>
                  <li>Não modificar a forma externa ou interna do imóvel sem o consentimento prévio e por escrito do LOCADOR.</li>
                </ul>

                <h2 className="font-display text-xl font-semibold pt-4">CLÁUSULA QUINTA - DO FORO</h2>
                <p>
                  Fica eleito o foro da Comarca de {property.city} para dirimir quaisquer dúvidas 
                  oriundas do presente contrato.
                </p>

                <p className="pt-6">
                  E por estarem assim justos e contratados, firmam o presente instrumento em 02 (duas) vias 
                  de igual teor, juntamente com 02 (duas) testemunhas.
                </p>

                <p className="text-center pt-8">
                  {property.city}, {today}
                </p>

                <div className="grid md:grid-cols-2 gap-12 pt-12">
                  <div className="text-center">
                    <div className="border-t border-foreground pt-4">
                      <p className="font-semibold">LOCADOR(A)</p>
                      <p className="text-sm text-muted-foreground">CasaFácil Imobiliária LTDA</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-foreground pt-4">
                      <p className="font-semibold">LOCATÁRIO(A)</p>
                      <p className="text-sm text-muted-foreground">{contractData?.fullName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 pt-8">
                  <div className="text-center">
                    <div className="border-t border-foreground pt-4">
                      <p className="text-sm text-muted-foreground">Testemunha 1</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-foreground pt-4">
                      <p className="text-sm text-muted-foreground">Testemunha 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg"
                className="gradient-hero text-primary-foreground font-semibold text-lg h-14 px-12 rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirmar e Enviar
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Ao confirmar, você receberá uma cópia do contrato por e-mail
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12 print:hidden">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2024 CasaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default RentalContract;
