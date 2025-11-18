import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Save, X, Power, PowerOff, Upload, Image as ImageIcon, Star } from 'lucide-react';
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

interface CaseStudyImage {
  id?: string;
  image_url: string;
  description: string;
  display_order: number;
  file?: File;
}

const AdminCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [formData, setFormData] = useState<Partial<CaseStudy>>({
    title: '',
    client: '',
    sector: '',
    year: new Date().getFullYear().toString(),
    start_year: new Date().getFullYear().toString(),
    end_year: new Date().getFullYear().toString(),
    location: '',
    icon: 'Building',
    description: '',
    technologies: [],
    standards: [],
    results: [],
    image_url: '',
    cover_image_url: '',
    is_featured: false,
    display_order: 0,
    is_active: true
  });
  
  const [images, setImages] = useState<CaseStudyImage[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null);
  const [newTech, setNewTech] = useState('');
  const [newStandard, setNewStandard] = useState('');
  const [newResult, setNewResult] = useState('');

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
    
    // Contar cases destacados ativos
    const featured = (data || []).filter(c => c.is_featured && c.is_active);
    setFeaturedCount(featured.length);
  };

  const handleCreate = async () => {
    // Verificar limite de cases destacados
    if (formData.is_featured) {
      const { data: featuredCases } = await supabase
        .from('case_studies')
        .select('id')
        .eq('is_featured', true)
        .eq('is_active', true);
      
      if (featuredCases && featuredCases.length >= 6) {
        toast.error('Limite de 6 cases destacados atingido! Desative outro case antes de destacar este.');
        return;
      }
    }

    const { data: caseStudy, error } = await supabase
      .from('case_studies')
      .insert([formData as any])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar case');
      return;
    }

    // Upload images and get cover URL
    const coverUrl = await uploadImages(caseStudy.id);
    
    // Update with cover URL if exists
    if (coverUrl) {
      await supabase
        .from('case_studies')
        .update({ cover_image_url: coverUrl })
        .eq('id', caseStudy.id);
    }

    toast.success('Case criado com sucesso!');
    setIsCreating(false);
    resetForm();
    loadCaseStudies();
  };

  const handleUpdate = async (id: string) => {
    try {
      // Verificar limite de cases destacados se está tentando destacar
      if (formData.is_featured) {
        const { data: featuredCases, error: featuredError } = await supabase
          .from('case_studies')
          .select('id')
          .eq('is_featured', true)
          .eq('is_active', true)
          .neq('id', id); // Excluir o case atual
        
        if (featuredError) {
          console.error('Erro ao verificar cases destacados:', featuredError);
          toast.error('Erro ao verificar limite de cases destacados');
          return;
        }
        
        if (featuredCases && featuredCases.length >= 6) {
          toast.error('Limite de 6 cases destacados atingido! Desative outro case antes de destacar este.');
          return;
        }
      }

      // Upload new images and get cover URL
      const coverUrl = await uploadImages(id);
      
      // Update form data with new cover URL if exists
      const updateData = { ...formData };
      if (coverUrl) {
        updateData.cover_image_url = coverUrl;
      }

      const { error } = await supabase
        .from('case_studies')
        .update(updateData as any)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar case:', error);
        toast.error(`Erro ao atualizar case: ${error.message}`);
        return;
      }

      setEditingId(null);
      resetForm();
      loadCaseStudies();
      toast.success('Case atualizado com sucesso!');
    } catch (err) {
      console.error('Erro inesperado ao salvar case:', err);
      toast.error('Erro inesperado ao salvar a case. Verifique o console para mais detalhes.');
    }
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

  const startEdit = async (caseStudy: CaseStudy) => {
    setEditingId(caseStudy.id);
    setFormData(caseStudy);
    
    // Load images for this case study
    const { data: imageData } = await supabase
      .from('case_study_images')
      .select('*')
      .eq('case_study_id', caseStudy.id)
      .order('display_order', { ascending: true });
    
    if (imageData) {
      const loadedImages = imageData.map(img => ({
        id: img.id,
        image_url: img.image_url,
        description: img.description || '',
        display_order: img.display_order
      }));
      setImages(loadedImages);
      
      // Set cover image index if exists
      if (caseStudy.cover_image_url) {
        const coverIndex = loadedImages.findIndex(img => img.image_url === caseStudy.cover_image_url);
        setCoverImageIndex(coverIndex !== -1 ? coverIndex : null);
      }
    }
    
    // Scroll to top for editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
    setImages([]);
    setCoverImageIndex(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      sector: '',
      year: new Date().getFullYear().toString(),
      start_year: new Date().getFullYear().toString(),
      end_year: new Date().getFullYear().toString(),
      location: '',
      icon: 'Building',
      description: '',
      technologies: [],
      standards: [],
      results: [],
      image_url: '',
      cover_image_url: '',
      is_featured: false,
      display_order: 0,
      is_active: true
    });
    setImages([]);
    setCoverImageIndex(null);
  };

  const uploadImages = async (caseStudyId: string): Promise<string | null> => {
    let coverUrl: string | null = null;
    
    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        if (image.file) {
          // Upload to storage
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${caseStudyId}/${Date.now()}.${fileExt}`;
          
          console.log('Fazendo upload da imagem:', fileName);
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('case-study-images')
            .upload(fileName, image.file);

          if (uploadError) {
            console.error('Erro no upload:', uploadError);
            toast.error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
            continue;
          }

          console.log('Upload bem-sucedido, obtendo URL pública');
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('case-study-images')
            .getPublicUrl(fileName);

          console.log('Salvando no banco de dados');
          // Save to database
          const { error: insertError } = await supabase
            .from('case_study_images')
            .insert({
              case_study_id: caseStudyId,
              image_url: publicUrl,
              description: image.description,
              display_order: image.display_order
            });
          
          if (insertError) {
            console.error('Erro ao inserir imagem no banco:', insertError);
            toast.error(`Erro ao salvar informações da imagem: ${insertError.message}`);
            continue;
          }
          
          // If this is the cover image, save the public URL
          if (i === coverImageIndex) {
            coverUrl = publicUrl;
          }
        } else if (image.id) {
          // Update existing image description
          console.log('Atualizando imagem existente:', image.id);
          const { error: updateError } = await supabase
            .from('case_study_images')
            .update({ 
              description: image.description,
              display_order: image.display_order 
            })
            .eq('id', image.id);
          
          if (updateError) {
            console.error('Erro ao atualizar imagem:', updateError);
            toast.error(`Erro ao atualizar imagem: ${updateError.message}`);
          }
          
          // If this is the cover image and it already exists, use its URL
          if (i === coverImageIndex && image.image_url) {
            coverUrl = image.image_url;
          }
        }
      }
    } catch (err) {
      console.error('Erro inesperado no upload de imagens:', err);
      toast.error('Erro inesperado ao processar imagens');
    }
    
    return coverUrl;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: CaseStudyImage[] = Array.from(files).map((file, index) => ({
      image_url: URL.createObjectURL(file),
      description: '',
      display_order: images.length + index,
      file
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    
    // If image has ID, delete from database
    if (image.id) {
      await supabase
        .from('case_study_images')
        .delete()
        .eq('id', image.id);
    }
    
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImageDescription = (index: number, description: string) => {
    const newImages = [...images];
    newImages[index].description = description;
    setImages(newImages);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newImages.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    // Update display_order
    newImages.forEach((img, i) => {
      img.display_order = i;
    });
    
    setImages(newImages);
  };

  const addItem = (field: 'technologies' | 'standards' | 'results', value: string) => {
    if (!value.trim()) return;
    
    const current = formData[field] || [];
    setFormData({ ...formData, [field]: [...current, value.trim()] });
    
    if (field === 'technologies') setNewTech('');
    if (field === 'standards') setNewStandard('');
    if (field === 'results') setNewResult('');
  };

  const removeItem = (field: 'technologies' | 'standards' | 'results', index: number) => {
    const current = formData[field] || [];
    setFormData({ ...formData, [field]: current.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Cases</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cases destacados na HOME: <span className={featuredCount >= 6 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{featuredCount}/6</span>
            {featuredCount >= 6 && <span className="text-red-600"> - Limite atingido! Desative um case antes de destacar outro.</span>}
          </p>
        </div>
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
                  placeholder="Ex: Automação Predial Completa"
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
                <label className="text-sm font-medium">Ano Inicial</label>
                <Input
                  value={formData.start_year}
                  onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                  placeholder="Ex: 2023"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ano Final</label>
                <Input
                  value={formData.end_year}
                  onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                  placeholder="Ex: 2024"
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
                <label className="text-sm font-medium">Ordem de Exibição</label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Solução Aplicada</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição completa da solução aplicada no projeto"
                rows={5}
              />
            </div>


            {/* Tecnologias */}
            <div>
              <label className="text-sm font-medium">Tecnologias</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Digite uma tecnologia"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('technologies', newTech))}
                />
                <Button type="button" onClick={() => addItem('technologies', newTech)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.technologies || []).map((tech, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('technologies', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Normas */}
            <div>
              <label className="text-sm font-medium">Normas</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newStandard}
                  onChange={(e) => setNewStandard(e.target.value)}
                  placeholder="Digite uma norma"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('standards', newStandard))}
                />
                <Button type="button" onClick={() => addItem('standards', newStandard)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.standards || []).map((standard, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {standard}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('standards', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Resultados */}
            <div>
              <label className="text-sm font-medium">Resultados</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newResult}
                  onChange={(e) => setNewResult(e.target.value)}
                  placeholder="Digite um resultado"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('results', newResult))}
                />
                <Button type="button" onClick={() => addItem('results', newResult)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.results || []).map((result, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {result}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeItem('results', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Upload de Imagens */}
            <div>
              <label className="text-sm font-medium">Imagens do Case</label>
              <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clique ou arraste imagens aqui
                  </span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 space-y-4">
                  {images.map((image, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={image.image_url} 
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Descrição da imagem"
                              value={image.description}
                              onChange={(e) => updateImageDescription(index, e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => moveImage(index, 'up')}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => moveImage(index, 'down')}
                                disabled={index === images.length - 1}
                              >
                                ↓
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={index === coverImageIndex ? 'default' : 'outline'}
                                onClick={() => {
                                  setCoverImageIndex(index);
                                  setFormData({ ...formData, cover_image_url: image.image_url });
                                }}
                                title="Definir como capa"
                              >
                                <ImageIcon className="h-4 w-4" />
                                {index === coverImageIndex && ' ✓'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                    {caseStudy.is_featured && caseStudy.is_active && (
                      <div className="bg-yellow-500 rounded-full p-1.5 shadow-md" title="Destaque na HOME">
                        <Star className="h-4 w-4 text-white fill-white" />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg">{caseStudy.title}</h3>
                    {caseStudy.is_featured && (
                      <Badge variant="secondary">Destaque</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{caseStudy.client}</p>
                  <p className="text-sm mb-2 line-clamp-2">{caseStudy.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">📍 {caseStudy.location}</Badge>
                    <Badge variant="secondary">📅 {caseStudy.start_year && caseStudy.end_year 
                      ? `${caseStudy.start_year} - ${caseStudy.end_year}`
                      : caseStudy.year}</Badge>
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