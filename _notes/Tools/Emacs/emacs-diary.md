---
title: Emacs 日记
date: '2013-01-05'
description:
tags:
- 月亮
---


### 2011-12-27 

`c-h i     打开Manual`

`c-h c-h 或 c-h ? 打开help for help 列出Emacs 所有帮助功能`

最常用的还是

`c-h f 查询函数`

`c-h v 查询变量`

`c-h k 查询按键绑定`

`c-h F 查询命令的文档，而不是函数的描述，对进一步了解命令很有帮助`

另外info这个这个命令也是可以打开Manual的，另外其它info开头的命令都是跟manual有关的。

在Manual也就是info模式中，按h，是可以查看Info模式的使用帮助的。

命令`describe-mode（c-h m）`，是来查看当前模式的帮助的，在Info模式中使用，也可以看到Info模式的操作说明。

###  2011-12-28

使用 Emacs 宏的计数器

`C-x ( C-x C-k C-i C-x )`

### 2012-01-05

emacs 調用外部命令的方法有三种:

`M-!`   shell-command	 直接执行shell命令,Emacs一般同步执行命令,也就是说Emacs会锁住整个UI等待命令执行完毕.这时可以用C-g给命令发送中断命令(SIGINT),如果再按一次C-g则强制中断命令(SIGKILL).

如果命令后有'&',则异步执行命令.在Windows上也是可以的.

完整函数 (shell-command COMMAND &optional OUTPUT-BUFFER ERROR-BUFFER)

OUTPUT-BUFFER 可以指定command的输出位置,指定1的话,可以将output插入到当前buffer. M-1 M-! 也可以达到同样效果.

`M-&`   async-shell-command 异步执行shell命令,实际是在命令后面加上'&'后再调用 shell-command .

但异步命令有个问题,如果为异步命令指定了output-buffer,Emacs又会block整个UI. 所以要使用异步命令必须打开一个 *Async Shell Command* 的buffer.不知是不是bug.

`M-|`  shell-command-on-region  貌似在Windows下有bug.选择region之后还有输命令.

以上命令都在WIn7下用sleep和dir和echo命令测试过.

    dir

### 2012-02-02

#### PICTURE-MODE


C-o 可以在当前行下插入空白行

C-c C-c 返回前一个模式

其他的看 C-h m 吧


### 2012-02-07

#### 缩进

C-x tab indent-rigidly 可以强制缩进

#### 插入

```lisp
(defun insert-code (beg end code)
  (interactive (list (point) (mark) (read-string "what's language?")))
  
  (goto-char (max beg end))
  (insert (concat "</" "code>"))
  (goto-char (min beg end))
  (insert "<code " code ">")
  )
```


### 2012-03-24

C-x r k 剪切一个矩形块

C-x r y 粘贴一个矩形块

C-x r o 插入一个矩形块

C-x r c 清除一个矩形块(使其变成空白)

C-x r t 在选定区域的所有列前插入样的字符

### 2012-03-31

#### Undo

默认的撤销有3个快捷键

- C-x u

- C-/

- C-_ (个人常用这个)


emacs的撤销机制与现代的编辑器有很大的不同,最让人困惑的就是没有redo,一旦问起人们最常见的回答就是undo undo = redo.但是如果你真的非常诚实地按了两次undo，emacs就真的非常诚实的只undo了2次。

谈这个问题之前,先说说我的理解,在buffer中做编辑，而每一次改动都会被emacs记录下来，存放到buffer的改动历史列表中，这个列表就称为状态列表S吧，因为实际上每次改动操作都把buffer从当前状态s_0映射到一个新状态s_1上.所谓改动可以这样定义： 

	T : C^n
	∀s_0,s_1 ∈ T

改动是一个函数集 `F: {f:s0 -> s1|s0!=s1}`

在emacs中每一个编辑操作,新的状态s_n+1会被追加到buffer的状态列表S中。undo也是属于这个函数集，所以它并不能直接改动状态列表S，下面说说我对undo的理解。

想象这样一个这个状态列表S

    s_0 -- s_1 -- s_2 -- ... -- s_n
                                 ^
                                 |
                              当前视图

 
第一次调用undo时,先想象已经有一个指针p_u，p_u -> s_n,undo执行这样一个过程U：p_u自减,(此时p_u -> s_n-1).再将p_u指向的状态复制一份,插入状态队列的头部( 就是将s_n 映射到 s_n-1)，现在队列变成下面那样：

                                p_u
                                 |
                                 v
    s_0 -- s_1 -- s_2 -- ... -- s_n-1 -- s_n -- s_n+1(:s_n-1)
                                                   ^
                                                   |
                                                当前视图

表面看起来就是 `undo: s_n  -> s_n-1`.
 
再一次 undo ,此时p_u还是指向s_n-1,继续执行上面的过程U。第二次undo，列表S变成下面那样:

                                  p_u
                                   v
     s_0 -- s_1 -- s_2 -- ... -- s_n-2 -- ... -- s_n+2(:s_n-2)
                                                      ^
                                                      |
                                                   当前视图

表面看起来就是 undo^2: s_n   -> s_n-2

FIXME 实际上，连续执行undo，emacs 会把它当成一个连续操作，也可以想象成第一次undo使buffer处在undo mode中，这时只要执行任意操作(比如移动光标,C-g也不错)就可以中断这个连续操作，结束undo mode.具体就是重置p_u(p_u -> 当前状态),中断连续undo后，如果此时再undo,列表S变成下面那样:

                                     p_u
                                      V
    s_0 -- s_1 -- s_2 -- ... -- s_n+1(:s_n-1) -- s_n+2(:s_n-2) -- s_n+3(:s_n-1)
                                                                      ^
                                                                      |
                                                                   当前视图

表面看起来就是 `undo^2 * redo: s_n  -> s_n-1 -> s_n-2  ->(redo) s_n-1`

回到redo = undo undo的问题，更应该这样表述redo = undo(undo)   实际上的undo操作就是 undo 重置p_u undo。所以在emacs中几次undo后想要做redo，推荐的操作就是 undo undo undo ... C-g redo redo(实际上还是undo的操作) 。

在buffer中做任何操作，包括 undo redo在内，每个操作所产生的状态都会被记录下来，可以看出buffer的状态列表是只增不减的（暂时这样认为,实际上总长度是有限制的，由

    `undo-limit' 
    `undo-strong-limit'
    `undo-outer-limit' 
   
控制），所以在buffer中所做的任何编辑都不会丢失的，有些同学会认为列表来保存历史状态是不是太浪费，分明就是一颗树嘛，但是emacs为什么不这么做（我不知道emacs的内部实现是不是用树结构），但如果用树来表示，那么undo就不能满足上面的F的定义了，undo不再是一个T上的映射，而变成一个移动当前视图指针的操作，所以我觉得emacs用列表示历史状态,空间上是一种浪费，但概念上确是一种简化。

当然，如果想这么做确实有个扩展可以帮忙。 [undo-tree](http://www.dr-qubit.org/download.php?file=undo-tree/undo-tree.el)

据我所知这个扩展提供一树结构显示状态列表的视图. 见 http://linuxtoy.org/archives/emacs-undo-tree.html

看起来很不错的样子，不过当你看到有n多个节点n多个分支的树想必也没什么食欲吧.


### 2013-01-30

#### 月相

M-x lunar-phases 可以显示最近三个月的月相



