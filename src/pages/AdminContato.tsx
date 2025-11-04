import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Plus, Trash2, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  business_hours: any;
  map_embed_url: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service_type: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminContato = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [businessHours, setBusinessHours] = useState<{ day: string; hours: string }[]>([
    { day: 'Segunda a Sexta', hours: '7h às 17h' },
    { day: 'Sábado', hours: '8h às 12h' }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoResponse, messagesResponse] = await Promise.all([
        supabase.from('contact_info').select('*').single(),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      if (infoResponse.data) {
        setContactInfo(infoResponse.data);
        setBusinessHours(infoResponse.data.business_hours as { day: string; hours: string }[]);
      }
      if (messagesResponse.data) {
        setMessages(messagesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar as informações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContactInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      map_embed_url: formData.get('map_embed_url') as string,
      business_hours: businessHours,
    };

    try {
      if (contactInfo) {
        await supabase.from('contact_info').update(data).eq('id', contactInfo.id);
      } else {
        await supabase.from('contact_info').insert(data);
      }

      toast({
        title: 'Sucesso!',
        description: 'Informações de contato atualizadas',
      });
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as informações',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      await supabase.from('contact_messages').update({ status }).eq('id', id);
      toast({
        title: 'Status atualizado',
        description: 'Status da mensagem foi atualizado',
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta mensagem?')) return;

    try {
      await supabase.from('contact_messages').delete().eq('id', id);
      toast({
        title: 'Mensagem excluída',
        description: 'A mensagem foi removida com sucesso',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a mensagem',
        variant: 'destructive',
      });
    }
  };

  const addBusinessHour = () => {
    setBusinessHours([...businessHours, { day: '', hours: '' }]);
  };

  const removeBusinessHour = (index: number) => {
    setBusinessHours(businessHours.filter((_, i) => i !== index));
  };

  const updateBusinessHour = (index: number, field: 'day' | 'hours', value: string) => {
    const updated = [...businessHours];
    updated[index][field] = value;
    setBusinessHours(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-wine-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-2xl text-wine-900">
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveContactInfo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={contactInfo?.phone}
                  placeholder="(61) 99999-9999"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={contactInfo?.email}
                  placeholder="contato@empresa.com.br"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                defaultValue={contactInfo?.address}
                placeholder="Rua, número, bairro, cidade - Estado"
                required
              />
            </div>

            {/* Business Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Horário de Atendimento</Label>
                <Button type="button" variant="outline" size="sm" onClick={addBusinessHour}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              {businessHours.map((hour, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Dia"
                    value={hour.day}
                    onChange={(e) => updateBusinessHour(index, 'day', e.target.value)}
                  />
                  <Input
                    placeholder="Horário"
                    value={hour.hours}
                    onChange={(e) => updateBusinessHour(index, 'hours', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBusinessHour(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="map_embed_url">URL do Google Maps Embed</Label>
              <Textarea
                id="map_embed_url"
                name="map_embed_url"
                defaultValue={contactInfo?.map_embed_url}
                placeholder="Cole aqui a URL de embed do Google Maps"
                rows={3}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Acesse Google Maps, clique em Compartilhar → Incorporar mapa → Copiar HTML
              </p>
            </div>

            <Button type="submit" disabled={saving} className="bg-wine-900 hover:bg-wine-800">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Informações
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-playfair text-2xl text-wine-900">
            Mensagens Recebidas ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma mensagem recebida ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.service_type}</TableCell>
                      <TableCell>
                        <select
                          value={message.status}
                          onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="novo">Novo</option>
                          <option value="lido">Lido</option>
                          <option value="respondido">Respondido</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        {new Date(message.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Message Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl">Detalhes da Mensagem</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-sm">{selectedMessage.phone}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-sm">{selectedMessage.company || 'N/A'}</p>
                </div>
                <div>
                  <Label>Tipo de Serviço</Label>
                  <p className="text-sm">{selectedMessage.service_type}</p>
                </div>
                <div>
                  <Label>Data</Label>
                  <p className="text-sm">
                    {new Date(selectedMessage.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div>
                <Label>Mensagem</Label>
                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md mt-1">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContato;
