---
title: Android Test
date: '2014-08-22'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---


### Key Feature


1. JUnit，AndroidTestCase
2. 针对各个组件的 Test Case Class
3. Test 套件置于与主应用相似的 Test 包里。
4. SDK Tools & command-line
5. monkeyrunner 生成伪随机操作事件


### Framework

Instrumentation，JUnit，Mock Objects


###　Projects

Android　Studio　默认　src/androidTest/java

类名 Ctrl + Shift + T 可生成 Test Case


### API

#### JUnit

JUnit 为每个测试方法创建一个实例，然后按照 setup test teardown 顺序执行

#### Instrumentation

可操作 Activity 的生命周期

#### Test case classes

##### AndroidTestCase

继承了 TestCase 和 Asser，另外还提供了测试权限的方法和保护内存泄露的方法

##### 针对组件的测试用例

- Activity
- Content Provider
- Service

##### ApplicationTestCase

对于验证 manifest 中声明的 application 很有用


##### InstrumentationTestCase

用于操作 instrumentation 方法

#### Assertion classes

MoreAsserts

ViewAsserts

#### Mock object classes



### Activity Test

ActivityInstrumentationTestCase2 Activity 运行在标准的系统上下文。不允许 Mock Context 和 Application

ActivityUnitTestCase 


#### Monkeyrunner

基本使用，产生一些伪随机的用户操作事件

	adb shell monkey –p <package name> <event count>


http://developer.android.com/tools/help/monkeyrunner_concepts.html#APIClasses
