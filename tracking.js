// tracking.js — Recruiter visit tracking for Camille's portfolio
// Uses Google Analytics 4 with referral link tracking
//
// SETUP:
//   1. Create a GA4 property at https://analytics.google.com
//   2. Replace 'G-XXXXXXXXXX' below with your Measurement ID
//
// USAGE:
//   Share tracked links with recruiters:
//     https://ctt011.github.io/Camille-Tran-Website/?ref=google
//     https://ctt011.github.io/Camille-Tran-Website/?ref=meta-jane
//     https://ctt011.github.io/Camille-Tran-Website/projects/?ref=palantir#portos-aip-agent
//
//   Then check GA4 > Reports > Engagement > Events to see:
//     - "recruiter_visit" events with the ref source
//     - Which pages they viewed and how long they stayed

(function () {
  const GA_MEASUREMENT_ID = 'G-8NCCT18D9V';

  // Skip tracking in local development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  // Load the GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  // Capture ?ref= parameter and persist across page navigation
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');
  if (ref) {
    sessionStorage.setItem('portfolio_ref', ref);
  }
  const source = sessionStorage.getItem('portfolio_ref') || 'direct';

  // Send page view with referral context
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: location.href,
    referral_source: source,
  });

  // Fire a distinct event for tracked recruiter visits (only on landing)
  if (ref) {
    gtag('event', 'recruiter_visit', {
      recruiter_ref: ref,
      landing_page: location.pathname + location.hash,
    });

    // Clean the ?ref= from the URL bar so the recruiter doesn't see it
    const cleanUrl = location.pathname + location.hash;
    history.replaceState(null, '', cleanUrl);
  }

  // Track hash changes (for project detail navigation like #portos-aip-agent)
  window.addEventListener('hashchange', function () {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: location.href,
      referral_source: source,
    });
  });
})();
