---
title: 关于笔记
date: '2013-09-28'
description:
type: draft
---

### 笔记的定义


记录，把所见所闻通过一定的手段保留下来，并作为信息传递开去。[笔记(维基百科)][wiki]，[笔记(百度百科)][百度百科]

[wiki]: http://zh.wikipedia.org/wiki/%E7%AC%94%E8%AE%B0
[百度百科]: http://baike.baidu.com/subview/58308/9231697.htm?fromId=58308&from=rdtself


### 记笔记的意义

经常盘旋在脑中的想法是，会不会因为专注于记笔记而忽略于想法本身。把笔记当成思考锻炼，不如去刷几道题。

是否记录了正确的东西，记录的内容是否真的有用？

做了这个平台，感觉回头率接近于零，反问自己这些方法是否有用。是否过分专注于笔记，而忽略知识本身。

价值在于不断的组织?

有些东西在当时的脑子里是理解了，但是很难将它表达出来。后来忘了，重新做的时候，还有从头再来一遍。

做开发的时候会遇到很多坑，是否需要把每个坑都记录起来。
一般可以通过搜索引擎直接找到的内容，便不需记录了。

记录笔记后，怎么样才可以高效的定位到。

### 记笔记的方法

在写代码的时候，实现了一个好的模式，估计以后用到，那我该如何记录起来方便以后的检索？

笔记的利用

是否需要保有两个平台,Note & Evernote.差异化体现在哪,这样的差异化是否有必要

那么多技巧是否需要记忆在脑中

记的越多忘的越多，不能仅仅是一个贴便签的地方，而是需要慢慢提炼，慢慢精简。让结构逐渐清晰。

知识也不能永久，学习方法比知识更重要。记笔记的目的，就是提高学习效率。

工作笔记的目的，帮助理解某一块的知识，记录具体的操作方式，方便检索。

联系。



做。

生活的内容方方面面，列出各个关注的领域。

回顾以前的笔记，分析一直以来记笔记的不足。

具体可实施的步骤.

	标签起到摘要和归纳的作用。如果要查找，还是内文搜索好。


#### 死记与活用

在 LinearLayout 中，如何实现底部工具栏。在网上可以找到下面这样的方法，

    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical" >
    
        <fragment
			android:id="@+id/content"
            android:layout_width="match_parent"
            android:layout_height="0dip"
            android:layout_weight="1"
            android:padding="0dp" />

        <fragment
            android:id="@+id/footer"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_weight="0" />
    </LinearLayout>
	
然后，我把它记下了，以后需要用到这种布局。就来复制粘贴一份。

后来，了解了 LinearLayout onMeasure 方法，明白了 LinearLayout 布局的过程。

	step 1

	total = sum(c.dimenity)
	weights = sum(c.weight)  or layout_weight
	empty = available space - total

	step 2
	c.d =  c.d + empty * (c.weight / weights)

以宽度为例，第一步，先测量各个控件的宽度，得到剩下的空间。第二步，把剩下的空间按照weight分配给各个组件。

 

#### 实际效果

比如 Emacs ，学习如何利用内建文档，来快速查找到想要的内容。比单纯记下几个命令的用法和作用好的多。


#### 分类

组织信息是一门很高深的学问。要做好分类就非常难

如何保证每个子类是互斥的，之间没有交叉。

维护了一份分类描述文件 [categories.org](categories.org)

#### 读书笔记

把书介绍给别人的语气，来做读书笔记。书有自己的知识系统，这些知识将最终融入自己的知识网络中。所以读书笔记只是一种临时的笔记，介绍，归纳，标记，评论之用。

#### other

另外工作越发低效，不断分心。一篇文章写了一个月还不能算没开始。关于记笔记的一些反思，其实算是一个课题了，这段期间确实有学到点东西，那也可以理解吧。

其中有两个方向，一个是分类，另一个是价值。

有价值的东西，思想比知识更有价值，知识比信息更有价值。

这个三个概念其实是三个层次，如何定义，如何界定是个问题。甚至是相对的。

记录下知识，提炼出思想。

工具，找到好工具，学会用工具。Evernote 主攻信息，加上知识。Notes 主攻知识，再提炼出思想。但两者都是工具，方便，好用，快速也是很重要的一点。

#### 习惯

随便想到要写个什么东西,创建笔记还不够方便.一条 notes 命令是很容易,但是创建和编辑不在同一个系统(可以写个 shell 脚本,或者 emacs 插件)
显然不如 evernote 方便

同步,一个小修改要同步,需要 git add  git commit git push

其他机器需要 (git fetch git merge)/ git pull

evernote 这方面是压倒性优势


### Evenote 对比

Evernote？

优点：

全平台支持
树状笔记本
附加功能强大，上传照片，地理位置，剪切
索引，搜索
分类，排序
文本段加密
提供接口？

缺点：

庞大启动缓慢
可视化编辑器
不支持应用加密
不支持笔记本加密
浏览与编辑一体
Writing System

优点

可定制性无敌
markdown （顺手的 emacs 编辑器）
版本控制（目前还没发挥过这个优势）
命令行接口
自己部署
分层清晰
缺点

编码难度
依附于 git，移动端尚未成熟
只有命令行
方法论尚未形成（同 evernote）



附件放在仓库里并不合适
