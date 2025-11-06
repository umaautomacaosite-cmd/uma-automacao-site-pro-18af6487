import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

const AdminHome = () => {
  const [loading, setLoading] = useState(false);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['hero_title', 'hero_subtitle', 'hero_description', 'hero_image_url']);

      if (data) {
        data.forEach(setting => {
          switch (setting.key) {
            case 'hero_title':
              setHeroTitle(setting.value || '');
              break;
            case 'hero_subtitle':
              setHeroSubtitle(setting.value || '');
              break;
            case 'hero_description':
              setHeroDescription(setting.value || '');
              break;
            case 'hero_image_url':
              setHeroImageUrl(setting.value || '');
              break;
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return heroImageUrl;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('case-study-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('case-study-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem.",
        variant: "destructive"
      });
      return heroImageUrl;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const uploadedImageUrl = await handleImageUpload();

      const updates = [
        { key: 'hero_title', value: heroTitle },
        { key: 'hero_subtitle', value: heroSubtitle },
        { key: 'hero_description', value: heroDescription },
        { key: 'hero_image_url', value: uploadedImageUrl }
      ];

      for (const update of updates) {
        await supabase
          .from('settings')
          .upsert(update, { onConflict: 'key' });
      }

      toast({
        title: "Configurações salvas!",
        description: "As configurações da HOME foram atualizadas com sucesso."
      });

      setImageFile(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !heroTitle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações da HOME</h1>
        <p className="text-muted-foreground">
          Gerencie o conteúdo exibido na página principal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seção Hero (Topo da Página)</CardTitle>
          <CardDescription>
            Configure o título, subtítulo e descrição exibidos no topo da página HOME
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Título Principal</Label>
            <Input
              id="hero-title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Ex: Soluções em Automação Industrial"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtitle">Subtítulo</Label>
            <Textarea
              id="hero-subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Breve descrição dos serviços"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="hero-description">Descrição</Label>
            <Textarea
              id="hero-description"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="Texto adicional sobre a empresa"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hero-image">Imagem de Fundo</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  id="hero-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {heroImageUrl && !imageFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Imagem atual configurada
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
