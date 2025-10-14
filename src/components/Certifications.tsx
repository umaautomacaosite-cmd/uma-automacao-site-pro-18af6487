import { Shield, Award, CheckCircle2, FileCheck } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Certifications = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  const certifications = [
    {
      icon: Shield,
      title: "CREA/DF",
      subtitle: "Registro: 123456",
      color: "text-wine-900"
    },
    {
      icon: Award,
      title: "ISO 9001",
      subtitle: "Certificado",
      color: "text-gold-500"
    },
    {
      icon: CheckCircle2,
      title: "NR-10 | NR-12",
      subtitle: "Compliance Total",
      color: "text-green-600"
    },
    {
      icon: FileCheck,
      title: "ABNT NBR 5410",
      subtitle: "Certificado",
      color: "text-blue-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-wine-900 to-wine-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-white mb-2">
            Certificações e Compliance
          </h2>
          <p className="font-lato text-gray-200">
            Excelência técnica reconhecida e certificada
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div 
              key={index}
              className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 ${
                isIntersecting 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <cert.icon className={`h-12 w-12 ${cert.color} mx-auto mb-4`} />
              <h3 className="font-lato font-bold text-white text-lg mb-1">{cert.title}</h3>
              <p className="font-lato text-sm text-gray-300">{cert.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
