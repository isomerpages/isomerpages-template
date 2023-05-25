---
layout: blank
---

// We use layout:blank to make use of jekyll config params
// Imported script so it isn't blocked by our CSP
const perfObserver = new PerformanceObserver((observedEntries) => {
  const entry =
    observedEntries.getEntriesByType('navigation')[0]
  console.log('pageload time: ', entry.duration)
  // window.dataLayer.push({ pageLoadTime: 5 })
  // if (entry.duration === 0) return
  const parsedLoadTime = Math.round(entry.duration / 100) / 10;
  console.log(parsedLoadTime)
  window.dataLayer.push({ 
    event: 'performance',
    entryType: entry.entryType,
    pageLoadTime: Math.round(entry.duration / 100) / 10, 
  })
})

perfObserver.observe({
  type: 'navigation',
  buffered: true
})

window.dataLayer = window.dataLayer || [];
function gtag(){
  window.dataLayer.push(arguments);
}
gtag('js', new Date());

// Set Isomer's ga tag
gtag('config', 'G-3RT85MXN6L');

// Set site specific ga tag
if ('{{site.google_analytics_ga4}}' && '{{site.google_analytics_ga4}}' != "") {
  gtag('config', '{{site.google_analytics_ga4}}');
}