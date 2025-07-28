import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, FileText, Users, BarChart, Plus, Edit, Trash2, Save, Eye, Phone, X, Network, Zap, Shield, Database, Wifi, HardDrive, MonitorSpeaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [whatsappNumber, setWhatsappNumber] = useState(localStorage.getItem('whatsappNumber') || '5511999999999');
  
  // Service Management State
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('adminServices');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Fibra Óptica FTTH/FTTX",
        category: "redes",
        description: "Implantação completa de redes de fibra óptica para telecomunicações e dados corporativos.",
        applications: ["Provedores de Internet", "Condomínios Residenciais", "Complexos Empresariais", "Campus Universitários"],
        standards: ["ANSI/TIA-568", "ISO/IEC 11801", "ABNT NBR 14565", "ITU-T G.652"],
        features: ["Certificação OTDR", "Fusão de Fibras", "Teste de Atenuação", "Documentação Técnica Completa"],
        engineer: "Eng. Carlos Silva - CREA/DF 123456"
      },
      {
        id: 2,
        title: "Cabeamento Estruturado",
        category: "redes",
        description: "Sistemas de cabeamento estruturado categoria 6A/7 para redes corporativas de alta performance.",
        applications: ["Escritórios Corporativos", "Indústrias", "Hospitais", "Escolas"],
        standards: ["ANSI/TIA-568.2-D", "ISO/IEC 11801", "ABNT NBR 14565", "NR-10"],
        features: ["Cat 7/6A/6", "Certificação Fluke", "Patch Panels", "Organização de Racks"],
        engineer: "Eng. Maria Santos - CREA/DF 789012"
      }
    ];
  });
  
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'redes',
    description: '',
    applications: [''],
    standards: [''],
    features: [''],
    engineer: ''
  });

  const categories = [
    { id: 'redes', name: 'Redes e Infraestrutura', icon: Network },
    { id: 'energia', name: 'Energia e Elétrica', icon: Zap },
    { id: 'automacao', name: 'Automação Industrial', icon: Settings },
    { id: 'seguranca', name: 'Segurança Industrial', icon: Shield },
    { id: 'datacenter', name: 'Data Center', icon: Database },
  ];

  const { toast } = useToast();

  // Service Management Functions
  const saveServices = (newServices) => {
    setServices(newServices);
    localStorage.setItem('adminServices', JSON.stringify(newServices));
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      category: 'redes',
      description: '',
      applications: [''],
      standards: [''],
      features: [''],
      engineer: ''
    });
    setEditingService(null);
  };

  const startEditService = (service) => {
    setEditingService(service.id);
    setServiceForm({
      title: service.title,
      category: service.category,
      description: service.description,
      applications: [...service.applications],
      standards: [...service.standards],
      features: [...service.features],
      engineer: service.engineer
    });
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description || !serviceForm.engineer) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const serviceData = {
      ...serviceForm,
      applications: serviceForm.applications.filter(app => app.trim() !== ''),
      standards: serviceForm.standards.filter(std => std.trim() !== ''),
      features: serviceForm.features.filter(feat => feat.trim() !== '')
    };

    if (editingService) {
      const updatedServices = services.map(service =>
        service.id === editingService
          ? { ...service, ...serviceData }
          : service
      );
      saveServices(updatedServices);
      toast({
        title: "Serviço atualizado!",
        description: "As alterações foram salvas com sucesso."
      });
    } else {
      const newService = {
        id: Date.now(),
        ...serviceData
      };
      saveServices([...services, newService]);
      toast({
        title: "Serviço criado!",
        description: "O novo serviço foi adicionado com sucesso."
      });
    }

    resetServiceForm();
  };

  const deleteService = (serviceId) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    saveServices(updatedServices);
    toast({
      title: "Serviço removido!",
      description: "O serviço foi excluído com sucesso."
    });
  };

  const updateArrayField = (field, index, value) => {
    const newArray = [...serviceForm[field]];
    newArray[index] = value;
    setServiceForm({ ...serviceForm, [field]: newArray });
  };

  const addArrayField = (field) => {
    setServiceForm({
      ...serviceForm,
      [field]: [...serviceForm[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = serviceForm[field].filter((_, i) => i !== index);
    setServiceForm({ ...serviceForm, [field]: newArray });
  };

  const saveWhatsAppNumber = () => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
    toast({
      title: "Número salvo!",
      description: "O número do WhatsApp foi atualizado com sucesso."
    });
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo."
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive"
      });
    }
  };
  if (!isLoggedIn) {
    return <div className="min-h-screen">
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
                    <Input type="text" placeholder="Digite seu usuário" value={loginData.username} onChange={e => setLoginData({
                    ...loginData,
                    username: e.target.value
                  })} />
                  </div>
                  <div>
                    <label className="font-lato font-medium text-sm mb-2 block">Senha</label>
                    <Input type="password" placeholder="Digite sua senha" value={loginData.password} onChange={e => setLoginData({
                    ...loginData,
                    password: e.target.value
                  })} />
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
      </div>;
  }
  return <div className="min-h-screen">
      <Header />
      
      {/* Admin Header */}
      <section className="bg-wine-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="font-playfair text-3xl font-bold">Painel Administrativo</h1>
            <p className="font-lato">Sistema de Gestão de Conteúdo - UMA AUTOMAÇÃO</p>
          </div>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="border-white hover:bg-white text-base text-wine-900">
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
                <Button 
                  className="bg-wine-900 hover:bg-wine-800 text-white"
                  onClick={resetServiceForm}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Serviço
                </Button>
              </div>

              {/* Service Form */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">
                    {editingService ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Título do Serviço *</label>
                        <Input 
                          placeholder="Ex: Fibra Óptica FTTH/FTTX" 
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="font-lato font-medium text-sm mb-2 block">Categoria *</label>
                        <select 
                          className="w-full p-3 border border-gray-300 rounded-md font-lato"
                          value={serviceForm.category}
                          onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Descrição *</label>
                      <Textarea 
                        placeholder="Descrição detalhada do serviço..." 
                        rows={4}
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                        required
                      />
                    </div>

                    {/* Applications */}
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Aplicações</label>
                      <div className="space-y-2">
                        {serviceForm.applications.map((app, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Ex: Provedores de Internet"
                              value={app}
                              onChange={(e) => updateArrayField('applications', index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField('applications', index)}
                              disabled={serviceForm.applications.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayField('applications')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Aplicação
                        </Button>
                      </div>
                    </div>

                    {/* Standards */}
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Normas e Padrões</label>
                      <div className="space-y-2">
                        {serviceForm.standards.map((standard, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Ex: ANSI/TIA-568"
                              value={standard}
                              onChange={(e) => updateArrayField('standards', index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField('standards', index)}
                              disabled={serviceForm.standards.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayField('standards')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Norma
                        </Button>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Características Técnicas</label>
                      <div className="space-y-2">
                        {serviceForm.features.map((feature, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Ex: Certificação OTDR"
                              value={feature}
                              onChange={(e) => updateArrayField('features', index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayField('features', index)}
                              disabled={serviceForm.features.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addArrayField('features')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Característica
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="font-lato font-medium text-sm mb-2 block">Engenheiro Responsável *</label>
                      <Input 
                        placeholder="Ex: Eng. Carlos Silva - CREA/DF 123456" 
                        value={serviceForm.engineer}
                        onChange={(e) => setServiceForm({...serviceForm, engineer: e.target.value})}
                        required
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" className="bg-wine-900 hover:bg-wine-800 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        {editingService ? 'Atualizar' : 'Salvar'} Serviço
                      </Button>
                      {editingService && (
                        <Button type="button" variant="outline" onClick={resetServiceForm}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Services List */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair text-xl">Serviços Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service) => {
                      const categoryName = categories.find(cat => cat.id === service.category)?.name || 'Categoria';
                      const CategoryIcon = categories.find(cat => cat.id === service.category)?.icon || Settings;
                      
                      return (
                        <div key={service.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <CategoryIcon className="h-5 w-5 text-wine-900" />
                                <h3 className="font-lato font-semibold text-lg">{service.title}</h3>
                              </div>
                              <Badge variant="outline" className="text-xs">{categoryName}</Badge>
                              <p className="font-lato text-sm text-gray-600 mt-2">{service.description}</p>
                              <p className="font-lato text-xs text-gray-500 mt-1">
                                <strong>Engenheiro:</strong> {service.engineer}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditService(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteService(service.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {services.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-lato">Nenhum serviço cadastrado ainda.</p>
                      </div>
                    )}
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
                      <Textarea placeholder="Descrição completa do projeto e soluções implementadas..." rows={4} />
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
                      <Input placeholder="Ex: 5511999999999" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} />
                      <p className="font-lato text-xs text-gray-500 mt-1">
                        Formato: Código do país + DDD + número (apenas números)
                      </p>
                    </div>

                    <Button className="bg-wine-900 hover:bg-wine-800 text-white" onClick={saveWhatsAppNumber}>
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
    </div>;
};
export default Admin;