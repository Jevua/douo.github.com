---
title: Android Architecture Components
date: '2017-06-17'
description:
type: pending
---


### Architectural principles

1. you should not store any app data or state in your app components and your app components should not depend on each other.
2. drive your UI from a model, preferably a persistent model. 


 handling the lifecycle properly such that your data streams pause when the related LifecycleOwner is stopped and the streams are destroyed when the LifecycleOwner is destroyed. You can also add the android.arch.lifecycle:reactivestreams artifact to use LiveData with another reactive streams library 
 
 
 
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

![生命周期传递到 LifecycleObserver](lifecycle_call.png)

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

还有第三方库的，比如 `CordovaActivity`… 。随着项目的扩大，你很难只用一类 Activity。而且有生命周期的组件不止一个，这些组件的子类也花样繁多，我们建立了 `BaseFragment`、`BaseService`…同时也建立了更多痛苦。为什么我们的模块要和这些复杂性绑定在一起？生命周期敏感模块应该与独立起来，变成一个可以在任意有生命周期的组件安装的模块，所以 Lifecycle 就在帮我们做这种事情。

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

Activity 不只有生命周期回调，还有权限，onActivityResult 等等。那些需要与这些回调深度耦合的模块，利用 Lifecycle 用的技术 Headless Fragments 来解耦是个不错的方法。对于整个 Application 来说那就可以用 Headless ContentProvider。


[Lifecycle]: https://developer.android.com/topic/libraries/architecture/lifecycle.html
[Android Architecture Components]: https://developer.android.com/topic/libraries/architecture/index.html
[LiveData]: https://developer.android.com/topic/libraries/architecture/livedata.html

### LiveData

不太适合用于网络请求这种只有单一事件的序列？

Lifecycle 事件小于 STARTED 对 LiveData 来说是 inactive。


#### LiveData 与 Databinding

现在这两个框架融合的不是很好，在 MVVM 中还是 Databinding 比较好用。


#### LiveData 与 Retrofit

网络接口是一次性的，而 LiveData 是一个值随时间变化的序列，似乎不太搭，

Retrofit 用 LiveData 用了他的 Lifecycle aware 的作用，防止泄露。

用 CallAdapter.Factory 来转换 LiveData


### ViewModel

两个问题让 UI Controller(Activities、Fragments...) 变得巨大且难以维护

- 在 destroy 的时候清理异步回调。
- react to user actions or handle the operating system communication.
 
ViewModel，

- retain its state across Activity configuration changes
- outlives the specific Activity or Fragment instances.
- stay in memory until the Lifecycle it’s scoped to goes away permanently，Activity, once it finishes; in the case of a Fragment, once it’s detached.
- it shouldn’t reference any Views directly inside of it or hold reference to a context. This can cause memory leaks.
- If the ViewModel needs an Application context (e.g. to find a system service), it can extend the AndroidViewModel 


#### ViewModelProviders

是一个工具类，提供获取 ViewModelProvider 的工厂方法。

    mViewModel = ViewModelProviders.of(this).get(MainViewModel.class);

#### ViewModelProvider

ViewModelProvider 用于获取并缓存 ViewModel 对象，一个 Activity 或 Fragment 只有一个 ViewModelProvider 实例。ViewModelProvider 中实际存放 ViewModel 对象的便是 ViewModelStore。

#### ViewModelStore

ViewModelStore 封装了一个 Map 用于存放 ViewModel 对象，同时依靠一个 retain instance fragment（HolderFragment），在宿主生命周期变化时存活。

#### HolderFragment

通过 HolderFragmentManager 来管理 retain instance fragment。

`mNotCommittedActivityHolders`，默认情况是通过 findByFragment 获取 Fragment引用的，但是 commit 不一定立刻执行，如果在 commit 之前重新找一次 fragment 就会找不到，所以需要一个 Map 把 Activity 实例和 Fragment 关联起来，以防止在这种情况找不到。为什么不用 `fm.executePendingTransactions()` 呢？

为什么 Fragment 不用立刻添加，因为他只是用来存放 ViewModel

#### Dagger Android


ViewModel 的实现生命是由框架自己管理，所以不能交给 Dagger 注入。

那么只能注入 ViewModel 本身。

Dagger Android 对系统组件的注入做了优化，但如果采用 MVVM 架构，系统组件会尽可能的薄，系统组件大部分要做的事情，就是把 ViewModel 的实例传递给 Binding 而已，所以大部分的注入入口都是 ViewModel

要如何注入 ViewModel，主要有两种做法：

