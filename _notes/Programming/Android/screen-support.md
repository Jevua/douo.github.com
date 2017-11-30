---
title: Screen Support
date: '2013-02-19'
description:
---

[官方文档](https://developer.android.com/guide/practices/screens_support.html)

[Android手机屏幕那点事](http://www.qhm123.com/2011/07/17/android-learning-fifth-screen-things-resolution-denity.html)总结的不错。


### 一些概念

<dl>
  <dt><strong>屏幕尺寸(size)</strong></dt>
  <dd>真实的尺寸，屏幕的对角线长度。
	   android 把屏幕尺寸分为四种一般类型：small,normal,large,extra large(xlarge)
  </dd>
  <dt><strong>屏幕密度(density)</strong></dt>
  <dd>一个物理面积内的像素数量，常用单位dpi（dots per inch）。
      android 把屏幕像素分为四种一般类型：low(ldpi)，medium(mdpi)，high(hdpi)，extra high(xhdpi)
  </dd>
  <dt><strong>分辨率(resolution)</strong></dt>
  <dd>屏幕的物理像素</dd>
  <dt><strong>纵横比(aspect ratios)</strong></dt>
  <dd>提供 long 和 notlong 两个限定值，long 表示屏幕变宽或者变高了，比如 portrait 是 notlong landscape 则是 long </dd>
</dl>

应用只需按照尺寸和密度的分组来区分不同屏幕无需考虑具体分辨率。

> two devices that report a screen density of hdpi might have real pixel densities that are slightly different. Android makes these differences abstract to applications, so you can provide UI designed for the generalized sizes and densities and let the system handle any final adjustments as necessary

### 计量单位

<dl>
<dt><strong>dp/dip</strong></dt>
<dd>device independent pixels(设备独立像素)。 不同设备有不同的显示效果,具体基于屏幕的物理密度，在160 dpi(像素每英寸)的屏幕上, 1dp等于1px 。 实际上dp = px * dpi/160。所以160dp无论屏幕的密度是多少都是1英寸的大小。在指定view的大小和位置时，应当以dp为单位,这样可以让UI在不同的屏幕上保持相同的尺寸。</dd>

<dt><strong>sp</strong></dt>
<dd>Scale-independent Pixels ，文档中说跟dp差不多，这个于dp的不同在于，字体大小在dp的基础上，可以根据用户的偏好设置，相应调整字体大小，所以是scale的。正如stackoverflow上说的，所有地方都应该用dp作为单位，除了字体，字体应该用sp。 这个值以px的关系,跟DisplayMetrics的scaledDensity属性有关.</dd>

<dt><strong>pt</strong></dt>
<dd>Points，物理长度单位，1/72 英寸。</dd>

<dt><strong>px</strong></dt>
<dd>实际的像素点，效率最高的单位。</dd>

<dt><strong>mm</strong></dt>
<dd>毫米，同样是物理长度单位。</dd>

<dt><strong>in</strong></dt>
<dd>英寸，屏幕物理长度单位。 1英寸=25.4mm。</dd>
</dl>


> xlarge screens are at least 960dp x 720dp

> large screens are at least 640dp x 480dp

> normal screens are at least 470dp x 320dp

> small screens are at least 426dp x 320dp

下面是android 处理单位的转换算法：

    switch (unit) {
    case COMPLEX_UNIT_PX:
		return value;
    case COMPLEX_UNIT_DIP:
		return value * metrics.density;
    case COMPLEX_UNIT_SP:
		return value * metrics.scaledDensity;
    case COMPLEX_UNIT_PT:
		return value * metrics.xdpi * (1.0f/72);
    case COMPLEX_UNIT_IN:
		return value * metrics.xdpi;
    case COMPLEX_UNIT_MM:
		return value * metrics.xdpi * (1.0f/25.4f);
    }
    return 0;
	
metrics，是类DisplayMetrics的实例,DisplayMetrics是一个描述显示设备基本信息的类。

	//获取当前DisplayMetrics
    DisplayMetrics metrics = new DisplayMetrics();
    getWindowManager().getDefaultDisplay().getMetrics(metrics);

`metrics.density`是dp直接相关缩放因子。density不是实际dpi/160，即这个值与真实屏幕尺寸（xdpi，ydpi。）无关的，应该是与屏幕密度的分组有关，

	DisplayMetrics.DENSITY_LOW  // 120dp
	DisplayMetrics.DENSITY_MEDIUM //160dp
	DisplayMetrics.DENSITY_HIGH //240dp
	DisplayMetrics.DENSITY_XHIGH //320dp


`metrics.densityDpi` 可以得到这个值，比如 hdpi 的设备， density 应该为 1.5

### 位图缩放
 
>  if your application provides bitmap drawables only for the baseline, medium screen density (mdpi), then the system scales them up when on a high-density screen, and scales them down when on a low-density screen. 

位图放在 drawable 里会按实际像素处理，放在 drawable-?dpi 里的图片，在其他dpi的设备里显示会被缩放。

比如一张大小为72x72的图片，放到 drawble-hdpi里，在不同dpi的设备显示大小如下：

	hdpi 72x72px 48x48dp
	mdpi 48x48px 48x48dp

如果这张图片放到 drawable 里：

	hdpi 72x72px 108x108dp
	mdpi 72x72px 72x72dp

因为 mdpi `1px = 1dp`，所以放到 drawble 里，跟放到 drawable-mdpi 一样。



### 多屏幕支持

如何具体应对多屏幕?
