import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  testimonial: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sectionVisible, setSectionVisible] = useState(true);
  const [formData, setFormData] = useState({
    client_name: '',
    company: '',
    testimonial: '',
    rating: 5
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
    loadSectionVisibility();
  }, []);

  const loadSectionVisibility = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'testimonials_section_visible')
        .single();

      if (data?.value) {
        setSectionVisible(data.value === 'true');
      }
    } catch (error) {
      console.error('Error loading visibility:', error);
    }
  };

  const handleToggleSectionVisibility = async (checked: boolean) => {
    setSectionVisible(checked);
    try {
      await supabase
        .from('settings')
        .upsert({ key: 'testimonials_section_visible', value: checked.toString() }, { onConflict: 'key' });

      toast({
        title: checked ? "Seção habilitada" : "Seção ocultada",
        description: checked ? "A seção de depoimentos agora está visível na HOME" : "A seção de depoimentos foi ocultada da HOME"
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os depoimentos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.client_name || !formData.company || !formData.testimonial) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, empresa e depoimento.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Depoimento atualizado!" });
      } else {
        const maxOrder = Math.max(...testimonials.map(t => t.display_order), 0);
        const { error } = await supabase
          .from('testimonials')
          .insert({ ...formData, display_order: maxOrder + 1 });

        if (error) throw error;
        toast({ title: "Depoimento adicionado!" });
      }

      setFormData({ client_name: '', company: '', testimonial: '', rating: 5 });
      setEditingId(null);
      loadTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o depoimento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este depoimento?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Depoimento excluído!" });
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Erro ao excluir",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = testimonials.findIndex(t => t.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === testimonials.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newTestimonials = [...testimonials];
    [newTestimonials[index], newTestimonials[newIndex]] = [newTestimonials[newIndex], newTestimonials[index]];

    try {
      for (let i = 0; i < newTestimonials.length; i++) {
        await supabase
          .from('testimonials')
          .update({ display_order: i })
          .eq('id', newTestimonials[i].id);
      }
      loadTestimonials();
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      client_name: testimonial.client_name,
      company: testimonial.company,
      testimonial: testimonial.testimonial,
      rating: testimonial.rating
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Depoimentos de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os depoimentos exibidos na página HOME
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visibilidade da Seção</CardTitle>
          <CardDescription>
            Controle se a seção de depoimentos aparece na HOME
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="section-visible"
              checked={sectionVisible}
              onCheckedChange={handleToggleSectionVisibility}
            />
            <Label htmlFor="section-visible">
              {sectionVisible ? 'Seção visível na HOME' : 'Seção oculta na HOME'}
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar' : 'Adicionar'} Depoimento</CardTitle>
          <CardDescription>
            Preencha os dados do depoimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Nome do Cliente</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ex: Empresa ABC"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="testimonial">Depoimento</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              placeholder="O que o cliente disse sobre seus serviços"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ client_name: '', company: '', testimonial: '', rating: 5 });
              }}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Depoimentos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{testimonial.client_name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  <p className="text-sm mt-2">{testimonial.testimonial}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {'⭐'.repeat(testimonial.rating)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                    title={testimonial.is_active ? 'Ocultar' : 'Mostrar'}
                  >
                    {testimonial.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleReorder(testimonial.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleReorder(testimonial.id, 'down')}
                    disabled={index === testimonials.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(testimonial)}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;
