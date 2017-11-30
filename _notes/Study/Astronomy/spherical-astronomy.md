---
title: 球面天文学基础
date: '2012-12-28'
description:
tags:
- 月亮
- 天球
- 星宿
widgets :
  math :
    enable : true
---

### 星体命名

Betelgeuse 参宿四

Rigel 参宿七

Capella 五車二

Aldebaran 毕宿五

### 方位天文学

> 人類以肉眼在最好的環境下約可見6,000顆恆星（全天計），但在任何時間都有一半是在地平線下看不見的。現代星圖中，人類把天球劃分成88個星座並有標準的星座邊界，每一顆恆星僅能歸屬於一個星座。星座的升落與天極在航海天文上非常有用，舉例如居於北半球，可利用北極星找到北方，因為他永遠位於北天極附近。

0. 在晚上肉眼可見約有3000顆恆星(半天)
1. 天文学家把天空划分成88个星群
2. 恒星的相对位置不会改变 (实在是太远了,以至于本身的移动显得无关紧要)，天球模型的基礎
3. 星星总是东升西落，因為天球是固定的（不是绝对的，参考[自行]），而地球總是由西向東自轉


[自行]: https://zh.wikipedia.org/zh/%E8%87%AA%E8%A1%8C

#### 星座

[星座]，宿（Constellations）

学习在天空上找星座。

[星座]: http://zh.wikipedia.org/wiki/%E6%98%9F%E5%BA%A7

#### 天球

> 天球（Celestial sphere），是在天文学和导航上假想出的一个与地球同圆心，并有相同的自转轴，半径无限大的球。天空中所有的物体都可以当成投影在天球上的物件。地球的赤道和地理极点投射到天球上，就是天球赤道和天极。天球是位置天文学上很实用的工具。


- 恒星的位置在天球中是固定，因此可以用天球坐标系来描述恒星的位置
- 太阳不是固定的，在天球上每天移动约1度，一年则移动一周（360度），这称之为太阳周年视运动，太阳中心在天球上视运动的轨迹则是黄道。
- 顺行：行星在天球上向东运动。逆行：行星在天球上向西运动。

天球的坐标系统是赤道坐标系统。天极的投影在地球的的极点，天极赤道的投影在地球的赤道。

天球的纬度叫做赤纬（Declination；缩写为Dec；符号为δ）

在观测者天顶的赤纬与该观测地的纬度相同。

天球的经度叫做赤经（Right ascension；缩写为RA；符号为α）

赤经的零点在[春分点]

天球模拟器：http://astro.unl.edu/classaction/animations/coordsmotion/radecdemo.html

[春分点]:http://zh.wikipedia.org/wiki/%E6%98%A5%E5%88%86%E7%82%B9

#### 地平坐标系

- 高度角（Alt），有时就称为高度或仰角，是天体和观测者所在地的地平线的夹角。
- 方位角（Az），是沿着地平线测量的角度（由正北方为起点向东方测量）。

在地平坐标系中的高度角是天顶角(Zenith Angle,ZA)的余角。

天顶: Alt=90, ZA = 0; 地平线: Alt = 0, ZA = 90

天顶的赤纬对于所在地面的纬度

子午圈（Local Meridian），子午圈是在天空中假想的天球上，穿过天顶和在地平圈上北点的一个大圆。他在地平圈上经过过天球北极、通过天顶，再经过地平圈上的南极，然后通过天底，他还会垂直当地的地平圈。详见，http://zh.wikipedia.org/wiki/%E5%AD%90%E5%8D%88%E5%9C%88


#### 本地恒星时

恒星时（local sidereal time，LST），本地恒星时的定义是一个地方的子午圈与天球的春分点之间的时角。**规定春分点在当地上中天(子午圈上)的时刻为零时。**

时角（Hour Angel，HA），本地恒星时与星星赤经的距离（星星到子午圈的距离）。

```mathjax
HA_{obj} = LST - RA_{obj}
```

模拟器:http://astro.unl.edu/naap/motion2/animations/ce_hc.html

#### 太阳

> sidereal time and solar time simulator 

24 ST = 23h56m4s LT 

9月21 ST ~= LT

ST ~= +/- D*4m

![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sidereal_day_%28prograde%29.png/300px-Sidereal_day_%28prograde%29.png)

>在顺行轨道上的行星，像是地球，恒星日会比太阳日短。如图：在时间1，一颗遥远的恒星和太阳都在正上方；在时间2，行星转了360°，遥远的恒星在正上方（1→2 =恒星日），但是要再晚一点，在时间3的位置上太阳才会在正上方（1→3 =太阳日）。

来自维基[太阳日](https://zh.wikipedia.org/wiki/%E5%A4%AA%E9%98%B3%E6%97%A5)



#### 倾斜与季节

太阳的赤纬在 23.5 到 -23.5 之间。

在热带(纬度在 23.5 到 -23.5)太阳有两次处于天顶。

计算中午的太阳高度角 ZA = Lat - Dec, Alt = 90 -ZA

[季节模拟器](http://astro.unl.edu/classaction/animations/coordsmotion/eclipticsimulator.html)

岁差（axial precession），地球自转轴的方向逐渐漂移，追踪它摇摆的顶部，以大约26,000年的周期扫掠出一个圆锥（向西旋转 23.5 度）。

历元(epoch)，在天文学中是为指定天球坐标或轨道根数而规定的某一特定时刻。现在使用的标准历元是J2000.0，即TT（Terrestrial Time）时间2000年1月1日12:00。

赤道平面与黄道平面之间的两个交点，一个是春分点，一个是秋分点。

岁差导致黄赤交角的变动，导致回归年的时间不等于地球公转一周（恒星年）的时间。

回归年就是两个春分点之间的间隔。太阳回到赤道

同时还会受到章动的影响

#### 月亮

月球绕地球自西先东公转，公转周期为27.32日，为一个恒星月（sidereal month）

月球永远面对地球的是同一面，因为公转周期与自转周期相同，潮汐锁定。

RA 每天增加 52min（24 / 27.32），每天相对太阳移动 48min（太阳每天增加 4min）
 
一个朔望月（synodic month）是29.53天。

##### 月相

![](http://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Moon_phases_00.jpg/800px-Moon_phases_00.jpg)


	朔/新月  New
	娥眉月   Waxing crescent
	上弦月	Waxing quarter
	盈凸月	Waxing gibbous
	满月（望） Full
	亏凸月	Waning gibbous
	下弦月 Waning quarter
	残月 Waning crescent

#### Eclipses

月球与太阳在空中的大小大致相同，大约等于 0.5°

月球的轨道（白道）与黄道相差 5°，当月球与太阳同时处于黄白交点时，日食便可能发生

Eclipse Season，是指一年中食可能发生的时间。每个季节持续大约34天，每6个月循环一次，一个季节可能发生2~3次食。

[月球停变期][]的周期是18.6年，

>月球可以到达的最大赤纬和最小赤纬也会改变。这是因为月球环绕地球的轨道平面相对于地球绕太阳公转的轨道平面 (黄道) 有大约5°的倾斜，而这倾斜的方向相对于地球23.5 ° 的倾斜方向也会以18.6年的周期逐渐交替的以"和"与"差"的值变换著。结果是，月球赤纬的最大值变化会从(23.5° − 5°) = 18.5° 到 (23.5 ° + 5 °） = 28.5 °之间逐渐变化。

[月球停变期]:http://zh.wikipedia.org/wiki/%E6%9C%88%E7%90%83%E5%81%9C%E8%AE%8A%E6%9C%9F

#### 其他

笔记，http://astro.wsu.edu/worthey/astro/html/lec-celestial-sph.html

