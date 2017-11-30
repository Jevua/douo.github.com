---
title: Arch Linux 日志
date: '2016-12-08'
description:
type: draft ## 移除这个字段，笔记才会公开发布
tags:
    - Arch
---

## Dell Inspiron 15

### 调整 ntfs 分区大小

用 `gparted` 很方便，它实际是调用 `ntfsresize` 来进行分区调整的

### 挂载 /var 到独立分区

见：[partitioning - How can I store /var on a separate partition? - Ask Ubuntu](https://askubuntu.com/questions/39536/how-can-i-store-var-on-a-separate-partition)

    mkdir /var2
    mount /dev/sda12 /var2
    rsync -a /var/ /var2  # 同步现有的 var 目录到新分区
    /dev/sda12    /var    ext4    defaults      2 2
    
rsync 遇到稀疏文件（sparse file）时可能有问题，尝试加上 `--sparse` 参数。

    rsync -a --sparse /var/ /var2  # 同步现有的 var 目录到新分区
    
可选，重启前切换目录前：

    rm -rf /var
