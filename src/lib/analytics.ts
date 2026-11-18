/** Google Search Console ownership token for the https://kaushalhub.in/ URL-prefix property. */
export const GOOGLE_SITE_VERIFICATION = "iB4zCJZU_iKH_UNKjl_VT0S0fOUL0gsNjaX2Zi_ZcGo";

/** Google Analytics 4 web stream for kaushalhub.in. */
export const GA_MEASUREMENT_ID = "G-LFFMXHXFH2";

/**
 * gtag bootstrap. Runs only on the live domain, so local previews and builds are not counted.
 * Client-side page changes are recorded by GA4's enhanced measurement (browser history events).
 */
export const gaBootstrapScript = `(function(){var h=location.hostname;if(h!=="kaushalhub.in"&&h!=="www.kaushalhub.in")return;var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}";document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag("js",new Date());gtag("config","${GA_MEASUREMENT_ID}");})();`;
