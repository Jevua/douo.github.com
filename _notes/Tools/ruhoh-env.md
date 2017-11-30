---
title: 配置 RUHOH 环境
date: '2014-02-09'
description:
---

### Emacs

[Emacs for Windows](http://ftp.gnu.org/gnu/emacs/windows/)

[Aquamacs][]  for Mac

#### 个人配置

将 [lims_dot_emacs][] clone 到 `~/.emacs.d` 重启 emacs 便配置好一切。


#### 配置 CapsLock 为 Ctrl

Mac 可在设置 -> 键盘 -> 修饰键里直接修改。

Win 需要改注册表，将下面的代码保存成 `.reg` 导入便可。

    REGEDIT4

    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
    "Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00

详见，[MovingTheCtrlKey](http://www.emacswiki.org/emacs/MovingTheCtrlKey)

[lims_dot_emacs]:https://github.com/douo/lims_dot_emacs

[Aquamacs]: http://aquamacs.org/，需要将


    (load "~/.emacs.d/init.el")

写入 `~/.emacs`，让 Aquamacs 加载 emacs 的配置文件。


### Cygwin

Win 下需要 Cygwin 环境，在[这里][Cygwin]下载安装。

使用 [apt-cyg](https://github.com/transcode-open/apt-cyg) 安装管理包更方便。

需要用到下面这些包：

    ruby
    emacs emacs-win32
    git  git-completion
    zsh
    curl wget
    openssh
    make gcc
    libyaml
    libcrypt devel #redcarpet
    libiconv devel # nogokiri

 emacs-win32 安装后可以在 Cygwin 中直接打开 Win 下 Emacs  的 GUI，仍然在 Cygwin 环境下，不过经测试不支持输入法，对汉字的支持也不好（默认字体）。

#### tree

cygwin 下没有 tree ，手动编译便可。在[这里](http://mama.indstate.edu/users/ice/tree/)下载源码，根据 `INSTALL` 文件的指引来安装。

#### gem 2.2.2

`gem 2.2.2` + `ruby 1.9.3p484 (2013-11-22)` 在 Cygwin 下有 bug，安装提示出错：

    ERROR:  While executing gem ... (ArgumentError)
        invalid byte sequence in UTF-8

将 `/usr/share/ruby/2.0.0/win32/registry.rb` 的 172 行注释掉便可。具体见 [issue 8508](https://bugs.ruby-lang.org/issues/8508)。

#### nokogiri

2015-03-04，nokogiri(1.6.6.2) 安装失败，见 https://groups.google.com/forum/#!topic/nokogiri-talk/BigaPrf2AwE


    - RUBYGEMS VERSION: 2.4.6
    - RUBY VERSION: 2.0.0 (2014-11-13 patchlevel 598) [x86_64-cygwin]


[Cygwin]: http://cygwin.com/install.html

### iTerm2

在 Mac 下 [iTerm2][] 是一个更强大的终端，现已习惯用这个。

解决 option key 的映射问题：[osx - Making iTerm to translate 'meta-key' in the same way as in other OSes - Stack Overflow](https://stackoverflow.com/questions/196357/making-iterm-to-translate-meta-key-in-the-same-way-as-in-other-oses)


### oh-my-zsh

Cygwin 下配置好 zsh 环境：

    # Create initial /etc/zshenv
    [[ ! -e /etc/zshenv ]] && echo export PATH=/usr/bin:\$PATH > /etc/zshenv
       # setting up zsh as default
       sed -i "s/$USER\:\/bin\/bash/$USER\:\/bin\/zsh/g" /etc/passwd
       
**新版本**的 Cygwin 可直接修改 `/etc/nsswitch.conf` 切换 Shell。

[iTerm2][] 可用下面的命令将 shell 更改为 zsh：

    chsh -s `which zsh`

安装 [oh-my-zsh][]

       git clone git://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
       cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc


主题

    ZSH_THEME="blinks"

插件

CygWin：

    plugins=(git ruby gem ssh-agent)

iTerm2：

    plugins=(git osx brew ruby gem)


[oh-my-zsh]: https://github.com/robbyrussell/oh-my-zsh

### ruhoh.rb

[ruhoh.rb][] 用的是[我的 fork][douo_ruhoh.rb]，主要是多了个指定工作路径的选项，这个不好通过插件来扩展。

然后用 gem 安装，补上缺失的 gems 就行。

`.zshrc` 要配置一下：

    DOUO=$HOME/.douo  # 我的个人配置文件目录
    PATH=$HOME/bin:$PATH # 添加用户可执行文件路径
    source $DOUO/ruhoh.sh # ruhoh 的配置

[ruhoh.sh][] 为ruhoh 提供一些快捷命令。


[ruhoh.rb]: https://github.com/ruhoh/ruhoh.rb
[douo_ruhoh.rb]: https://github.com/douo/ruhoh.rb
[ruhoh.sh]: https://gist.github.com/douo/4452974

[iTerm2]: http://www.iterm2.com/#/section/home

### Vagrant

Windows 下还是使用 [Vagrant](https://www.vagrantup.com/docs/) 来搭建 Ruhoh 方便。用的是基于标准 Ubuntu 14.04.2 打包的 box。

配置需要加上端口转发，还有自动启动 Ruhoh 服务的 provision。 具体[Vagrantfile](https://gist.github.com/douo/d06dcf0714b0652c9194)

在 Box 的目录下加上两个批处理文件

vp.bat

```
vagrant up
```

vh.bat

```
vagrant halt
```

在将其加入环境变量中，分别在运行窗口直接运行。


默认 SSH 端口是 `2222`，用户密码是`vagrant:vagrant`。通过下面的命令将 cygwin 的 pub key 加入 vagrant

```ssh-copy-id -i ~/.ssh/id_rsa.pub vagrant@127.0.0.1 -p 2222```

以后可直接连入

```ssh -p 2222 vagrant@localhost```
