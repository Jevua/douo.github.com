---
title: 初尝 Android Studio
date: '2013-05-29'
description:
categories:
- coder
tags:
- Android
- Android Studio
- gradle
---

Google I/O 2013 放出的新 Android IDE，基于 IntelliJ IDEA，现在还只是早期预览版本。断断续续用了几天后，得出一个结论，强烈不建议用来作正式开发工具。当然，这个其实看它的版本名就知道。一方面是不完善，从建立一个新项目到打包运行，遇到问题不断。另一方面，也是最不可接受的一点，就是打包速度慢。一台 E5200 的 Win7，一次 clean 要**10秒**以上，然后 compileDebug 要**30秒**。一台 i5-3550 同时配备有固态硬盘的 Hackintosh， clean 一次仍要**5秒**，compileDebug 要**15秒**。而且花在 checkSource 上的时间很多。做一个小改动再重新运行也要等很久，这一点严重拖慢开发效率（有这个空隙总会不自觉地去刷刷 reader，从而导致更多的拖延）。目前没有方法，一方面可能是 groovy 、gradle 本身的局限，一方面是现在这个 New Build System 也还不完善，现在版本才是0.3，还是有很大的改进空间的。另外，用 [daemon][] 模式也可以加速。

[daemon]: http://www.gradle.org/docs/current/userguide/gradle_daemon.html

不过，Android Studio 还是很让人期待的，特别是看过 ["What's new in Android Developer Tools"][1] 里面介绍的那些很酷的特性。终于可以摆脱 Eclipse 的一些顽疾和那老气沉沉的 UI 了（我是 Swing 爱好者，没做 Android 之前 Netbeans 才是我的日常IDE，可惜 ADT 没 Netbeans 的份）。摆脱了 Eclipse 后，Android IDE 才能有更大发挥，比如说新 Layout Design ，不必再望 Interface Builder 空叹了。而 JetBrains 也是声名在外，上次它在国内做活动的时候，差点买了 AppCode 和 RubyMine。至于 IntelliJ IDEA 我算是久仰其名，未见其面吧，其实也试用过，不过当时是非 Android 官方支持的，不敢随便就切换过去。最值得一提的是，从 Eclipse 切换 到 IntelliJ IDEA 的成本其实不高，有一些[概念][0]的混淆。但都有 Emacs Keymap，还有最蛋疼的一点，现在　Android　Studio　还只是个**「编辑器」**，最容易导致问题的打包、依赖问题，现在做到　New Build System 了，目前还没整合进 Android Studio。所以打包依赖问题，不但要在 IDE 里配置一遍，还要自己写上一遍 `build.gradle`。

[0]: http://confluence.jetbrains.com/display/IDEADEV/Structure+of+IntelliJ+IDEA+Project
[1]: http://www.youtube.com/watch?v=lmv1dTnhLH4

以加入 ActionBarSherlock 为例，一开始不了解，尝试了多种方法，四处碰壁。用配置 IDE 的方法只能解决编码时的引用问题，最后只有 [@froger_mcs][] 的方法是可成功打包运行的。才发现要用 Android Studio 了解下 gradle 是必须的（在这之前我还没听说过 gradle）看一下 [Gradle User Guide][2]，最少看完第六章，就有点概念了。后来再看了 I/O 的讲座 ["The New Android SDK Build System"][3]，豁然开朗。才知道原来 Android 推出了个新的基于 gradle 的构建系统。[这里][4]是详细的文档。还有，New Android Build System 需要 gradle 1.6， brew 只能下载到 1.5。

[@froger_mcs]: http://stackoverflow.com/a/16639227/851344
[2]: http://www.gradle.org/docs/current/userguide/userguide_single.html#overview
[3]: https://www.youtube.com/watch?v=LCJAgPkpmR0
[4]: http://tools.android.com/tech-docs/new-build-system/user-guide

IntelliJ IDEA 默认的 Emacs Keymap 比 Eclipse 默认的好用，虽然还比不上 Emacs+，比如`c-x c-b` 不好用，但胜在足够稳定，贴合系统。不过在 Mac 下就没那么好了，option 键仍与 meta 键冲突（Aquamacs 中不会有这个问题），最后只能用一个新的 keyboard layout 屏蔽掉 option 输入字符快捷键（option 配合字母键输入特殊字符，我怎么觉得是个不怎么实用的功能），才能作为 meta 键使用。具体操作按照 [@dan][5] 的方法实现。但是这个 layout 不能在 Aquamacs 中输入字符，来回切换也麻烦。

[5]: http://stackoverflow.com/questions/11876485/how-to-disable-typing-special-characters-when-pressing-option-key-in-mac-os-x

还有 git ，IntelliJ IDEA 默认就支持 git，我之前就配置好 cygwin 下的 git 环境。它还能自动检测到 cygwin ，并用 cygwin 的 git 来提交。`.gitignore` 不知该如何写，直接把仓库建在 src 目录下是最方便的。

之前用 Eclipse Helios 总会遇到一些假死和突然崩溃，很可能是 ADT 的 bug。升级到 Juno 后好像不会了，不过 Juno 要配合 Emacs+ 也需要一番折腾，现在回想起来现在用的 Eclipse 好像已经足够稳定了，相比 Xcode ，ADT 还是有所欠缺，特别是可视化编辑方面，却也足够满足基本需求的，除了一些个人坏癖好现在没什么理由切换到 Android Studio 去做白老鼠。不过现在增量更新很方便，下载个放着也没什么不好。我还是继续坚持使用，有什么问题会及时记录到[笔记][android-studio]里。

[android-studio]:  /notes/tools/android-studio
