---

---
{% assign index = 0 %} {% assign tempindex = 0 %}
posts_json=[
    {%- assign tempindex = -1 | plus: 0 -%}

    {%- for collection in site.collections -%}
        {%- for post in collection.docs -%}
            {%- capture index -%} 
                {{ tempindex | plus: forloop.index}}
            {%- endcapture -%}
            
            {%- include post.json -%},
        {%- endfor -%}
        {%- assign tempindex = index -%}
    {%- endfor -%}

    {%- for post in site.html_pages -%}

		{%- capture index -%} 
			{{ tempindex | plus: forloop.index}}
		{%- endcapture -%}

    	{%- include post.json -%}{% unless forloop.last %},{% endunless %}
    {%- endfor -%}

]