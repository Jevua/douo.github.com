---
title: Service
date: '2015-07-11'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

A Service is an application component that can perform long-running operations in the background and does not provide a user interface.

Service 本质上有两种形态

Started，通过 startService 启动

Bound，服务可以绑定给 组件（bindService 是 Context 的方法）。服务提供 CS 接口给组件，组件通过接口与服务交流

两种形态可以同时工作，主要就是解决这个问题

### Base

写一个服务需要这些基本的回调方法：

- **onStartCommand()**，组件通过 startService() 启动服务，系统就会调用这个方法（不过服务是否在运行，每次都会调用）。通过 stopSelf 和 stopService 来终止服务，单单使用 bound 形式的服务，无需实现这个方法。
- **onBind()**，当其他组件通过 bindService 来绑定到这个服务时，系统会调用这个方法。这个方法一定要实现，不过如果无需 bound 形式，那返回 null 就好。
- **onCreate**，服务创建时调用的方法（在 onStartCommand 和 onBind 之前调用，如果服务已经在运行，则不会再调用 onCreate）。不像 Activity，onCreate 不用先调用父方法。
- **onDestroy**，Activity 类似，调用这个方法意味着服务将被销毁，在这里释放资源


**如果通过 start 启动服务，那服务只有调用 stopXXX 才会被终止。**

**如果通过 bounded 启动服务，那当没有组件绑定它的时候，系统将自动销毁它。**

内存不足时，系统会杀死服务来释放资源:

- 普通服务（started 或 bounded 组件也在后台），运行越久越容易被杀
- bounded，只有绑定的 Activity 在前台 不容易被杀死
- setforeground，最不容易被杀死

!#TODO service 要考虑被被系统杀死和恢复


#### 声明服务

    <manifest ... >
      ...
      <application ... >
          <service android:name=".ExampleService" />
          ...
      </application>
    </manifest>

!#TODO 详细见 [`<service>`](https://developer.android.com/guide/topics/manifest/service-element.html)


#### Started Service

