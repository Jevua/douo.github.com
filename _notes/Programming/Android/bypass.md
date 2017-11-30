---
title: Bypass
date: '2013-12-20'
description:
type: draft
tags:
- markdown
---

[bypass](http://uncodin.github.io/bypass/), Markdown 渲染库，跳过 Html 直接渲染到界面上，性能较好，支持 Android 与 iOS。
需要对 boost 的依赖，[damiancarrillo](https://github.com/damiancarrillo/bypass) 移除了对 boost 的依赖，在 windows 下打包容易了许多。

### ndk

windows 下避免

	Unable to launch cygpath. Is Cygwin on the path?

设置 `NDK_DEBUG=1` 见 http://tools.android.com/recent/usingthendkplugin
