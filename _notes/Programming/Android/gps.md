---
title: GPS
date: '2017-02-21'
description:
tag:
- gps
- location
---


### GPS 简介

[GPS][] 属于[全球卫星导航系统][GNSS]（global navigation satellite system）的一种。

有源与无源定位，GPS 为无源定位，接收机不需要发出任何信号。

卫星信号里包含有卫星的精确位置以及卫星发射信号的精确时间信息，接收机最少要收到四个卫星的信号，相当于从四个已知精确位置的点收到信号；而且可以通过接收机时钟得到时间差，从而知道四个信号从卫星到接收机的不准确距离（含同一个误差值，由接收机时钟误差造成），用这四个不准确距离和四个卫星的准确位置构建四个方程，解方程组就得到接收机位置。

这里有个问题，为什么 Android GPS API 返回的卫星数据，是天顶角（Alt） 和方位角（Az），这是地平坐标系。这些位置信息如果是卫星返回的，不是应该返回绝对位置吗？比如说卫星在天球中的赤经和赤纬吗？如果说经程序转换，那么地平坐标系是基于观察者的坐标系，这时观察者的数据应该是未知。

#### 精度

C/A-code receivers ~ 5 -10 m.
P/Y-code receivers ~ 2 -9 m

DGPS(差分 GPS)

C/A-code DGPS receivers ~0.7 -3 m.
P/Y-code DGPS receivers ~0.5 -2.0 m.

卫星的几何分布也会影响到定位精度。

