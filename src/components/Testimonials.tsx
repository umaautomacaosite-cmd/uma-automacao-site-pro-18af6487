import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "João Silva",
      company: "Indústria Metalúrgica XYZ",
      text: "Excelente trabalho na automação da nossa linha de produção. Aumento de 40% na eficiência.",
      rating: 5
    },
    {
      name: "Maria Santos",
      company: "Tech Solutions Ltd",
      text: "Profissionalismo impecável na instalação do nosso data center. Entrega no prazo e com qualidade.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      company: "Grupo Industrial ABC",
      text: "Suporte técnico excepcional. Sempre disponíveis e resolvem problemas rapidamente.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="font-lato text-xl text-gray-600">
            Confiança construída através de resultados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="font-lato text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-lato font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="font-lato text-sm text-gray-600">{testimonial.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
