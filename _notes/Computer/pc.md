---
title:  PC折腾记录
date: '2012-09-07'
description:
---

## win7
win7 64 位. 已经成功安装在uefi + gpt 上了.
通过刷 slic2.1 的bios. 修改方法见 bios card.已经成功实现硬激活.

bootmgr.efi可用于硬盘镜像安装.(将镜像解压到fat32分区的硬盘中,bootmgr.efi放入跟根目录,在efi shell 里运行)

>  /data/archives/os/win/tools/bootmgr.efi 


目前问题

*  win7 的efi 机制,  修改了 /boot/bootx64.efi 仍可以成功引导
*  挂载了efi 分区无法访问(解决: 原来efi分区在 fs0，我一直从fs1开始的)

## hackintosh 

### 引导

单纯UEFi引导mac 貌似无解.见这个 dmazar 的[讨论](http://forum.voodooprojects.org/index.php?topic=2394.0)

[Clover](http://www.projectosx.com/forum/index.php?showtopic=2304) 基于  Chameleon, rEFIt, XNU, VirtualBox

[XPC EFI BOOTLOADER](http://xpcboot.weebly.com/dualbooting-windows.html)

[chameleon](http://forge.voodooprojects.org/p/chameleon/)
    http://bbs.pcbeta.com/viewthread-876046-1-1.html

### 一些有用的链接

跟我的情形一致:http://www.insanelymac.com/forum/index.php?showtopic=269655



### 网站
-  [insanelymac](http://www.insanelymac.com/)
-  [voodooprojects](http://forum.voodooprojects.org)
-  [tonymacx86](http://www.tonymacx86.com/) (引导盘iboot+multibeast安装单系统，就出自这个网站。站内还有不少别人做好的dsdt可以拿来用。)
-  [osx86](http://www.osx86.net)
-  [kexts](www.kexts.com) (下载各类黑苹果驱动、引导文件等黑苹果专用程序的顶级网站。由网友自发上传的)
-  http://netkas.org/
-  [projectosx](http://www.projectosx.com/forum/)
-  http://www.hackint0sh.org/
-  http://www.kakewalk.se/
-  http://aquamac.proboards.com/index.cgi


### TODO

[教程一枚：如何安装kext&如何修改](http://bbs.pcbeta.com/viewthread-936953-1-1.html)

[ATI 6xxx 显卡](http://bbs.pcbeta.com/viewthread-1060313-1-1.html)

[DSDT](http://bbs.pcbeta.com/viewthread-633082-1-1.html)


[详解MAC硬盘中各个文件夹](http://mac.pcbeta.com/thread-67417-1-1.html)

### 工具
[ACPI (DSDT) Patcher](http://www.insanelymac.com/forum/index.php?showtopic=142434)

[磁盘兼容 HFS+ for win , NTFS for mac](http://bbs.pcbeta.com/viewthread-633082-1-1.html)


## archlinux

已经安装好了,不过还不能引导.(可以通过efi shell 引导经系统,但是挂载不到home了,用 [ext2fsd](http://www.ext2fsd.com) 编辑一下fstab应该可以搞定)


## bios

[下载](http://www.gigabyte.com/products/product-page.aspx?pid=4140#bios)

[ 技嘉EFI BIOS添加三激活视屏教程](http://bbs.bios.net.cn/thread-266330-1-1.html)

## EFI

### 推荐阅读
[可延伸韌體介面(UEFI)](https://zh.wikipedia.org/wiki/%E5%8F%AF%E5%BB%B6%E4%BC%B8%E9%9F%8C%E9%AB%94%E4%BB%8B%E9%9D%A2)

[全局唯一標識分區表(GUID/UUID)](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%B1%80%E5%94%AF%E4%B8%80%E6%A8%99%E8%AD%98%E5%88%86%E5%8D%80%E8%A1%A8)

 The default location for the OS loader is \EFI\BOOT\boot[architecture name].efi, where the architecture name can be e.g. IA32, X64 or IA64. Some OS vendors may have their own OS loader. They may also change the default boot location.

[archlinux UEFI](https://wiki.archlinux.org/index.php/UEFI)


[rodsbooks](http://www.rodsbooks.com/bios2uefi/)

## GPT 分区

### 分区参考
http://www.douban.com/note/213539090/

### 我的设计

EFI

MSG

WIN7

ARCH
 
DATA

MAC


### EFI
[uEFI常见问题解答](http://www.xinhuigroup.com/Article/10007/10146.html)

[EFI和EFI工作原理简介](http://hi.baidu.com/gwjtzy/item/53cb5ffe5d20655dc9f33792)
