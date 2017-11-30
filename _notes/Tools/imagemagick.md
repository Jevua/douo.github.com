---
title: ImageMagick
date: '2013-08-05'
description:
tags:
- 图形
---

### 安装

Mac 下可用 brew 直接安装
	
	brew install imagemagick

### 常用

透明背景，将某个颜色转换为透明。
	
	convert ajax-loader.gif -transparent "rgb(255,255,255)" output.gif 

分割 
	
	convert -strip output.gif indicator%02d.png
	

http://forums.tigsource.com/index.php?topic=9041.msg282280#msg282280

