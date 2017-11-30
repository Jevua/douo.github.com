---
title: Google IO 2013
date: '2013-10-08'
description:
tags:
- Google IO
- ActionBar
- Navigation
- Graphics
---

### Navigation in Android

#### taskAffinity

http://yelinsen.iteye.com/blog/1122547

#### Launcher

在 Launcher 中打开应用的 Intent 带有 `FLAG_ACTIVITY_NEW_TASK`。一般情况下就是在新 Task 下打开一个 Activity。但是如果已经有相同 affinity 的 task 存在，这个 flag 意味着，如果 intent 跟 task 的 root activity 相同，那会把 task 带到前台，而不启动这个 Intent 的 activity。如果不同，那么新的 Activity 将会创建并压入 task 。

>	创建两个工程，application1和application2，分别含有Activity1和Activity2，它们的taskAffinity相同，首先，我们启动application1,加载Activity1，然后按Home键，使该task（假设为task1）进入后台。然后启动application2，会看到Activity1 被带入前台，Activity2 没有启动。


#### Recent


Recent 按钮就是三个标准按钮中，除了 Back 和 Home 外的另外一个。实际上就是用于切换 Task。

Recent 切换就是启动所选 Task 的 root activity，但是带有两个Flag，`FLAG_ACTIVITY_NEW_TASK`，`FLAG_ACTIVITY_TASK_ON_HOME`。意味着把这个 Task 和 Home 一起移到顶部，Home 置于 Task 之下。见:[Slide](https://docs.google.com/presentation/d/1BaucBbey81e5qEyq_71hVe4kmd7F2x5nt_TcyuxrgK0/edit#slide=id.g63148c4_0_11)




#### ActionBar

ActionBar 的后退按钮，称之为**UP** ，UP 是作为应用内导航用的，它让当前 Activity 返回到他的父 Activity，不一定是当前 Task 中的前一个 Activity。Apps 中各个Activity的关系应该是树结构的。见[Slide](https://docs.google.com/presentation/d/1BaucBbey81e5qEyq_71hVe4kmd7F2x5nt_TcyuxrgK0/edit#slide=id.g11d81ecd_1_32)

具体的实现见: [Providing Up Navigation](https://developer.android.com/training/implementing-navigation/ancestral.html)

#### Widget

如果 Widget 打开一个某个 Content Activity（位于 App structure 的某个非根节点），[Slide](https://docs.google.com/presentation/d/1BaucBbey81e5qEyq_71hVe4kmd7F2x5nt_TcyuxrgK0/edit#slide=id.g1464cfe7_1_208)。下面的代码显示这个 Activity 如何处理**UP**事件的。

	Intent upIntent = NavUtils.getParentActivityIntent(this);
    if (NavUtils.shouldUpRecreateTask(this, upIntent)) {
		//如果当前 Task 找不到它的 parent intent，则通过下面的方法，启动整个 parent statck
        TaskStackBuilder.from(this)
			.addParentStack(this)
			.startActivities();
		finish();
	} else {
        NavUtils.navigateUpTo(this, upIntent);
    }

`navigateUpTo` 只是加了個 `FLAG_ACTIVITY_CLEAR_TOP`

	    @Override
        public void navigateUpTo(Activity activity, Intent upIntent) {
            upIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            activity.startActivity(upIntent);
            activity.finish();
        }
		
#### Notification

Notification 打开的 Activity 会启动一个新 Task，但不带`FLAG_ACTIVITY_TASK_ON_HOME`。**Back**可以返回到前一个 Task。


#### Test

要小心不同方式打开 Acitivty 的不同处理，

- widget
- notification
- intent

### Android Graphics Performance

Android 4.3 优化了图形的绘制效率。**Re-ordering** 重新排序绘制指令，相
同的指令一起绘制（所有的 Vew），比如先绘制所有 bitmap ，然后 9patch 然
后text，而不是一个 View 一个 View 地绘制。**Merge** 相同的指令合并成一
个指令，比如两个 Bitmap 一起绘制。

Drawing 多线程优化，多核心 CPU 优化。

支持 Path Clip。

#### OverDraw

4.2 一个新的 debug tool 选项，`show GPU overdraw` Overdraw，就是一帧的
中一个像素被绘制了多少次，前几次绘制都是无用的，只有最后一次绘制的颜色
才会最终显示给用户。减少 overdraw 可以提供应用绘制的效率。

提供了几个技巧来减少 overdraw

1. 避免使用根View的背景，在 theme 中设置`android:windowBackground`代替。
2. 可以将 9patch 的  content area 弄成透明的，前提是显示的内容是非透明的。

#### Profilie GPU rendering

4.2 实时显示每一帧的绘制时间在屏幕上，低于绿线表示帧率超过60。手头没
有 4.2 的设备可供测试。

#### systrace

新的 API `android.os.Trace`。对 opengl  比较有用。

#### Trilinear filtering

4.2 Bitmap#setHasMipMap 支持
[MidMap](http://zh.wikipedia.org/wiki/Mipmap) 

#### 其他
需要进一步详细了解

1. Canvas layout
2. alpha，TextView setTextColor，ImageView setImageAlpha
3. 如果各个view间不相互覆盖，在4.1中可以通过设置hasOverLappingRendering为false来提高性能
4. Canvas confuse, hardware rendering 返回 size of view。softwarerendering 返回 size of window
5. clip ronate。 clip border 

最后放上 slide：

<iframe src="http://www.slideshare.net/slideshow/embed_code/26948262"
width="98%" height ="500" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

#### NVIDIA PerfHUD ES

[NVIDIA PerfHUD ES][1] 视频里出现了这个工具，看起来很酷的样子，可以逐
步重现各个绘制的步骤。但貌似只支持 Terga GPU

高通也有个类似的工具，用于调试 OpenGl ES，[ADRENO™ PROFILER][2]

[1]: https://developer.nvidia.com/nvidia-perfhud-es
[2]: https://developer.qualcomm.com/mobile-development/mobile-technologies/gaming-graphics-optimization-adreno/tools-and-resources

### Volley

[Volley][] 类似于 async-http-client 的网络库，很强大的 cancelation 处理机制。（async-http-client 的 cancel 几乎不可用）。有吸引力，正式使用前必须跟 async-http-client 作一番对比才行，接口看起来复杂不少。

mark 一下[LRU Cache](http://zh.wikipedia.org/wiki/%E5%BF%AB%E5%8F%96%E6%96%87%E4%BB%B6%E7%BD%AE%E6%8F%9B%E6%A9%9F%E5%88%B6)

[Volley]: https://android-review.googlesource.com/#/admin/projects/platform/frameworks/volley

[Volley Source]: https://android.googlesource.com/platform/frameworks/volley/

#### OkHttp

[OkHttp][] 有两个优点，其一是更高效地使用 http，并支持 spdy；其二，实现了HttpURLConnection 和  Apache HttpClient 几乎一样的接口，重构成本低。

这里有一份[中文介绍](http://blog.chengyunfeng.com/?p=489#ixzz2i3evPpq0)。

[OkHttp]: http://square.github.io/okhttp/

#### 
