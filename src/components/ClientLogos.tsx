import { Building2 } from 'lucide-react';

const ClientLogos = () => {
  const clients = [
    "Petrobras", "Vale", "Gerdau", "Embraer", "Ambev", "JBS"
  ];

  return (
    <div className="py-12 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-300 font-lato text-sm mb-6">
          Empresas que confiam em nossos serviços
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <Building2 className="h-8 w-8 text-gold-500 mb-2" />
              <span className="font-lato text-white text-sm font-semibold">{client}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
