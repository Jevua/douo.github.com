---
title: Mavericks 备忘
date: '2014-02-13'
description:
---


### 第一阶段：安装

#### 配置

     Mobo：[GA-Z77-D3H](http://www.gigabyte.com/products/product-page.aspx?pid=4140#sp)
         Audio: VIA VT2021
         LAN: Atheros GbE LAN
     CPU： i5 3450
     GC： MSI HAWK r6850
     MEN： 8G 1600Mzh

#### 硬盘

SSD：SAMSUNG SSD 840 250G

       #:                       TYPE NAME                    SIZE       IDENTIFIER
       0:      GUID_partition_scheme                        *250.1 GB   disk0
       1:       Microsoft Basic Data EFI                     209.7 MB   disk0s1
       2:                  Apple_HFS Hackintosh              125.0 GB   disk0s2
       3:                  Apple_HFS Recovery HD             650.0 MB   disk0s3
       4:       Microsoft Basic Data BOOT                    5.4 GB     disk0s4
       5:         Microsoft Reserved                         134.2 MB   disk0s5
       6:       Microsoft Basic Data Win8                    118.7 GB   disk0s6

HDD: WDC 2T

       #:                       TYPE NAME                    SIZE       IDENTIFIER
       0:      GUID_partition_scheme                        *250.1 GB   disk0
       1:       Microsoft Basic Data EFI                     209.7 MB   disk0s1
       2:                  Apple_HFS Hackintosh              125.0 GB   disk0s2
       3:                  Apple_HFS Recovery HD             650.0 MB   disk0s3
       4:       Microsoft Basic Data BOOT                    5.4 GB     disk0s4
       5:         Microsoft Reserved                         134.2 MB   disk0s5
       6:       Microsoft Basic Data Win8                    118.7 GB   disk0s6

#### Clover

r2577 ，[下载](http://sourceforge.net/projects/cloverefiboot/files/)

#### Mavericks

10.9.1(13B42)，[下载](http://bbs.pcbeta.com/viewthread-1457312-1-1.html)

MD5(InstallESD.dmg) = f67bf055be1a494eb2547e17e74a0c13

#### 安装


##### 安装 Clover

将U盘用GPT方式分为两个区，第一个是 EFI 分区，Fat32 用于 Clover，大于 200 mb 便可以，第二个是 HFS+，用于恢复苹果安装镜像。

安装 Clover，选择纯 UEFI 引导，以 ESP 方式安装，安装位置选择一个分区大，必须是 fat32 或者 hps 格式，同时必需让苹果系统不挂载第一个分区，安装的时候，Clover会自动把 efi 文件安装到第一个分区里。

     第一次安装的时候 Clover 会自己创建 EFI 分区，但是接下来再次安装都不行了，安装失败，log 显示设备的第一个分区 resource busy ，不知道原因，所以得使用上面的方法安装才可以。

这样用 UEFI 引导 U 盘便可以进入 Clover 了。

##### 准备安装 U 盘

用了[如何创建 Mavericks 安装盘](http://coolestguidesontheplanet.com/making-a-boot-usb-disk-of-osx-10-9-mavericks/)中的第三种方法，纯命令行比较方便。

如果需要修改 SLE 里的文件，参考[How to modify InstallESD.dmg](http://www.insanelymac.com/forum/topic/282787-clover-v2-instructions/page__st__20#entry1869539)。不过 Mavericks 不用修改什么，AMD6000Controller.kext 直接可以驱动 6850。

不过进入 Clover 发现其不能找到U盘里的苹果安装包分区，原因未明。后来试了下，将安装镜像恢复到 HDD 的一个分区里，Clover 可以找到了安装盘了，不过进入后提示找不到 mach_kernel，原因未深究。将安装镜像恢复到整个U盘里，就可以顺利引导进入安装界面。不过 U盘的EFI也要被格式化的，需把 Clover 移到 HDD 里，为 HDD 创建一个 EFI 分区，然后将原先 EFI 分区的 EFI 文件夹移过来便可以。


##### 如何创建一个 EFI 分区

用 [Arch Linux 的安装镜像](https://www.archlinux.org/download/)来创建 EFI 分区很方便，别的系统找不到得心应手的 GPT 分区工具，还是 Linux 方便。

1.gdisk 分区，type: efi, code:ef00;一般 index 为 1，如果已经用了不放在第一个也可以
2.parted 为分区加上 flag: boot,hidden
3.格式化为 fat32，`mkdosfs /dev/sda1`

最后挂载两个分区，转移 EFI 文件便可。


##### 重刷 Bios

期间出了点状况，开机无法进入启动选择菜单，也无法进入 Bios，拔掉任意一个硬盘后一切正常。猜测是 Bios 有 Bug，可能是 EFI 分区太多导致。决定重刷 Bios。重刷的版本是[F22](http://www.gigabyte.com/products/product-page.aspx?pid=4140#bios)，在 Windows 下用 @Bios 刷入，[指导](http://www.gigabyte.com/webpage/20/HowToReflashBIOS.html)。重刷后就正常了。设置被恢复默认了，然后记得改回 ACHI。根据 [How to set up the UEFI of your Hackintosh's Gigabyte motherboard](http://www.macbreaker.com/2012/08/set-up-hackintosh-gigabyte-uefi.html)，还做了如下修改：

1. xhci mode ： smart auto 到 auto
2. echi hand-off：到 enable


##### 其他问题

google+ auto backup 导致系统缓慢，磁盘无法卸载。先卸而后快。


##### 配置 Clover

`config.plist` 无需修改。

drivers64efi 保留 `CsmVideoDxe-64.efi DataHubDxe-64.efi FSInject-64.efi OsxAptioFixDrv-64.efi OsxFatBinaryDrv-64.efi PartitionDxe-64.efi VBoxHfs.efi`，具体参考[山狮备忘](./mountian-lion-memo)。

kexts 需要 `FakeSMC` 和 `VoodooPS2Controller`，我的键盘是 PS2 接口的。放于 EFI/CLOVER/KEXTS/下的 10.9 和 other

这样就可以正常进入安装程序了。

##### 安装问题

安装的时候遇到一个比较麻烦的问题，DiskUtil 无法抹掉原先山狮是在的分区，只得删掉重新建立分区，系统和 Recovery HD 分区可以成功不到，但要建立新分区却提示失败了。

原因可能与先安装 windows 再安装 mac 也有问题

http://www.google.com.hk/url?sa=t&rct=j&q=prepare+to+partition+disk&source=web&cd=5&cad=rja&ved=0CD8QFjAE&url=%68%74%74%70%3a%2f%2f%77%77%77%2e%72%65%64%64%69%74%2e%63%6f%6d%2f%72%2f%68%61%63%6b%69%6e%74%6f%73%68%2f%63%6f%6d%6d%65%6e%74%73%2f%31%6b%30%75%6b%70%2f%69%6e%73%74%61%6c%6c%69%6e%67%5f%6d%61%63%5f%6f%73%5f%78%5f%6d%6f%75%6e%74%61%69%6e%5f%6c%69%6f%6e%5f%73%74%75%63%6b%5f%61%74%2f&ei=H3L6Ut_WNuGkigecqIGwDA&usg=AFQjCNGLKImWftxdk1AjgQPJuJDE5bj9sw

进入到上上次的山狮系统，同样用 DiskUtil 也无法建立分区。后来用 iPartition 才能成功创建分区，庆幸还保留着那个旧系统。

分区后就可以顺利安装了，不过无法创建 Recovery 分区。安装后也顺利进入系统，显卡 OK，网卡，声卡不能工作。

### 第二阶段：配置

#### 网卡驱动

网卡的 Kext 在[这位朋友的驱动](http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1425293)里找的，仅用了他的`ALXEthernet.kext`。

#### 声卡驱动

VIA VT2021，按照 [Lacedaemon] 的[教程][]修改 DSDT，用他提供的 [AppleHDA.kext][] 替换掉系统的，便可以不必用 VoodooHDA。不过前置面板还是没有输出。

#### CPU 变频问题

有一个问题是之前没有遇到过的，系统装好后感觉比较慢，便用 GeekBench 跑了下，结果分数异常的低。折腾了半天后才发现 CPU 的频率被锁定在 800 mhz，用 [Intel® Power Gadget][] 可以看到 CPU 的实时频率。然后用 [ssdtPRGen.sh][] 生成一个 ssdt.aml ，放入 /EFI/CLOVER/ACPI/patched 重启便可。

这个问题确实折腾的比较久，还发过[求助帖][]。尝试过 Clover `config.plist` 的不少选项，还替换了不少 SMBios，发现只有 iMac 和 Mac Pro（排除垃圾桶）可以支持 AMD 显卡。还更新了 [FakeSMC][]，皆不能修复。

#### XMP

我的内存是骇客神条，默认频率是 1333MHz，必须在 Bios 中开启 XMP 模式才可以到 1600MHz，主板只有一个 XMP 模式，Profile 1。重启后 Mac 依然只认到 1333MHz，尝试重新用[ssdtPRGen.sh][] 生成一个 ssdt.aml 没有作用，后来在`config.plist`中加入 XMPDetection，强制使用 Profile 1 重启后就可以认出 1600MHz 了。

重新跑了下分，分数更高了。结果如下：

    Benchmark Summary
      Integer Score              9615 ||||||||||
      Floating Point Score      15179 |||||||||||||||||
      Memory Score               9084 ||||||||||
      Stream Score               8677 |||||||||
    
      Geekbench Score           11362 ||||||||||||
    
    System Information
      Operating System      Mac OS X 10.9.1 (Build 13B42)
      Model                 iMac13,1
      Model ID              iMac13,1
      Motherboard           Apple Computer, Inc. Mac-00BE6ED71E35EB86 iMac13,1
      Processor             Intel Core i5-3450 @ 3.10 GHz
                            1 Processor, 4 Cores, 4 Threads
      Processor ID          GenuineIntel Family 6 Model 58 Stepping 9
      L1 Instruction Cache  32.0 KB x 2
      L1 Data Cache         32.0 KB x 2
      L2 Cache              256 KB x 2
      L3 Cache              6.00 MB
      Memory                8.00 GB 0 MHz RAM
      BIOS                  Apple Computer, Inc. IM131.88Z.010A.B05.1209042338
    
    Integer Performance
      Blowfish
        single-threaded scalar   2277 ||
        multi-threaded scalar    9754 ||||||||||
      Text Compress
        single-threaded scalar   3571 ||||
        multi-threaded scalar   13865 |||||||||||||||
      Text Decompress
        single-threaded scalar   3890 ||||
        multi-threaded scalar   16010 |||||||||||||||||
      Image Compress
        single-threaded scalar   3235 |||
        multi-threaded scalar   12680 ||||||||||||||
      Image Decompress
        single-threaded scalar   3814 ||||
        multi-threaded scalar   15333 |||||||||||||||||
      Lua
        single-threaded scalar   6181 ||||||
        multi-threaded scalar   24773 |||||||||||||||||||||||||||
    
    Floating Point Performance
      Mandelbrot
        single-threaded scalar   3099 |||
        multi-threaded scalar   12594 ||||||||||||||
      Dot Product
        single-threaded scalar   4831 |||||
        multi-threaded scalar   20467 ||||||||||||||||||||||
        single-threaded vector   7753 ||||||||
        multi-threaded vector   35666 ||||||||||||||||||||||||||||||||||||||||
      LU Decomposition
        single-threaded scalar   2829 |||
        multi-threaded scalar    9987 |||||||||||
      Primality Test
        single-threaded scalar   8863 |||||||||
        multi-threaded scalar   28419 |||||||||||||||||||||||||||||||
      Sharpen Image
        single-threaded scalar   7297 ||||||||
        multi-threaded scalar   29365 ||||||||||||||||||||||||||||||||
      Blur Image
        single-threaded scalar   8241 |||||||||
        multi-threaded scalar   33103 |||||||||||||||||||||||||||||||||||||
    
    Memory Performance
      Read Sequential
        single-threaded scalar   8264 |||||||||
      Write Sequential
        single-threaded scalar  12459 |||||||||||||
      Stdlib Allocate
        single-threaded scalar   5119 |||||
      Stdlib Write
        single-threaded scalar  10667 |||||||||||
      Stdlib Copy
        single-threaded scalar   8915 |||||||||
    
    Stream Performance
      Stream Copy
        single-threaded scalar   8573 |||||||||
        single-threaded vector   9893 |||||||||||
      Stream Scale
        single-threaded scalar   8950 ||||||||||
        single-threaded vector   9441 ||||||||||
      Stream Add
        single-threaded scalar   7537 ||||||||
        single-threaded vector   9746 ||||||||||
      Stream Triad
        single-threaded scalar   8040 |||||||||
        single-threaded vector   7243 ||||||||

#### 显卡

很幸运显卡原生就驱动的很好，SMBios 为 iMac(13,1)。用 OpenGL Extensions
Viewer 跑分正常，LuxMark 的跑分也跟[数据库里的数据][6850]接近。只有一个问题 6850 显示成为 6xxx。这个问题要通过修改 DSDT 解决，得进一步学习 DSDT 知识，暂缓。

#### 硬盘

下载 Trim Enabler 来为 SSD 开启 Trim。

#### USB3.0

USB3.0 接口无法使用，[GenericUSBXHCI](http://sourceforge.net/projects/genericusbxhci/) 可以解决问题，但热插拔 android
手机的时候，会导致重启，开机前插入就不会有问题。应该跟 [Ticket18](http://sourceforge.net/p/genericusbxhci/tickets/18/) 相同的
问题。

#### 总结

最后把用到的各种工具总结下。

- [DarwinDumper][]  可以dump Mac OS 中的大量信息，整合各种工具。
- [Kext Utility][] 它做的是复制新 kext 到 SLE，备份原始 kext，修复权限，重新生成 Cache。
- [Clover Configurator][] 非常好用的 Clover `config.plist` GUI 工具
- [HWMonitor][] 下载[FakeSMC][] 附送的，可以参考电源管控方面的信息。
- [DSDT Editor][] dsdt 编辑器，也就是 aml 的编辑器。可以解出当前系统的 dsdt。
- [Intel® Power Gadget][] Intel 出的 CPU 监控工具，可以查看 CPU 的实时频率。
- [Geekbench][] CPU 的跑分工具，跑一下看看 CPU 的分数是否正常。



[Lacedaemon]: http://www.osx86.net/user/345012-lacedaemon/
[教程]: http://www.osx86.net/topic/16228-guide-via-vt2021-audio-on-os-x-108x109/
[AppleHDA.kext]: http://www.osx86.net/files/file/3577-applehda-for-vt2021-mavericks-only/
[Intel® Power Gadget]: http://software.intel.com/en-us/articles/intel-power-gadget-20
[ssdtPRGen.sh]: https://github.com/Piker-Alpha/RevoBoot/blob/clang/i386/libsaio/acpi/Tools/ssdtPRGen.sh
[求助帖]: http://bbs.pcbeta.com/forum.php?mod=viewthread&tid=1478000
[FakeSMC]: https://github.com/RehabMan/OS-X-FakeSMC-kozlek

[6850]:http://www.luxrender.net/luxmark/search/search?page=1&benchmark_type=Sala&benchmark_mode=ANY&os_type=ANY&dev_count=1&device_unique_name=Advanced%20Micro%20Devices,%20Inc._SEPARETOR_Barts_SEPARETOR_12
[Geekbench]: https://www.google.com/search?sourceid=chrome&q=Geekbench
[OpenGL Extensions Viewer]: https://itunes.apple.com/us/app/opengl-extensions-viewer/id444052073?mt=12
[LuxMark]: http://www.luxrender.net/wiki/LuxMark#Download
[HWMonitor]: https://github.com/RehabMan/OS-X-FakeSMC-kozlek
[Clover Configurator]:http://www.osx86.net/files/file/49-clover-configurator/
[Kext Utility]: http://cvad-mac.narod.ru/index/0-4
[DarwinDumper]:  https://bitbucket.org/blackosx/darwindumper
[DSDT Editor]: http://olarila.com/forum/viewtopic.php?f=19&t=62

### 第三阶段：常用软件


### Base

安装好 xCode，貌似我 xCode 安装好后就有 Command Line tools，有 `git` `gcc` `make` 这些命令。

不过接下来安装 [Homebrew][] 的时候还会提示安装 Command Line tools。

用 [iTerm2][] 来作为日常终端。

[Homebrew]: http://brew.sh/
[iTerm2]: http://www.iterm2.com/#/section/home

#### Ruby

mavericks 自带有 ruby 2.0，如果需最新版本推荐用 [rvm](http://rvm.io/) 来管理不同版本的 ruby。

#### Ruhoh

Ruhoh 的安装配置请参考[配置 RUHOH 环境][ruhoh-env]

[ruhoh-env]: /notes/tools/ruhoh-env

#### Android 开发

- Android Studio
- ADT
- NDK

#### iOS 开发

#### Design Tools

