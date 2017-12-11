---
title: Resume
date: '2017-10-26'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

# 联系方式
（HR会打印你的简历，用于在面试的时候联系，所以联系方式放到最上边会比较方便）

- 手机：13729271273
- Email：dourokinga@gmail.com
- 微信号：[二维码]

---

# 个人信息

 - 林超/男/1988 
 - 专科/广东科学技术职业学院/软件工程
 - 工作年限：7年
 - 技术博客：http://dourok.info
 - GitHub：http://github.com/douo 
 - 期望职位：Android高级程序员，应用架构师
 - 期望薪资：税前月薪**20k~30k**
 - 期望城市：深圳
---

# 自我介绍


- Linux 爱好者，没 Mac 的时候一直使用 Arch Linux 桌面进行开发。
- Emacs 党
- 喜欢自己动手写插件提升生产力，包括 chrome 插件，wordpress 插件。
- 基于 ruhoh 定制自己一套笔记系统
- Android 手机爱好者，熬夜收看每年 IO 大会，喜欢折腾手机
- 五年车险行业相关经验
- 自我教育者，对元学习及精力管理的知识感兴趣

# 工作经理

## 自由职业（2017年07月~2017年10月）

### ActivityBuilder

[ActivityBuilder](https://github.com/douo/ActivityBuilder) 是一个个人的开源项目，基于注解处理器，为 Activity 生成 Builder。主要亮点是可以用一行代码实现传递参数、启动 Activity 和设置结果回调。

### 移动办公

集团内部的移动办公软件，主要功能包括 IM、集团通讯录、单据审批管理、文件共享等。使用 Android Architecture Component 配合 Databinding 和 Dagger2 搭建了一个 MVVM 架构。

## 广东东升信息技术有限公司北京分公司 （ 2016年03月 ~ 2017年07月 ）

Android 组长，主要的工作包括参与需求评审，项目规划与排期，技术选型，客户端架构设计。

### 移动理赔处理平台

移动理赔处理平台（简称 MCP），是人保内部最大的移动平台--移动查勘定损系统的第二代产品。作为项目的核心成员参与了前期团队的组建。Mcp 使用 Hybird 技术，依赖于 cordova，界面及大部分业务代码由前端实现，Android 端只对前端开发了一个接口层，以插件的形式向前端提供接口。

​

## 广东东升信息技术有限公司 （2011年12月 ~ 2016年03月）

对新技术的研发。

### 东升车险内部应用

车险行业内部 app，供各个环节的相关人员使用，使用东升数据工具，打通整个车险流程

- 移动查勘定损（人保定损工具），基于东升数据平台的定损工具，
- 快撤快赔，对于小额事故的快速处理。需要对接移动蓝牙打印机
- 维修厂，维修厂接车端
- 旧件回收，对拆解件进行回收

 
##  扇贝网(南京贝湾教育科技有限公司) （ 2012年06月 ~ 2014年08月 ）

扇贝网的工作是以兼职外包的形式进行的，因为开发了[扇贝查词 Chrome 扩展][]，认识了扇贝的联合创始人，当时他们网站正准备开发移动客户端，交流之后，我建立了一个两人的小团队，负责扇贝网移动端的开发工作。

期间，我个人负责了[扇贝单词][]、[扇贝阅读][]、[扇贝新闻][]、[扇贝炼句][]的 Android 端开发及 iOS 端 [扇贝新闻][] 的开发。

期间用 Ruby 实现了一个 json 转 pojo 的小工具，使用 mustache 进行模板填充，还附带 fromJson、toJson 方法，
其中一个印象比较深刻的难点是，Android 端的扇贝阅读器的实现，Android 的 TextView 不像 iOS 的 UITextView 对富文本的支持那么好。涉及的需求有改变个别单词的颜色，加下划线，改变下划线样式，文本的对齐，及文本中图片的对齐，每个单词，或者短语要响应独立的事件。每个基本元素都用 View 的话，对性能影响非常大。只能考虑用 Spannable，经过阅读 Android Spannable 模块的代码后发现，Spannable 不能实现所有功能，Spannable 的扩展性也较差。最后决定参考 Spannable 自己实现一个文本布局模块，最终实现后性能符合要求，对大量文本进行渲染对性能的影响也较小。

[扇贝查词 Chrome 扩展](https://code.google.com/archive/p/shanbay-chrome-extension/)

## 自由职业 （2011年01月 ~ 2011年11月）

学习 Android 开发，期间主要开发了两个开源 Android App

### AOSP Music Player Plus

第一个上线 Google play 的应用。

对 Android 2.3 的音乐播放进行修改，主要增加了定时停止播放和歌词模块。歌词模块除了支持一般的歌词显示外，还支持包括千千静听和 LyrDb 等多来源的在线歌词搜索。千千静听的歌词搜索主要参考了 Foobar2000 的歌词搜索插件。期间还对插件进行修复，见 [修复了 Lyrics Grabber2 的千千静听歌词抓取脚本 | DouO's Blog](http://dourok.info/2011/08/08/fixed-ttplayer-lrc-py/)。


- [AOSP Music Player Plus](http://m.mobomarket.net/free-download-aosp-music-player-plus-4294232943.html)，因为 play 更新了开发者协议后没有及时确定，当年的 app 都要被下架。
- [douo/music_plus at musicplus](https://github.com/douo/music_plus/tree/musicplus)
- [douo/LyricsShowForAndroid](https://github.com/douo/LyricsShowForAndroid)

### LWTouchPad

一个模拟笔记本触控板的 App，支持单击，双击，拖拽等，服务端用 java 实现，跨平台，在 win 和 linux 上测试过。通讯方面支持 socket 和蓝牙。

- [douo/LWTouchPad: a light weigth remote touch pad for android](https://github.com/douo/LWTouchPad)

## 珠海汉策教育软件有限公司 （2010年03月 ~ 2011年01月）

在公司期间主要负责 J2ME 及 MTK 平台的手机应用开发。

### 搜题易

独立负责搜题易 J2ME app 的开发，涉及到在线接口的调用，题目数据是 HTML，主要难点在于解析题目数据。最终实现了一个简易的 HTML 解析器，及渲染成 UI 的功能。所用 IDE 是 NetBeans 6

### 手机学习机

基于 MTK 平台进行定制，我在此项目主要负责了点读模块的开发。主要业务是对点读数据的解密及解析，热点区域点击的判断，图片预加载和音频播放。使用 C 和 VC 6.0 进行开发

---

# 开源项目和作品
（这一段用于放置工作以外的、可证明你的能力的材料）

## 开源项目
（对于程序员来讲，没有什么比Show me the code能有说服力了）

 - [STU](http://github.com/yourname/projectname)：项目的简要说明，Star和Fork数多的可以注明
 - [WXYZ](http://github.com/yourname/projectname)：项目的简要说明，Star和Fork数多的可以注明

## 技术文章
（挑选你写作或翻译的技术文章，好的文章可以从侧面证实你的表达和沟通能力，也帮助招聘方更了解你）

- [一个产品经理眼中的云计算：前生今世和未来](http://get.jobdeer.com/706.get)
- [来自HeroKu的HTTP API 设计指南(翻译文章)](http://get.jobdeer.com/343.get) （ ```好的翻译文章可以侧证你对英文技术文档的阅读能力```）

## 演讲和讲义
（放置你代表公司在一些技术会议上做过的演讲，以及你在公司分享时制作的讲义）

  - 2014架构师大会演讲：[如何通过Docker优化内部开发](http://jobdeer.com)
 - 9月公司内部分享：[云计算的前生今世](http://jobdeer.com)

# 技能清单
（我一般主张将技能清单写入到工作经历里边去。不过很难完整，所以有这么一段也不错）

以下均为我熟练使用的技能

- Web开发：PHP/Hack/Node
- Web框架：ThinkPHP/Yaf/Yii/Lavaral/LazyPHP
- 前端框架：Bootstrap/AngularJS/EmberJS/HTML5/Cocos2dJS/ionic
- 前端工具：Bower/Gulp/SaSS/LeSS/PhoneGap
- 数据库相关：MySQL/PgSQL/PDO/SQLite
- 版本管理、文档和自动化部署工具：Svn/Git/PHPDoc/Phing/Composer
- 单元测试：PHPUnit/SimpleTest/Qunit
- 云和开放平台：SAE/BAE/AWS/微博开放平台/微信应用开发


---

# 曾获荣誉

- 2009年全国大学生数学建模竞赛/全国一等奖（http://www.shumo.com/home/html/527.html）

## 参考技能关键字

本技能关键字列表是从最近招聘Android的数百份JD中统计出来的，括号中是出现的词频。如果你的简历要投递给有机器（简历分选系统）和不如机器（不懂技术的HR）筛选简历环节的地方，请一定从下边高频关键词中选择5～10个适合你自己的。


# 致谢
感谢您花时间阅读我的简历，期待能有机会和您共事。
