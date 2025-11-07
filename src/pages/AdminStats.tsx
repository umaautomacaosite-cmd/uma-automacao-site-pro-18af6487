import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminStats = () => {
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Estatísticas da HOME</h1>
      <Card>
        <CardHeader>
          <CardTitle>Editar Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={stat.id} className="grid grid-cols-3 gap-4 p-4 border rounded">
              <div>
                <Label>Valor</Label>
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index].value = e.target.value;
                    setStats(newStats);
                  }}
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
            Salvar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
