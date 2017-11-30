---
title: Ruhoh 札记
date: '2012-08-20'
description:
categories:
- coder
- life
tags:
- ruhoh
- ruby
- bootstrap
- markdown
widgets :
  math :
    enable : true
---

{% raw %}

### ruhoh ###

这里<del>也许</del>会成为我第一篇ruhoh的博客，先罗列一下常用的命令吧。

    rackup -p 9292  # 启动 web 服务在 9292 端口
	ruhoh page about.md  #创建一个页面，支持子目录 
	ruhoh post "The Greatest Post Ever" #通过标题创建文章，将会生成 the-greatest-post-ever.md
	ruhoh draft #快速建立一个草稿，生成untitled-draft-1.md 
	ruhoh titleize #快速为草稿文件命名

后台

    http://localhost:9292/dash


断断续续用了 ruhoh 已不止一个月了，用的都是些碎片时间，所以进展并没有多少，现在基本完成作为博客的功能，也扩展了 `note` 和 `diary` 两个新命令，还非常初步，要完善想必得花不少时间吧，但是我觉得用静态网站生成系统来做个人的文章输出平台是非常值得做的尝试。强大的版本控制；数据安全，纯文件，你可以备份到各个云存储平台，各个git仓库；无网络的时候可以离线编辑和预览；markdown 的易读性；还有十足的可操纵感；当然要享受这些好处的前提就是得有一个折腾得起的心。

ruhoh 效率问题暂且不提，现在内容不多也感觉不出来。部署到虚拟主机可能会是比较麻烦的问题，不过我现在在 webfaction 上用着还是很舒服的。另外 plusjade 还提供免费的主机作为普通的博客用绝对绰绰有余，当然不支持插件。另外部署到其他支持 ruby 云服务平台上应该不会有什么问题，如 Heroku。虚拟主机的话，每次更新都要重新编译再上传数据，想想就害怕。

ruhoh 的扩展设计也不完美，或者我是不能明白，分为 widgets，themes 和 plugins，widgets 定义一些可复用的页面代码块，plugins 则是系统扩展，通过ruby脚本实现，有点像动态网站的后台逻辑部分。而像评论模块、google prettify 这些载入js就可以解决的功能，用 widgets 和 themes 实现就很完美，生成 rss、sitemap 则可以用plugins 单独实现。但是实际用起来发觉这三者之间的耦合太大了，比如本博的 toc 和 fancybox 功能。就必须用 plugins 的自定义转换器，来改动 redcarpet 生成的目标代码。然后又得把那些特定的 js 文件、html 代码块放到 widgets 里面，widgets 和 plugins 紧紧的联系在一起，这样要实现一个功能必须得同时使用 plugins 和 widgets ，这样还不如把前端代码直接放到 themes 里来的清晰。当然啦，像 toc 完全前端实现也是可以的，见：[Generating a Table of Contents in Octopress]。

[Generating a Table of Contents in Octopress]: http://brizzled.clapper.org/blog/2012/02/04/generating-a-table-of-contents-in-octopress/

### 评论 ###

静态博客的评论系统只能通过第三方评论系统来实现，ruhoh 是用 widgets 来嵌入第三方评论。內置支持disqus。

我的目的是實現，ruhoh 和  wordpress 的相同篇文章共用一個評論，disqus 提供了這種可能性 [Why are the same comments showing up on multiple pages?]。wordpress 的 disqus 插件使用了 文章的 post_id 和 guid作爲 disqus\_identifier ，模式如下

	post_id + ' ' + guid

