import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Upload, Power, PowerOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Setting {
  key: string;
  value: string;
}

interface ClientLogo {
  id: string;
  company_name: string;
  logo_url: string;
  display_order: number;
  is_active: boolean;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLogo, setNewLogo] = useState({
    company_name: '',
    logo_url: '',
    display_order: 0
  });

  useEffect(() => {
    loadSettings();
    loadClientLogos();
  }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value');

    if (error) {
      toast.error('Erro ao carregar configurações');
      return;
    }

    const settingsObj: Record<string, string> = {};
    (data || []).forEach((item: Setting) => {
      settingsObj[item.key] = item.value || '';
    });
    setSettings(settingsObj);
    setLoading(false);
  };

  const loadClientLogos = async () => {
    const { data, error } = await supabase
      .from('client_logos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar logos');
      return;
    }

    setClientLogos(data || []);
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key);

    if (error) {
      toast.error(`Erro ao atualizar ${key}`);
      return;
    }

    toast.success('Configuração atualizada!');
  };

  const handleSaveSettings = async () => {
    for (const [key, value] of Object.entries(settings)) {
      await updateSetting(key, value);
    }
  };

  const handleAddLogo = async () => {
    if (!newLogo.company_name || !newLogo.logo_url) {
      toast.error('Preencha o nome da empresa e a URL do logo');
      return;
    }

    const { error } = await supabase
      .from('client_logos')
      .insert([newLogo]);

    if (error) {
      toast.error('Erro ao adicionar logo');
      return;
    }

    toast.success('Logo adicionado!');
    setNewLogo({ company_name: '', logo_url: '', display_order: 0 });
    loadClientLogos();
  };

  const handleDeleteLogo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este logo?')) return;

    const { error } = await supabase
      .from('client_logos')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir logo');
      return;
    }

    toast.success('Logo excluído!');
    loadClientLogos();
  };

  const handleToggleLogoActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('client_logos')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar status');
      return;
    }

    toast.success(`Logo ${!currentStatus ? 'ativado' : 'desativado'}!`);
    loadClientLogos();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações do Sistema</h2>

      {/* Contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
          <CardDescription>Configure os números de telefone e e-mails exibidos no site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Número WhatsApp</label>
            <Input
              placeholder="5561999999999"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formato: código do país + DDD + número (ex: 5561999999999)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Telefone do Cabeçalho</label>
            <Input
              placeholder="(61) 99999-9999"
              value={settings.header_phone || ''}
              onChange={(e) => setSettings({ ...settings, header_phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Telefone do Rodapé</label>
            <Input
              placeholder="(61) 99999-9999"
              value={settings.footer_phone || ''}
              onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">E-mail do Cabeçalho</label>
            <Input
              placeholder="contato@umaautomacao.com.br"
              value={settings.header_email || ''}
              onChange={(e) => setSettings({ ...settings, header_email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">E-mail do Rodapé</label>
            <Input
              placeholder="contato@umaautomacao.com.br"
              value={settings.footer_email || ''}
              onChange={(e) => setSettings({ ...settings, footer_email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociais */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>Configure os links para as redes sociais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">URL do Facebook</label>
            <Input
              placeholder="https://facebook.com/suapagina"
              value={settings.facebook_url || ''}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">URL do Instagram</label>
            <Input
              placeholder="https://instagram.com/seuperfil"
              value={settings.instagram_url || ''}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">URL do LinkedIn</label>
            <Input
              placeholder="https://linkedin.com/company/suaempresa"
              value={settings.linkedin_url || ''}
              onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Imagem Hero</CardTitle>
          <CardDescription>Configure a imagem de fundo da seção principal (recomendado: 1920x1080px)</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium block mb-2">URL da Imagem Hero</label>
            <Input
              placeholder="https://exemplo.com/hero-image.jpg"
              value={settings.hero_image_url || ''}
              onChange={(e) => setSettings({ ...settings, hero_image_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tamanho recomendado: 1920x1080px (Full HD, proporção 16:9)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Salvar Configurações */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-wine-900 hover:bg-wine-800">
          <Save className="mr-2 h-4 w-4" />
          Salvar Todas as Configurações
        </Button>
      </div>

      {/* Logos de Parceiros */}
      <Card>
        <CardHeader>
          <CardTitle>Logos de Parceiros</CardTitle>
          <CardDescription>Gerencie os logos das empresas parceiras exibidos na página inicial</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para adicionar novo logo */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Adicionar Novo Logo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Nome da Empresa</label>
                <Input
                  placeholder="Petrobras"
                  value={newLogo.company_name}
                  onChange={(e) => setNewLogo({ ...newLogo, company_name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">URL do Logo</label>
                <Input
                  placeholder="https://exemplo.com/logo.png"
                  value={newLogo.logo_url}
                  onChange={(e) => setNewLogo({ ...newLogo, logo_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho recomendado: 200x200px (quadrado)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={newLogo.display_order}
                  onChange={(e) => setNewLogo({ ...newLogo, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <Button onClick={handleAddLogo}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Logo
            </Button>
          </div>

          {/* Lista de logos */}
          <div className="space-y-4">
            <h3 className="font-semibold">Logos Cadastrados</h3>
            {clientLogos.length === 0 ? (
              <p className="text-muted-foreground">Nenhum logo cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {clientLogos.map((logo) => (
                  <Card key={logo.id} className={!logo.is_active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={logo.logo_url}
                          alt={logo.company_name}
                          className="w-16 h-16 object-contain rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Logo';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{logo.company_name}</h4>
                          <p className="text-xs text-muted-foreground">{logo.logo_url}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">Ordem: {logo.display_order}</Badge>
                            {logo.is_active ? (
                              <Badge variant="default">Ativo</Badge>
                            ) : (
                              <Badge variant="secondary">Inativo</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleLogoActive(logo.id, logo.is_active)}
                            title={logo.is_active ? 'Desativar' : 'Ativar'}
                          >
                            {logo.is_active ? (
                              <Power className="h-4 w-4 text-green-600" />
                            ) : (
                              <PowerOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteLogo(logo.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
