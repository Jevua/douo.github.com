---
title: PC Setup
date: '2013-04-29'
description:
type: draft
---

受[阳志平][1]的启发，决定在重做操作系统后，记录一下各个系统的配置。这次重做系统已经不再安装Arch Linux 了，放弃了使用Linux，只装了 Win8 和 Mountian Lion。

### Win8

Win 现在主要当成游戏机用，这段时间观察下来实际我也很少用了，不够还是要设置成默认启动的系统，防止其他人要用我的电脑而不知进入系统。

基本上只装一些常用必备的软件，

- [Chrome][2]
- [foobar2000][3] 无需多言的音乐播放器，大学时很喜欢折腾它，现在也很少用，我的配置可参考[这里][4]，也许会再整理更多出来。
- Potplayer 视频播放器，只是用习惯而已，没有配置过。

#### Ruhoh

配置一下 ruhoh 的环境。

- [Cygwin][5] zsh，ruby 和 git。[ZSH with mintty on latest cygwin?][10]
- [Emacs][6] 
- [oh-my-zsh][9] af-magic 这个主题不错

Cygwin 还要安装 ca-certificates（解决 https 链接的问题） gcc make

安装 nokogiri 还要麻烦一些，把 libxml libxml2 libxslt libiconv 找到的包都安装了，包括devel的，才能成功安装 nokogiri。

#### 效率

- [Launchy][7] 没怎么用过。开始试用，应该比`Win+R` 更强大。
- [Evernote][8]

#### 其他

Win8 下居然找不到一个可用的支持 gpt 的分区工具，都是限制太多了，还弄坏了我的 gpt 分区表，气愤。幸好有备份，还是gdisk 和 libparted 好用，做了个 archlinux 的安装u盘才把分区搞定。然后将 SSD 的 WIN EFI 分区的 boot flag 关闭，将安装 clover 的分区开启 boot flag。

[1]: http://www.yangzhiping.com/tech/mac-dev.html
[2]: https://www.google.com/intl/en/chrome/browser/
[3]: http://www.foobar2000.org/
[4]: http://wiki.dourok.info/doku.php/%E5%B7%A5%E5%85%B7/foobar2000
[5]: http://www.cygwin.com/install.html
[6]: http://ftp.gnu.org/gnu/emacs/windows/
[7]: http://www.launchy.net/
[8]: https://evernote.com/intl/zh-cn/
[9]: https://github.com/robbyrussell/oh-my-zsh
[10]: http://superuser.com/questions/396341/zsh-with-mintty-on-latest-cygwin

### Mac

- iterm2
- homebrew
- truecrypt (macfuse)
