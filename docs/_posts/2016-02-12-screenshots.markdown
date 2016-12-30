---
layout: test
title: screenshots
date:   2016-02-12 17:50:00
---

{{ page.title }}
================

{% capture my-include %}{% include index.md %}{% endcapture %}
{{ my-include | markdownify }}
