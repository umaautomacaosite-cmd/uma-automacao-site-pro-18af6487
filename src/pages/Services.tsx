
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Zap, 
  Settings, 
  Shield, 
  Database,
  Wifi,
  HardDrive,
  MonitorSpeaker,
  CheckCircle,
  Users,
  Award
} from 'lucide-react';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('redes');

  const categories = [
    { id: 'redes', name: 'Redes e Infraestrutura', icon: Network },
    { id: 'energia', name: 'Energia e Elétrica', icon: Zap },
    { id: 'automacao', name: 'Automação Industrial', icon: Settings },
    { id: 'seguranca', name: 'Segurança Industrial', icon: Shield },
    { id: 'datacenter', name: 'Data Center', icon: Database },
  ];

  const services = {
    redes: [
      {
        title: "Fibra Óptica FTTH/FTTX",
        description: "Implantação completa de redes de fibra óptica para telecomunicações e dados corporativos.",
        applications: ["Provedores de Internet", "Condomínios Residenciais", "Complexos Empresariais", "Campus Universitários"],
        standards: ["ANSI/TIA-568", "ISO/IEC 11801", "ABNT NBR 14565", "ITU-T G.652"],
        features: ["Certificação OTDR", "Fusão de Fibras", "Teste de Atenuação", "Documentação Técnica Completa"],
        engineer: "Eng. Carlos Silva - CREA/SP 123456"
      },
      {
        title: "Cabeamento Estruturado",
        description: "Sistemas de cabeamento estruturado categoria 6A/7 para redes corporativas de alta performance.",
        applications: ["Escritórios Corporativos", "Indústrias", "Hospitais", "Escolas"],
        standards: ["ANSI/TIA-568.2-D", "ISO/IEC 11801", "ABNT NBR 14565", "NR-10"],
        features: ["Cat 7/6A/6", "Certificação Fluke", "Patch Panels", "Organização de Racks"],
        engineer: "Eng. Maria Santos - CREA/SP 789012"
      }
    ],
    energia: [
      {
        title: "Sistema Busway Trifásico",
        description: "Instalação de barramentos blindados para distribuição elétrica industrial de alta corrente.",
        applications: ["Indústrias Pesadas", "Data Centers", "Hospitais", "Shopping Centers"],
        standards: ["ABNT NBR 5410", "ABNT NBR 6808", "NR-10", "NR-12"],
        features: ["800A a 6300A", "IP65", "Baixa Impedância", "Expansão Modular"],
        engineer: "Eng. Roberto Lima - CREA/SP 345678"
      },
      {
        title: "Fechamento de Quadros Elétricos",
        description: "Montagem e fechamento de quadros elétricos conforme normas de segurança industrial.",
        applications: ["Máquinas Industriais", "Sistemas de Automação", "Painéis de Controle"],
        standards: ["ABNT NBR 5410", "ABNT NBR IEC 60439", "NR-10", "NR-12"],
        features: ["IP54/IP65", "Disjuntores ABB/Schneider", "Bornes Phoenix", "Identificação Técnica"],
        engineer: "Eng. Ana Costa - CREA/SP 901234"
      }
    ],
    automacao: [
      {
        title: "Sistemas PLC e SCADA",
        description: "Desenvolvimento de sistemas de automação industrial com PLCs e supervisórios SCADA.",
        applications: ["Linhas de Produção", "Sistemas de Tratamento", "Controle de Processos"],
        standards: ["IEC 61131-3", "IEC 61508", "ISA-95", "NR-12"],
        features: ["Siemens S7", "Rockwell ControlLogix", "Schneider Modicon", "Redundância"],
        engineer: "Eng. Pedro Oliveira - CREA/SP 567890"
      }
    ],
    seguranca: [
      {
        title: "Sistemas de Segurança NR-12",
        description: "Implementação de sistemas de segurança para máquinas e equipamentos industriais.",
        applications: ["Prensas Industriais", "Robôs Industriais", "Linhas Automatizadas"],
        standards: ["NR-12", "ISO 13849", "IEC 62061", "ABNT NBR ISO 14119"],
        features: ["Cortinas de Luz", "Chaves de Segurança", "Relés de Segurança", "Botões de Emergência"],
        engineer: "Eng. Lucas Ferreira - CREA/SP 234567"
      }
    ],
    datacenter: [
      {
        title: "Infraestrutura de Data Center",
        description: "Projeto e implementação de infraestrutura completa para data centers de missão crítica.",
        applications: ["Data Centers Corporativos", "Cloud Providers", "Colocation"],
        standards: ["TIA-942", "ISO 27001", "ABNT NBR 5410", "NR-10"],
        features: ["Tier III/IV", "UPS Redundante", "CRAC", "Monitoramento 24/7"],
        engineer: "Eng. Rafael Almeida - CREA/SP 678901"
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
            Nossos Serviços
          </h1>
          <p className="font-lato text-lg md:text-xl max-w-3xl mx-auto">
            Soluções técnicas especializadas em automação industrial com compliance total às normas regulamentadoras e certificações internacionais.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
            <Badge variant="secondary" className="bg-gold-500 text-black font-semibold">
              <Award className="mr-2 h-4 w-4" />
              ISO 9001 Certificado
            </Badge>
            <Badge variant="secondary" className="bg-green-600 text-white font-semibold">
              <Users className="mr-2 h-4 w-4" />
              Atendimento Nacional
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="lg:sticky lg:top-8">
                <h3 className="font-playfair text-xl md:text-2xl font-bold mb-6">Categorias</h3>
                <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left p-3 md:p-4 rounded-lg font-lato font-medium transition-colors flex items-center space-x-3 ${
                        activeCategory === category.id
                          ? 'bg-wine-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <category.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="text-sm md:text-base">{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Services Content */}
            <div className="lg:w-3/4">
              <div className="space-y-8">
                {services[activeCategory as keyof typeof services]?.map((service, index) => (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-playfair text-2xl text-wine-900">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="font-lato text-lg">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Applications */}
                      <div>
                        <h4 className="font-lato font-semibold text-base md:text-lg mb-3">Aplicações</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {service.applications.map((app, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="font-lato text-sm">{app}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Standards */}
                      <div>
                        <h4 className="font-lato font-semibold text-lg mb-3">Normas e Padrões</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.standards.map((standard, idx) => (
                            <Badge key={idx} variant="outline" className="font-lato">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <h4 className="font-lato font-semibold text-base md:text-lg mb-3">Características Técnicas</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-wine-900 mt-0.5 flex-shrink-0" />
                              <span className="font-lato text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Engineer */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-wine-900" />
                          <span className="font-lato font-semibold">Engenheiro Responsável:</span>
                          <span className="font-lato">{service.engineer}</span>
                        </div>
                        <Badge className="mt-2 bg-green-600 text-white">
                          Atendimento Nacional
                        </Badge>
                      </div>

                      <Link to="/contato">
                        <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold w-full text-sm md:text-base">
                          Solicitar Orçamento para este Serviço
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
