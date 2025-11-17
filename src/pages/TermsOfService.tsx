import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';

const TermsOfService = () => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState('Termos de Uso');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_latest_legal_document', { doc_type: 'terms_of_service' });

      if (error) throw error;

      if (data && data.length > 0) {
        setTitle(data[0].title);
        setContent(data[0].content);
      }
    } catch (error) {
      console.error('Erro ao carregar termos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Termos de Uso - UMA AUTOMAÇÃO"
        description="Termos de uso e condições gerais de utilização do site UMA AUTOMAÇÃO."
        canonical="/termos-de-uso"
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
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'span', 'div'],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
              }) }}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsOfService;
