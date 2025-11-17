import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'footer_settings_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

const Footer = () => {
  const getCachedSettings = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error('Erro ao ler cache do footer:', error);
    }
    return null;
  };

  const cachedSettings = getCachedSettings();
  
  const [footerPhone, setFooterPhone] = useState(cachedSettings?.phone || '(61) 99999-9999');
  const [footerEmail, setFooterEmail] = useState(cachedSettings?.email || 'contato@umaautomacao.com.br');
  const [whatsappNumber, setWhatsappNumber] = useState(cachedSettings?.whatsapp || '5561999999999');
  const [whatsappMessage, setWhatsappMessage] = useState(cachedSettings?.whatsappMessage || 'Olá! Gostaria de falar com um especialista em automação predial.');
  const [facebookUrl, setFacebookUrl] = useState(cachedSettings?.facebook || '');
  const [instagramUrl, setInstagramUrl] = useState(cachedSettings?.instagram || '');
  const [linkedinUrl, setLinkedinUrl] = useState(cachedSettings?.linkedin || '');
  const [cnpj, setCnpj] = useState(cachedSettings?.cnpj || '');
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['footer_phone', 'footer_email', 'whatsapp_number', 'whatsapp_default_message', 'facebook_url', 'instagram_url', 'linkedin_url', 'cnpj']);
      
      if (data) {
        const phone = data.find(s => s.key === 'footer_phone');
        const email = data.find(s => s.key === 'footer_email');
        const whatsapp = data.find(s => s.key === 'whatsapp_number');
        const whatsappMsg = data.find(s => s.key === 'whatsapp_default_message');
        const facebook = data.find(s => s.key === 'facebook_url');
        const instagram = data.find(s => s.key === 'instagram_url');
        const linkedin = data.find(s => s.key === 'linkedin_url');
        const cnpjSetting = data.find(s => s.key === 'cnpj');
        
        const settings = {
          phone: phone?.value || '(61) 99999-9999',
          email: email?.value || 'contato@umaautomacao.com.br',
          whatsapp: whatsapp?.value || '5561999999999',
          whatsappMessage: whatsappMsg?.value || 'Olá! Gostaria de falar com um especialista em automação predial.',
          facebook: facebook?.value || '',
          instagram: instagram?.value || '',
          linkedin: linkedin?.value || '',
          cnpj: cnpjSetting?.value || ''
        };
        
        setFooterPhone(settings.phone);
        setFooterEmail(settings.email);
        setWhatsappNumber(settings.whatsapp);
        setWhatsappMessage(settings.whatsappMessage);
        setFacebookUrl(settings.facebook);
        setInstagramUrl(settings.instagram);
        setLinkedinUrl(settings.linkedin);
        setCnpj(settings.cnpj);

        // Salvar no cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: settings,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error('Erro ao salvar cache do footer:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do footer:', error);
    }
  };
  return <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-playfair font-bold text-wine-400 mb-4">
              UMA AUTOMAÇÃO
            </div>
            <p className="font-lato text-gray-300 mb-4">Soluções completas em automação predial com excelência técnica e atendimento nacional.</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-wine-400" />
                <span>{footerPhone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-wine-400" />
                <span>{footerEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-wine-400" />
                <span>Brasília, DF - Brasil</span>
              </div>
              {cnpj && (
                <div className="flex items-center space-x-2 text-sm mt-2">
                  <span className="font-semibold">CNPJ:</span>
                  <span>{cnpj}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
          <h3 className="font-lato font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/servicos" className="text-gray-300 hover:text-wine-400 transition-colors">Serviços</Link></li>
              <li><Link to="/cases" className="text-gray-300 hover:text-wine-400 transition-colors">Cases de Sucesso</Link></li>
              <li><Link to="/sobre" className="text-gray-300 hover:text-wine-400 transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-gray-300 hover:text-wine-400 transition-colors">Contato</Link></li>
              <li><Link to="/termos-de-uso" className="text-gray-300 hover:text-wine-400 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-gray-300 hover:text-wine-400 transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-lato font-semibold text-lg mb-4">Certificações</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 p-3 rounded border border-wine-400">
                <div className="font-semibold text-wine-400">CREA</div>
                <div className="text-sm text-gray-300">
              </div>
              </div>
              <div className="bg-gray-800 p-3 rounded border border-gold-500">
                <div className="font-semibold text-gold-500">ISO 9001</div>
                <div className="text-sm text-gray-300">Certificado</div>
              </div>
              <div className="text-sm text-gray-300">
                Conformidade NR-10, NR-12, ABNT NBR 5410
              </div>
            </div>
          </div>

          {/* Social Media & WhatsApp */}
          <div>
            <h3 className="font-lato font-semibold text-lg mb-4">Redes Sociais</h3>
            <div className="flex space-x-4 mb-6">
              {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-wine-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>}
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-wine-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>}
              {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-wine-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>}
            </div>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 UMA AUTOMAÇÃO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;