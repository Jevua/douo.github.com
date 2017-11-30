---
title: Android Architecture Component -- Lifecycle 浅析
date: '2017-05-23'
description:
categories: coder
tags: 
- Android
- 生命周期
- Android Architecture Components
---

### Lifecycle

[Lifecycle][] 是 [Android Architecture Components][] 的一个组件，用于将系统组件（Activity、Fragment等等）的生命周期分离到 `Lifecycle` 类，`Lifecycle` 允许其他类作为观察者，观察组件生命周期的变化。Lifecycle 用起来很简单，首先声明一个 `LifecycleObserver` 对象，用 `@OnLifecycleEvent` 注解声明生命周期事件回调的方法：

    public class LifecycleObserverDemo implements LifecycleObserver {
    
        @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
        void onAny(LifecycleOwner owner, Lifecycle.Event event) {
            System.out.println("onAny:" + event.name());
        }
        @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
        void onCreate() {
            System.out.println("onCreate");
        }
    
        @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
        void onDestroy() {
            System.out.println("onDestroy");
        }
    }

然后在 `LifecycleRegistryOwner` 比如 `LifecycleActivity` 加入这么一行代码：

        getLifecycle().addObserver(new LifecycleObserverDemo());
        
然后？然后就没了，运行起来可以看到 `LifecycleActivity` 的生命周期发生变化时，`LifecycleObserverDemo` 总能得到通知。而 `LifecycleActivity` 只有寥寥几行代码，并没有覆盖任何回调方法。那么 Lifecycle 是怎么做到的，是不是有点黑魔法的感觉？

### 注解的作用

首先从注解入手，可以在 build 目录下发现注解处理器为我们生成了 `LifecycleObserverDemo_LifecycleAdapter`，不过这只是一个适配器，用于将生命周期事件派发到 `LifecycleObserverDemo` 对应的方法。

``` java
public class LifecycleObserverDemo_LifecycleAdapter implements GenericLifecycleObserver {
  final LifecycleObserverDemo mReceiver;

  LifecycleObserverDemo_LifecycleAdapter(LifecycleObserverDemo receiver) {
    this.mReceiver = receiver;
  }

  @Override
  public void onStateChanged(LifecycleOwner owner, Lifecycle.Event event) {
    mReceiver.onAny(owner,event);
    if (event == Lifecycle.Event.ON_CREATE) {
      mReceiver.onCreate();
    }
    if (event == Lifecycle.Event.ON_START) {
      mReceiver.onStart();
    }
    if (event == Lifecycle.Event.ON_PAUSE) {
      mReceiver.onPause();
    }
    if (event == Lifecycle.Event.ON_DESTROY) {
      mReceiver.onDestroy();
    }
  }

  public Object getReceiver() {
    return mReceiver;
  }
}
```

### 如何传达 lifecycle 事件

注解也没有生成任何相关的代码，而 Activity 不用写任何代码，那么 Lifecycle 是如何把 Activity 生命周期事件传递给 `LifecycleObserver`的？

最终通过研读 Lifecycle 的代码，发现里面有个包可见的类 `LifecycleDispatcher`，`LifecycleDispatcher` 是一个单例，在 `LifecycleDispatcher#init(Context)` 中，它通过 `registerActivityLifecycleCallbacks` 方法，向当前的 Application 注册一个 `DispatcherActivityCallback`，但 Lifecycle 并没使用 `ActivityLifecycleCallbacks` 来监听并派发生命周期事件。

    static void init(Context context){
        ...
        ((Application)context.getApplicationContext()).registerActivityLifecycleCallbacks(new LifecycleDispatcher.DispatcherActivityCallback());
        ...
    }
    
    static class DispatcherActivityCallback extends EmptyActivityLifecycleCallbacks {
        public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
            ...
            if(manager.findFragmentByTag("android.arch.lifecycle.LifecycleDispatcher.report_fragment_tag") == null) {
                manager.beginTransaction().add(new ReportFragment(), "android.arch.lifecycle.LifecycleDispatcher.report_fragment_tag").commit();
                manager.executePendingTransactions();
            }
        }
    }
    
