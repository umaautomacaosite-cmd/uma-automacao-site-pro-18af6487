import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ICON_OPTIONS = [
  'Target', 'Users', 'CheckCircle', 'Heart', 'Award', 'Zap', 'Shield', 
  'Star', 'TrendingUp', 'Lightbulb', 'Building', 'Cog'
];

interface AboutContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  image_url?: string | null;
  history_p2?: string | null;
  history_p3?: string | null;
  history_p4?: string | null;
  history_p5?: string | null;
}

interface AboutValue {
  id: string;
  icon: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

interface AboutTimeline {
  id: string;
  year: string;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

interface AboutStat {
  id: string;
  value: string;
  label: string;
  display_order: number;
  is_active: boolean;
}

const AdminAbout = () => {
  const [contents, setContents] = useState<AboutContent[]>([]);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [timeline, setTimeline] = useState<AboutTimeline[]>([]);
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<string | null>(null);
  const [editingStat, setEditingStat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchContents(),
      fetchValues(),
      fetchTimeline(),
      fetchStats()
    ]);
    setLoading(false);
  };

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .order('display_order');
    if (error) {
      toast.error('Erro ao carregar conteúdos');
    } else {
      setContents(data || []);
    }
  };

  const fetchValues = async () => {
    const { data, error } = await supabase
      .from('about_values')
      .select('*')
      .order('display_order');
    if (error) {
      toast.error('Erro ao carregar valores');
    } else {
      setValues(data || []);
    }
  };

  const fetchTimeline = async () => {
    const { data, error } = await supabase
      .from('about_timeline')
      .select('*')
      .order('display_order');
    if (error) {
      toast.error('Erro ao carregar trajetória');
    } else {
      setTimeline(data || []);
    }
  };

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('about_stats')
      .select('*')
      .order('display_order');
    if (error) {
      toast.error('Erro ao carregar estatísticas');
    } else {
      setStats(data || []);
    }
  };

  const updateContent = async (id: string, updates: Partial<AboutContent>) => {
    // Handle image upload if there's a new image
    if (imageFile) {
      setUploadingImage(true);
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `about-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('case-study-images')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('case-study-images')
          .getPublicUrl(fileName);
        
        updates.image_url = publicUrl;
        setImageFile(null);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Erro ao fazer upload da imagem');
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    // Handle history paragraphs
    const content = contents.find(c => c.id === id);
    if (content?.section_key === 'history') {
      const historyUpdates: any = { ...updates };
      if ((content as any).history_p2 !== undefined) historyUpdates.history_p2 = (content as any).history_p2;
      if ((content as any).history_p3 !== undefined) historyUpdates.history_p3 = (content as any).history_p3;
      if ((content as any).history_p4 !== undefined) historyUpdates.history_p4 = (content as any).history_p4;
      if ((content as any).history_p5 !== undefined) historyUpdates.history_p5 = (content as any).history_p5;
      updates = historyUpdates;
    }

    const { error } = await supabase
      .from('about_content')
      .update(updates)
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar conteúdo');
    } else {
      toast.success('Conteúdo atualizado com sucesso');
      fetchContents();
      setEditingContent(null);
    }
  };

  const updateValue = async (id: string, updates: Partial<AboutValue>) => {
    const { error } = await supabase
      .from('about_values')
      .update(updates)
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar valor');
    } else {
      toast.success('Valor atualizado com sucesso');
      fetchValues();
      setEditingValue(null);
    }
  };

  const addValue = async () => {
    const { error } = await supabase
      .from('about_values')
      .insert([{
        icon: 'Target',
        title: 'Novo Valor',
        description: 'Descrição do valor',
        display_order: values.length
      }]);
    if (error) {
      toast.error('Erro ao adicionar valor');
    } else {
      toast.success('Valor adicionado com sucesso');
      fetchValues();
    }
  };

  const deleteValue = async (id: string) => {
    const { error } = await supabase
      .from('about_values')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Erro ao excluir valor');
    } else {
      toast.success('Valor excluído com sucesso');
      fetchValues();
    }
  };

  const updateTimeline = async (id: string, updates: Partial<AboutTimeline>) => {
    const { error } = await supabase
      .from('about_timeline')
      .update(updates)
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar evento');
    } else {
      toast.success('Evento atualizado com sucesso');
      fetchTimeline();
      setEditingTimeline(null);
    }
  };

  const addTimeline = async () => {
    const { error } = await supabase
      .from('about_timeline')
      .insert([{
        year: new Date().getFullYear().toString(),
        title: 'Novo Evento',
        description: 'Descrição do evento',
        display_order: timeline.length
      }]);
    if (error) {
      toast.error('Erro ao adicionar evento');
    } else {
      toast.success('Evento adicionado com sucesso');
      fetchTimeline();
    }
  };

  const deleteTimeline = async (id: string) => {
    const { error } = await supabase
      .from('about_timeline')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Erro ao excluir evento');
    } else {
      toast.success('Evento excluído com sucesso');
      fetchTimeline();
    }
  };

  const updateStat = async (id: string, updates: Partial<AboutStat>) => {
    const { error } = await supabase
      .from('about_stats')
      .update(updates)
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar estatística');
    } else {
      toast.success('Estatística atualizada com sucesso');
      fetchStats();
      setEditingStat(null);
    }
  };

  const moveItem = async (
    table: 'about_values' | 'about_timeline' | 'about_stats',
    items: any[],
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    const updates = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx
    }));

    for (const update of updates) {
      await supabase
        .from(table)
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    if (table === 'about_values') fetchValues();
    else if (table === 'about_timeline') fetchTimeline();
    else fetchStats();
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Conteúdo Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo da Página Sobre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Image Section */}
          {contents.find(c => c.section_key === 'brand_image') && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-semibold text-lg mb-4">Imagem da Marca</h3>
              {editingContent === contents.find(c => c.section_key === 'brand_image')?.id ? (
                <div className="space-y-3">
                  <div>
                    <Label>Upload da Imagem da Marca</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Esta imagem aparecerá na página Sobre
                    </p>
                  </div>
                  {(contents.find(c => c.section_key === 'brand_image')?.image_url || imageFile) && (
                    <div className="mt-2">
                      <Label>Preview:</Label>
                      {imageFile ? (
                        <img 
                          src={URL.createObjectURL(imageFile)} 
                          alt="Preview" 
                          className="w-48 h-48 object-contain border rounded mt-2" 
                        />
                      ) : (
                        <img 
                          src={contents.find(c => c.section_key === 'brand_image')?.image_url || ''} 
                          alt="Marca" 
                          className="w-48 h-48 object-contain border rounded mt-2" 
                        />
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateContent(contents.find(c => c.section_key === 'brand_image')!.id, {})
                      }
                      size="sm"
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                      Salvar Imagem
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingContent(null);
                        setImageFile(null);
                        fetchContents();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      Imagem que aparece na página Sobre
                    </p>
                    <Button
                      onClick={() => setEditingContent(contents.find(c => c.section_key === 'brand_image')?.id || null)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  {contents.find(c => c.section_key === 'brand_image')?.image_url && (
                    <img 
                      src={contents.find(c => c.section_key === 'brand_image')?.image_url || ''} 
                      alt="Marca" 
                      className="w-48 h-48 object-contain border rounded" 
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Other Content Sections */}
          {contents.filter(c => c.section_key !== 'brand_image' && c.section_key !== 'history').map((content) => (
            <div key={content.id} className="border rounded-lg p-4">
              {editingContent === content.id ? (
                <div className="space-y-3">
                  <Input
                    value={content.title}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.id === content.id ? { ...c, title: e.target.value } : c
                        )
                      )
                    }
                    placeholder="Título"
                  />
                  <Textarea
                    value={content.content}
                    onChange={(e) =>
                      setContents(
                        contents.map((c) =>
                          c.id === content.id ? { ...c, content: e.target.value } : c
                        )
                      )
                    }
                    placeholder="Conteúdo"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateContent(content.id, {
                          title: content.title,
                          content: content.content,
                        })
                      }
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingContent(null);
                        fetchContents();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{content.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Chave: {content.section_key}
                      </p>
                    </div>
                    <Button
                      onClick={() => setEditingContent(content.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{content.content}</p>
                </div>
              )}
            </div>
          ))}

          {/* History Section with 5 Paragraphs */}
          {contents.find(c => c.section_key === 'history') && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-lg mb-4">Seção História</h3>
              {editingContent === contents.find(c => c.section_key === 'history')?.id ? (
                <div className="space-y-3">
                  <div>
                    <Label>Título da Seção</Label>
                    <Input
                      value={contents.find(c => c.section_key === 'history')?.title || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, title: e.target.value } : c
                          )
                        )
                      }
                      placeholder="Título (ex: Nossa História)"
                    />
                  </div>
                  <div>
                    <Label>História - Parágrafo 1</Label>
                    <Textarea
                      value={contents.find(c => c.section_key === 'history')?.content || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, content: e.target.value } : c
                          )
                        )
                      }
                      placeholder="Primeiro parágrafo da história"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>História - Parágrafo 2</Label>
                    <Textarea
                      value={(contents.find(c => c.section_key === 'history') as any)?.history_p2 || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, history_p2: e.target.value } as any : c
                          )
                        )
                      }
                      placeholder="Segundo parágrafo da história"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>História - Parágrafo 3</Label>
                    <Textarea
                      value={(contents.find(c => c.section_key === 'history') as any)?.history_p3 || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, history_p3: e.target.value } as any : c
                          )
                        )
                      }
                      placeholder="Terceiro parágrafo da história"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>História - Parágrafo 4</Label>
                    <Textarea
                      value={(contents.find(c => c.section_key === 'history') as any)?.history_p4 || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, history_p4: e.target.value } as any : c
                          )
                        )
                      }
                      placeholder="Quarto parágrafo da história"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>História - Parágrafo 5</Label>
                    <Textarea
                      value={(contents.find(c => c.section_key === 'history') as any)?.history_p5 || ''}
                      onChange={(e) =>
                        setContents(
                          contents.map((c) =>
                            c.section_key === 'history' ? { ...c, history_p5: e.target.value } as any : c
                          )
                        )
                      }
                      placeholder="Quinto parágrafo da história"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const historyContent = contents.find(c => c.section_key === 'history');
                        if (historyContent) {
                          updateContent(historyContent.id, {
                            title: historyContent.title,
                            content: historyContent.content,
                            ...(historyContent as any).history_p2 && { history_p2: (historyContent as any).history_p2 },
                            ...(historyContent as any).history_p3 && { history_p3: (historyContent as any).history_p3 },
                            ...(historyContent as any).history_p4 && { history_p4: (historyContent as any).history_p4 },
                            ...(historyContent as any).history_p5 && { history_p5: (historyContent as any).history_p5 },
                          });
                        }
                      }}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar História
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingContent(null);
                        fetchContents();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{contents.find(c => c.section_key === 'history')?.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">5 parágrafos da história</p>
                      <div className="space-y-2 text-sm">
                        <p><strong>P1:</strong> {contents.find(c => c.section_key === 'history')?.content?.substring(0, 100)}...</p>
                        <p><strong>P2:</strong> {((contents.find(c => c.section_key === 'history') as any)?.history_p2 || '')?.substring(0, 100)}...</p>
                        <p><strong>P3:</strong> {((contents.find(c => c.section_key === 'history') as any)?.history_p3 || '')?.substring(0, 100)}...</p>
                        <p><strong>P4:</strong> {((contents.find(c => c.section_key === 'history') as any)?.history_p4 || '')?.substring(0, 100)}...</p>
                        <p><strong>P5:</strong> {((contents.find(c => c.section_key === 'history') as any)?.history_p5 || '')?.substring(0, 100)}...</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setEditingContent(contents.find(c => c.section_key === 'history')?.id || null)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.id} className="border rounded-lg p-4">
              {editingStat === stat.id ? (
                <div className="space-y-3">
                  <Input
                    value={stat.value}
                    onChange={(e) =>
                      setStats(
                        stats.map((s) =>
                          s.id === stat.id ? { ...s, value: e.target.value } : s
                        )
                      )
                    }
                    placeholder="Valor (ex: 1500+)"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) =>
                      setStats(
                        stats.map((s) =>
                          s.id === stat.id ? { ...s, label: e.target.value } : s
                        )
                      )
                    }
                    placeholder="Label"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateStat(stat.id, {
                          value: stat.value,
                          label: stat.label,
                        })
                      }
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingStat(null);
                        fetchStats();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <Button
                    onClick={() => setEditingStat(stat.id)}
                    variant="ghost"
                    size="sm"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Valores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Valores da Empresa</CardTitle>
          <Button onClick={addValue} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Valor
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {values.map((value, index) => (
            <div key={value.id} className="border rounded-lg p-4">
              {editingValue === value.id ? (
                <div className="space-y-3">
                  <Select
                    value={value.icon}
                    onValueChange={(val) =>
                      setValues(
                        values.map((v) =>
                          v.id === value.id ? { ...v, icon: val } : v
                        )
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={value.title}
                    onChange={(e) =>
                      setValues(
                        values.map((v) =>
                          v.id === value.id ? { ...v, title: e.target.value } : v
                        )
                      )
                    }
                    placeholder="Título"
                  />
                  <Textarea
                    value={value.description}
                    onChange={(e) =>
                      setValues(
                        values.map((v) =>
                          v.id === value.id ? { ...v, description: e.target.value } : v
                        )
                      )
                    }
                    placeholder="Descrição"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateValue(value.id, {
                          icon: value.icon,
                          title: value.title,
                          description: value.description,
                        })
                      }
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingValue(null);
                        fetchValues();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      Ícone: {value.icon}
                    </p>
                    <h4 className="font-semibold">{value.title}</h4>
                    <p className="text-sm">{value.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => moveItem('about_values', values, index, 'up')}
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => moveItem('about_values', values, index, 'down')}
                      variant="ghost"
                      size="sm"
                      disabled={index === values.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setEditingValue(value.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteValue(value.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Nossa Trajetória */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Nossa Trajetória</CardTitle>
          <Button onClick={addTimeline} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Evento
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id} className="border rounded-lg p-4">
              {editingTimeline === event.id ? (
                <div className="space-y-3">
                  <Input
                    value={event.year}
                    onChange={(e) =>
                      setTimeline(
                        timeline.map((t) =>
                          t.id === event.id ? { ...t, year: e.target.value } : t
                        )
                      )
                    }
                    placeholder="Ano"
                  />
                  <Input
                    value={event.title}
                    onChange={(e) =>
                      setTimeline(
                        timeline.map((t) =>
                          t.id === event.id ? { ...t, title: e.target.value } : t
                        )
                      )
                    }
                    placeholder="Título"
                  />
                  <Textarea
                    value={event.description}
                    onChange={(e) =>
                      setTimeline(
                        timeline.map((t) =>
                          t.id === event.id ? { ...t, description: e.target.value } : t
                        )
                      )
                    }
                    placeholder="Descrição"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateTimeline(event.id, {
                          year: event.year,
                          title: event.title,
                          description: event.description,
                        })
                      }
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingTimeline(null);
                        fetchTimeline();
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-wine-900">{event.year}</p>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => moveItem('about_timeline', timeline, index, 'up')}
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => moveItem('about_timeline', timeline, index, 'down')}
                      variant="ghost"
                      size="sm"
                      disabled={index === timeline.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setEditingTimeline(event.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTimeline(event.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;