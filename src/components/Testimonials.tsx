import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  testimonial: string;
  rating: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadTestimonials();
    loadVisibility();
  }, []);

  const loadVisibility = async () => {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'testimonials_section_visible')
      .maybeSingle();
    
    if (data?.value) {
      setIsVisible(data.value === 'true');
    }
  };

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (data) {
      setTestimonials(data);
    }
  };

  if (!isVisible || testimonials.length === 0) {
    return null;
  }

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
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="font-lato text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
                <div className="border-t pt-4">
                  <p className="font-lato font-semibold text-gray-900">{testimonial.client_name}</p>
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
