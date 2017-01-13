---
date: '2010-07-30'
title: ProGuard混淆丢掉空循环
tags:
- proguard
- synchronized
- valatile
- 多线程
- 空循环
categories:
- coder
meta:
  _edit_last: '1'
  dsq_thread_id: '812017129'
  _wp_old_slug: proguard_remove_busy_loop
postid: '130'
guid: http://dourok.info/?p=130
---
项目正要发布时，我用proguard打了个混淆包，想不到运行的时候出错了。proguard是Netbeans6.9
J2ME插件自带的，版本号是4.4。

无奈只好debug加反编译，发现居然混淆后的代码里，我用来挂起线程的空循环语句，所谓的[busy-waiting
loop](http://en.wikipedia.org/wiki/Busy_waiting)被去掉了

原代码大概如下:



```java
boolean a = false;

new Thread().start

while(a);
```



混淆后的代码while(a);这句已经不见了 加上个括号也不行



```java
boolean a = false;

new Thread().start

while(a){ }
```



必须做些操作,循环才会正确运行。



```java
boolean a = false;

new Thread().start

while(a){

System.out.print("");

}
```



想必是proguard给优化掉，Google了一下居然被我找到了一段Troubleshooting([原文地址](http://docs.huihoo.com/proguard/manual/troubleshooting.html#Disappearingloops))，摘录如下：
**Disappearing loops**

If your code contains empty busy-waiting loops, ProGuard's optimization
step may remove them. More specifically, this happens if a loop
continuously checks the value of a non-volatile field that is changed in
a different thread. The specifications of the Java Virtual Machine
require that you always mark fields that are accessed across different
threads without further synchronization as **volatile**. If this is not
possible for some reason, you'll have to switch off optimization using
the [**-dontoptimize**](http://docs.huihoo.com/proguard/manual/usage.html#dontoptimize)
option.

大致的意思是，如果你的代码里有忙等待循环，那么Proguard的优化步骤很可能会把它移除掉，特别是当你在循环里不断检查的字段没有用**valatile**关键字修饰时。

不过我后来加上 **valatile**
关键字后，空循环还是照样被移除。而且我调用的方法已经加了synchronized，我的代码也没有必要为这个变量加上**valatile**
，最后只能非常不爽地在项目的混淆选项界面里的其他混淆设置中添上一行


```
-dontoptimize
```

