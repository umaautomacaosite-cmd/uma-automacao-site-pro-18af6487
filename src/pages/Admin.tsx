import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, FileText, Users, BarChart, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminServices from './AdminServices';
import AdminCaseStudies from './AdminCaseStudies';
import AdminSettings from './AdminSettings';

const Admin = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(localStorage.getItem('whatsappNumber') || '5511999999999');
  const { toast } = useToast();

  const saveWhatsAppNumber = () => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
    toast({
      title: "Número salvo!",
      description: "O número do WhatsApp foi atualizado com sucesso."
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-wine-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="font-playfair text-3xl font-bold">Painel Administrativo</h1>
            <p className="font-lato">Sistema de Gestão de Conteúdo - UMA AUTOMAÇÃO</p>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="servicos" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Cases</span>
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Config</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    <div className="font-playfair text-2xl font-bold">12</div>
                    <div className="font-lato text-sm text-gray-600">Serviços Ativos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    <div className="font-playfair text-2xl font-bold">4</div>
                    <div className="font-lato text-sm text-gray-600">Cases Publicados</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    <div className="font-playfair text-2xl font-bold">3</div>
                    <div className="font-lato text-sm text-gray-600">Usuários Ativos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    <div className="font-playfair text-2xl font-bold">1.2k</div>
                    <div className="font-lato text-sm text-gray-600">Visualizações</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-lato font-semibold">Novo case adicionado</div>
                        <div className="font-lato text-sm text-gray-600">Hospital Regional São Paulo</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Novo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-lato font-semibold">Serviço atualizado</div>
                        <div className="font-lato text-sm text-gray-600">Fibra Óptica FTTH/FTTX</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Atualizado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="servicos">
              <AdminServices />
            </TabsContent>

            <TabsContent value="cases">
              <AdminCaseStudies />
            </TabsContent>

            <TabsContent value="usuarios">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Gestão de Usuários</CardTitle>
                  <CardDescription>Em desenvolvimento</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Admin;
