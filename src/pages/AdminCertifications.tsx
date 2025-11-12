import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Certification {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_color: string;
  is_active: boolean;
  display_order: number;
}

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Shield',
    icon_color: '#3b82f6'
  });

  const iconOptions = [
    { name: 'Shield', label: 'Escudo' },
    { name: 'Award', label: 'Troféu' },
    { name: 'CheckCircle', label: 'Check' },
    { name: 'Zap', label: 'Raio' },
    { name: 'Lock', label: 'Cadeado' },
    { name: 'Star', label: 'Estrela' },
    { name: 'Certificate', label: 'Certificado' },
  ];

  const colorOptions = [
    { value: '#3b82f6', label: 'Azul' },
    { value: '#10b981', label: 'Verde' },
    { value: '#f59e0b', label: 'Laranja' },
    { value: '#ef4444', label: 'Vermelho' },
    { value: '#8b5cf6', label: 'Roxo' },
    { value: '#ec4899', label: 'Rosa' },
  ];
  const { toast } = useToast();

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as certificações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e descrição.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('certifications')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Certificação atualizada!" });
      } else {
        const maxOrder = Math.max(...certifications.map(c => c.display_order), 0);
        const { error } = await supabase
          .from('certifications')
          .insert({ ...formData, display_order: maxOrder + 1 });

        if (error) throw error;
        toast({ title: "Certificação adicionada!" });
      }

      setFormData({ title: '', description: '', icon: 'Shield', icon_color: '#3b82f6' });
      setEditingId(null);
      loadCertifications();
    } catch (error) {
      console.error('Error saving certification:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a certificação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta certificação?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Certificação excluída!" });
      loadCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
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
        .from('certifications')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadCertifications();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = certifications.findIndex(c => c.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === certifications.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newCertifications = [...certifications];
    [newCertifications[index], newCertifications[newIndex]] = [newCertifications[newIndex], newCertifications[index]];

    try {
      for (let i = 0; i < newCertifications.length; i++) {
        await supabase
          .from('certifications')
          .update({ display_order: i })
          .eq('id', newCertifications[i].id);
      }
      loadCertifications();
    } catch (error) {
      console.error('Error reordering:', error);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      description: cert.description,
      icon: cert.icon,
      icon_color: cert.icon_color
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Certificações e Compliance</h1>
        <p className="text-muted-foreground">
          Gerencie as certificações exibidas na página HOME
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar' : 'Adicionar'} Certificação</CardTitle>
          <CardDescription>
            Preencha os dados da certificação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: ISO 9001"
              />
            </div>
            <div>
              <Label htmlFor="icon">Ícone</Label>
              <Select
                value={formData.icon}
                onValueChange={(val) => setFormData({ ...formData, icon: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.name} value={icon.name}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da certificação"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="icon_color">Cor do Ícone</Label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon_color: color.value })}
                  className={`w-10 h-10 rounded-full border-2 ${
                    formData.icon_color === color.value ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => {
                setEditingId(null);
                setFormData({ title: '', description: '', icon: 'Shield', icon_color: '#3b82f6' });
              }}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificações Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ícone: {cert.icon} | Cor: <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: cert.icon_color }}></span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleActive(cert.id, cert.is_active)}
                    title={cert.is_active ? 'Ocultar' : 'Mostrar'}
                  >
                    {cert.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleReorder(cert.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleReorder(cert.id, 'down')}
                    disabled={index === certifications.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(cert)}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AdminStatsSection />
    </div>
  );
};

const AdminStatsSection = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const iconOptions = ['Award', 'Users', 'MapPin', 'Shield', 'TrendingUp', 'CheckCircle'];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('home_stats')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setStats(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const stat of stats) {
        await supabase
          .from('home_stats')
          .update({ label: stat.label, value: stat.value, icon: stat.icon })
          .eq('id', stat.id);
      }
      toast({ title: "Estatísticas atualizadas!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Estatísticas da HOME</CardTitle>
        <CardDescription>Edite as estatísticas exibidas na página inicial</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={stat.id} className="grid grid-cols-3 gap-4 p-4 border rounded">
            <div>
              <Label>Valor</Label>
              <Input
                type="text"
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...stats];
                  newStats[index].value = e.target.value;
                  setStats(newStats);
                }}
                placeholder="Ex: 24/7, 100+, etc."
              />
            </div>
            <div>
              <Label>Texto</Label>
              <Input
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...stats];
                  newStats[index].label = e.target.value;
                  setStats(newStats);
                }}
              />
            </div>
            <div>
              <Label>Ícone</Label>
              <Select
                value={stat.icon}
                onValueChange={(value) => {
                  const newStats = [...stats];
                  newStats[index].icon = value;
                  setStats(newStats);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar Estatísticas
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminCertifications;
