
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  FileText, 
  Users, 
  BarChart,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [whatsappNumber, setWhatsappNumber] = useState(
    localStorage.getItem('whatsappNumber') || '5511999999999'
  );
  const { toast } = useToast();

  const saveWhatsAppNumber = () => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
    toast({
      title: "Número salvo!",
      description: "O número do WhatsApp foi atualizado com sucesso.",
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <Header />
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-2xl text-wine-900">
                  Painel Administrativo
                </CardTitle>
                <CardDescription>
                  Faça login para acessar o sistema de gestão de conteúdo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Usuário</label>
                    <Input 
                      type="text"
                      placeholder="Digite seu usuário"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Senha</label>
                    <Input 
                      type="password"
                      placeholder="Digite sua senha"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="bg-wine-900 hover:bg-wine-800 text-white w-full">
                    Fazer Login
                  </Button>
                </form>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-lato font-semibold text-sm mb-2">Credenciais de Teste:</h4>
                  <p className="font-lato text-xs text-gray-600">Usuário: admin</p>
                  <p className="font-lato text-xs text-gray-600">Senha: admin123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

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
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-wine-900"
            onClick={() => setIsLoggedIn(false)}
          >
            Sair
          </Button>
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-2xl font-bold">Gestão de Serviços</h2>
                <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Serviço
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Título do Serviço</label>
                        <Input placeholder="Ex: Fibra Óptica FTTH/FTTX" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Categoria</label>
                        <select className="w-full p-3 border border-gray-300 rounded-md font-lato">
                          <option>Redes e Infraestrutura</option>
                          <option>Energia e Elétrica</option>
                          <option>Automação Industrial</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Descrição</label>
                      <Textarea 
                        placeholder="Descrição detalhada do serviço..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Normas Aplicáveis</label>
                        <Input placeholder="Ex: ANSI/TIA-568, ISO/IEC 11801" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Engenheiro Responsável</label>
                        <Input placeholder="Ex: Eng. Carlos Silva - CREA/SP 123456" />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar
                      </Button>
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-2xl font-bold">Gestão de Cases</h2>
                <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Case
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Nome do Cliente</label>
                        <Input placeholder="Ex: Hospital Regional São Paulo" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Setor</label>
                        <Input placeholder="Ex: Saúde" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Ano</label>
                        <Input placeholder="Ex: 2023" />
                      </div>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Solução Aplicada</label>
                      <Input placeholder="Ex: Infraestrutura completa de Data Center" />
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Descrição Detalhada</label>
                      <Textarea 
                        placeholder="Descrição completa do projeto e soluções implementadas..."
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Case
                      </Button>
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usuarios">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-2xl font-bold">Gestão de Usuários</h2>
                <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Nome Completo</label>
                        <Input placeholder="Nome do usuário" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">E-mail</label>
                        <Input type="email" placeholder="usuario@umaautomacao.com.br" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Usuário</label>
                        <Input placeholder="Nome de usuário" />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Nível de Acesso</label>
                        <select className="w-full p-3 border border-gray-300 rounded-md font-lato">
                          <option>Administrador</option>
                          <option>Editor</option>
                          <option>Visualizador</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button className="bg-wine-900 hover:bg-wine-800 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Criar Usuário
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes">
              <div className="mb-6">
                <h2 className="font-playfair text-2xl font-bold">Configurações Gerais</h2>
                <p className="font-lato text-gray-600">Gerencie as configurações do sistema</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </CardTitle>
                  <CardDescription>
                    Configure o número do WhatsApp para redirecionamento dos usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">
                        Número do WhatsApp (com código do país)
                      </label>
                      <Input 
                        placeholder="Ex: 5511999999999"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                      />
                      <p className="font-lato text-xs text-gray-500 mt-1">
                        Formato: Código do país + DDD + número (apenas números)
                      </p>
                    </div>

                    <Button 
                      className="bg-wine-900 hover:bg-wine-800 text-white"
                      onClick={saveWhatsAppNumber}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Número
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