`Context#startService`，实际上不是启动服务的命令，而是利用 Intent 向服务发送命令，是否启动服务由系统决定，调用者不知道这个方法是否会导致服务启动。应该理解为，向服务发送命令，这个命令可以是让服务开始做一件事，也可以让服务停止做一件事。甚至可以停用服务，这个取决于 `Service#onStartCommand` 的处理。 [过时的 onStart 就是这样处理的](http://android-developers.blogspot.se/2010/02/service-api-changes-starting-with.html)，服务被系统杀死释放资源后，会重启只调用 onCreate 而没有 onStart，改进后会调用 onStartCommand 并传递 null intent，就是启动服务但不发送命令的意思。

记得只要服务和应用是在同一个进程执行的话，服务的生命周期方法都是在**主线程**执行的。

IntentService，是个方便的子类，提供 `onHandleIntent` 方法用於异步执行。

`onStartCommand` 的返回值用于告诉 Android 服务若被杀死后该怎么处理。几种不同 Start Id 的区别：

##### `START_NOT_STICKY`

不会重启

First run

```
07-23 22:06:37.033  15457-15457/? D/ServiceDemo﹕ onCreate
07-23 22:06:37.034  15457-15457/? D/ServiceDemo﹕ onStartCommand:1 flags:0
07-23 22:06:37.035  15457-15457/? D/ServiceDemo﹕ Dumping Intent start
    Data:http://dourok.info/demo
    Action:Test
    [key=value]
    Dumping Intent end
07-23 22:06:51.348  15457-15457/? D/Servi
```

killed

```
07-23 22:07:48.389    1157-1744/? W/ActivityManager﹕ Scheduling restart of crashed service info.dourok.android.demo/.services.ServiceDemo in 1000ms
```

##### START_STICKY

重启，但 Intent 为空

First run

```
07-23 22:01:03.369  10762-10762/? D/ServiceDemo﹕ onCreate
07-23 22:01:03.370  10762-10762/? D/ServiceDemo﹕ onStartCommand:1 flags:0
07-23 22:01:03.373  10762-10762/? D/ServiceDemo﹕ Dumping Intent start
    Data:http://dourok.info/demo
    Action:Test
    [key=value]
    Dumping Intent end
```

killed

```
07-23 22:02:16.695    1157-2100/? W/ActivityManager﹕ Scheduling restart of crashed service info.dourok.android.demo/.services.ServiceDemo in 1000ms
07-23 22:02:17.541  12814-12814/? D/ServiceDemo﹕ onCreate
07-23 22:02:17.541  12814-12814/? D/ServiceDemo﹕ onStartCommand:2 flags:0
07-23 22:02:17.547  12814-12814/? D/ServiceDemo﹕ null
```


##### `START_REDELIVER_INTENT`

重启，并返回上一次的 intent

First run

```
07-23 22:15:43.459  22569-22569/? D/ServiceDemo﹕ onCreate
07-23 22:15:43.460  22569-22569/? D/ServiceDemo﹕ onStartCommand:1 flags:0
07-23 22:15:43.461  22569-22569/? D/ServiceDemo﹕ Dumping Intent start
    Data:http://dourok.info/demo
    Action:Test
    [key=value]
    Dumping Intent end
```

killed

```
07-23 22:15:57.568    1157-2107/? W/ActivityManager﹕ Scheduling restart of crashed service info.dourok.android.demo/.services.ServiceDemo in 28518ms
07-23 22:16:26.141    1157-1207/? I/ActivityManager﹕ Start proc info.dourok.android.demo for service info.dourok.android.demo/.services.ServiceDemo: pid=23724 uid=10272 gids={50272, 9997} abi=armeabi-v7a
07-23 22:16:26.222  23724-23724/? D/ServiceDemo﹕ onCreate
07-23 22:16:26.222  23724-23724/? D/ServiceDemo﹕ onStartCommand:1 flags:1
07-23 22:16:26.225  23724-23724/? D/ServiceDemo﹕ Dumping Intent start
    Data:http://dourok.info/demo
    Action:Test
    [key=value]
    Dumping Intent end
```

IntentService 只有两种选择，不重启或重启并带回 Intent。

即便创建 Service 的 Activity 被销毁了，Service 还是运行着，即使 Service 不做任何事。多次运行 Activity Service#onStartCommand 也会被调用多次，但 onCreate 只有一次。重新运行程序，杀掉重启应用。服务也会重启的。这是 onStartCommand 会被调用两次，一次是系统重启，一次是 Activity 调用。

关于 flags：
- 0 
- 1 START_FLAG_REDELIVERY 服务在调用 stopSelf 之前被杀掉，系统重启它将会带这个标志
- 2 START_FLAG_RETRY  Intent 没有到达或没有 onStartCommand 没有返回，系统重新发送 Intent 将会带这个标志。onStartCommand 没有返回，Service 跟发送的组件不在同一个进程，才可能发送。我尝试在 onStartCommand 写个死循环并在新进程里运行服务。大约20秒左右，log 打出 Service 执行超时，然后居然死机，log 打出类似[这样的](https://gist.github.com/vciancio/8d0d3f53d57e82780f61)。居然帮我找到 L50t 死机的原因。换另一台手机，大概一分钟后提示 ANR，然后强制关掉后，**并没有重新启动服务。**所以我也没办法重现找个标志了。

生命周期比 Activity 更简单:

![](https://developer.android.com/images/service_lifecycle.png)

##### 回调

通过 Broadcast 回调


#### Bind Service

setForeground 避免被杀

#### 回调

local ref

Message


### startForeground


提升服务优先级到前台进程，前台进程最不容易被回收，Android将进程分为6个等级,它们按优先级顺序由高到低依次是:

1. 前台进程( FOREGROUND_APP)
2. 可视进程(VISIBLE_APP )
3. 次要服务进程(SECONDARY_SERVER )
4. 后台进程 (HIDDEN_APP)
5. 内容供应节点(CONTENT_PROVIDER)
6. 空进程(EMPTY_APP)

但是需要**强制显示一个不可移除的通知**


