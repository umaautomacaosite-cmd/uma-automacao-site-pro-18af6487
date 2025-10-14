import { Phone, FileSearch, Wrench, CheckCircle2 } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const HowItWorks = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const steps = [
    {
      icon: Phone,
      title: "Contato Inicial",
      description: "Entre em contato e conte-nos sobre seu projeto e necessidades."
    },
    {
      icon: FileSearch,
      title: "Análise e Proposta",
      description: "Nossos engenheiros analisam e elaboram uma proposta técnica detalhada."
    },
    {
      icon: Wrench,
      title: "Execução",
      description: "Implementação do projeto com acompanhamento técnico constante."
    },
    {
      icon: CheckCircle2,
      title: "Entrega e Suporte",
      description: "Entrega com documentação completa e suporte técnico 24/7."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="font-lato text-xl text-gray-600 max-w-2xl mx-auto">
            Processo simples e transparente do início ao fim
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative text-center transition-all duration-700 ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-wine-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-wine-200 hidden lg:block" 
                   style={{ 
                     width: index === steps.length - 1 ? '0' : 'calc(100% - 4rem)',
                     left: 'calc(50% + 2rem)'
                   }} 
              />
              <h3 className="font-lato font-semibold text-xl mb-3 text-gray-900">
                {index + 1}. {step.title}
              </h3>
              <p className="font-lato text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
