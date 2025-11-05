import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Upload, Power, PowerOff, Building2, Store, Factory, Briefcase, Users, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  icon_fallback?: string;
  website_url?: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLogo, setNewLogo] = useState({
    company_name: '',
    logo_url: '',
    display_order: 0,
    icon_fallback: 'Building2',
    website_url: ''
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

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

  const handleHeroImageUpload = async () => {
    if (!heroImageFile) {
      toast.error('Selecione uma imagem');
      return;
    }

    setUploadingHero(true);
    const fileExt = heroImageFile.name.split('.').pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('case-study-images')
      .upload(fileName, heroImageFile);

    if (uploadError) {
      toast.error('Erro ao fazer upload da imagem');
      setUploadingHero(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('case-study-images')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('settings')
      .update({ value: publicUrl })
      .eq('key', 'hero_image_url');

    if (updateError) {
      toast.error('Erro ao salvar URL da imagem');
      setUploadingHero(false);
      return;
    }

    setSettings({ ...settings, hero_image_url: publicUrl });
    setHeroImageFile(null);
    setUploadingHero(false);
    toast.success('Imagem hero atualizada!');
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error('Selecione uma imagem');
      return;
    }

    setUploadingLogo(true);
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('case-study-images')
      .upload(fileName, logoFile);

    if (uploadError) {
      toast.error('Erro ao fazer upload da imagem');
      setUploadingLogo(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('case-study-images')
      .getPublicUrl(fileName);

    setNewLogo({ ...newLogo, logo_url: publicUrl });
    setLogoFile(null);
    setUploadingLogo(false);
    toast.success('Imagem carregada!');
  };

  const handleSaveSettings = async () => {
    let hasError = false;
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', key);
      
      if (error) {
        hasError = true;
        break;
      }
    }
    
    if (hasError) {
      toast.error('Erro ao atualizar configurações');
    } else {
      toast.success('Configurações atualizadas com sucesso!');
    }
  };

  const handleAddLogo = async () => {
    if (!newLogo.company_name) {
      toast.error('Preencha o nome da empresa');
      return;
    }

    const { error } = await supabase
      .from('client_logos')
      .insert([{
        company_name: newLogo.company_name,
        logo_url: newLogo.logo_url || '',
        display_order: newLogo.display_order,
        icon_fallback: newLogo.icon_fallback,
        website_url: newLogo.website_url || null
      }]);

    if (error) {
      toast.error('Erro ao adicionar logo');
      return;
    }

    toast.success('Logo adicionado!');
    setNewLogo({ company_name: '', logo_url: '', display_order: 0, icon_fallback: 'Building2', website_url: '' });
    setLogoFile(null);
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
          <CardDescription>Upload da imagem de fundo da seção principal (recomendado: 1920x1080px)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Upload da Imagem Hero</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tamanho recomendado: 1920x1080px (Full HD, proporção 16:9)
            </p>
          </div>
          {heroImageFile && (
            <Button onClick={handleHeroImageUpload} disabled={uploadingHero}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadingHero ? 'Enviando...' : 'Fazer Upload'}
            </Button>
          )}
          {settings.hero_image_url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Imagem Atual:</p>
              <img src={settings.hero_image_url} alt="Hero atual" className="w-full max-w-md rounded-lg" />
            </div>
          )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Nome da Empresa</label>
                <Input
                  placeholder="Petrobras"
                  value={newLogo.company_name}
                  onChange={(e) => setNewLogo({ ...newLogo, company_name: e.target.value })}
                />
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
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Upload do Logo (opcional)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho recomendado: 200x200px (quadrado). Se não enviar, será usado um ícone.
                </p>
              </div>
              
              {logoFile && (
                <Button onClick={handleLogoUpload} disabled={uploadingLogo} size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingLogo ? 'Enviando...' : 'Fazer Upload'}
                </Button>
              )}
              
              {!newLogo.logo_url && (
                <div>
                  <label className="text-sm font-medium block mb-2">Ícone Alternativo (se não houver logo)</label>
                  <Select
                    value={newLogo.icon_fallback}
                    onValueChange={(value) => setNewLogo({ ...newLogo, icon_fallback: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Building2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Prédio</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Store">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          <span>Loja</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Factory">
                        <div className="flex items-center gap-2">
                          <Factory className="h-4 w-4" />
                          <span>Fábrica</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Briefcase">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>Negócios</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Users">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>Equipe</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Globe">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>Global</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium block mb-2">URL do Website (opcional)</label>
                <Input
                  placeholder="https://www.empresa.com.br"
                  value={newLogo.website_url}
                  onChange={(e) => setNewLogo({ ...newLogo, website_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Se preenchido, ao clicar no logo o usuário será redirecionado para este site
                </p>
              </div>
            </div>
            
            <Button onClick={handleAddLogo}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Parceiro
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
                        {logo.logo_url ? (
                          <img
                            src={logo.logo_url}
                            alt={logo.company_name}
                            className="w-16 h-16 object-contain rounded border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Logo';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center rounded border">
                            <Building2 className="h-8 w-8 text-gold-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{logo.company_name}</h4>
                          {logo.website_url && (
                            <a 
                              href={logo.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-wine-700 hover:underline"
                            >
                              {logo.website_url}
                            </a>
                          )}
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