- [GPS精度因子（GDOP,PDOP,HDOP,VDOP,TDOP）](https://www.cnblogs.com/inteliot/archive/2012/08/14/2638185.html)
- [科学网—什么叫几何精度因子（GDOP,PDOP,HDOP,VDOP,TDOP）](http://blog.sciencenet.cn/blog-640874-503434.html)

[GPS]: https://zh.wikipedia.org/wiki/%E5%85%A8%E7%90%83%E5%AE%9A%E4%BD%8D%E7%B3%BB%E7%BB%9F
[GNSS]: https://zh.wikipedia.org/wiki/%E5%8D%AB%E6%98%9F%E5%AF%BC%E8%88%AA%E7%B3%BB%E7%BB%9F

### 大地测量系统（Geodetic Datum）

[大地测量系统][Geodetic Datun]是指用于描述地球上一个地点位置的坐标系统，有多套标准，国内面对的一般有如下三种

1. WGS-84

  GPS全球定位系统使用而建立的坐标系统。在Android系统内取得的海拔高度预设是参照WGS84而不是当地平均海平面，使得用户在海边定位是可能发现自己的测量值位于海平面以下

2. GCJ-02
 
  又名火星坐标。

  > A marker with GCJ-02 coordinates will be displayed at the correct location on a GCJ-02 map. However, the offsets can result in a 100 - 700 meter error from the actual location if a WGS-84 marker (such as a GPS location) is placed on a GCJ-02 map, or vice versa. 

  谷歌地图上的**路网图**用的是 GCJ-02，卫星地图（同谷歌地球）用的 是 WGS-84，所以显示出来会有 100-700m 的偏移。

3. BD-09

  百度标准的经纬度坐标，基于 GCJ-02。

[Geodetic Datun]: https://en.wikipedia.org/wiki/Geodetic_datum

#### 坐标转换

WGS-84 和 GCJ-02 的转换可参考：[中国地图坐标(GCJ-02)偏移算法破解小史 – blog.genglinxiao.com](http://blog.genglinxiao.com/%E4%B8%AD%E5%9B%BD%E5%9C%B0%E5%9B%BE%E5%9D%90%E6%A0%87%E5%81%8F%E7%A7%BB%E7%AE%97%E6%B3%95%E7%A0%B4%E8%A7%A3%E5%B0%8F%E5%8F%B2/)

[GPSspg](http://www.gpsspg.com/maps.htm)，提供各个地图的经纬度查询。以北纬 N39°54′26.54″ 东经 E116°23′28.84″  为例：

 * 谷歌地图：39.9087677478,116.3975780499 (GCJ-02)
 * 百度地图：39.9151190000,116.4039630000 (BD-09)
 * 腾讯高德：39.9087311069,116.3975323161 (GCJ-02)
 * 图吧地图：39.9081728469,116.3867845961
 * 谷歌地球：39.9073728469,116.3913445961 (WGS-84)

具体算法可参考:

 - [Offline Navigation for Windows Phone 7 - Source Code](https://on4wp7.codeplex.com/SourceControl/changeset/view/21483#353936)
 - [android-demo/InternalGpsConverter.java at master · douo/android-demo](https://github.com/douo/android-demo/blob/master/app/src/main/java/info/dourok/android/demo/utils/InternalGpsConverter.java)
 

### GPS 轨迹文件

GPS 轨迹可以理解为是一个基于时间的 GPS 坐标点集合。常用的有两种：

1. GPX

  [GPX（GPS Exchange Format）][GPX] 基于 XML，专门用来储存地理资讯。免费、开放、常用。规范见：[GPX 1.1 Schema Documentation](http://www.topografix.com/GPX/1/1/)

2. KML

  [KML][] 也是基于 XML，由谷歌旗下的 Keyhole 维护，常用于谷歌系的软件。


[KML]: https://zh.wikipedia.org/wiki/KML
[GPX]: https://zh.wikipedia.org/wiki/GPX


### Android Location 框架


#### Location Callback

PendingIntent 可以通过这样的方式获取更新的 Location 对象

``` java
Location location = getIntent().getParcelableExtra(LocationManager.KEY_LOCATION_CHANGED);
```

#### Gps 卫星

 GpsSatellite 用的是[地平坐标系][] :
 
高度角（Elevation/Altitude），有时就称为高度或仰角，是天体和观测者所在地的地平线的夹角。
方位角（Azimuth），是沿着地平线测量的角度（由正北方为起点向东方测量）。

[地平坐标系]: https://zh.wikipedia.org/wiki/%E5%9C%B0%E5%B9%B3%E5%9D%90%E6%A8%99%E7%B3%BB

#### AGPS

GPS 接收器可能最多需要 12.5 分钟（从 GPS 卫星下载历书和星历的时间）来计算出当前位置。
 
辅助有两种类型：

1. 基地台基本定位功能（Mobile Station Based）
  
   通过网络服务器获取卫星的轨道和历书数据，避免从 GPS 卫星直接下载数据从而加快锁定卫星。
   通过网络获取精准的时间（NTP）。
   
2. 基地台协助（Mobile Station Assisted）
 
   设备上传本身的 GPS 数据，由服务器来技术位置。


Android 可以通过 `LocationManager#sendExtraCommand`  操作 AGPS。以 5.1  为例，总共支持 3 条命令。

1. `delete_aiding_data`，清除辅助定位数据，重置 GPS 状态到冷启动
2. `force_time_injection`，命令从一个配置服务器中下载A-GPS 数据，这些数据将被GPS位置提供者使用
3. `force_xtra_injection`，命令从配置的NTP 服务器检索当前时间并进行更新，用来进行GPS 计算。

`delete_aiding_data` 命令用于删除先前已下载的A-GPS 数据。这是唯一使用Bundle 参数的附加命令，Bundle 用于控制要删除的A-GPS 数据。Bundle 可以包含布尔型的键值对来指明要移除的数据。
具体代码见：[GpsLocationProvider][] 或 [grepcode(Android 5.1)][grepcode]。

1. cold(冷启动)：没有之前的位置信息，没有星历，没有时间的估算。这种情况发生在初次使用定位时或电池没电导致星历丢失时。关机状态下将接收机移动200公里以上距离。
2. warm(温启动)：有历书信息，大致的位置和时间可知，没有星历信息。这种情况发生在本次定位距离上次超过两个小时时。
3. hot(热启动)：有星历信息，大致的时间和位置可知，通常比温启动的时间和位置信息精确。这种情况发生在本次定位与上次定位的时间间隔小于两个小时时。


星历(Ephemeris)与历书(Almanac):

   为了缩短卫星锁定时间，GPS接收机需利用历书、当地位置的时间来预报卫星运行状态。

   历书与星历都是表示卫星运行的参数。历书包括全部卫星的大概位置，用于卫星预报；星历只是当前接收机观测到的卫星的精确位置，用于定位。
   
NTP 服务器和 Xtra 服务器的配置文件保存在 `/etc/gps.conf`。

参考：

- [Assisted GPS - Wikipedia](https://en.wikipedia.org/wiki/Assisted_GPS)
- [GpsLocationProvider中的sendExtraCommand方法](https://www.cnblogs.com/l2rf/p/5113326.html)
- [gps.conf - Google 文件](https://docs.google.com/document/d/12JGuF553-Yswh7IRhAZ77I0tpfyuTb0N9SpJ7_GygGE/edit)

FYI：

- [WirelessMoves: How SUPL Reveals My Identity And Location To Google When I Use GPS](http://mobilesociety.typepad.com/mobile_life/2014/08/supl-reveals-my-identity-and-location-to-google.html)
- [How Does Android Use SUPL Server? - Google 網上論壇](https://groups.google.com/forum/#!topic/gpstest_android/wOgMdQ0N_vU)


[grepcode]: http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/5.1.1_r1/com/android/server/location/GpsLocationProvider.java#GpsLocationProvider.sendExtraCommand%28java.lang.String%2Candroid.os.Bundle%29


[GpsLocationProvider]: https://gitorious.org/android-eeepc/base.git/?p=android-eeepc:base.git;a=blob;f=location/java/com/android/internal/location/GpsLocationProvider.java;h=887574a66bad13cdfdd11d9325b74789f24ac912;hb=HEAD

#### NMEA


[NMEA][] 是美国国家海洋电子协会（National Marine Electronics Association）的缩写。这里的 NMEA 是指一套规格用于定义各种海洋电子设备之间通讯的接口。这套标准的规格文件是收费的，可到[官网][NMEA]购买。不过网上也能找到这套规格的描述，比如 deal  的[文章][dale]还有埃里克·雷蒙（Eric S. Raymond）的[披露][revealed]。埃里克·雷蒙现在是 [gpsd][] 的维护者。


[NMEA]: https://www.nmea.org
[dale]: http://www.gpsinformation.org/dale/nmea.htm
[revealed]: http://www.catb.org/gpsd/NMEA.html
[gpsd]: https://en.wikipedia.org/wiki/Gpsd

NMEA 的基本单元是一种称为句子（sentence）的数据行，句子有 ASCII 字符组成，由 `$` 符号开始，由换行符（carriage return/line）结束，句子最多有 80 个可见字符（+ 一个不可见的换行符）。句子有两种类型：

1. 标准句子
   
   标准句子由两个字符作为前缀，表示设备类型， 比如 GPS 接收器的前缀就是 `GP`，接着的三个字符表示句子的内容，由五个字符表示句子的类型。
   
2. 专有（proprietary）句子
   
   专有句子是由独立公司自己定义的句子，以 `P` 作为前缀，后面跟着三个字符用来表示厂商，比如 `PGRM` 是佳明（Garmin）的句子。
 

句子内的数据项用`,`分隔。`*` 带上两位十六进制字符表示校验码。

```
  $GPGSV,2,1,08,01,40,083,46,02,17,308,41,12,07,344,39,14,22,228,45*75

Where:
      GSV          Satellites in view
      2            Number of sentences for full data
      1            sentence 1 of 2
      08           Number of satellites in view

      01           Satellite PRN number
      40           Elevation, degrees
      083          Azimuth, degrees
      46           SNR - higher is better
           for up to 4 satellites per sentence
      *75          the checksum data, always begins with *
```

大部分 GPS 接收器支持的标准是 NMEA 0183 Version 2。


用下面代码在真机上进行测试

``` java
mLocationManager.addNmeaListener(new OnNmeaMessageListener() {
                long firstTimestamp = -1;
                int count;

                @Override
                public void onNmeaMessage(String message, long timestamp) {
                    if (firstTimestamp == -1) {
                        firstTimestamp = timestamp;
                    }
                    count++;
                    Log.d(TAG, message);
                    if (timestamp != firstTimestamp) {
                        Log.d(TAG, "rate:" + (count * 1000 / (timestamp - firstTimestamp)) + "sen/s");
                    }
                }
            });
```


- Nexus 6p，NMEA 的接收频率大概是 10 句每秒，接收的设备类型前缀有`GP`（GPS）和 `GL`（GLONASS）
- P9 plus 上是 18 句每秒，前缀比较多：`QZ`（QZSS）、`GN`（GLONASS）、`IM`、`BD`(北斗)、`GP`（GPS）
