---
layout: simple-page
permalink: /test/
breadcrumb: Test
title: Test
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
