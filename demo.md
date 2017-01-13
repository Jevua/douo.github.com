---
layout: page
title: Demo
permalink: /demo/
---

This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](http://jekyllrb.com/)

You can find the source code for the Jekyll new theme at:
{% include icon-github.html username="jekyll" %} /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at
{% include icon-github.html username="jekyll" %} /
[jekyll](https://github.com/jekyll/jekyll)

<ul>
  {% for post in site.notes %}
    <li>
      <a href="{{ post.url }}">{{ post.title}}</a>
    </li>
  {% endfor %}
</ul>
