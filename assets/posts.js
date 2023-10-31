---
layout: blank
---
posts_json=[
    {%- assign putComma = false -%}
    {%- assign counter = 0 -%}
    {%- for collection in site.collections -%}
        {%- for post in collection.docs -%}
            {%- if post.permalink or post.file_url -%}
                {%- if putComma -%},{%- endif -%}
                {%- include post.json -%}
                {%- assign counter = counter | plus: 1 %}
                {%- assign putComma = true -%}
            {%- endif -%}
        {%- endfor -%}
    {%- endfor -%}

    {%- for post in site.html_pages -%}
        {%- if post.permalink or post.file_url -%}
            {%- if putComma -%},{%- endif -%}
            {%- include post.json -%}
            {%- assign counter = counter | plus: 1 %}
            {%- assign putComma = true -%}
        {%- endif -%}
    {%- endfor -%}

    {%- for record in site.data.all.records -%}
    {%- if putComma -%},{%- endif -%}
    {
        "title": "{{ record.title | escape }}",
        "id": "{{ counter }}",
        "content": "{{ record.date | escape }} - {{ record.main_category | escape }} - {{ record.sub_category | escape }} - {{ record.notification_no | escape }} - {{ record.title }} - {{ record.file_url }}",
        "url": "{{ record.file_url | escape }}",
    }
    {%- assign counter = counter | plus: 1 %}
    {%- assign putComma = true -%}
    {%- endfor -%}
]

console.log(`index built`,posts_json)
