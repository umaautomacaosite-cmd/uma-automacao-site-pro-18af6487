import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const FeaturedCases = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const cases = [
    {
      title: "Automação Completa - Indústria Automotiva",
      description: "Implementação de linha automatizada com aumento de 45% na produtividade.",
      results: ["45% ↑ Produtividade", "30% ↓ Custos", "Zero acidentes"],
      category: "Automação"
    },
    {
      title: "Data Center Tier III - Multinacional",
      description: "Construção de infraestrutura de data center com 99.99% de uptime.",
      results: ["99.99% Uptime", "500 Racks", "Certificação Tier III"],
      category: "Infraestrutura"
    },
    {
      title: "Retrofit Elétrico - Planta Industrial",
      description: "Modernização completa do sistema elétrico com compliance NR-10.",
      results: ["100% Compliance", "40% ↓ Energia", "Certificação CREA"],
      category: "Elétrica"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Cases de Sucesso em Destaque
          </h2>
          <p className="font-lato text-xl text-gray-600 max-w-3xl mx-auto">
            Projetos que transformaram a operação de grandes empresas
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cases.map((caseItem, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-t-4 border-wine-900 ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-wine-900">{caseItem.category}</Badge>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="font-lato text-xl">{caseItem.title}</CardTitle>
                <CardDescription className="font-lato">{caseItem.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseItem.results.map((result, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-sm font-lato font-semibold text-gray-700">{result}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/cases">
            <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-semibold px-8 py-3 text-lg group">
              Ver Todos os Cases
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCases;
