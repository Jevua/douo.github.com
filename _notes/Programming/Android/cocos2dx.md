---
title: cocos2dx
date: '2012-12-01'
description:
---

成功windows7下跑起了DEMO

`create_android_project.bat` 得做一些修改

必须得用管理员权限运行,不然 org/helloapp/main.cpp 这个文件会权限出错,不知道为什么.

创建好项目后必须得修复下权限,让当前用户可修改所有文件

然后再 window 下的环境变量 设置 `NDK_ROOT`

再进入到cygwin 到项目文件内运行 `./build_native.sh` 才可以编译出`libgame.so`


然后用eclipse 导入项目, 可能会提示找不到org.cocos2dx.lib 这个库

这个库的源文件在

`%COCOS2DX_ROOT%\cocos2dx\platform\android\java`

也导入到eclipse,标记为库

再将库导入到项目

