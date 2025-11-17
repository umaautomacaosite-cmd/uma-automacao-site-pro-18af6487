import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
const contactSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  email: z.string().trim().email('Email inválido').max(255),
  phone: z.string().trim().min(1, 'Telefone é obrigatório').max(20),
  company: z.string().trim().max(100).optional(),
  service_type: z.string().min(1, 'Selecione um tipo de serviço'),
  message: z.string().trim().min(1, 'Mensagem é obrigatória').max(2000)
});
const Contact = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [whatsappMessage, setWhatsappMessage] = useState<string>('Olá! Gostaria de falar com um especialista em automação predial.');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchContactInfo();
    fetchWhatsappData();
  }, []);
  const fetchContactInfo = async () => {
    try {
      const {
        data
      } = await supabase.from('contact_info').select('*').single();
      if (data) setContactInfo(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchWhatsappData = async () => {
    try {
      const {
        data
      } = await supabase.from('settings').select('key, value').in('key', ['whatsapp_number', 'whatsapp_default_message']);
      if (data) {
        const numberData = data.find(item => item.key === 'whatsapp_number');
        const messageData = data.find(item => item.key === 'whatsapp_default_message');
        
        if (numberData?.value) setWhatsappNumber(numberData.value);
        if (messageData?.value) setWhatsappMessage(messageData.value);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp data:', error);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      service_type: formData.get('service_type') as string,
      message: formData.get('message') as string
    };
    try {
      // Validate data
      contactSchema.parse(data);

      // Insert into database
      const {
        error
      } = await supabase.from('contact_messages').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        service_type: data.service_type,
        message: data.message
      }]);
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      toast({
        title: 'Mensagem enviada!',
        description: 'Responderemos em breve. Obrigado pelo contato!'
      });

      // Reset form
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erro de validação',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erro ao enviar',
          description: 'Não foi possível enviar a mensagem. Tente novamente.',
          variant: 'destructive'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="min-h-screen">
      <SEO 
        title="Entre em Contato - UMA AUTOMAÇÃO"
        description="Solicite uma consultoria gratuita e receba uma proposta personalizada para seu projeto de automação industrial. Atendimento nacional."
        keywords="contato, orçamento, consultoria, automação industrial, proposta técnica"
        canonical="/contato"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contato",
          "description": "Entre em contato com a UMA AUTOMAÇÃO para consultoria e orçamentos"
        }}
      />
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-wine-900 to-wine-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-playfair text-5xl font-bold mb-4">
            Entre em Contato
          </h1>
          <p className="font-lato text-xl max-w-3xl mx-auto">Solicite uma consultoria gratuita e receba uma proposta personalizada para seu projeto .</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-wine-900 mb-6">
                  Fale com Nossos Especialistas
                </h2>
                <p className="font-lato text-lg text-gray-700 mb-8">Nossa equipe de engenheiros certificados CREA está pronta para atender suas necessidades com soluções técnicas personalizadas.</p>
              </div>

              {/* Contact Cards */}
              {!loading && contactInfo && <div className="space-y-4">
                  <Card className="border-l-4 border-l-wine-900">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Phone className="h-8 w-8 text-wine-900" />
                        <div>
                          <h3 className="font-lato font-semibold text-lg">Telefone</h3>
                          <p className="font-lato text-gray-600">{contactInfo.phone}</p>
                          <p className="font-lato text-sm text-gray-500">Atendimento comercial</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-wine-900">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-8 w-8 text-wine-900" />
                        <div>
                          <h3 className="font-lato font-semibold text-lg">E-mail</h3>
                          <p className="font-lato text-gray-600">{contactInfo.email}</p>
                          <p className="font-lato text-sm text-gray-500">Responderemos sua solicitação em breve</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-wine-900">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-8 w-8 text-wine-900" />
                        <div>
                          <h3 className="font-lato font-semibold text-lg">Endereço</h3>
                          <p className="font-lato text-gray-600">{contactInfo.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-wine-900">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-8 w-8 text-wine-900" />
                        <div>
                          <h3 className="font-lato font-semibold text-lg">Horário de Atendimento</h3>
                          {contactInfo.business_hours?.map((hour: any, idx: number) => <p key={idx} className="font-lato text-gray-600">
                              {hour.day}: {hour.hours}
                            </p>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>}

              {/* WhatsApp Button */}
              {!loading && whatsappNumber && <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-lato font-semibold text-lg mb-2">Atendimento via WhatsApp</h3>
                    <p className="font-lato text-gray-600 mb-4">
                      Fale diretamente com nossos engenheiros para uma consultoria rápida
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full" onClick={() => {
                  const message = encodeURIComponent(whatsappMessage);
                  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                }}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Iniciar Conversa no WhatsApp
                    </Button>
                  </CardContent>
                </Card>}
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-wine-900">
                    Solicitar Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Nome Completo *</label>
                        <Input name="name" placeholder="Seu nome completo" required />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Empresa</label>
                        <Input name="company" placeholder="Nome da empresa" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">E-mail *</label>
                        <Input name="email" type="email" placeholder="seu@email.com" required />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Telefone *</label>
                        <Input name="phone" placeholder="(11) 99999-9999" required />
                      </div>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Tipo de Serviço *</label>
                      <select name="service_type" className="w-full p-3 border border-input rounded-md font-lato bg-background" required>
                        <option value="">Selecione o tipo de serviço</option>
                        <option value="Redes e Infraestrutura">Redes e Infraestrutura</option>
                        <option value="Energia e Elétrica">Energia e Elétrica</option>
                        <option value="Automação Industrial">Automação Industrial</option>
                        <option value="Segurança Industrial">Segurança Industrial</option>
                        <option value="Data Center">Data Center</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Descrição do Projeto *</label>
                      <Textarea name="message" placeholder="Descreva detalhadamente seu projeto, necessidades específicas, localização e prazo desejado..." rows={6} required />
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-lato font-semibold text-sm mb-2">Informações Importantes:</h4>
                      <ul className="font-lato text-xs text-muted-foreground space-y-1">
                        <li>• Todos os projetos são assinados por engenheiros CREA</li>
                        <li>• Compliance total com normas NR-10, NR-12 e ABNT</li>
                        <li>• Atendimento em todo o território nacional</li>
                        <li>• Orçamento gratuito e sem compromisso</li>
                      </ul>
                    </div>

                    <Button type="submit" disabled={submitting} className="bg-wine-900 hover:bg-wine-800 text-white w-full font-lato font-semibold py-3">
                      {submitting ? 'Enviando...' : <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Solicitação de Orçamento
                        </>}
                    </Button>

                    <p className="font-lato text-xs text-muted-foreground text-center">Responderemos sua solicitação em breve</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-center text-wine-900 mb-8">
            Nossa Localização
          </h2>
          {!loading && contactInfo?.map_embed_url ? <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <iframe src={contactInfo.map_embed_url} width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div> : <div className="bg-muted h-96 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-wine-900 mx-auto mb-4" />
                <p className="font-lato text-lg">Mapa será exibido aqui</p>
                <p className="font-lato text-sm text-muted-foreground">Configure no painel admin</p>
              </div>
            </div>}
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;