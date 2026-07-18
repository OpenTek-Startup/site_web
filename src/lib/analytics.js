// Chargement conditionnel de Google Analytics 4 et/ou Google Tag Manager.
// Ne fait rien tant que les variables d'environnement ne sont pas
// renseignees (voir .env.example) - aucun risque de casser le site en
// attendant la creation des comptes Google.

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GTM_ID = import.meta.env.VITE_GTM_ID;

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;

  if (GTM_ID) {
    const script = document.createElement("script");
    script.async = true;
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(script);
    return;
  }

  if (GA_MEASUREMENT_ID) {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }
}

// A appeler depuis le formulaire de contact / bouton "Get In Touch" une fois
// le tag de conversion Google Ads cree, pour suivre les leads generes.
export function trackConversion(conversionLabel) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: conversionLabel,
  });
}
