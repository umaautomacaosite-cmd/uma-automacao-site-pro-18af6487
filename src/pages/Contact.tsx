import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
const Contact = () => {
  return <div className="min-h-screen">
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
              <div className="space-y-4">
                <Card className="border-l-4 border-l-wine-900">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Phone className="h-8 w-8 text-wine-900" />
                      <div>
                        <h3 className="font-lato font-semibold text-lg">Telefone</h3>
                        <p className="font-lato text-gray-600">(61) 99999-9999</p>
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
                        <p className="font-lato text-gray-600">contato@umaautomacao.com.br</p>
                        <p className="font-lato text-sm text-gray-500">Resposta em até 2 horas</p>
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
                        <p className="font-lato text-gray-600">Av. Paulista, 1000 - Sala 1501</p>
                        <p className="font-lato text-gray-600">Brasília, DF - CEP: 01310-100</p>
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
                        <p className="font-lato text-gray-600">Segunda a Sexta: 7h às 17h</p>
                        <p className="font-lato text-gray-600">Sábado: 8h às 12h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp Button */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-lato font-semibold text-lg mb-2">Atendimento via WhatsApp</h3>
                  <p className="font-lato text-gray-600 mb-4">
                    Fale diretamente com nossos engenheiros para uma consultoria rápida
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white w-full" onClick={() => {
                  const whatsappNumber = localStorage.getItem('whatsappNumber') || '5511999999999';
                  const message = encodeURIComponent('Olá! Gostaria de falar com um especialista em automação industrial.');
                  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                }}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Iniciar Conversa no WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-wine-900">
                    Solicitar Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Nome Completo</label>
                      <Input placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Empresa</label>
                      <Input placeholder="Nome da empresa" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">E-mail</label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Telefone</label>
                      <Input placeholder="(11) 99999-9999" />
                    </div>
                  </div>

                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Tipo de Serviço</label>
                    <select className="w-full p-3 border border-gray-300 rounded-md font-lato">
                      <option>Selecione o tipo de serviço</option>
                      <option>Redes e Infraestrutura</option>
                      <option>Energia e Elétrica</option>
                      <option>Automação Industrial</option>
                      <option>Segurança Industrial</option>
                      <option>Data Center</option>
                      <option>Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Descrição do Projeto</label>
                    <Textarea placeholder="Descreva detalhadamente seu projeto, necessidades específicas, localização e prazo desejado..." rows={6} />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-lato font-semibold text-sm mb-2">Informações Importantes:</h4>
                    <ul className="font-lato text-xs text-gray-600 space-y-1">
                      <li>• Todos os projetos são assinados por engenheiros CREA</li>
                      <li>• Compliance total com normas NR-10, NR-12 e ISO 9001</li>
                      <li>• Atendimento em todo o território nacional</li>
                      <li>• Orçamento gratuito e sem compromisso</li>
                    </ul>
                  </div>

                  <Button className="bg-wine-900 hover:bg-wine-800 text-white w-full font-lato font-semibold py-3">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Solicitação de Orçamento
                  </Button>

                  <p className="font-lato text-xs text-gray-500 text-center">
                    Responderemos sua solicitação em até 2 horas úteis
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-center text-wine-900 mb-8">
            Nossa Localização
          </h2>
          <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-wine-900 mx-auto mb-4" />
              <p className="font-lato text-lg text-gray-700">Mapa Interativo</p>
              <p className="font-lato text-sm text-gray-600">Av. Paulista, 1000 - Brasília, DF</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;