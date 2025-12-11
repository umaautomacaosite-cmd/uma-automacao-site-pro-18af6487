import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object;
  breadcrumbs?: BreadcrumbItem[];
}

const SEO = ({
  title = 'UMA AUTOMAÇÃO - Soluções em Automação Predial',
  description = 'Soluções em Automação Predial e Infraestrutura de Alta Performance. Atendimento nacional com engenheiros certificados CREA em Brasília-DF.',
  keywords = 'automação predial, automação industrial, infraestrutura, CREA, Brasília, data center, engenharia, redes estruturadas',
  ogImage = '/datacenter-hero.jpg',
  canonical,
  schema,
  breadcrumbs,
}: SEOProps) => {
  const siteUrl = 'https://umaautomacao.com.br';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  // LocalBusiness Schema - sempre presente
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    "name": "UMA AUTOMAÇÃO",
    "image": `${siteUrl}/datacenter-hero.jpg`,
    "description": "Empresa especializada em automação predial, redes estruturadas, sistemas fotovoltaicos e segurança predial com engenheiros certificados CREA.",
    "url": siteUrl,
    "telephone": "+55 61 99999-9999",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Brasília",
      "addressLocality": "Brasília",
      "addressRegion": "DF",
      "postalCode": "70000-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -15.7801,
      "longitude": -47.9292
    },
    "areaServed": {
      "@type": "Country",
      "name": "Brasil"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/umaautomacao",
      "https://www.instagram.com/umaautomacao",
      "https://www.linkedin.com/company/umaautomacao"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Automação Predial",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Redes e Infraestrutura",
            "description": "Fibra óptica FTTH/FTTX, cabeamento estruturado Cat 5/6/6A com certificação OTDR e Fluke"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Energia e Elétrica",
            "description": "Sistemas Fotovoltaicos, fechamento de quadros elétricos, distribuição de energia e aterramento"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Automação Predial",
            "description": "Sistemas de controle e monitoramento predial com integração de sistemas e relatórios de eficiência energética"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Segurança Predial",
            "description": "Câmeras IP, gravação digital em alta definição, visão noturna e infravermelho"
          }
        }
      ]
    }
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.url}`
    }))
  } : null;

  // Combinar schemas
  const allSchemas: object[] = [localBusinessSchema];
  if (schema) allSchemas.push(schema);
  if (breadcrumbSchema) allSchemas.push(breadcrumbSchema);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="UMA AUTOMAÇÃO" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Geo Meta Tags */}
      <meta name="geo.region" content="BR-DF" />
      <meta name="geo.placename" content="Brasília" />
      <meta name="geo.position" content="-15.7801;-47.9292" />
      <meta name="ICBM" content="-15.7801, -47.9292" />

      {/* Language */}
      <html lang="pt-BR" />
      <meta property="og:locale" content="pt_BR" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="UMA AUTOMAÇÃO" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Schema.org JSON-LD - Todos os schemas */}
      {allSchemas.map((schemaItem, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schemaItem)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
