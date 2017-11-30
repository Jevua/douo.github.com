---
title:  Eclipse
date: '2012-08-10'
description:
---
# Eclipse #

## 个性化 ##

### 配色 ###

[Eclipse Color Theme]可以下载到大量的配色主题，用了很长一段时间的 [Oblivion] 。

[Zenburn]: http://eclipsecolorthemes.org/?view=theme&id=2 "Zenburn"

[Oblivion]: http://eclipsecolorthemes.org/?view=theme&id=1 "Oblivion"

[Eclipse Color Theme]: http://eclipsecolorthemes.org

### 按键 ###

用类 Emacs 的按键绑定，内置的 Emacs 按键绑定功能有点弱了，用 [Emacs+] 代替，有非常实用的 yank ring 和 minibuf 。Emacs+ 对 Juno 的支持不好，只能用回3.7，见这个[讨论]。

*  Emacs+ 電信訪問居然跳轉到google主頁，翻牆沒問題。臨時建了個牆內[鏡像（3.6.5）][emacsplus_dourok]

找到了个支持 Juno 的 emacs+ alpha 版:[emacs-juno-alpha](Emacs+ for Juno)


[emacs-juno-alpha]: http://www.mulgasoft.com/emacsplus/juno
[emacsplus_dourok]: http://dourok.info/update-site/emacsplus


#### 自定义按键 ####

另外还需要自定义些按键

    Quick Fix  -> Alt+Enter
	Toggle Toolbar Visibility -> Ctrl+F6
	Quick Outline -> C-X,O
	Format -> C-X,F
	Build Clear -> Shift Meta C

##### Mac



### 自定义 outline

Eclipse 支持像xcode `#pragma mark` 一样的定制 outline 的功能，就是用 @category 注解。

	/**
	 * @category init
	 */



### 其他

安裝 marketplace

`Java -> Editor -> Templates` 增加一个模板
    
	Name    : sout
	Pattern : System.out.println(${word_selection}${}${cursor});
	
`Java -> Editor -> Content Assist -> Favorites` 可以定义 content assist 默认的静态导入成员

`General -> Workspace`  編碼改爲UTF-8 ， 換行符改爲 Unix。

[讨论]: https://groups.google.com/forum/?fromgroups#!topic/emacsplus/U753GoSYwTQ%5B1-25%5D

[Emacs+]: http://www.mulgasoft.com/
