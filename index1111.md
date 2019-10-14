---
layout: homepage
title: 'Isomer Pages Template'
description: 'test **test**'
permalink: /
url: 'https://www.tech.gov.sg'
plugins:
    - jekyll-feed
    - jekyll-assets
    - jekyll-sitemap
safe: false
exclude:
    - travis-script.js
    - .travis.yml
    - README.md
    - package.json
    - package-lock.json
    - test_suite
    - node_modules
collections:
    application-guidelines:
        output: true
        permalink: '/:collection/:path/:title'
    who-we-are:
        output: true
        permalink: '/:collection/:path/:title'
    products-and-services:
        output: true
        permalink: '/:collection/:path/:title'
resources_name: resource_room
paginate: 12
custom_css_path: /do-not-touch/theme-colors/custom.css
custom_print_css_path: /assets/css/print.css
recommender: true
favicon: /assets/img/favicon.ico
google-analytics: UA-test
defaults:
    -
        scope:
            path: ""
        values:
            layout: page
---
{%- comment -%} Type your notification here - the notification bar will not appear if this is empty. For other changes, refer to _data/homepage.yml to edit the homepage {%- endcomment -%}
###### This website is in beta - your valuable [feedback]({{site.feedback_form_url}}){:target="_blank"} will help us in improving it.