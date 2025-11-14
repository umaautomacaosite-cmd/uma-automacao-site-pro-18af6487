import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'header_settings_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

const Header = () => {
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
      console.error('Erro ao ler cache do header:', error);
    }
    return null;
  };

  const cachedSettings = getCachedSettings();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerPhone, setHeaderPhone] = useState(cachedSettings?.phone || '(61) 99999-9999');
  const [headerEmail, setHeaderEmail] = useState(cachedSettings?.email || 'contato@umaautomacao.com.br');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['header_phone', 'header_email']);

      if (data) {
        const phone = data.find(s => s.key === 'header_phone');
        const email = data.find(s => s.key === 'header_email');
        
        const settings = {
          phone: phone?.value || '(61) 99999-9999',
          email: email?.value || 'contato@umaautomacao.com.br'
        };
        
        setHeaderPhone(settings.phone);
        setHeaderEmail(settings.email);

        // Salvar no cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: settings,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error('Erro ao salvar cache do header:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do header:', error);
    }
  };
  const navItems = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Serviços',
    path: '/servicos'
  }, {
    name: 'Cases',
    path: '/cases'
  }, {
    name: 'Sobre',
    path: '/sobre'
  }, {
    name: 'Contato',
    path: '/contato'
  }];
  return <header className="bg-white shadow-lg relative z-50">
      {/* Top contact bar */}
      <div className="bg-gray-900 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{headerPhone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{headerEmail}</span>
            </div>
          </div>
          <div className="text-xs hidden lg:block">
            Atendimento Nacional | Engenheiros CREA Certificados
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-playfair font-bold text-wine-900">
              UMA AUTOMAÇÃO
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`font-lato font-medium transition-colors ${isActive(item.path) ? 'text-wine-900 border-b-2 border-wine-900' : 'text-gray-700 hover:text-wine-900'}`}>
                {item.name}
              </Link>)}
            <Link to="/contato">
              <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-medium px-6">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="lg:hidden mt-4 pb-4 border-t">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`block py-2 font-lato ${isActive(item.path) ? 'text-wine-900 font-semibold' : 'text-gray-700'}`} onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>)}
            <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-medium px-6 mt-4 w-full">
                Solicitar Orçamento
              </Button>
            </Link>
          </div>}
      </nav>
    </header>;
};
export default Header;