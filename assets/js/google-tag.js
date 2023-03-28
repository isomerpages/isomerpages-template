---
layout: blank
---

// We use layout:blank to make use of jekyll config params
// Imported script so it isn't blocked by our CSP
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());

// Set Isomer's ga tag
gtag('config', 'G-3RT85MXN6L');

// Set site specific ga tag
if ('{{site.google_analytics_ga4}}' && '{{site.google_analytics_ga4}}' != "") {
  gtag('config', '{{site.google_analytics_ga4}}');
}