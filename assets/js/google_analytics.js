---
layout: blank
---
window.ga=window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;

ga('create', 'UA-139339739-1', 'auto', 't1');

ga('t1.require', 'pageVisibilityTracker', {
    sendInitialPageview: true,
});
ga('t1.require', 'outboundLinkTracker', {
    shouldTrackOutboundLink: () => true
});

{%- if site.google_analytics -%}
    ga('create', '{{site.google_analytics}}', 'auto', 't2');

    ga('t2.require', 'pageVisibilityTracker', {
        sendInitialPageview: true,
    });

    ga('t2.require', 'outboundLinkTracker', {
        shouldTrackOutboundLink: () => true
    });
{%- endif -%}
