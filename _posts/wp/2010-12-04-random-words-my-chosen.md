---
date: '2010-12-04'
title: Random Words My Chosen
tags:
- php
- wordpress插件
- 随机副标题
categories:
- coder
meta:
  _edit_last: '1'
  _aioseop_keywords: 随机副标题,wordpress插件,随机格言插件
  dsq_thread_id: '796842318'
  _wp_old_slug: random_words_my_chosen
postid: '397'
guid: http://dourok.info/?p=397
---
博客荒废了2个月，不忍让时间悄然飞逝，终于鼓起劲把博客重新整理下。其实不写博客还有另外一个原因，就是我习惯了用Evernote来记笔记。Evernote用起来是很方便，特别是做些文字剪辑。但是用久有些缺点还是很明显，如没有层次结构，用标签管理，如果标签没有规划好，就很容易乱了。得经常需要整理，而我又疏于整理，最后只能越来越乱了。确实不如wiki清晰，且页面间不能互相连接是个缺憾。

说回整理博客，趁这个机会实现了个以前很想实现的功能，就是随机显示不同的副标题(见右上角)。这样就可以把一堆格言名句之类东西扔进去每次访问随机显示一条出来。一开始写在主题文件上面，觉得这样写很丑，便想写成wordpress的插件。仔细了解一番发现写成插件也并不复杂。wordpress的插件主要就是两个行为，一个动作（Action），另一个是过滤器（Filter）。我所写的那个插件主要就是用到过滤器，当页面请求显示博客副标题也就是bloginfo("description")这个方法时，我的插件会将它原本的内容拦截下来替换成格言列表里面的随机一句。就是这么傻瓜化，关于制作插件方面的具体内容，我连php都是现学现写，连个菜鸟都算不上，就不献丑了。下面给出一些帮助我完成这个插件的文章链接供有兴趣者参考：

[http://sexywp.com/wordpress-plugin-api.htm](http://sexywp.com/wordpress-plugin-api.htm)
这个网站还有不少内容，我直接套那个入门模板。

[http://codex.wordpress.org/Writing\_a\_Plugin](http://codex.wordpress.org/Writing_a_Plugin)
官网滴

[http://codex.wordpress.org/Plugin\_API](http://codex.wordpress.org/Plugin_API)
同上，有代码可以偷师。

[http://core.trac.wordpress.org/browser/tags/3.0.1/wp-includes/plugin.php](http://core.trac.wordpress.org/browser/tags/3.0.1/wp-includes/plugin.php)

[http://codex.wordpress.org.cn/Adding\_Administration\_Menus](http://codex.wordpress.org.cn/Adding_Administration_Menus)
如何添加设置菜单

[http://ruby8.javaeye.com/blog/647116](http://ruby8.javaeye.com/blog/647116)

[http://www.w3school.com.cn/php/index.asp](http://www.w3school.com.cn/php/index.asp)
W3school的php教程挺简洁的

最后，给出插件的下载的地址，欢迎使用，指正错误。

[random-words-my-chosen](http://dourok.info/wp-content/uploads/2010/12/random-words-my-chosen.zip)

关于php再唠叨一下，每个变量前要加个\$符号真的很不爽啊，试过在访问数组的时候，索引忘了加"\$"，在记事本上写又不报错哦。结果调试了半天。还有，写过php后,我就忘了javascript该怎么写...真的挺像的。
