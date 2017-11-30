---
title:  android 逆向工程 
date: '2012-08-13'
description:
---

[apktool]，是一个对apk进行重构(reengineer)的工具，可以很方便的重构res,反编译,修改,再打包回去,用来翻译很方便.但对于源码只能反编译到smali。
关于smali.留意这个博客http://androidcracking.blogspot.com/2011/02/more-smali-syntax-examples.html

[dex2jar]，一个很方便的将apk，转换到jar的程序。


[apktool] 的基本使用是这样的：

    apktool d app.apk        # 反编译 app.apk到文件夹apk
    apktool b app app_apk    # 从文件夹app重建APK，输出到./app_.apk
    java -jar signapk.jar testkey.x509.pem testkey.pk8 app_.apk app_signed.apk #对apk进行签名
	
skgnapk.jar 和后面的文件在一个叫[auto-sign]的工具里
	
[Android 反编译资料整理] 有详细的解释。

目前还没有方便的`apk -> java -> apk`的方法.

留意http://androidorigin.blogspot.com/2011/02/dex-format-to-jar-format.html 植入IDE的方法。


[jad]: http://www.varaneckas.com/jad

[dex2jar]: http://code.google.com/p/dex2jar/wiki/UserGuide

[apktool]: http://code.google.com/p/android-apktool/

[jd-gui]: http://java.decompiler.free.fr/?q=jdgui

[auto-sign]: http://d.download.csdn.net/download/fjfdszj/2768910

[Android 反编译资料整理]: http://rayleeya.iteye.com/blog/841076
    
