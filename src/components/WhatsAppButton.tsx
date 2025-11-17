import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [whatsappMessage, setWhatsappMessage] = useState<string>('Olá! Gostaria de falar com um especialista em automação predial.');

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    const fetchWhatsappData = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', ['whatsapp_number', 'whatsapp_default_message']);
        
        if (data) {
          const numberData = data.find(item => item.key === 'whatsapp_number');
          const messageData = data.find(item => item.key === 'whatsapp_default_message');
          
          if (numberData?.value) setWhatsappNumber(numberData.value);
          if (messageData?.value) setWhatsappMessage(messageData.value);
        }
      } catch (error) {
        console.error('Error fetching WhatsApp data:', error);
      }
    };

    fetchWhatsappData();
  }, []);

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
