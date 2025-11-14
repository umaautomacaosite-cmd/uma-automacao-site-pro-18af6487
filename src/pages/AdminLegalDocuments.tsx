import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Plus, Eye, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LegalDocument {
  id: string;
  document_type: string;
  version: string;
  title: string;
  content: string;
  effective_date: string;
  is_active: boolean;
  created_at: string;
}

const AdminLegalDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    document_type: 'terms_of_service',
    version: '',
    title: '',
    content: '',
    effective_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    checkAuth();
    loadDocuments();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/dashboard');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (!roles?.some(r => r.role === 'admin')) {
      navigate('/dashboard');
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('legal_documents').insert({
        ...formData,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success('Documento criado com sucesso!');
      setShowCreateDialog(false);
      setFormData({
        document_type: 'terms_of_service',
        version: '',
        title: '',
        content: '',
        effective_date: new Date().toISOString().split('T')[0],
      });
      loadDocuments();
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Erro ao criar documento');
    }
  };

  const handleActivate = async (id: string, documentType: string) => {
    try {
      // Deactivate all documents of this type
      await supabase
        .from('legal_documents')
        .update({ is_active: false })
        .eq('document_type', documentType);

      // Activate the selected document
      const { error } = await supabase
        .from('legal_documents')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      toast.success('Documento ativado com sucesso!');
      loadDocuments();
    } catch (error) {
      console.error('Error activating document:', error);
      toast.error('Erro ao ativar documento');
    }
  };

  const exportConsents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_legal_consents')
        .select('*')
        .csv();

      if (error) throw error;

      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consents-${new Date().toISOString()}.csv`;
      a.click();

      toast.success('Consentimentos exportados!');
    } catch (error) {
      console.error('Error exporting consents:', error);
      toast.error('Erro ao exportar consentimentos');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documentos Legais</h1>
          <p className="text-muted-foreground">Gerencie Termos de Uso e Política de Privacidade</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportConsents} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Consentimentos
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="document_type">Tipo de Documento</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, document_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terms_of_service">Termos de Uso</SelectItem>
                      <SelectItem value="privacy_policy">Política de Privacidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="version">Versão</Label>
                  <Input
                    id="version"
                    placeholder="Ex: 1.1"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Termos de Uso do Site"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="effective_date">Data de Vigência</Label>
                  <Input
                    id="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Conteúdo (HTML ou Texto)</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite o conteúdo completo do documento..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={handleCreate} className="w-full">
                  Criar Documento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {doc.title}
                    {doc.is_active && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        ATIVO
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {doc.document_type === 'terms_of_service'
                      ? 'Termos de Uso'
                      : 'Política de Privacidade'}{' '}
                    - Versão {doc.version}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{doc.title}</DialogTitle>
                      </DialogHeader>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: doc.content }}
                      />
                    </DialogContent>
                  </Dialog>
                  {!doc.is_active && (
                    <Button
                      size="sm"
                      onClick={() => handleActivate(doc.id, doc.document_type)}
                    >
                      Ativar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vigência: {new Date(doc.effective_date).toLocaleDateString('pt-BR')} | Criado em:{' '}
                {new Date(doc.created_at).toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLegalDocuments;
