
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Cases', path: '/cases' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ];

  return (
    <header className="bg-white shadow-lg relative z-50">
      {/* Top contact bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>contato@umaautomacao.com.br</span>
            </div>
          </div>
          <div className="text-xs">
            Atendimento Nacional | Engenheiros CREA Certificados
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-playfair font-bold text-wine-900">
              UMA AUTOMAÇÃO
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-lato font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-wine-900 border-b-2 border-wine-900'
                    : 'text-gray-700 hover:text-wine-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-medium px-6">
              Solicitar Orçamento
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 font-lato ${
                  isActive(item.path)
                    ? 'text-wine-900 font-semibold'
                    : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-wine-900 hover:bg-wine-800 text-white font-lato font-medium px-6 mt-4 w-full">
              Solicitar Orçamento
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
