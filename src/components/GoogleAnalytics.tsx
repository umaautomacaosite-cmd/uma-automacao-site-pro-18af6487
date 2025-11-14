import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
  enabled: boolean;
}

const GoogleAnalytics = ({ measurementId, enabled }: GoogleAnalyticsProps) => {
  useEffect(() => {
    if (!enabled) return;

    // Load gtag.js script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    return () => {
      // Cleanup script on unmount
      const scriptTag = document.querySelector(`script[src*="${measurementId}"]`);
      if (scriptTag) {
        scriptTag.remove();
      }
    };
  }, [measurementId, enabled]);

  return null;
};

export default GoogleAnalytics;
