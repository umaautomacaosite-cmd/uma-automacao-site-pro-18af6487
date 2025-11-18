import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, FileText, Users, BarChart, Eye, Info, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useRecentActivities } from '@/hooks/useRecentActivities';
import AdminServices from './AdminServices';
import AdminCaseStudies from './AdminCaseStudies';
import AdminSettings from './AdminSettings';
import AdminHome from './AdminHome';
import AdminCertifications from './AdminCertifications';
import AdminTestimonials from './AdminTestimonials';
import AdminAbout from './AdminAbout';
import AdminContato from './AdminContato';

const Admin = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(localStorage.getItem('whatsappNumber') || '5511999999999');
  const { toast } = useToast();
  const { activeServices, publishedCases, activeUsers, loading: statsLoading } = useAdminStats();
  const { activities, loading: activitiesLoading } = useRecentActivities();

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
            <TabsList className="grid w-full grid-cols-10 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="home" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>HOME</span>
              </TabsTrigger>
              <TabsTrigger value="certificacoes" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Certificações</span>
              </TabsTrigger>
              <TabsTrigger value="depoimentos" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Depoimentos</span>
              </TabsTrigger>
              <TabsTrigger value="servicos" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Cases</span>
              </TabsTrigger>
              <TabsTrigger value="sobre" className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Sobre</span>
              </TabsTrigger>
              <TabsTrigger value="contato" className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Contato</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    ) : (
                      <div className="font-playfair text-2xl font-bold">{activeServices}</div>
                    )}
                    <div className="font-lato text-sm text-gray-600">Serviços Ativos</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    ) : (
                      <div className="font-playfair text-2xl font-bold">{publishedCases}</div>
                    )}
                    <div className="font-lato text-sm text-gray-600">Cases Publicados</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-wine-900 mx-auto mb-2" />
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    ) : (
                      <div className="font-playfair text-2xl font-bold">{activeUsers}</div>
                    )}
                    <div className="font-lato text-sm text-gray-600">Usuários Ativos</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Atividades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <Skeleton className="h-6 w-20" />
                        </div>
                      ))}
                    </div>
                  ) : activities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhuma atividade recente encontrada.</p>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const getActivityLabel = (type: string) => {
                          switch (type) {
                            case 'service': return 'Serviço';
                            case 'case_study': return 'Case';
                            case 'testimonial': return 'Depoimento';
                            case 'certification': return 'Certificação';
                            default: return 'Item';
                          }
                        };

                        const formatDate = (dateString: string) => {
                          const date = new Date(dateString);
                          return new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(date);
                        };

                        return (
                          <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-lato font-semibold">{getActivityLabel(activity.type)} {activity.action}</div>
                              <div className="font-lato text-sm text-gray-600">{activity.title}</div>
                              <div className="font-lato text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Atualizado</Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="home">
              <AdminHome />
            </TabsContent>

            <TabsContent value="certificacoes">
              <AdminCertifications />
            </TabsContent>

            <TabsContent value="depoimentos">
              <AdminTestimonials />
            </TabsContent>

            <TabsContent value="servicos">
              <AdminServices />
            </TabsContent>

            <TabsContent value="cases">
              <AdminCaseStudies />
            </TabsContent>

            <TabsContent value="sobre">
              <AdminAbout />
            </TabsContent>

            <TabsContent value="contato">
              <AdminContato />
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