而是通过一个无 UI 的 Fragment，在 `DispatcherActivityCallback#onActivityCreated` 可以看到它在 `Activity#onCreate` 时，为 Activity 添加一个 `ReportFragment`。最终由 `ReportFragment` 来监听各个生命周期事件，然后传递给 `LifecycleRegistry`。

    public class ReportFragment extends Fragment {
        ...
        public void onPause() {
            super.onPause();
            dispatch(Event.ON_PAUSE);
        }
        ...
        private void dispatch(Event event) {
            if(this.getActivity() instanceof LifecycleRegistryOwner) {
                ((LifecycleRegistryOwner)this.getActivity()).getLifecycle().handleLifecycleEvent(event);
            }
        }
    }

*Activity 的生命周期事件都会派发到它的 Fragments，向 Activity 注册一个无 UI 的 Fragment 也叫 Headless Fragment 用于将各种 Activity 回调分离出来是个常用的做法*，比如 [RxPermissions](https://github.com/tbruyelle/RxPermissions) 也是用这种方法来避免复写 `Activity#onRequestPermissionsResult`。


顺便一提 [Lifecycle 文档](https://developer.android.com/reference/android/arch/lifecycle/Lifecycle.html)提到：

> ON\_CREATE, ON\_START, ON\_RESUME events in this class are dispatched *after* the LifecycleOwner's related method returns. ON\_PAUSE, ON\_STOP, ON\_DESTROY events in this class are dispatched *before* the LifecycleOwner's related method is called.

正好是 Fragment 生命周期回调的触发顺序。

`Activity` 的生命周期变化是如何传递到 `LifecycleObserver` 有了清晰的图表：

![生命周期传递到 LifecycleObserver](http://upload-images.jianshu.io/upload_images/64766-e57813cb987f6d6c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### LifecycleRuntimeTrojanProvider

还有一个问题， `LifecycleDispatcher#init(Context)` 并不是入口，它也需要被调用。那么他的调用者是谁？Google 这里的做法还是很巧妙的，如果这时把 apk 的 AndroidManifest.xml 提取出来，就会发现多了一个 ContentProvider 声明：

    <provider
            android:name="android.arch.lifecycle.LifecycleRuntimeTrojanProvider"
            android:authorities="${applicationId}.lifecycle-trojan"
            android:exported="false"
            android:multiprocess="true" />

`LifecycleRuntimeTrojanProvider`，运行时木马是什么鬼？实际上，它不是一个 ContentProvider，而是利用 ContentProvider 的特点在应用程序初始化时，向其注入两行代码：

    LifecycleDispatcher.init(getContext());
    ProcessLifecycleOwner.init(getContext());


这里 ContentProvider 之于 Application 的作用就类似于 Headless Fragment 之于 Activity 一样，目的都是避免继承系统组件。关于 ContentProvider 的生命周期可以看 [android - ContentProvider destruction/lifecycle - Stack Overflow](https://stackoverflow.com/questions/24047248/contentprovider-destruction-lifecycle)，

### 其他 LifecycleOnwer

最后再提一下，Lifecycle 还提供了内置了另外三个 LifecycleOnwer：

1. [LifecycleFragment](https://developer.android.com/reference/android/arch/lifecycle/LifecycleFragment.html)
2. [LifecycleService](https://developer.android.com/reference/android/arch/lifecycle/LifecycleService.html)，ServiceLifecycleDispatcher 将事件派发重新推到主线程消息队列，用于保证确保回调在 Service 生命周期回调后再调用。
3. [ProcessLifecycleOwner](https://developer.android.com/reference/android/arch/lifecycle/ProcessLifecycleOwner.html)，用于监听整个应用的前后台切换。也是利用 ActivityLifecycleCallback 监听每个 Activity 的生命周期，如果 onStop 事件后，没有监听到任意的 onStart 事件，那么 ProcessLifecycleOwner 就会认为整个应用切换到后台，同时留下一个标志。如果监听到 onStart 事件，同时检查有标志那么就会认为应用回到前台。

### Lifecycle 的应用？

有朋友在问 Lifecycle 有什么应用。我觉得 Lifecycle 最主要的作用就是在于解耦。以前我们使用一个生命周期敏感的模块 m，必须得在 Activity 子类里面添加类似下面的代码

    super.onCreate()
    m.init()
    
    m.release()
    super.onDestory()
    
这类组件之多，用起来之频繁。以致于我们经常要创建一个 `BaseActivity` 类来做这些脏活。不过，一旦我们建立了`BaseActivity`，我们常常就能体会到 Java 单继承之痛。Activity不止一个啊：

- `LifecycleActivity`、
- `AppcompatActivity`、
- `FragmentActivity`
- 等等…

还有第三方库的，比如 `CordovaActivity`… 。随着项目的扩大，你很难只用一类 Activity。而且有生命周期的组件不止一个，这些组件的子类也花样繁多，我们建立了 `BaseFragment`、`BaseService`…同时也建立了更多痛苦。**为什么我们的模块要和这些复杂性绑定在一起？**生命周期敏感模块应该与独立起来，变成一个可以在任意有生命周期的组件安装的模块，所以 Lifecycle 就在帮我们做这种事情。

    getLifecycle().addObserver(new LifecycleObserverDemo());

那么具体一点这类生命周期敏感的组件有哪些呢？[官方以 LocationManager 为例][Lifecycle]，主要作用避免 Activity 遁入后台后继续定位浪费电量。这里我以 volley 为例，举一个网络请求经常要面对的问题：

    volleyClient.query(new Respose.Listener(){});
    
上面的代码是个老生常谈的问题了，`new Respose.Listener(){}` 是 Activity 的一个匿名类，它有指向 Activity 的引用，而 Volley 是一个存活范围比 Activity 更大的实例，比如常常 VolleyClient 就是单例。这就导致了 Activity 销毁后不能及时释放，内存泄漏！当然，网络请求终会返回的，这个回调对象就会被销毁，从这个角度讲，问题也不是很大。另外一个就是请求返回的时候，我们会在 onSuccess 里操作 UI，如果 Activity 已经销毁了，没做检查的话那么就会崩溃。这些都不是大问题，但是很烦人。所以像 volley 请求这样的就是一个生命周期敏感的功能。

网络请求和定位回调一样都可以归类为生命周期敏感的数据源，Google 为这种类型的数据源提供了 [LiveData][]。这就是 LifecycleObserver 一个典型的应用，当然这只是 [LiveData][] 的一部分功能。


非数据源的生命周期敏感组件，比如说用户行为收集模块，它本身就是一个生命周期的监听者，在没有 `ActivityLifecycleCallback` 的年代（API<14），常常需要在各个 Activity 中手动加入开始记录和停止纪录的代码。有了 `ActivityLifecycleCallback` 之后，我们需要做的就变成在 `Application#onCreate` 加一句代码。那么现在把用户行为收集模块变成 `LifecycleObserver` 有什么好处？

很遗憾，对于这个例子我暂时还想不出有什么特别好的地方，但是它能说明 LifecycleObserver 一个最主要的特点。比如我们有十个 Activity，只有 Activity1 和 Activity2 需要记录，那么用 LifecycleObserver 就可以避免用配置去声明哪些 Activity 需要记录。直接在需要记录的 Activity加入如下代码

    getLifecycle().addObserver(new OpRecorder());
    
这就是解耦的好处。能让一个与生命周期深度耦合的组件变成一个随处可安装的组件。


最后，还是要回到这篇文章的主题，我们从 Lifecycle 的代码可以学到一个更大的模式。

Activity 不只有生命周期回调，还有权限，onActivityResult 等等。那些需要与这些回调深度耦合的模块，利用 Lifecycle 用的技术 Headless Fragments 来解耦是个不错的方法。对于整个 Application 来说那就可以用更 tricky 的 Headless ContentProvider。


[Lifecycle]: https://developer.android.com/topic/libraries/architecture/lifecycle.html
[Android Architecture Components]: https://developer.android.com/topic/libraries/architecture/index.html
[LiveData]: https://developer.android.com/topic/libraries/architecture/livedata.html
