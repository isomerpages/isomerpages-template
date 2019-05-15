---
layout: simple-page
permalink: /test/
breadcrumb: Test
title: Test
---
The `layout` of this page is `simple-page`. Below is a set of accordion that is in the markdown itself.

{% accordion Abcde %}
This is some text.
{% endaccordion %}

{% accordion Test 2 %}
More text. Lorem ipsum.
{% endaccordion %}

As you can see, I can put accordions anywhere. Here's an accordion again.

{% accordion Title %}
Hi! I'm a new accordion! You can't make me exist using the old method.
{% endaccordion %}

The syntax to make an accordion is:

```
{%- raw %}
{% accordion Title %}
Hi! I'm a new accordion! You can't make me exist using the old method.
{% endaccordion %}{% endraw -%}
```
