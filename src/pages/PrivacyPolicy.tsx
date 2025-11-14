import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PrivacyPolicy = () => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState('Política de Privacidade');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrivacyPolicy();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_latest_legal_document', { doc_type: 'privacy_policy' });

      if (error) throw error;

      if (data && data.length > 0) {
        setTitle(data[0].title);
        setContent(data[0].content);
      }
    } catch (error) {
      console.error('Erro ao carregar política:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Política de Privacidade - UMA AUTOMAÇÃO"
        description="Política de privacidade e proteção de dados da UMA AUTOMAÇÃO em conformidade com a LGPD."
        canonical="/politica-de-privacidade"
      />
      <Header />
      <main className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">{title}</h1>
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ) : (
            <div 
              className="prose prose-slate max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
