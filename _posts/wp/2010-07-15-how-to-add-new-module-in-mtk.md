---
date: '2010-07-15'
title: 如何为MTK平台添加新模块
tags:
- Modis
- MTK
categories:
- coder
meta:
  _edit_last: '1'
  dsq_thread_id: '812017495'
  _wp_old_slug: how_to_add_new_module_in_mtk
postid: '116'
guid: http://dourok.info/?p=116
---
包含源码的第三方库
------------------

以添加一个TTS模块为例，可以按如下步骤添加：

1.  把TTS的源码包复制到你的MTK软件系统根目录下，以让TTS的源码都在TTS目录中
2.  在make目录下新增一个tts目录，在tts目录下添加4个新文件，分别是，tts.def、tts.inc、tts.lis、tts.pth。tts.def文件的内容需要根据内容来修改，其他3个文件中加上源文件及其目录、头文件目录即可。
3.  在REL\_CR\_MMI\_\<project\>.mak 中加上如下语句 CUS\_REL\_SRC\_COMP
    += tts
4.  把MTK工程remake一下，若没有错误，tts模块就成功加上去了。
5.  **如果要为Modis模拟器添加该模块，须进入到Modis目录，在createMoDIS.ini文件中，[GLOBAL\_SETTINGS]下，追加
    **enable\_libs += tts** createMoDIS.ini会在createMoDIS.pl中加载**

添加一个无源码的库，如xxx.lib，可按照下面步骤：

1.  在MTK软件系统根目录中新建一个xxx文件夹，把xxx.lib放在里面
2.  在make\\Option.mak里增加下面几行，ifeq语句不是必要。 ifeq (\$(strip
    \$(XXX\_SUPPORT)),TRUE) COMPOBJS += xxx\\xxx.lib CUS\_REL\_OBJ\_LIST
    += xxx\\xxx.lib endif
3.  有 头文件，要将头文件路径加入，用CUSTOM\_COMMINC如： CUSTOM\_COMMINC +=
    ....
4.  如果加了XXX\_SUPPORT判断，须在\<customer\>\_\<project\>.mak文件中添加，并初始化为
    TRUE： XXX\_SUPPORT = TRUE;
5.  修改完成后，remake就可以将新模块添加到工程里了。
6.  关于 ifeq
    ((XXX\_SUPPORT)),TRUE)语句的意思是如果XXX\_SUPPORT的值为TRUE则继续执行。strip函数详见[这里](http://dourok.info/wiki/doku.php?id=%E7%A8%8B%E5%BA%8F:makefile:strip "程序:makefile:strip")。

**Modis模拟器不能调用该库，Modis模拟器调用的库要经过VC编译。**

生成自己的Lib库
---------------

比如说新建一个源文件dou.c，代码如下： 

```c
#include "dou.h"
int dou_max(int a , int b){
return a>b?a:b;
}
```


接下来建立头文件dou.h, 

```c
#ifndef _DOU_H
#define _DOU_H
extern int dou_max(int a,int b);
#endif
```



若要将程序打包成库发布，这里跟上面添加包含源码的第三方库一样，在MTK软件系统根目录下，新增一个dou目录，在创建inc和src文件夹，把dou.h放在dou，dou.c放在dou。接着在make目录下新增一个dou目录,再添加4个新文件，分别是，dou.def、dou.inc、dou.lis、dou.pth。

dou.inc添加 

```
dou\inc
```



dou.lis添加 

```
dou\src\dou.c
```



dou.pth添加 

```
dou\src
```



.inc是头文件目录，.lis是源文件列表，.pth是源文件目录。

remake一下，完成后可在build文件夹里，搜索到dou.lib文件。接下来可以如上面所说的无源码的库的添加方法那样去添加。

### 也可以不用remake，可以用命令行来编译 

```
armcc [options] file1 file2 ... filen
```



不过我用armmcc编译出来的obj文件加入MTK工程后链接出错。后来用


```
tcc
```



就OK了。
用armcc还是tcc，在Option.mak里是有定义的，具体看COMPILE\_MODE这个参数。好像默认就是tcc。

tcc编译出来的是obj文件，还要打包成lib库,用命令 

```
armar -r libfile objfile...
```



之后把lib加入工程的方法一开始说过了。但如果要把lib添加进模拟器中还需要多几个步骤。

首先，这个lib库是用在真机上，而模拟器中的库是需要经过vc编译的。

### Modis

如按照包含源码的第三方库第5步操作过，那么重新生成、编译模拟器就可以在模拟器中使用该库。在模拟器的目录Modis中可以库目录dou，dou.lib应该就在Debug目录下。这个dou.lib就是vc编译过的库。
如果第三方要在模拟器里使用该库，那么可以按下面几个步骤操作。
确保lib文件是vc编译的 将lib复制到 \_lib..
这个目录是不确定的，在CreateModis.pl里有定义，具体可查看\${modislibroot}这个变量

在CreateModis.pl里，添加一句 

```
push(@liblist, "${modislibroot}\\dou\.lib");
```


这里可以参考了其它\${modislibroot}里的lib库的添加方法。 然后


```
make gen_modis
make codegen_modis
```

 编译Modis，不报错便大功告成。

### PC Simulator

如果用PC Simulator
，并且确保代码是不依赖于MTK平台的，就是说没有使用MTK平台现有模块的任何函数，如dou.c。那么可以在VC6里面新建个静态库项目，把源文件添加进去，让编译打包成LIB库。再打开PC\_Simulator.dsw。在project→setting把新生成的lib添加进去。接着再tools→options加入Lib库的路径，有的话在加入头文件的路径。这样可以在模拟器里使用该库了。

最后调用下dou\_max函数验证之。

参考资料
--------

[1]陈智鹏. 走出山寨-MTK芯片开发指南. 人民邮电出版社

[2]52rd论坛.
添加新模块模拟器编译出现问题[http://www.52rd.com/bbs/Detail\_RD.BBS\_189450\_5\_1\_1.html](http://www.52rd.com/bbs/Detail_RD.BBS_189450_5_1_1.html)
