---
title: Activity
date: '2012-08-18'
description:
tags:
---

### lifecycle


- StartActivity, create start resume
- finish, pause stop destroy
- 弹出对话框，不会造成状态变化，但会调用 onWindowFocusChanged，Activity 所在的 Window 会失去焦点
- 新的 Activity 进入前台， p s
- home p s
- 锁屏 p s
- onActivtyResult 在 Start 之前

c d 整个生命周期
s s 可见生命周期，
r p 前台生命周期


#### onRestart

onStop 后的 Activity 重新 Start，会在调用 onStart 之前调用 onRestart。

#### onStart

进入可见生命周期。

#### onResume

进入前台生命周期。

#### onPause

`onPuase` 在 Activity 离开前台之前调用，接下来将会调用`onWindowFocusChanged(false)` ，**新的 Activity 不会在当前 Activity 的 onPause 返回之前调用。** Pause 之后 Activity 的状态是失去了焦点，但仍然可见。

**弹出菜单或对话框，Activity 失去焦点，但不会调用 onPause。**

`onPause` 常用用于保存全局的数据，而 `onSaveInstanceState` 用于保存当前 Activity 的状态。

#### onStop

离开可见生命周期。

#### onDestroy

`onDestroy` 要释放所有资源，包括任何创建后台线程。



完全不可见。

![Activity Lifecycle](https://developer.android.com/images/activity_lifecycle.png)

**低内存的时候，可能 onDestroy/onStop 没被调用 activity 就被杀死**

	onCreat 
	
	-onStart   						 
	|--onRestoreInstanceState
	|
	|--onPostCreate 在onRestoreInstanceState后调用，接收savestate参数
	|  	   	   	   	  	
	|-onResume 	   
	|--onPostResume	在这个状态，activity已经是可见的了，所有ui布局应该完成	
	+--------- 	   	
	|  	   		   
	|-onPause  在这个方法内提交/保持用户的操作(用户可能就此离开)
	|--onSaveInstanceState
	|					  
	|onStop
	|onRetainNonConfigurationInstance  暂时保留引用。
	onDestroy

其他：
onUserLeaveHint 当activity由用户操作进入stop状态时，会调用这个方法，书中说在用户按back 或home 键会调用，在 sense4.0 真机上只有home会调用。这个方法是个清除dialog的好地方


如果耗时操作是与 Acitivty 无关， Activity 处在哪个状态都对操作无影响，那么应该把操作方到 Service 中。


### Configuration Changes

在 android:configChanges 声明的 configChange ，不会重启 Activity，而是调用 onConfigurationChanged(Configuration) 。

### Edit in Place

打开一个新实例界面时，同时创建它的数据库实例或文件实例。

用户所有的编辑在 onPause 保存。

#### Saving Persistent State保存持久状态

鼓励使用"edit in place" 用户模型，即更改立刻生效。

提到了一个 Android 中的用户习惯，返回按钮意味著用户保存内容（如果有未保存的话）并离开当前 Activity，如果需要取消编辑要通过其他途径（比如一个取消按钮）。

### Tasks

1. stack of activities
2. include activities from several apps
3. not a process

#### Multiple Tasks

Creating a new task

`FLAG_ACTIVITY_NEW_TASK`。

如果已有一个相同 affinity 的 task 存在，那么将这个 task 带到前台，然后再进行判断，如果Intent 更此 Task 的根 Activity 相同，则把 task 带到前台便完成；若找不到，那新的 Activity 将推入单前的 Task 中。

### ActionBar

1. make the most common actions more visible
2. structure and place to the app

structure navigation in app

### Activity Manager

Activity Manager 管理的是整个系统层面的 Activity，提供获取内存信息，当前 Tasks，当前 Services，杀死进程等等的方法，主要用于任务管理 app 吧。

### ActivityInfo
