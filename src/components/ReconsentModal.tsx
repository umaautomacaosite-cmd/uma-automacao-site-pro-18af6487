import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useConsentCheck } from '@/hooks/useConsentCheck';
import type { CookiePreferences } from './CookieConsent';

export const ReconsentModal = () => {
  const { consentStatus, loading } = useConsentCheck();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!loading && consentStatus.some(s => s.needsConsent)) {
      setOpen(true);
    }
  }, [loading, consentStatus]);

  const handleAcceptAll = async () => {
    await saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleAcceptEssential = async () => {
    await saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = async () => {
    await saveConsent({ ...preferences, essential: true });
  };

  const saveConsent = async (prefs: CookiePreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: latestDocs } = await supabase
        .from('legal_documents')
        .select('id, document_type, version')
        .eq('is_active', true);

      if (latestDocs) {
        for (const doc of latestDocs) {
          await supabase.from('user_legal_consents').insert([{
            user_id: user.id,
            document_id: doc.id,
            document_type: doc.document_type,
            document_version: doc.version,
            cookie_preferences: prefs as any,
            user_agent: navigator.userAgent,
          }]);

          await supabase.from('legal_document_access_logs').insert([{
            user_id: user.id,
            document_id: doc.id,
            document_type: doc.document_type,
            access_type: 'consent',
            user_agent: navigator.userAgent,
          }]);
        }
      }

      localStorage.setItem('cookie_consent_preferences', JSON.stringify({
        version: '1.0',
        preferences: prefs,
        timestamp: new Date().toISOString(),
      }));

      setOpen(false);
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Atualizamos nossos Termos</DialogTitle>
          <DialogDescription>
            Atualizamos nossos Termos de Uso e Política de Privacidade. 
            Por favor, revise e aceite para continuar usando nossos serviços.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="essential" checked={true} disabled className="mt-1" />
            <div className="flex-1">
              <label htmlFor="essential" className="text-sm font-medium">
                Cookies Essenciais (Obrigatórios)
              </label>
              <p className="text-xs text-muted-foreground">
                Necessários para o funcionamento básico do site.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="analytics-reconsent"
              checked={preferences.analytics}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, analytics: checked as boolean })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="analytics-reconsent" className="text-sm font-medium">
                Cookies Analíticos
              </label>
              <p className="text-xs text-muted-foreground">
                Google Analytics para entender como você usa o site.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing-reconsent"
              checked={preferences.marketing}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, marketing: checked as boolean })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <label htmlFor="marketing-reconsent" className="text-sm font-medium">
                Cookies de Marketing
              </label>
              <p className="text-xs text-muted-foreground">
                Personalizar anúncios e medir campanhas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button onClick={handleAcceptAll} className="flex-1">
            Aceitar Todos
          </Button>
          <Button onClick={handleAcceptEssential} variant="outline" className="flex-1">
            Apenas Essenciais
          </Button>
          <Button onClick={handleSaveCustom} variant="outline" className="flex-1">
            Salvar Preferências
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
