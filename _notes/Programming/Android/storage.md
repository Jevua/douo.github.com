---
title: 存储
date: '2016-12-10'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

### 存储类型

见 [Storage \| Android Open Source Project](https://source.android.com/devices/storage/index.html)，将存储器分为两种类型。

- 传统存储，包括模拟存储器（emulated storage）和可移除存储器（portable storage），这也称为外置存储。
- Adoptable Storage， 6.0 引入的新的存储模式，将外置存储格式化并加密存储数据，其能当作内部存储使用


传统存储是不区分大小写。


### 权限

对于应用的特定目录 `/{storage}/Android/data/{package}/` 无需声明权限便有读写权限，且不分主要还是第二存储器。

访问外置存储的权限

- 4.1 以前读取外置存储无需权限，写入需声明 `WRITE_EXTERNAL_STORAGE`
- 4.1 以后读取外置存储需声明权限 `READ_EXTERNAL_STORAGE`
- 4.4 以后，app 无法**写入** primary 以外的传统存储/外置存储。

一般来说主要外置存储器（primary external storage）是指手机内置的模拟存储器。其他外置存储器，称为第二外置存储器（second external storage），包括外置 sdcard 或 usb 存储器。

经查资料，对于 4.4 来说（未验证）

- primary 存储器的组是 `sdcard_rw`，声明 `WRITE_EXTERNAL_STORAGE` 权限将应用加入 `sdcard_rw` 组，从而拥有读写主要外置存储器的权限。
- 第二外置存储器的组是 `media_rw`，所以没有写入权限。声明 `WRITE_MEDIA_STORAGE` 能让 app 加入 `media_rw` 但这个权限只支持系统应用。

另外，修改 `/system/ect/permissions/platform.xml`，也能让应用拥有写入第二外置存储器的权限。

```xml
<permission name=”android.permission.WRITE_MEDIA_STORAGE” >
<group gid=”sdcard_rw” />
<group gid=”media_rw” />
</permission>
```

L 以后可能又不一样了，POSIX 的权限管理不足以处理复杂的权限或者可移除 sdcard 常用的 fat 文件系统不支持多用户，所以 android 将外置存储器挂着为 [FUSE][]，提供自己一套安全策略来管理。待阅读：http://kernel.meizu.com/android-m-external-storage.html

Android 的主要外置存储器挂载到 `/sdcard`，所以很容易和可移动存储器，也就是所谓的 sdcard 搞混

    /sdcard -> /storage/self/primary -> /mnt/user/0/primary -> /storage/emulated/0 （sdcard_rw Android 6.0 华为 P9）

[FUSE]: https://zh.wikipedia.org/wiki/FUSE

讲的比较详细的文章 http://blog.csdn.net/zjbpku/article/details/25161131

### 运行时权限

/mnt/runtime/default
/mnt/runtime/read
/mnt/runtime/write
