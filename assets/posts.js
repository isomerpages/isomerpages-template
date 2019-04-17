---

---
posts_json=[
    {%- for collection in site.collections -%}
        {%- unless forloop.first -%},{%- endunless -%}
        {%- for post in collection.docs -%}
            {%- if post.permalink or post.file_url -%}
                {%- include post.json -%}
            {%- endif -%}
        {%- endfor -%}
    {%- endfor -%}

    {%- for post in site.html_pages -%}
        ,
        {%- if post.permalink or post.file_url -%}
            {%- include post.json -%}
        {%- endif -%}
    {%- endfor -%}
]