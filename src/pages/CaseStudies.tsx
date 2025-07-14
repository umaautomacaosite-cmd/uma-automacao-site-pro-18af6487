
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Factory, 
  Hospital, 
  GraduationCap, 
  Calendar,
  MapPin,
  CheckCircle,
  Award
} from 'lucide-react';

const CaseStudies = () => {
  const cases = [
    {
      client: "Hospital Regional São Paulo",
      sector: "Saúde",
      year: "2023",
      location: "São Paulo, SP",
      icon: Hospital,
      solution: "Infraestrutura completa de Data Center para sistema hospitalar",
      description: "Implementação de data center Tier III com redundância total para sistema de prontuário eletrônico e equipamentos médicos críticos.",
      technologies: ["UPS Schneider 200kVA", "CRAC Liebert", "Fibra Óptica OM4", "Busway 1600A"],
      standards: ["NR-10", "ABNT NBR 5410", "TIA-942", "ISO 27001"],
      results: ["99.99% Uptime", "Redundância N+1", "Certificação Anatel", "Economia 30% Energia"],
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      client: "Metalúrgica Brasileira Ltda",
      sector: "Industrial",
      year: "2023",
      location: "São Bernardo do Campo, SP",
      icon: Factory,
      solution: "Sistema de automação industrial para linha de produção",
      description: "Modernização completa da linha de produção com sistemas PLC, SCADA e implementação de segurança NR-12.",
      technologies: ["Siemens S7-1500", "WinCC SCADA", "Profinet", "Safety PLCs"],
      standards: ["NR-12", "ISO 13849", "IEC 61508", "ABNT NBR ISO 14119"],
      results: ["Aumento 40% Produtividade", "Zero Acidentes", "Redução 25% Custos", "Certificação NR-12"],
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      client: "Universidade Federal de Tecnologia",
      sector: "Educação",
      year: "2022",
      location: "Campinas, SP",
      icon: GraduationCap,
      solution: "Cabeamento estruturado para campus universitário",
      description: "Implementação de rede estruturada Cat 6A para 15 prédios do campus com backbone de fibra óptica.",
      technologies: ["Cat 6A Furukawa", "Fibra OM3/OM4", "Switches Cisco", "Access Points Ubiquiti"],
      standards: ["ANSI/TIA-568", "ISO/IEC 11801", "ABNT NBR 14565"],
      results: ["Conectividade 10Gbps", "Wi-Fi 6 Total", "Gestão Centralizada", "Expansão Futura"],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      client: "Shopping Center Metropolitan",
      sector: "Comercial",
      year: "2022",
      location: "Ribeirão Preto, SP",
      icon: Building,
      solution: "Sistema elétrico e automação predial completa",
      description: "Instalação de sistema busway, automação de iluminação e ar condicionado para complexo de 80.000m².",
      technologies: ["Busway 3200A", "BMS Schneider", "Inversores ABB", "Smart Lighting"],
      standards: ["ABNT NBR 5410", "ABNT NBR 16401", "ASHRAE 90.1"],
      results: ["Economia 35% Energia", "Automação Total", "Manutenção Preditiva", "Certificação LEED"],
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl font-bold mb-4">
            Cases de Sucesso
          </h1>
          <p className="font-lato text-xl max-w-3xl mx-auto">
            Projetos entregues com excelência técnica, conformidade total com normas regulamentadoras e resultados comprovados em diversos setores.
          </p>
          <div className="mt-8">
            <Badge className="bg-gold-500 text-black font-semibold px-4 py-2 text-lg">
              <Award className="mr-2 h-5 w-5" />
              500+ Projetos Entregues
            </Badge>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cases.map((caseStudy, index) => (
              <Card key={index} className="border-2 hover:shadow-xl transition-shadow overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${caseStudy.image})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <caseStudy.icon className="h-16 w-16 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-wine-900 text-white">
                    Conformidade NR-12
                  </Badge>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="font-lato text-sm">
                      {caseStudy.sector}
                    </Badge>
                    <div className="text-sm text-gray-500 font-lato">
                      {caseStudy.year}
                    </div>
                  </div>
                  <CardTitle className="font-playfair text-xl text-wine-900">
                    {caseStudy.client}
                  </CardTitle>
                  <CardDescription className="font-lato">
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{caseStudy.location}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Solução Aplicada
                    </h4>
                    <p className="font-lato text-sm text-gray-700">
                      {caseStudy.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Tecnologias Utilizadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Normas Aplicadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.standards.map((standard, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-lato font-semibold text-wine-900 mb-2">
                      Resultados Obtidos
                    </h4>
                    <div className="space-y-1">
                      {caseStudy.results.map((result, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-lato text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full">
                    Solicitar Projeto Similar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-4">
            Seu Projeto Pode Ser o Próximo Case de Sucesso
          </h2>
          <p className="font-lato text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e transforme sua infraestrutura com soluções técnicas de excelência.
          </p>
          <Button size="lg" className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-4 text-lg">
            Solicitar Consultoria Gratuita
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
