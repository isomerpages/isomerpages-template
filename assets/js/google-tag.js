---
layout: blank
---

window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());

// Set Isomer's ga tag
gtag('config', 'G-25BGPGZD1C');

// Set site specific ga tag
if ('{{site.google_analytics_ga4}}' && '{{site.google_analytics_ga4}}' != "") {
  gtag('config', '{{site.google_analytics2}}');
}