---
date: '2011-05-11'
title: 如何用Mercurial开始GoogleCode项目
tags:
- google
- Google Code
- hg
- Mercurial
categories:
- otaku
meta:
  _edit_last: '1'
  _aioseop_title: 如何用Mercurial开始GoogleCode项目
  _aioseop_keywords: google,Google Code,hg,Mercurial
  dsq_thread_id: '796842627'
postid: '489'
guid: http://dourok.info/?p=489
---
最近打算对自己乱糟糟的代码整理规划下，把一些项目提交到在线的代码仓库。因为自己还算是一个windows用户，所以还是放弃github，选择google
code
加上看起来比较好用的Mercurial（[CVS，GIT，Mercurial和SVN比较](http://www.cnblogs.com/greenmile/archive/2010/04/20/VCS.html)），Netbeans对Mercurial也有很好的支持。

Mercurial用起来还是很方便的，见[Managing a Google Code project with
Mercurial](http://blog.dreasgrech.com/2010/07/managing-google-code-project-with.html)。下面的内容就是翻译整理自这文章，权当记录一下。

### 安装Mercurial

首先，需要在你的机器上安装Mercurial，从这里 http://mercurial.selenic.com/downloads/  选择适合自己系统的版本下载安装。Ubuntu用户可以直接`sudo apt-get install mercurial`。搞定后，打开命令行窗口，键入`hg version`，如果出现类似下面信息的话就OK了。

```
分布式软件配置管理工具 - 水银 (版本 1.7.5)
(see http://mercurial.selenic.com for more information)
```

Copyright (C) 2005-2010 Matt Mackall and others
This is free software; see the source for copying conditions. There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.`

找不到命令的话请检查下环境变量。

### 设置默认用户

当Mercurial成功安装后，还需要设置一个用户作为你提交到仓库的默认用户。
windows用户的话，需要在用户目录（%USERPROFILE%）创建一个名为Mercurial.ini或者.hgrc的配置文件。比如创建`C:\Users\Andreas\Mercurial.ini`
Linux在\$HOME目录创建.hgrc文件 然后在创建好的文件里加上下面内容

```
[ui]
username = 你的名字 <你的邮箱>
```

可以在[这里](http://www.selenic.com/mercurial/hgrc.5.html)找到配置文件的更多选项。

### 创建项目

点这个链接[Google Project
Hosting](http://code.google.com/hosting/createProject)创建新项目，记得在版本控制工具（Version
control
system）选项上选择Mercurial。填完其他项目后就可以创建自己的项目主页了。你的项目大概如：http://code.google.com/p/myhgproject/。
接下来需要先建立本地仓库（repository），再把所有东西提交到在线仓库。首先，打开项目主页下的source标签页，或者这个地址http://code.google.com/p/myhgproject/source/checkout
然后复制页面上的命令： `hg clone https://myhgproject.googlecode.com/hg/ myhgproject`
在本地电脑上打开命令行窗口，进入到想要放着项目的文件夹如~/myproject，执行上面的命令。这个命令将会添加一个在线仓库的副本到本地机器上。这时应该在~/myproject下可以看到Mercurial创建的文件夹myhgproject。现在里面只有个.hg文件夹，接下来就可以把准备提交的项目文件复制到myhgproject下。

现在myhgproject文件夹下已经有项目需要的所有文件夹了，再接下来就要把这些文件添加到本地仓库中，命令行窗口进入myhgproject，执行hg
add，如果有新文件的话就会看到一堆anding xxx的信息。hg add
命令的作用就是把新文件标记为要添加到下一次要提交的仓库中(新添加的文件状态就会由?变为a，可用hg
status查看)，所以接下来就是把这些文件提交到本地仓库中， 使用命令：
`hg commit -m 「Initial commit」` -m
后面的参数是指你这次提交的的一些信息。比如，现在是第一次添加，所以可以说明Initial
commit来说明是第一次提交的意思。

注意，到现在本地的代码还未提交到在线仓库。接下来才是要把本地的代码提交到在线仓库，不过首先你要知道你的google为你生成的
googlecode.com密码.在项目的source页面下可以看到这个链接：[http://code.google.com/hosting/settings](http://code.google.com/hosting/settings)。现在就可以使用你的google用户名和这个密码提交更改到在线仓库了。比如用户名是andreas，密码是AbCdEfGHiJ12。可以用这个命令提交：
`hg push https://andreas:AbCdEfGHiJ12@myhgproject.googlecode.com/hg/`
现在应该可以在在线仓库看到你项目的所有文件了。以后每次做更改后想要提交都需要先提交到本地仓库，用这个命令：
`hg commit -m "这次提交的一些信息"` 也可以不加-m这个参数。如果要添加新文件的话记得先
`hg add` 然后就可以继续这个命令提交到在线仓库
`hg push https://andreas:AbCdEfGHiJ12@myhgproject.googlecode.com/hg/`

### 不想每次提交都打地址？

没问题，其实可以直接键入 `hg push`
不过服务器会要求你输入密码，输入上面的密码后才可以成功提交。如果连密码也不想输，也可以。
打开项目文件夹了的.hg文件夹，可以看到里面有个hgrc文件，如果没有的话也可以自己创建。
在里面加入你的密码

```
[paths]
default = https://andreas:AbCdEfGHiJ12@myhgproject.googlecode.com/hg/
```

明文保存的，要小心密码被泄露。

### SVN转到Mercurial

可以参考这里[在Google Code上用 Mercurial 取代 Subversion
管理你的项目](http://leeiio.me/googlecode-converting-svn-to-hg/)，我也没细看。

知道hg就是汞Hg吧 :lol:
