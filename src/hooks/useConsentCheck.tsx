import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConsentStatus {
  needsConsent: boolean;
  documentType?: string;
  latestVersion?: string;
}

export const useConsentCheck = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('user_needs_consent', {
        user_uuid: user.id
      });

      if (error) throw error;

      const formattedData = (data || []).map((item: any) => ({
        needsConsent: item.needs_consent,
        documentType: item.document_type,
        latestVersion: item.latest_version,
      }));

      setConsentStatus(formattedData);
    } catch (error) {
      console.error('Error checking consent:', error);
    } finally {
      setLoading(false);
    }
  };

  return { consentStatus, loading, recheckConsent: checkConsent };
};
