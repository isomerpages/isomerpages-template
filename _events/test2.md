---
layout: event
permalink: /events/test-event-2/
image: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F60116727%2F188368147152%2F1%2Foriginal.20190410-071406?w=512&amp;auto=compress&amp;rect=28%2C0%2C8984%2C4492&amp;s=afceb3dd8236774e492a07659577a09e"
start: 2019-05-04 13:40
end: 2019-05-04 15:20
address: Test Street
breadcrumb: Test Event 2
title: Test Event 2
---
The `layout` of this page is `simple-page`. Below is a set of accordions that is in the markdown itself.

{% accordion Title title title %}
This is some text.
{% endaccordion %}

{% accordion Title! 1's %}
More text. Lorem ipsum.
{% endaccordion %}

As you can see, I can put accordions anywhere. Here's an accordion again.

{% accordion JSKH:djlkfsaf"!3w452 dsafdsf423 %}
Hi! I'm a new accordion! You can't make me exist using the old method. *is this markdown?*
{% accordion Accordion in accordion!!!1!111! %}
Lorem ipsum sit amet. [Google](https://www.google.com)
{% endaccordion %}
{% endaccordion %}

The syntax to make an accordion is:

```
{%- raw %}
{% accordion Title of Accordion %}
Hi! I'm a new accordion! You can't make me exist using the old method. 

**You can write everything in here using Markdown as usual!**

You can even put an accordion in an accordion!
{% endaccordion %}{% endraw -%}
```

The above yields:

{% accordion Title of Accordion %}
Hi! I'm a new accordion! You can't make me exist using the old method. 

**You can write everything in here using Markdown as usual!**

You can even put an accordion in an accordion!
{% endaccordion %}

![test image](/assets/img/facebook.png)