第一，默认情况下，ViewModel 对象的生命周期是由 Architecture Component 直接管理的。所以不能依靠 Dagger 去自动注入。下面这行代码是跑不了的：

    viewModel = ViewModelProviders.of(this).get(MainViewModel.class);
    
所以要实现对 ViewModel 最佳实践还是得用 AndroidInjector。实现 AndroidInjector 注入并不困难。照着实现下面四个类变行：

- AndroidViewModelInjection
- AndroidViewModelInjectionModule
- HasViewModelInjector
- ViewModelKey

首先有个很大的限制，就是 ViewModel 只能用 AndroidViewModel。按照 AndroidInjection 的实现，ViewModel 必须有办法找到他的 Injector。 ViewModel 不能保存其宿主（Activity，Fragment）的引用，**所以 ViewModel 的 Injector 只能是 Application**。因为 ViewModel 是跨越 Activity/Fragment 生命周期的存在，所以一定程度上也是有道理的。拥有 Application 引用的 ViewModel。框架已经帮我们实现好了，就是 AndroidViewModel。

ViewModel 的 scope 应该大于或独立于 Activity 或 Fragment

另外一个问题就是，这种做法还是比较繁琐的，所以还得加上 @ContributesAndroidInjector 注解的支持，让其自动生成 Subcomponent 和 binding 方法。

这样就比较简单了，在 AppComponent 的 Module 下加入：

    @ContributesAndroidInjector
    abstract MyViewModel contributeMyViewModelInjector();
  
在 MyViewModel 下加入：
  
    class MyViewModel extends AndroidViewModel{
      MyViewModel(){
         AndroidInjection.inject(this);
      }
    }
  
另外一种做法，就是自定义 `ViewModelProvider.Factory`，这个 Factory 主要管理 ViewModel 的实例的创建，通过自定义 Factory 就可以将 ViewModel 作为提供者加入对象图中，也就是让 dagger2 帮我们创建 ViewModel 实例。

自定义 Factory 中有一个 Map 依赖

    Map<Class<? extends ViewModel>, Provider<ViewModel>> creators;
    
通过 multibind 把，ViewModel 添加到这个 Map 中：

    @Binds
    @IntoMap
    @ViewModelKey(UserViewModel.class)
    abstract ViewModel bindUserViewModel(UserViewModel userViewModel);

这样 ViewModel 就能像普通对象一样，通过 inject 构造方法来注入，并作为提供者加入对象图中。


    @Inject
    // 可以自定义构造函数的参数
    public UserViewModel(UserRepository userRepository, RepoRepository repoRepository) {}
    
自定义 Factory 也加入到对象图中，并提供一个 binding

    @Binds
    abstract ViewModelProvider.Factory bindViewModelFactory(GithubViewModelFactory factory);

这样我们就可以在系统组件里，使用 ViewModel 了：

    public class UserFragment extends LifecycleFragment implements Injectable {
      @Inject
      ViewModelProvider.Factory viewModelFactory;
      
      @Override
      public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        userViewModel = ViewModelProviders.of(this, viewModelFactory).get(UserViewModel.class);
      }

这样，乍看是比第一种方法更简洁，但是用这种方法就不可避免地对系统组件进行依赖注入。在 MVVM 系统组件都很薄，实际使用中对系统组件的依赖注入大部分只是为了注入 
`viewModelFactory`，未免显得没有必要，不如直接注入 ViewModel。

google sample 就是用第二种方法：[android-architecture-components/ViewModelModule.java at master · googlesamples/android-architecture-components](https://github.com/googlesamples/android-architecture-components/blob/master/GithubBrowserSample/app/src/main/java/com/android/example/github/di/ViewModelModule.java)


#### 另一种注解

利用 `ViewModelProvider.NewInstanceFactory` 保持 Application 引用在外部进行注解。

### IO 


Kotlin
------





Android Architecture Components 
-----

 - LifeCycle
 - Live Data
 - ViewModel
 - Room

 
Android O
----------
 

Supported Libraries
----------

- font xml/ downloadable font
- up to api 14+ remove methods
- 

~~sfa~~


### Romm

1. 如何对已有的数据库进行映射
2. 如何对数据库名是变量名的数据进行映射






关系

外键

A{
 id:id
 a1:a
 a2:a
 b_id:id
}

B{
  id:id
  b1:b
  b2:b
}


还是 View Object
A{
id:id
 a1:a
 a2:a
 b_id:id
 b1:b
 b2:b
}



### ConstraintLayout

