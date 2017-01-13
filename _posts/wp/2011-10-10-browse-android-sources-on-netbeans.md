---
date: '2011-10-10'
title: 在Netbeans上查看Android源码
tags:
- Android
- NBAdroid
- Netbeans
categories:
- coder
meta:
  _edit_last: '1'
  _aioseop_title: 在Netbeans上查看Android源码
  _wp_old_slug: browse_android_sources_on_netbeans
postid: '606'
guid: http://dourok.info/?p=606
---
Netbeans7.1终于有像Eclipse一样的Attach
Sources按钮，可以为android.jar附加源码了。虽然现在Netbeans 7.1
还处在测试阶段，但这个功能太重要了，迫不及待要去尝鲜，不过其实现在也足够稳定了。

[![](wp-content/uploads/2010/05/attach_sources.png "attach_sources")](wp-content/uploads/2010/05/attach_sources.png)

先下载[Netbeans 7.1 beta](http://netbeans.org/community/releases/71/)，然后在[这里](http://adt-addons.googlecode.com/svn/trunk/source/com.android.ide.eclipse.source.update/plugins/)可以下载到打包好android各版本的源码，这是个jar档案需要解压出来。另外，如果已安装有旧版本的netbeans，如7.0；需要注意一个问题，如[Bug-200698](http://netbeans.org/bugzilla/show_bug.cgi?id=200698)里jn0101@netbeans.org
的描述。如果7.1和旧版的netbeans共用一个userdir可能会导致"Attach Sources"按钮失效。我试过了确实会这样（linux下）。解决方法可以用[--userdir](http://wiki.netbeans.org/FaqAlternateUserdir)给netbeans 7.1重新指定一个新userdir。不过，我是直接把.netbeans文件删掉，当然有先备份，然后，先配置好7.1的nbandroid，然后把sources.zip附到相应的android.jar。再把备份的7.0拷回来。可以把7.0的一些config拷给7.1，如：Editors和Keymaps等等。这样两个版本都可以正常工作了。
[![](wp-content/uploads/2010/05/view_sources.png "view_sources")](wp-content/uploads/2010/05/view_sources.png)

另外，意外的是在debug下还能工作的挺好的。
[![](wp-content/uploads/2010/05/debug_view.png "debug_view")](wp-content/uploads/2010/05/debug_view.png)

[NBANDROID-71](http://kenai.com/jira/browse/NBANDROID-71)基本可以算解决了。

见此,如何[在Netbeans上配置Android开发环境](http://dourok.info/2010/05/%e5%9c%a8netbeans%e4%b8%8a%e9%85%8d%e7%bd%aeandroid%e5%bc%80%e5%8f%91%e7%8e%af%e5%a2%83/ "在Netbeans上配置Android开发环境")
