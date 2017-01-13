---
date: '2012-04-29'
title: Lonely Android
tags:
- Android
- processing.js
- wordpress插件
categories:
- coder
meta:
  _edit_last: '1'
  dsq_thread_id: '796842725'
postid: '685'
guid: http://dourok.info/?p=685
widgets :
  processing_js :
    enable : true
---
<canvas data-processing-sources="pjs/lonelyandroid.pjs"></canvas> 两个月前，在某博客看到Android
Developer的一个Flash广告挺有趣的，可以点下[Conveyor.swf](http://static.googleusercontent.com/external_content/untrusted_dlcp/www.android.com/zh-CN//swf/conveyor.swf "conveyor.swf")看看。就想把它做成WordPress
无头像评论者的随机头像（或者叫
[Identicons](http://en.wikipedia.org/wiki/Identicon "Identicon")）应该很可爱的。

所以呢，就把它做出来了。

用了之前我在[这里](http://dourok.info/2011/12/before_2012/)提过的[processing.js](http://processingjs.org)来实现，processing.js很好玩，以后再专门来说一说。

插件的原理很简单，当用户头像载入时，先去请求gravatar有没该用户的头像，有的话就把头像显示出来完事，没有的话就根据用户的id，即邮箱的MD5码生成一个对应的Android机器人出来，这里跟gravatar生成随机头像是一样的，然后再加上个1秒钟的渐变效果。插件都是在客户端运行的，用的是客户端的CPU不会影响到服务器，但获取gravatar图片的跨域问题也挺烦的，现在还没有真正解决。另外这个插件还有个实际点的好处，因为某墙的缘故，gravatar在墙内也是经常抽风的，用这个插件就可以避免出现一片空白，而是换成一个可爱的Android机器人。用了lazyload技术，头像的动画只会在头像出现在视图（viewport）中才会触发，相对来说对页面的流畅程度的影响比较小，不过如果评论多的话，还是慎用（话说评论N多的牛人会用这么白痴的东西吗？）。
插件的具体效果可以点几下下面的框框看看： <canvas data-processing-sources="wp-content/plugins/imandroid/js/imandroid.pjs"></canvas>
因为是用了processingjs，还需要导入processingjs框架，而插件本身是没有提供这个框架的，所以呢装这个插件之前，推荐先装一下这个：[http://www.ramoonus.nl/wordpress/processing-js/](http://www.ramoonus.nl/wordpress/processing-js/)

这个插件可以在这里下载：[imandroid](https://wordpress.org/extend/plugins/imandrod/)。

其实在用processingjs实现之前我已经在Android平台上实现了这个东东，幸好有processingjs这么像java语法的东西让我省了不少力气移植到js上来。
不浪费顺便弄了个动态壁纸（live wallpaper），到[Play
Store](https://play.google.com/store/apps/details?id=info.dourok.imandroid)看下吧。
