---
title: 新年新博客
date: '2018-01-02'
description:
graphviz: true
tags:
- jekyll
- ruhoh
- lunr
---

### 迁移 Jekyll
网站在 18 年元旦终于重做的差不多了，五年前买的主机在去年 12 月过期了，促使我终于将拖了一年多的 Jekyll 迁移计划落地。Ruhoh 从 14 年就再没有更新，虽然用起来没什么大问题，但总有一些小毛病，比如生成速度过慢(Jekyll 也不快，15 款高配 MBP 全站生成都大概要 10秒)，实时预览的功能也没有 Jekyll 的增长式构建那么强大。作为一个小众的静态博客生成系统基本也没什么生态，迁移到主流的 Jekyll 是迟早的事，只不过我对 Ruhoh 做了不少定制，迁移要在 Jekyll 这边重新实现一遍挺费时间的。

最大的问题就是笔记系统，Jekyll 和 Ruhoh 都支持页面资源的归类和管理，Jekyll 中叫 Collection，Ruhoh 叫 Resource。Jekyll 的理念是所有 Collection 生而平等，但有些 Collection 更平等。比如其他 Collection 就不像 Posts 那样自带标签汇总。Ruhoh 的 Resource 才是真平等，通过插件扩展的能力也更强大当然也更繁琐。之前的笔记和日记就是通过自定义 Resource 实现的。

用 Jekyll 实现笔记系统我没有对 Collection 进行扩展，通过配置来实现部分功能，舍弃了父类别也能生成页面的功能。笔记的树结构 json 通过 generator 插件实现。标签归纳也得自己实现。固定连接反而是最简单的，一条配置搞定：

    scope:
      type: "notes"
    values:
      layout: "note"
      permalink: "/:collection/:path/"

另外还有一些自定义插件，比如 LaTeX， `Kramdown` 是默认支持的。至于 [graphviz][]，我发现 Kramdown 的定制比 Redcarpet 麻烦。最后还是决定用自定义 liquid [tags][] 实现。

{% raw %}
    {% graphviz %}
    digraph G {
    	subgraph cluster_0 {
    	....

    	start [shape=Mdiamond];
    	end [shape=Msquare];
    }
    {% endgraphviz %}
{% endraw %}
{% graphviz %}
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;

	start [shape=Mdiamond];
	end [shape=Msquare];
}
{% endgraphviz %}

还有一个就是[迁移脚本][ruhoh_jekyll.rb]，首先将文章的文件名转换为符合 Jekyll 规则。 Ruhoh 用的模板语言是 [Mustache][]，眼看 Mustache 被微信小程序选用了有机会火了，又被我放弃了…… Markdown 引擎是 [Redcarpet][]，Jekyll 则是 [Liquid][] 和 [Kramdown][]，所以还需对内文做一些转换和过滤。还是最重要的一点是将页面引用的本地资源进行整理。

[graphviz]: https://graphviz.gitlab.io/
[tags]: https://jekyllrb.com/docs/plugins/#tags
[ruhoh_jekyll.rb]: https://github.com/douo/douo.github.com/blob/develop/_plugins/ruhoh_jekyll.rb
[Mustache]: https://mustache.github.io
[Redcarpet]: https://github.com/vmg/redcarpet
[Liquid]: https://shopify.github.io/liquid/
[Kramdown]: https://kramdown.gettalong.org/

### Resource 管理

对页面资源进行管理是由来已久的想法。要求每篇文章（Document）的都有一个独立的资源目录，然后目录内的文件都可以在正文内通过相对路径访问。这样就不用再将所有资源都挤在 media 文件夹，还得用一个`{{ulrs.media}}` 来获取 media 的相对路径。实现是通过一个 [generator][resource_generator.rb] 将资源拷贝到相应路径实现的，最终的目录结构如下：

    _res
    ├── notes
    │   ├── Programming
    │   │   ├── Android
    │   │   │   └── loader
    │   │   │       ├── Loader.png
    │   │   │       └── loader_event.png
    │   ├── Reading
    │   │   └── computer-systems-a-programmer-s-perspective
    │   │       └── CSAPP
    │   │           ├── CSAPP-5.10&5.11.png
    │   │           ├── CSAPP-5.5&5.6.png
    │   │           ├── address_translation.png
    │   │           └── process_address_space.png
    └── posts
        ├── 2013-08-16-the-pain-of-note
        │   └── note_system_review.js
        ├── 2013-10-22-the-pain-of-note-2
        │   └── categories.org
        ├── 2016-12-24-hierarchy-fragment-pager-adapter
        │   ├── b_aa_ba_ca.png
        │   ├── b_ba_baa_baaa.png
        │   └── b_ba_ca.png
        ├── 2017-10-20-lambda-in-android
        │   └── desugar_diagram.png



