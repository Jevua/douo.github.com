---
title: 山狮备忘
date: '2013-04-14'
description:
---

### 配置

	Mobo：GA-Z77-D3H
	CPU： i5 3450
	GC： MSI HAWK r6850
	MEN： 8G 1600Mzh

### 安装

通过 Clover 引导进入（不同的引导应该没有影响）已有的10.8.1系统后，可以直接挂载原版`InstallESD` 安装。因为我显卡的原因需要移除`ATI6000Controller.kext`来避免重启进入安装界面后白屏。关于如果修改可以见`InstallESD` 

[How to modify InstallESD.dmg](http://www.insanelymac.com/forum/topic/282787-clover-v2-instructions/page__st__20#entry1869539) 

[Clover 引导原版 InstallESD.dmg全盘安装指路](http://bbs.pcbeta.com/viewthread-1230436-1-1.html)

### Clover

kexts 放于`EFI/kexts/10.8`

`FakeSMC.kext` 还有 `AtherosL1cEthernet.kext`驱动有线网卡

#### config.plist
使用这个配置可以引导老 10.8.1 的系统，显卡驱动也能被加载。
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PCI</key>
	<dict>
		<key>USBInjection</key>
		<string>Yes</string>
		<key>USBFixOwnership</key>
		<string>Yes</string>
		<key>InjectClockID</key>
		<string>Yes</string>
	</dict>
	<key>SystemParameters</key>
	<dict>
		<key>boot-args</key>
		<string>-v npci=0x2000 slide=0 WithKexts</string>
		<key>prev-lang:kbd</key>
		<string>zh-CN:0</string>
		<key>InjectSystemID</key>
		<string>Yes</string>
	</dict>
	<key>Graphics</key>
	<dict>
	        <key>GraphicsInjector</key>
		<string>Yes</string>
		<key>PatchVBios</key>
		<string>Yes</string>
		<key>FBName</key>
		<string>Futomaki</string>
	</dict>
</dict>
</plist>
```
http://www.insanelymac.com/forum/topic/282787-clover-v2-instructions/page__st__20#entry1869539
这里有一些配置的解释

#### drivers64UEFI

加`*`号为我正在使用efi，可以正确引导。

	文件名	功能说明	备注
	*1	CsmVideoDxe-64.efi	增强显卡在EFI模式下的兼容性	源自Intel EFI规范，与分辨率的实现相关
	*2	DataHubDxe-64.efi	Data Hub可抓取data集合成SMBios	源自Intel EFI规范
	2	EmuVariableRuntimeDxe.efi	针对某些 Phoenix UEFI 本本	例如DELL Vostro，某些ThinkPad
	*3	FSInject-64.efi	为强制加载某些kext或注入提供支持	kext patcher，如ATIConnectorInfo patch
	*4	HFSPlus64.efi	识别OSX分区	OSX必备，与VBoxHfs.efi通用
	5	NTFS64.efi	识别Win分区	单碟多系统必备
	*6	OsxAptioFixDrv-64.efi	针对AMI Aptio UEFI 台式主板多见	技嘉、华硕、华擎等，解决找不到内核问题
	*7	OsxFatBinaryDrv-64.efi	胖二进制，对多架构提供支持，
	如OSX的boot.efi	OSX必备，或称通用二进制Universal Binary
	即Intel/PPC
	8	OsxLowMemFixDrv-64.efi	针对 Insyde H2O UEFI 的本本	修复低位内存问题
	*9	PartitionDxe-64.efi	提供对MBR、GPT等多分区表的支持	源自Intel EFI规范
	10	Ps2MouseDxe-64.efi	PS鼠标	源自Intel EFI规范，待测试
	11	UsbMouseDxe-64.efi	USB鼠标	源自Intel EFI规范，鼠标仍不可用
	12	VBoxExt2-64.efi	识别Linux分区	源自VBox，Ext4未能识别
	13	VBoxHfs.efi	识别OSX分区	源自VBox，GUI界面不显示HFS卷名
	14	XhciDxe-64.efi	USB3.0支持	USB2.0的情况正常，据说NEC Reneas勿选



### 问题

安装完成后，如何恢复显卡驱动？

http://www.insanelymac.com/forum/topic/282787-clover-v2-instructions/#entry1853099

http://www.insanelymac.com/forum/topic/282787-clover-v2-instructions/#entry1853010

### 实验一

clover usb 引导

http://tonymacx64.blogspot.hk/2013/03/guide-how-to-build-reliable-usb.html

http://arstechnica.com/apple/2012/07/how-to-create-a-bootable-backup-mountain-lion-install-disk/
diy 方式制造启动盘


命令行挂载 dmg `hdiutil attach /path/to/diskimage.dmg`


kextcache 失败



MBR 方式安装的黑苹果能否用 Clover 启动

开机慢 http://bbs.pcbeta.com/viewthread-1082297-1-1.html


### DSDT

区分系统描述表（Differentiated System Description Table (DSDT)）
OEM厂商必须为ACPI兼容的OS提供一个DSDT。这个DSDT包含Differentiated Definition Block，它能提供关于基本系统的实现和配置信息。OS总是在ACPI Namespace中插入DSDT信息，当系统启动的时候，而且绝不会删除它。

SSDT – Secondary System Description Table

http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1288363

[使用ACPI Patcher制作DSDT补丁](http://bbs.pcbeta.com/viewthread-484842-1-1.html)


### Clover 

如果要加载额外的 kext 一定要有以下三项条件，
1. /efi/drivers/FSInject.efi。
2. 适当文件夹位置的 kexts 驱动。
3. 开机选用加载选项 "Boot Mac OS X with extra kexts (skips cache)"。

其他功能：
/EFI/drivers32 文件夹：
/EFI/drivers64 文件夹：
进入 GUI 之前会载入的额外 EFI-drivers，通常使用于 mouse 及 其他系统格式的驱动，如果未使用可直接移除。

/EFI/misc 文件夹：
为开机按 F2 开机纪录 及 F10截图 储存位置，Fat32 专用，HFS+ 不可用。

F1：帮助选单。
F2：储存开机纪录（Fat32专用）。
F4：储存原始 DSDT（Fat32专用）。
F10：储存开机截图（Fat32专用）。
F12：退出光盘。
?：显示分区信息。


cool: http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1197452

https://github.com/STLVNUB/CloverGrower/blob/master/Files/HFSPlus/x64/HFSPlus.efi

#### 启动参数

npci=0x2000 http://legacy.tonymacx86.com/viewtopic.php?p=222908


OSX的安装

0）恢复：用硬盘安装助手将懒人版镜像恢复到事先准备好的分区中，如果U盘空间足够，推荐划一分区存放OSX安装文件
1）准备：将原/Extra/Extensions中的kext拷贝到Clover UEFI U盘的/EFI/BOOT/kexts/10.8中
2）启动：用准备好的Clover U盘启动，按F8选择 UEFI：USB 字样，在Clover界面中找到安装盘，按空格，
                用方向键移动光栅至（skip cache）一项， 回车进入安装


### 阶段总结

可以进入u盘 clover uefi 模式

下载了 ntfs.efi hfsplus.efi

clover 引导 安装程序出错，提示 ‘error loading drivers’

clover 引导到已经装好的mac，一开始可以成功引导，忘记改了什么，现在进入
登陆界面前就重启

### 显卡问题

尝试 GraphicsInjector 

如果你之前有执行过以下操作：
①、在 com.apple.Boot.plist 加入过 EFI 代码
②、安装、使用过任何显卡驱动
③、在 DSDT 中加入相关显卡代码的

请将它们一并移除/恢复，祝您顺利驱动！

尝试 白屏修复

http://bbs.pcbeta.com/viewthread-1310849-1-1.html


[ATI 5系和6系显卡驱动&修改FB探讨](http://bbs.pcbeta.com/viewthread-1060313-1-1.html)


#### 成功

http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1314577
http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1314269

http://bbs.pcbeta.com/viewthread-1296580-1-1.html

http://www.insanelymac.com/forum/topic/285756-hd-7xxx-can-we-eliminate-the-sleep-trick/page__st__120

