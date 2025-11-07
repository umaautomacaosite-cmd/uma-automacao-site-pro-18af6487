import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, X, Network, Zap, Shield, Database, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id?: string;
  title: string;
  category: string;
  description: string;
  applications: string[];
  standards: string[];
  features: string[];
  engineer: string;
  applications_icon_color: 'green' | 'red';
  features_icon_color: 'green' | 'red';
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
}

const categories = [
  { id: 'redes', name: 'Redes e Infraestrutura', icon: Network },
  { id: 'energia', name: 'Energia e Elétrica', icon: Zap },
  { id: 'automacao', name: 'Automação Industrial', icon: Settings },
  { id: 'seguranca', name: 'Segurança Industrial', icon: Shield },
  { id: 'datacenter', name: 'Data Center', icon: Database },
];

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceForm, setServiceForm] = useState<Service>({
    title: '',
    category: 'redes',
    description: '',
    applications: [''],
    standards: [''],
    features: [''],
    engineer: '',
    applications_icon_color: 'green',
    features_icon_color: 'red',
    display_order: 0,
    is_active: true,
    is_featured: false,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const formattedServices = (data || []).map(service => ({
        id: service.id,
        title: service.title,
        category: service.category,
        description: service.description,
        applications: (service.applications as unknown as string[]) || [],
        standards: (service.standards as unknown as string[]) || [],
        features: (service.features as unknown as string[]) || [],
        engineer: service.engineer,
        applications_icon_color: (service.applications_icon_color || 'green') as 'green' | 'red',
        features_icon_color: (service.features_icon_color || 'red') as 'green' | 'red',
        display_order: service.display_order,
        is_active: service.is_active,
        is_featured: service.is_featured || false,
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os serviços.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      title: '',
      category: 'redes',
      description: '',
      applications: [''],
      standards: [''],
      features: [''],
      engineer: '',
      applications_icon_color: 'green',
      features_icon_color: 'red',
      display_order: services.length,
      is_active: true,
      is_featured: false,
    });
    setEditingService(null);
  };

  const startEditService = (service: Service) => {
    setEditingService(service.id || null);
    setServiceForm({
      ...service,
      applications: [...service.applications],
      standards: [...service.standards],
      features: [...service.features],
    });
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description || !serviceForm.engineer) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Verificar limite de serviços destacados
    if (serviceForm.is_featured) {
      const { data: featuredServices } = await supabase
        .from('services')
        .select('id')
        .eq('is_featured', true)
        .eq('is_active', true);
      
      if (!editingService && featuredServices && featuredServices.length >= 4) {
        toast({
          title: 'Limite atingido',
          description: 'Máximo de 4 serviços destacados na HOME. Desative outro serviço antes.',
          variant: 'destructive',
        });
        return;
      } else if (editingService && featuredServices) {
        const otherFeatured = featuredServices.filter(s => s.id !== editingService);
        if (otherFeatured.length >= 4) {
          toast({
            title: 'Limite atingido',
            description: 'Máximo de 4 serviços destacados na HOME.',
            variant: 'destructive',
          });
          return;
        }
      }
    }

    try {
      const serviceData = {
        title: serviceForm.title,
        category: serviceForm.category,
        description: serviceForm.description,
        applications: serviceForm.applications.filter((app) => app.trim() !== ''),
        standards: serviceForm.standards.filter((std) => std.trim() !== ''),
        features: serviceForm.features.filter((feat) => feat.trim() !== ''),
        engineer: serviceForm.engineer,
        applications_icon_color: serviceForm.applications_icon_color,
        features_icon_color: serviceForm.features_icon_color,
        display_order: serviceForm.display_order,
        is_active: serviceForm.is_active,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService);

        if (error) throw error;

        toast({
          title: 'Serviço atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;

        toast({
          title: 'Serviço criado!',
          description: 'O novo serviço foi adicionado com sucesso.',
        });
      }

      resetServiceForm();
      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar o serviço.',
        variant: 'destructive',
      });
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: 'Serviço removido!',
        description: 'O serviço foi excluído com sucesso.',
      });

      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível excluir o serviço.',
        variant: 'destructive',
      });
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: 'Status atualizado!',
        description: `O serviço foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });

      fetchServices();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    }
  };

  const updateArrayField = (field: keyof Pick<Service, 'applications' | 'standards' | 'features'>, index: number, value: string) => {
    const newArray = [...serviceForm[field]];
    newArray[index] = value;
    setServiceForm({ ...serviceForm, [field]: newArray });
  };

  const addArrayField = (field: keyof Pick<Service, 'applications' | 'standards' | 'features'>) => {
    setServiceForm({
      ...serviceForm,
      [field]: [...serviceForm[field], ''],
    });
  };

  const removeArrayField = (field: keyof Pick<Service, 'applications' | 'standards' | 'features'>, index: number) => {
    const newArray = serviceForm[field].filter((_, i) => i !== index);
    setServiceForm({ ...serviceForm, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine-900"></div>
      </div>
    );
  }

  return (
    <div>
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
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="font-lato font-medium text-sm mb-2 block">Categoria *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md font-lato"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-lato font-medium text-sm mb-2 block">Cor dos Ícones das Aplicações *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md font-lato"
                  value={serviceForm.applications_icon_color}
                  onChange={(e) => setServiceForm({ ...serviceForm, applications_icon_color: e.target.value as 'green' | 'red' })}
                  required
                >
                  <option value="green">Verde</option>
                  <option value="red">Vermelho</option>
                </select>
              </div>
              <div>
                <label className="font-lato font-medium text-sm mb-2 block">Cor dos Ícones das Características *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md font-lato"
                  value={serviceForm.features_icon_color}
                  onChange={(e) => setServiceForm({ ...serviceForm, features_icon_color: e.target.value as 'green' | 'red' })}
                  required
                >
                  <option value="green">Verde</option>
                  <option value="red">Vermelho</option>
                </select>
              </div>
              <div>
                <label className="font-lato font-medium text-sm mb-2 block">Ordem de Exibição</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={serviceForm.display_order}
                  onChange={(e) => setServiceForm({ ...serviceForm, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label className="font-lato font-medium text-sm mb-2 block">Descrição *</label>
              <Textarea
                placeholder="Descrição detalhada do serviço..."
                rows={4}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="font-lato font-medium text-sm mb-2 block">Engenheiro Responsável *</label>
              <Input
                placeholder="Ex: Eng. Carlos Silva - CREA/SP 123456"
                value={serviceForm.engineer}
                onChange={(e) => setServiceForm({ ...serviceForm, engineer: e.target.value })}
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
                {serviceForm.standards.map((std, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Ex: ANSI/TIA-568"
                      value={std}
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
                {serviceForm.features.map((feat, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Ex: Certificação OTDR"
                      value={feat}
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

            <div className="flex gap-2">
              <Button type="submit" className="bg-wine-900 hover:bg-wine-800 text-white">
                {editingService ? 'Atualizar Serviço' : 'Adicionar Serviço'}
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
      <div className="space-y-4">
        <h3 className="font-playfair text-xl font-bold">Serviços Cadastrados</h3>
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-lato font-bold text-lg">{service.title}</h4>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50">
                      Aplicações: {service.applications_icon_color === 'green' ? '🟢' : '🔴'}
                    </Badge>
                    <Badge variant="outline" className="bg-red-50">
                      Características: {service.features_icon_color === 'green' ? '🟢' : '🔴'}
                    </Badge>
                  </div>
                  <p className="font-lato text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Categoria: {service.category}</span>
                    <span>•</span>
                    <span>Ordem: {service.display_order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleServiceStatus(service.id!, service.is_active)}
                  >
                    {service.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => startEditService(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteService(service.id!)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;