所以在 [wp\_to\_ruhoh](https://gist.github.com/3415268) 里，我就這兩個屬性也保留下來。但是 ruhoh 的 widget 不能訪問 page 的數據（吭爹呀），見 [issue52][]。所以只能把代碼放到 theme 的 layout 里。如下:

    <div id="disqus_thread"></div>
            <script type="text/javascript">
                /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO
            YOUR WEBPAGE * * */
                var disqus_title = '{{page.title}}';
                var disqus_identifier ='{{page.postid}} {{page.guid}}';
                var disqus_shortname = 'doousblog'; // required: replace example with your forum shortname
    
                /* * * DON'T EDIT BELOW THIS LINE * * */
                (function() {
                    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                })();
            </script>
            <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
            <a href="http://disqus.com" class="dsq-brlink">comments
                powered by <span class="logo-disqus">Disqus</span></a>


另外，对于 ruhoh 的 post ，如果不想以后换个标题，或者换个域名，都要重新整合评论，最好每篇文章提供一个 unique id 作为 disque_indentifier 使用。post 已经有 id 属性了，用的是相对的文件路径。


[issue52]: https://github.com/ruhoh/ruhoh.rb/issues/52

[Why are the same comments showing up on multiple pages?]: http://help.disqus.com/customer/portal/articles/662547-why-are-the-same-comments-showing-up-on-multiple-pages-

### 主题 ###

关于主题，折騰了幾下，感覺目前我弄的這個主題，並不能發揮bootstrap作爲脚手架的能力，用它的栅格系统总是不能把边栏设计地让人满意。不過响应式布局（responsive）這個特性實在太強了，基本可以保證在不同分辨率的設備上都可以保持比較好的閱讀體驗，<del>不过我分别实现了两个导航栏对应移动设备和pc，从语义上讲这个做法非常糟糕</del>通过 bootstrap 文档主页抄来的代码实现了一个响应式的导航栏。不過單單用 bootstrap 的那些小工具也非常值得，bootstrap 的設計真的很漂亮，像我這種沒有前端經驗的碼農，也可以用的很舒服。

特别遗憾的就是主題左邊那個固定的導航欄不能利用到bootstrap的栅格系统，只能用原來那種方法。

主题的设计偷着下面的这些网站，说好听就是参考了-_-，肯定不止这些的只是我确实想不起来了。

- http://www.sitepoint.com/pure-css3-paper-curl/
- http://yihui.name/cn/
- http://freemind.pluskid.org

相比 wordpress 那未完成的主题，主颜色换成蓝色，去掉了圆角，背景多了些阴影。感觉还不错。

另外还用了下面这些工具，

- http://dublue.com/plugins/toc/
- http://www.appelsiini.net/projects/lazyload
- http://fancyapps.com/fancybox/
- http://ajaxload.info/ 

也没办法一一列举了。

这个 ruhoh 主题可以在这里找到： [Moon]

[Moon]: https://github.com/douo/douo.ruhoh.com/tree/master/themes/moon

### mustache ###

一个 Logic Less （不知道怎么翻译，目的大概是把逻辑还给代码，让模板保持简洁。见 [stackoverflow][]）的模板语言，所以同样以语言无关为目标的 ruhoh
采用了它作为模板语言。参考它的 [demo][] 可以大致了解它的特性，也可以参考一下[我的笔记][]。

[stackoverflow]: http://stackoverflow.com/questions/3896730/whats-the-advantage-of-logic-less-template-such-as-mustache
[demo]: http://mustache.github.com/#demo
[我的笔记]: /notes/coding/mustache

{% endraw %}

### Markdown ###

用了一段時間的 Markdown ，發現 Markdown 主要的缺陷就是太簡單了，優點也是太簡單了，真是矛盾。

折腾一个主题基本上不能回避对  markdown 的转换器做一些改动。幸好 redcarpet 扩展起来十分方便。不过这样就牺牲默认用底层语言实现的转换器的效率。另外万不得已的时候决不对 Markdown 的语法进行扩展，优先用一些现成的扩展版本，幸好现在还不需要到这一步。之前考虑过换一些更强大的标记语言，不过现在看起来还没这个必要放棄 Markdown ，Markdown 很簡潔很漂亮，而且那些简化也是有它的道理的，觉得不爽的时候，还是先坚持一下。

这里有其他同学對Markdown的批評:

-  [Why I hate Markdown (and prefer reST)](http://blog.liancheng.info//why-i-hate-markdown)
-  [The Unbearable Madness of Static Blog Generators](http://freemind.pluskid.org/technology/the-unbearable-madness-of-static-blog-generators)

不过 Markdown 的转义让人抓狂

pandoc 增强的 Markdown 语法 http://johnmacfarlane.net/pandoc/demo/example9/pandocs-markdown.html 

### RSS & Sitemap ###

RSS 和 Sitemap 基本上是每个博客都必备的了。新版的ruhoh 已经内置 rss 生成插件，但是这个插件有不少问题，我参考了wordpress 的 rss 改进了一下，见 [rss.rb][]，rss的标准没有详细了解，希望实现不要不伦不类。

Sitemap 生成我用的是[crchan][]的[Ruhoh Sitemap Generator][]，根据wordpress的Sitemap做了一些做了些改动：[改动版](https://gist.github.com/3736089)

[Ruhoh Sitemap Generator]: https://gist.github.com/3705998
[crchan]: https://github.com/crhan
[rss.rb]: https://gist.github.com/3736010

### 搬家 ###

最后说说搬家，事实证明，想要无痛地将 wordpress 的文章转换到 ruhoh 上是件十分痛苦的事。折腾 ruhoh 有不少时间就是在折腾这个转换脚本。不过现在这个脚本基本上可以完成 87.53% 的转换工作，包括将文章转换为 markdown 格式，感谢 pandoc 。不过还是做了不少 hack。最折腾人的就是 codecolorer 这货，短标签，长标签，各种混用，太可怕了，差点想重新实现它的引擎，最后当然还是放弃，用人工修改一些例外，像是这篇文章：[CodeColorer中文帮助]

脚本由Jekyll 的wordpressdotcom 修改而来，根据我的博客做了很多针对性的hack，可能没有什么适用性。脚本可以在这里找到： [wp\_to\_ruhoh](https://gist.github.com/3415268)

[CodeColorer中文帮助]: /2010/08/03/codecolorer-doc-cn

### 部署 ###

webfaction 真心不错。给 git 加个钩子，用 post-receive 解决全部问题

```bash
#!/bin/bash

HOME=/home/xxx
LOG=$HOME/ruhoh.log
BUILD_DIR=$HOME/tmp/
SITE_DIR=$BUILD_DIR/compiled/
DEPLOY_DIR=$HOME/deploy/
source $HOME/.rvm/scripts/rvm
date >>  $LOG 
unset GIT_DIR
cd $BUILD_DIR
PATH=$HOME/douo-ruhoh/bin:$PATH  #use custom ruhoh to compile
#echo $PATH >>  $LOG
git pull  >>  $LOG
which ruhoh >> $LOG
ruhoh compile >> $LOG
rsync -a --delete-after $SITE_DIR $DEPLOY_DIR >>  $LOG
```


### 其他 ###

#### Mathjax ####

Mathjax的使用非常方便，直接在頁面嵌入腳本就行，然後通過一個 widgets 來載入 mathjax 的腳本。就可以展示公式了。关键是如何定义插入公式的语法，刚好 plusjade 扩展一下转换器插件实现了这个語法：[mathjax.rb](https://gist.github.com/2699636)。

```mathjax
e^{i\pi} + 1 = 0
```

我考虑是否要为页面加入一个Mathjax开关，因为大部分博文都无需用到Mathjax。另外，Mathjax 好像会不定时的出现一些布局错乱的问题。

#### 自动刷新 ####

看了 pluskid 的[文章]，我也跟着实现了保存的时候自动刷新页面。需要安装几个东西

- [guard][]
- [rack-livereload][]
- [guard-livereload][]

[guard]是一个监听文件系统变动的工具，[rack-livereload] 实现了自动刷新。安装和使用看一下各自的 readme 还是很容易明白的，但具体怎么工作我也没弄清楚，反正不用改动ruhoh的一个代码，很方便。不过我在 windows 下安装 [guard-livereload] 出了问题，原因是EventMachine 0.12.10 不能在跑着 ruy 1.9.2+ 的windows上工作。用 pre-release 的版本就可以解决问题，讨论在[stackoverflow](http://stackoverflow.com/questions/6927907/ruby-problem-installing-eventmachine-under-windows-7#) 上。

	gem install eventmachine --pre

发现 guard 这货在 win7 cygwin 下有时进程占用CPU 100%，不知道是什么情况。

[文章]: http://freemind.pluskid.org/technology/the-unbearable-madness-of-static-blog-generators/

[guard-livereload]: https://github.com/guard/guard-livereload

[rack-livereload]: https://github.com/johnbintz/rack-livereload

[guard]: https://github.com/guard/guard


 
