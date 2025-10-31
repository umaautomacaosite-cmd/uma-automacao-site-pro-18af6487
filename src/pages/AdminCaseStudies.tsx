import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Save, X, Power, PowerOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from '@/integrations/supabase/types';

type CaseStudyDb = Tables<'case_studies'>;

interface CaseStudy extends Omit<CaseStudyDb, 'technologies' | 'standards' | 'results'> {
  technologies: string[];
  standards: string[];
  results: string[];
}

const AdminCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: '',
    client: '',
    sector: '',
    year: new Date().getFullYear().toString(),
    location: '',
    icon: 'Building',
    solution: '',
    description: '',
    technologies: [],
    standards: [],
    results: [],
    image_url: '',
    category: 'Geral',
    is_featured: false,
    display_order: 0,
    is_active: true
  });

  const iconOptions = [
    'Building',
    'Factory',
    'Hospital',
    'GraduationCap',
    'Store',
    'Warehouse',
    'Zap',
    'Cpu'
  ];

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar cases');
      return;
    }

    setCaseStudies((data || []) as CaseStudy[]);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('case_studies')
      .insert([formData as any]);

    if (error) {
      toast.error('Erro ao criar case');
      return;
    }

    toast.success('Case criado com sucesso!');
    setIsCreating(false);
    resetForm();
    loadCaseStudies();
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('case_studies')
      .update(formData as any)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar case');
      return;
    }

    toast.success('Case atualizado com sucesso!');
    setEditingId(null);
    resetForm();
    loadCaseStudies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este case?')) return;

    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir case');
      return;
    }

    toast.success('Case excluído com sucesso!');
    loadCaseStudies();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('case_studies')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar status');
      return;
    }

    toast.success(`Case ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
    loadCaseStudies();
  };

  const startEdit = (caseStudy: CaseStudy) => {
    setEditingId(caseStudy.id);
    setFormData(caseStudy);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      sector: '',
      year: new Date().getFullYear().toString(),
      location: '',
      icon: 'Building',
      solution: '',
      description: '',
      technologies: [],
      standards: [],
      results: [],
      image_url: '',
      category: 'Geral',
      is_featured: false,
      display_order: 0,
      is_active: true
    });
  };

  const handleArrayFieldChange = (field: 'technologies' | 'standards' | 'results', value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: items });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Cases</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Case
          </Button>
        )}
      </div>

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Criar Novo Case' : 'Editar Case'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do case"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cliente</label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Setor</label>
                <Input
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  placeholder="Setor de atuação"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ano</label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Ano do projeto"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Localização</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cidade, Estado"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ícone</label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Categoria"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Solução</label>
              <Input
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Solução aplicada"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">URL da Imagem</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tecnologias (uma por linha)</label>
              <Textarea
                value={formData.technologies?.join('\n') || ''}
                onChange={(e) => handleArrayFieldChange('technologies', e.target.value)}
                placeholder="Tecnologia 1&#10;Tecnologia 2"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Normas (uma por linha)</label>
              <Textarea
                value={formData.standards?.join('\n') || ''}
                onChange={(e) => handleArrayFieldChange('standards', e.target.value)}
                placeholder="NR-10&#10;ABNT NBR 5410"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Resultados (um por linha)</label>
              <Textarea
                value={formData.results?.join('\n') || ''}
                onChange={(e) => handleArrayFieldChange('results', e.target.value)}
                placeholder="Resultado 1&#10;Resultado 2"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Destacar na Home</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Ativo</span>
              </label>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => (isCreating ? handleCreate() : handleUpdate(editingId!))}
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {isCreating ? 'Criar' : 'Salvar'}
              </Button>
              <Button onClick={cancelEdit} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {caseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className={!caseStudy.is_active ? 'opacity-60' : ''}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{caseStudy.client}</h3>
                    {caseStudy.is_featured && (
                      <Badge variant="secondary">Destaque</Badge>
                    )}
                    <Badge variant="outline">{caseStudy.sector}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{caseStudy.title}</p>
                  <p className="text-sm mb-2">{caseStudy.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">📍 {caseStudy.location}</Badge>
                    <Badge variant="secondary">📅 {caseStudy.year}</Badge>
                    <Badge variant="secondary">📂 {caseStudy.category}</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleToggleActive(caseStudy.id, caseStudy.is_active)}
                    variant="outline"
                    size="icon"
                    title={caseStudy.is_active ? 'Desativar' : 'Ativar'}
                  >
                    {caseStudy.is_active ? (
                      <Power className="h-4 w-4 text-green-600" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    onClick={() => startEdit(caseStudy)}
                    variant="outline"
                    size="icon"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(caseStudy.id)}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
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

export default AdminCaseStudies;