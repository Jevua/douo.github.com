---
title: Android Studio
date: '2013-05-24'
description:
tags:
- grandle
- Google IO
---

### 2016 

#### Inotify Watches Limit

见 [Inotify Watches Limit - IntelliJ IDEA - Confluence](https://confluence.jetbrains.com/display/IDEADEV/Inotify+Watches+Limit)，在 Arch Linux 下，需要放在 ` /etc/sysctl.d/*.conf ` 见 [sysctl - ArchWiki](https://wiki.archlinux.org/index.php/sysctl)

### 2014

### 基本设置

#### Copyright

	Copyright (c) $today.year. Tiou Lims, All rights reserved.

更改默认换行符

https://www.jetbrains.com/idea/webhelp/configuring-line-separators.html

将文件编码改为 utf-8

Alt + Ctrl + I  修复当前行的缩进（Auto-Indent Lines）

Alt + F7 Find Usage（全部项目）

Alt +Ctrl　＋　F7 使用 popup 显示 FindUsage 结果

Shift + Ctrl + F7 高亮结果

Ctrl + F12  Structure 类似 Eclipse Quick Outline  （居然找不到关闭的快捷键）

Ctrl + Alt + Shift + N 快速跳转到任一个 symbol

### template

默认有 `sout` 使用 C-j 进行补全

不明白eclipse 为什么用 sysout

http://arhipov.blogspot.jp/2011/07/whats-cool-in-intellijidea-part-ii-live.html
https://www.jetbrains.com/idea/features/code_generation.html


### Emacs Keymap

####  option 解决办法

用一个新的 keyboard layout 屏蔽掉 option 的输入字符快捷键，才能在
intellij 中作为meta 键使用。

按照 @dan 的方法实现
http://stackoverflow.com/questions/11876485/how-to-disable-typing-special-characters-when-pressing-option-key-in-mac-os-x

但是新的 layout 不支持 aquamacs

来回切换也麻烦

#### C-X,B

2015-03-10，可以支持了 `C-X,B`

	Emacs Keymap 中 `C-X,B` 默认是打开 Switcher 的，但是 Switcher 不支持这种打开方式，这是个比较特殊的功能，详见官方文档：[Navigating Between Files and Tool Windows](https://www.jetbrains.com/idea/webhelp/navigating-between-files-and-tool-windows.html)

	Switcher 只能使用默认快捷键，`Ctrl+Tab`


### git

用我这个 [.gitignore](https://gist.github.com/douo/9427014)

有个很方便的 VCS operations quick list(M-`, Ctrl + V for Mac))

直接用 cygwin 的 git.ext

http://shrubbery.homeip.net/c/display/W/Using+GIT+with+IntelliJ+IDEA


### 插件


[生成 butterknife 代码](https://github.com/avast/android-butterknife-zelezny)

https://github.com/inmite/android-selector-chapek

https://github.com/Haehnchen/idea-android-studio-plugin

https://bitbucket.org/bric3/jd-intellij






### 2013

#### 导入已存在项目

创建新模块（New Module），选择 Import Existing Project，然后从已存在的项目（Gradle Project）中导入一个模块，结果并不是引用这个模块，而是直接将模块整个模块复制到当前项目下。


#### 打包 .so 文件的技巧

https://groups.google.com/forum/?fromgroups#!topic/adt-dev/nQobKd2Gl_8

#### Overview

Google I/O 2013 放出的新 Android SDK，基于 Intellij IDEA。现在还只是早期预览版本。

https://developer.android.com/sdk/installing/studio.html

http://android-developers.blogspot.com/2013/05/android-studio-ide-built-for-android.html

是否要切换到 Android Studio?

#### 优点

- 跟 Eclipse 比较，UI 更舒服
- 很多激动人心的新特性，见 https://www.youtube.com/watch?v=lmv1dTnhLH4
- Emacs 按键绑定，比Eclipse 默认的强，甚至比 Emacs plus 好用，没那么多Bug。
- 没有遇到过像 Eclipse 假死，崩溃的问题。

#### 缺点

- android studio is not about build
- logcat 颜色怎么设置
- bug多，需要手动编辑 build.gradle
- gradle 速度慢（运行一次要30+秒 单单一次清理也要 10+秒）(mac 15s  clean：5s) `--daemon` 会有所改善
- emacs 按键仍不完整，如 c-x/c-b c-x/c-f 的弹出窗口不能用 c-g 取消


#### intellij idea

[Quick Start](http://confluence.jetbrains.com/display/IntelliJIDEA/Quick+Start) 30天 Guide 是很好的入门阅读材料

Help->Productivity Guide 提升效率的好帮手

先熟悉 IntelliJ IDEA

IntelliJ 的 project 概念跟 Eclipse 的 project 不一样.它的 module 才是类似于 Eclipse 的 project，而他的 project 则类似于 Eclipse 的 workspace

https://developer.android.com/sdk/installing/studio-tips.html
https://www.jetbrains.com/idea/index.html

##### 项目结构

http://confluence.jetbrains.com/display/IDEADEV/Structure+of+IntelliJ+IDEA+Project

##### Project

封装源码，库的一个组织单元。IntelliJ 所以操作的上下文环境，可以包含一个或者多个模块。

##### Module

模块是一个可单独运行，测试，debug 的离散单元。

##### Library


TODO 各个文件的作用



#### ActionBarSherlock

尝试了多种情况，只有 @froger_mcs 的方法是可行的，说明也足够详细。
http://stackoverflow.com/a/16639227/851344

不过关于android-support-v4.jar，得按照留言中 @Akbar 的配置才行。

不过运行的时候仍会提示错误

Gradle 执行 aapt 出错，`CreateProcess error=8`

gradle clean

再

gradle compileDebug --info

就没问题了.


	错误: 编码GBK的不可映射字符
	

#### Gradle

Gradle 是什么

http://www.gradle.org/docs/current/userguide/userguide_single.html#overview

http://stackoverflow.com/questions/1163173/why-use-gradle-instead-of-ant-or-maven

new android sdk build system 

https://www.youtube.com/watch?v=LCJAgPkpmR0

http://tools.android.com/tech-docs/new-build-system/user-guide


貌似只支持1.6

##### Gradle wrapper

The Gradle Wrapper allows you to execute Gradle builds on machines where Gradle is not installed.


#### Bug

##### 1

运行项目找不到模块(module)

##### 2

自己更改项目路径就会出现 There must not already be a project at this location.

##### 3

http://tools.android.com/knownissues

弄了一整天还是不能将源码导入作为andriod library ,提示

    Gradle: 
    FAILURE: Build failed with an exception.
    
    * What went wrong:
    Execution failed for task ':shanbay-reader-android:compileDebug'.
    > Compilation failed; see the compiler error output for details.
    
    * Try:
    Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.
	
这个错误是因为找不到类 AsyncHttpClient，发现将 jar 添加进module后，build.gradle 里的 dependencies 里仍没有该文件。

参考 http://binizzio.com/?p=227

    compile fileTree(dir: 'libs', include: '*.jar')
	

仍然需要手动编辑 build.gradle

然后必须`gradle clean` 不然还是会提示找不到类。

	
参考:http://stackoverflow.com/questions/16718026/how-to-build-an-android-library-with-android-studio-and-gradle



### 概念

Project，项目的格式

1. 基于目录，项目目录下有`.idea` 目录，包含有一堆 xml 配置文件集合
   
2. 基于文件，项目目录下有 `.ipr` 保存项目信息、`.iws` 保存个人工作区设置（personal workspace settings）

Modules，一个可以编译、运行、调试的功能单元
    

libraries
