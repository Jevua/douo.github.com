---
title: 为 Ruhoh 生成文章目录
date: '2012-11-20'
description:
categories: coder
tags:
- ruhoh
- ruby
- markdown
- toc
- mustache
---
{{=<% %>=}}
为文章生成目录，即所谓的 TOC（Table of Contents）， 可以在前台或后台实现。显然在前台，即用 javascript 实时生成目录，更简单明了，而且 [@brianclapper][] 早已提供一个在 Octopress 上实现的[方法][]，在 ruhoh 上可以用 widgets 实现，但是要实现根据 page 参数来开启关闭还是比较麻烦，因为现在 ruhoh 的 widgets 不能读取到 page 的数据，不过这也只是小问题，不是我选择后台实现的原因。

为何要在后台生成目录？首先，我觉得目录应该和正文一样是属于文章的一部，所以我不能接受需要一个 javascript 解析器才能把文章显示完整。另外，我一开始是希望能有很高的灵活性，支持三种开启目录的模式，分别是自动，强制开启，强制关闭，后来觉得只有标题超过一定的数量才生成目录，也就是自动这一个模式就已足够，最重要的是这一部分的代码之前我已经实现好了。还有，用插件实现编译一次搞定，不用每次访问都浪费计算资源去生成目录，这也算是优点之一吧。

一开始没想那么多，直接用 Markdown Converter 来生成目录，把目录代码直接加入到 Markdown 转换后的最终文档上，但是这种做法有很大的缺陷，目录不能与文章内容分离出来放在页面的其他地方，毫无灵活性可言。理想中的做法，是可以用`{{page.toc}}`在模板中指定目录的位置，通过 partial 来定制 toc 的模板，后来做了笔记系统需要两个不同风格的目录，这个问题更不能回避了。

为了通过 mustache 标签来载入 TOC，就得牺牲一下效率了，因为 ruhoh 的编译流程所限，不能做到将 Converter 工作后的产生的数据，为 Mustache 解析器所用。这样表达好像不清楚，换句话说因为目录的数据是需要 Markdown Converter 来生成，就是说将 markdown 转换为 html 后，才知道目录是长什么样的，而这个过程是在 mustache 的 render 方法里，所以 mustache 无法获取到 Converter 里的数据，于是当模板需要目录的时候，只能再去解析一遍 Markdown 文件，也是说一个 Markdown 文件必须经过两次解析才能生成目标页面，不过目前效率还远远不是问题。

实现的细节，代码见 [toc_render.rb][] 和 [custom.rb][]，[toc_render.rb][] 是生成 TOC 的 Markdown 解析器，[custom.rb][] 定义了 mustache helper `{{page.toc}}`。另外还有 [limdown.rb][]，是生成页面最终效果的 Markdown Converter，它为每个 header 加上 id。

以文章[Ruhoh 札记][]为例，它的目录数据是这样的：

```ruby
{:level=>0,
 :children=>
  [{:text=>"ruhoh", :level=>3, :count=>0, :anchor=>"toc_0", :children=>[]},
   {:text=>"评论", :level=>3, :count=>1, :anchor=>"toc_1", :children=>[]},
   {:text=>"主题", :level=>3, :count=>2, :anchor=>"toc_2", :children=>[]},
   {:text=>"mustache", :level=>3, :count=>3, :anchor=>"toc_3", :children=>[]},
   {:text=>"Markdown", :level=>3, :count=>4, :anchor=>"toc_4", :children=>[]},
   {:text=>"RSS &amp; Sitemap",
    :level=>3,
    :count=>5,
    :anchor=>"toc_5",
    :children=>[]},
   {:text=>"搬家", :level=>3, :count=>6, :anchor=>"toc_6", :children=>[]},
   {:text=>"部署", :level=>3, :count=>7, :anchor=>"toc_7", :children=>[]},
   {:text=>"其他",
    :level=>3,
    :count=>8,
    :anchor=>"toc_8",
    :children=>
     [{:text=>"Mathjax",
       :level=>4,
       :count=>9,
       :anchor=>"toc_9",
       :children=>[]},
      {:text=>"自动刷新", :level=>4, :count=>10, :anchor=>"toc_10", :children=>[]},
      {:text=>"TODO",
       :level=>4,
       :count=>11,
       :anchor=>"toc_11",
       :children=>[]}]}]}
```

这是一个树结构，也是一个递归结构，在 Mustache 中需要递归载入 partial 来能表现这种数据结构。比如笔记系统所使用的两个 partial。


note_toc.mustache:

```mustache
{{# page.toc }}
<div class="span3 toc"><ol class="toc-list">
   {{#children}}
     {{> toc_li}}
   {{/children}}
</div>
{{/ page.toc}}
```

toc_li.mustache:

```mustache
<li><a href="#{{anchor}}">{{{text}}}</a>
<ul>
   {{#children}}
     {{> toc_li}}
   {{/children}}
</ul>
</li>
```



[toc_wrapper]: https://github.com/douo/douo.ruhoh.com/blob/master/themes/moon/partials/toc_wrapper.html

[limdown.rb]: https://github.com/douo/douo.ruhoh.com/blob/master/plugins/converters/limdown.rb

[custom.rb]: https://github.com/douo/douo.ruhoh.com/blob/master/plugins/custom.rb

[toc_render.rb]: https://github.com/douo/douo.ruhoh.com/blob/master/plugins/toc_render.rb

[Ruhoh 札记]: /2012/08/20/something-about-ruhoh

[方法]: http://brizzled.clapper.org/blog/2012/02/04/generating-a-table-of-contents-in-octopress/

[@brianclapper]: https://twitter.com/#!/brianclapper

<%={{ }}=%>

