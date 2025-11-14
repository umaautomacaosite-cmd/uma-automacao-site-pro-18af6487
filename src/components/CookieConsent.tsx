import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
const COOKIE_CONSENT_VERSION = '1.0';

interface CookieConsentProps {
  onPreferencesChange: (preferences: CookiePreferences) => void;
}

const CookieConsent = ({ onPreferencesChange }: CookieConsentProps) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === COOKIE_CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          onPreferencesChange(parsed.preferences);
          return;
        }
      } catch (e) {
        console.error('Error parsing cookie consent:', e);
      }
    }
    setShowBanner(true);
  }, [onPreferencesChange]);

  const savePreferences = async (prefs: CookiePreferences) => {
    const consentData = {
      version: COOKIE_CONSENT_VERSION,
      preferences: prefs,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    
    // Save to Supabase if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
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
            ip_address: null,
            user_agent: navigator.userAgent,
          }]);
        }
      }
    }
    
    onPreferencesChange(prefs);
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    savePreferences(essentialOnly);
  };

  const handleSaveCustom = () => {
    savePreferences({ ...preferences, essential: true });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card className="w-full max-w-2xl pointer-events-auto animate-in slide-in-from-bottom-5">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Preferências de Cookies</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
            Você pode escolher quais tipos de cookies deseja aceitar.
          </p>

          {showDetails && (
            <div className="space-y-4 mb-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="essential"
                  checked={true}
                  disabled={true}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="essential" className="text-sm font-medium">
                    Cookies Essenciais (Obrigatórios)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Necessários para o funcionamento básico do site, como navegação e segurança.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="analytics" className="text-sm font-medium">
                    Cookies Analíticos
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Ajudam a entender como os visitantes interagem com o site através do Google Analytics.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked as boolean })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="marketing" className="text-sm font-medium">
                    Cookies de Marketing
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Utilizados para personalizar anúncios e medir a eficácia de campanhas publicitárias.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {!showDetails ? (
              <>
                <Button onClick={handleAcceptAll} className="flex-1">
                  Aceitar Todos
                </Button>
                <Button onClick={handleAcceptEssential} variant="outline" className="flex-1">
                  Apenas Essenciais
                </Button>
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  className="flex-1"
                >
                  Personalizar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSaveCustom} className="flex-1">
                  Salvar Preferências
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Voltar
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
