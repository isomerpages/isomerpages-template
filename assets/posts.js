---
layout: blank
---
posts_json=[
    {%- assign putComma = false -%}
    {%- for collection in site.collections -%}
        {%- for post in collection.docs -%}
            {%- if post.permalink or post.file_url -%}
                {%- if putComma -%},{%- endif -%}
                {%- include post.json -%}
                {%- assign putComma = true -%}
            {%- endif -%}
        {%- endfor -%}
    {%- endfor -%}

    {%- for post in site.html_pages -%}
        {%- if post.permalink or post.file_url -%}
            {%- if putComma -%},{%- endif -%}
            {%- include post.json -%}
            {%- assign putComma = true -%}
        {%- endif -%}
    {%- endfor -%}
]