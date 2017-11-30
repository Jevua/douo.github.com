---
title: 'orgmode'
date: '2012-10-24'
description:
tags:
- org
---
### 总览

orgmode 是一个用文本做笔记，TODO List，项目管理的 Emacs 扩展。

- 主页：http://orgmode.org/ 
- Html 版本的[手册](http://org.mode.org/org.html)


### 快捷键

文档推荐的快捷键设置

    ;; 设置 org 常用键
    (global-set-key "\C-cl" 'org-store-link)
    (global-set-key "\C-cc" 'org-capture)
    (global-set-key "\C-ca" 'org-agenda)
    (global-set-key "\C-cb" 'org-iswitchb)
	

- `TAB` org-cycle 展开折叠当前树
- `S-TAB/C-u TAB` org-global-cycle 全局展开折叠
- `C-c C-x b` 在新 buffer 里打开当前树

其他见: http://orgmode.org/org.html#Visibility-cycling

大纲间的移动: http://orgmode.org/org.html#Motion


####  TODO 列表

[这里](http://www.laihj.net/tag/orgmode/)有详细总结

**创建一个TODO项目**：`C-S-RET`
	
**改变TODO状态，TODO项在三个状态中循环**：`C-c C-t` (unmarked)->TODO->DONE.

**创建一个目前层级的TODO项**：`S-M-RET`

**设置 SCHEDULED 日期**：`C-c C-s`

**设置 DEADLINE 日期**：`C-c C-d`


循环的任务，如下面例子

	* TODO 刷牙							      :tag:
	   SCHEDULED: <2012-10-24 Wed .+1d>
 
`.+1d` 表示**任务每天重复一次**，

**为任务打上标签**：`C-c C-q`
	 
将某一个节点**打上ARCHIVE标签**：`C-c C-x a`

**同样是归档当前节点**：`C-c C-x A`。
将当前节点归入一个名为Archive的子树中，并且这个子树是位于当前级别子树的最下方。


文章中 agenda view 方面的快捷键失效了