[resource_generator.rb]: https://github.com/douo/douo.github.com/blob/develop/_plugins/resource_generator.rb

### 命令行接口

Jekyll 是没有对资源进行操作的命令行接口的，这点还是 Ruhoh 做得比较好，可以对每个 Resource/Collection 的命令行接口进行定制。

Jekyll 要可以通过 Commands 插件实现命令行接口。见 [jekyll-moon][]，目前扩展了 `create` 命令，实现了创建 post 和 note。接下来还需要实现创建资源目录、内文搜索，list 等。

[jekyll-moon]: https://github.com/douo/douo.github.com/tree/develop/jekyll-moon

### 主题

后台的事说得差不多，接下来说说前台。主题和网站结构重新做了设计。基于 [Materialize](http://materializecss.com/) 主题也是像素级照搬。不过也算实现了一直很想做的 MD 设计。

用了 ES6 和 Sass，Jekyll 默认支持 Sass 处理器。至于 Es6 用的是 jekyll-babel，babel-source（5.8.35） 快两年没更新了，看来 Rubier 还是喜好 coffee-script 多一些。

### 搜索

网站最大的突破是终于有了能用的搜索，基于 [Lunr](https://lunrjs.com/) 实现的浏览器端的搜索。目前只对标题和标签进行索引。

Lunr 默认不支持中文，它的建立索引的过程是先通过分词器进行处理，[tokenizer.js](https://github.com/olivernn/lunr.js/blob/master/lib/tokenizer.js)

再对每个 token，通过 pipeline 进行处理，默认有三个 pipeline：

    builder.pipeline.add(
        lunr.trimmer, // 过来所以非 \W 字符，中文会在这里被过滤掉
        lunr.stopWordFilter, // 过滤停止词
        lunr.stemmer // 返回词干
      )

考虑到中文分词的复杂性，所以我将分词放在 Ruby 端处理，找了一遍没有找到特别合适的分词器，主要是不想有 native extension，在 travis-ci 上部署不方便。所以目前只是单纯将中文与英文分隔开而已，见 [index_generator.rb][]。要搜索中文最好还是得手动加上通配符，Lunr 的搜索用法可参考 [Searching : Lunr](https://lunrjs.com/guides/searching.html)

[index_generator.rb]: https://github.com/douo/douo.github.com/blob/develop/_plugins/index_generator.rb

### 自动部署
GitHub 虽然支持 Jekyll，但我加了不少 Jekyll 插件，想直接用 GitHub 来部署是不可能的。不过也不是没有办法的，比如用免费的持续集成服务 [travis-ci.org](https://travis-ci.org) 来实现持续部署，Travis 支持部署到 GitHub Page，几行配置搞定：

    deploy:
      provider: pages
      skip_cleanup: true
      github_token: $GITHUB_TOKEN # Set in travis-ci.org dashboard
      local_dir: ${TRAVIS_BUILD_DIR}/_site
      target_branch: master
      on:
        branch: develop
        
Jekyll 的持续集成可参考官方文档 [Travis CI | jekyll](https://jekyllrb.com/docs/continuous-integration/travis-ci/)

### 支持 HTTPS 的免费主机

到这里基本实现了 `push` 后自动构建并部署到 https://douo.github.com 由 GitHub 来免费托管，也可以绑定自己的域名，一切看起来都很美好。但要为自己的域名添加免费 HTTPS 支持就没那么容易。幸好 [Netlify](https://www.netlify.com/) 恰能提供这样的服务，并支持绑定免费的 [Let's Encrypt - Free SSL/TLS Certificates](https://letsencrypt.org/) 证书，具体可参考：[GitHub Page 博客自定义域名添加 HTTPS 支持](https://jaeger.itscoder.com/web/2017/08/30/github-page-https)
