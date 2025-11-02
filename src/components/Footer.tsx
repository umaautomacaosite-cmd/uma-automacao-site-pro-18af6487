import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
const Footer = () => {
  const [footerPhone, setFooterPhone] = useState('(61) 99999-9999');
  const [footerEmail, setFooterEmail] = useState('contato@umaautomacao.com.br');
  const [whatsappNumber, setWhatsappNumber] = useState('5561999999999');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  useEffect(() => {
    loadSettings();
  }, []);
  const loadSettings = async () => {
    const {
      data
    } = await supabase.from('settings').select('key, value').in('key', ['footer_phone', 'footer_email', 'whatsapp_number', 'facebook_url', 'instagram_url', 'linkedin_url']);
    if (data) {
      const phone = data.find(s => s.key === 'footer_phone');
      const email = data.find(s => s.key === 'footer_email');
      const whatsapp = data.find(s => s.key === 'whatsapp_number');
      const facebook = data.find(s => s.key === 'facebook_url');
      const instagram = data.find(s => s.key === 'instagram_url');
      const linkedin = data.find(s => s.key === 'linkedin_url');
      if (phone?.value) setFooterPhone(phone.value);
      if (email?.value) setFooterEmail(email.value);
      if (whatsapp?.value) setWhatsappNumber(whatsapp.value);
      if (facebook?.value) setFacebookUrl(facebook.value);
      if (instagram?.value) setInstagramUrl(instagram.value);
      if (linkedin?.value) setLinkedinUrl(linkedin.value);
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
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="font-lato font-semibold text-lg mb-4">Certificações</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 p-3 rounded border border-wine-400">
                <div className="font-semibold text-wine-400">CREA/DF</div>
                <div className="text-sm text-gray-300">Registro: 123456</div>
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
            <a href={`https://wa.me/${whatsappNumber}?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista%20em%20automação%20industrial.`} target="_blank" rel="noopener noreferrer" className="w-full">
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