---
title: Transition
date: '2017-03-14'
description:
type: draft ## 移除这个字段，笔记才会公开发布
tag:
- transition
---



### Transition


On the next display frame, the framework

过场动画（transition），在 Kitkat 引入新 API。是 Android 用来定义场景切换之间的过渡效果。场景切换包括 Activity 之间的，Fragment 切换，甚至 PopupWindow 还有 Scene 之间，

### 内容过渡（content transition）

#### Activity 

Activity 实际也就是 Windows 两个最顶层 UI 之间的切换效果。

Activity A 到 Acitivity B 之间的有四种效果：

1. Enter，A -> B, B enter.
2. Exit，A -> B, A exit.
3. Return, A <- B, B return. 
      只有 B 调用`finishAfterTransition`，B 才会出现这个过渡效果，直接 `finish` 就是无过渡效果。onBackPress 调用 `finishAfterTransition`
      如果未设置 ReturnTransition，那么 TransitionManager 将会复用 EnterTransition
      
4. Reenter, A <- B, a reenter.
      如果未设置 ReenterTransition，那么 TransitionManager 将会复用 ExitTransition

例子 A Activity:

    Slide slideTransition = null;
    slideTransition = new Slide();
    slideTransition.setSlideEdge(Gravity.LEFT);
    slideTransition.setDuration(500);
    slideTransition.excludeTarget(v, true);
    getWindow().setReenterTransition(slideTransition);
    getWindow().setExitTransition(slideTransition);

B Activity 

    supportFinishAfterTransition();
    

#### Fragment

Fragment 的 transition 接口是在 Api 22 添加的。Fragment 也有 4 种效果：

1. Enter，初始化场景，由无到有的过渡效果，
2. Exit，场景切出，比如 removed hidden detached（ 不是 popping the back stack 导致的，比如代码直接调用相应的方法）
3. Return，场景切出，用于 removed hidden detached（popping the back stack）
4. Reenter，因 popping back stack 导致的场景切入

例子：

    getSupportFragmentManager()
                            .beginTransaction()
                            .add(R.id.fragment_container, A)
                            .addToBackStack(null)
                            .commit();


上面的代码一次执行，A 会使用 Enter 效果。第二次执行，A1 会使用 Enter 效果，A 会 Exit 效果。接下来按返回键，A1 Return，A Reenter。


#### PopupWindow

Android M 之后，PopupWindow 也对 Transition 做了支持。PopupWindow 有两种效果。

1. Enter, show 的过渡效果
2. Exit，dismiss 的过渡效果

ExitTransition，在 API 24 有 bug ，通过 `showAtLocation` 显示的 PopupWindow，dismiss 的时候是不会有 ExitTransition 的。具体见：[Issue 227766 - android - No Exit Transition occurs on PopupWindows when using PopupWindow.showAtLocation on L - Android Open Source Project - Issue Tracker - Google Project Hosting](https://code.google.com/p/android/issues/detail?id=227766)


#### 总结

重新考虑 Activity 之间的过渡，A -> B，实际是四个场景两个过渡，场景 1 ：『A 可见』，通过 exit transition  进入场景 2：『A 消失』。另外一个过渡是场景 3：『B 不可见』通过 Enter Transition 到 场景 4 『B 可见』。

这一种可见与不可见之间的过渡，称之为**内容过渡**（Content Transition）。content Transition 从无到有，从有到无。 Activity、Fragment 之间还有 PopupWindow 显示消失的 Transition 便是 **内容过渡**。

这类过渡决定了内容里视图如何离开或进入场景。这一类可见与否的转换专门有个 Transition 子集 Visibility 来实现。

```
    Visibility
       |
       |-- Fade
       |-- Slide
       |-- Explode
```

 另外 Widows 有个 `FEATURE_CONTENT_TRANSITIONS`，为 Activity 多次 setContentView 之间提供过渡效果[^1]，对 AppCompatActivity 无效。


[^1]:  见 [StackOverFlow](https://stackoverflow.com/questions/28975840/feature-activity-transitions-vs-feature-content-transitions)


### 共享元素过渡（Shared Element Transition）

#### Scene（场景）

Transtion 框架类比舞台的概念，`Transition` 用来表示两幕戏之间的过渡效果，过幕的时候，布景要移动，角色要化妆等等。这些过幕效果由 `TransitionManager` 统筹。比如 Activity 的过渡，Window 就是舞台，两个 Activity 的 ContentView 就是场景。

Scene 框架提供了一个更通用的抽象，SceneRoot 是一个 `ViewGroup` 也就是舞台， `Scene` 是一个场景，它也是一个 `ViewGroup` 可以从 layout 或 ViewGroup 构造。ViewGroup 内的各种子类信息，相当于舞台上的布景角色。Scene 就是用来存放这个 ViewGroup，

`TransitionManage.go(Scene,Transition)` 就是用新的场景 B（Scene）通过过渡效果换掉舞台上已有的场景 B（Scene）。

Scene 定义了应用程序的UI的给定状态，而*过渡*定义了两个场景之间的动画变化。Transition 在起始和结束场景中捕获每个视图的状态，并根据两个场景之间视图的差异来创建动画

### Shared Element



另外一类便是，shared element

 How and where are shared element views drawn during the transition? 
 
 shared element view instances are not actually “shared” across Activities/Fragments.
 
  shared elements are drawn on top of the entire view hierarchy in the window’s ViewOverlay by default

viewgroup

Activity 的 shared element 是在 ViewOverlay 绘制的。所以  shared element 可能会覆盖掉 UI

 Shared elements are animated by the called Activity/Fragment’s enter and return shared element transitions
 
 The final transitions, shared element exit/return, are a little different. These are used in the calling Activity to execute a Transition before the shared element is transferred. 

changeTransform





 共享元素过渡只能在 Activity 之间或 Fragments 之间，不能再 Activity 与 Fragment 之间。
 
 见 FragmentTransition 源码，所有 shared element 相关的代码都会有下面这句判断
 
        if (inFragment == null || outFragment == null) {
            return null; // no transition
        }
        

而且 Fragment 之间还得处于同一个视图容器，

       if (fragmentManager.mContainer.onHasView()) {
            sceneRoot = (ViewGroup) fragmentManager.mContainer.onFindViewById(containerId);
        }
        if (sceneRoot == null) {
            return;
        }

#### 深入源码

Transition 有两种状态，开始态与终止态，在开始态中记录下各个 View 需要过渡的属性值，在终止态中也记录下各个 View 需要过渡的属性值，最后计算这些属性值得变化动画，并播放出来。


`TransitionValue` 和 View 是一一对应的，用来存放 View 需要过渡的属性的值

`TransitionValueMap` 是存放各个 View 和 TransitionValue 的地方，保存 View 和 Transition 一一对应的关系。两个状态都各有一个 `TransitionValueMap`，分别是 `mStartValues` 和 `mEndValues`。

Transition 如何断定两个状态的 View 是同一个 View，并不单单看是否是同一个实例，Transition 有四种判断方法，分别是 transitionName 、同一个实例、id、itemId，默认的顺序如下：

```java
 private static final int[] DEFAULT_MATCH_ORDER = {
        MATCH_NAME,
        MATCH_INSTANCE,
        MATCH_ID,
        MATCH_ITEM_ID, // 对于 ListView
    };
```

Transition 有个 setMatchOrders 方法，可以更改默认顺序。`TransitionValueMap` 还相当于一索引表，保存了这些 match 类型和 View 的对应关系。

判断两个 TransitionValue 是同一个 View后，便各自传入列表 `mStartValuesList` 和 `mEndValuesList` 中。所以这个两个列表中的 `TransitionValue` 是一一对应的（索引相同），至于那些至于 startValue 或者 endValue 的 View，另外一个列表对应的位置便是 `null`。 最后遍历两个列表，传入子类的 `createAnimator(ViewGroup sceneRoot, TransitionValues startValues, TransitionValues endValues)` 方法。

TransitionValue 是可以在多个 Transition 中共享的，所以 key 的取值必须注意唯一性[^2]。

[^2]: 见 [TransitionSet.java#448](http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/5.1.1_r1/android/transition/TransitionSet.java#448)


`TransitionManage.go(Scene,Transition)`，做了三件事，

1. 捕获 sceneRoot 中 view 的状态，作为起始态（sceneChangeSetup）
2. 清空 sceneRoot，将新 Scene 的视图添加进 sceneRoot （scene.enter）
3. 在 preDraw 回调中，再次捕获 sceneRoot 的属性，作为终止态（sceneChangeRunTransition）
   3.1 开始过渡动画。 

`TransitionManager.beginDelayedTransition` 也是同样的道理，只是没有第二步。这是个很常用的方法，Activity、Fragment 之间的过渡效果，最终也是调用它实现的。

ExitTransitionCoordinator


### 其他

#### ListView 或 RecycleView transition 到 ViewPager Activity


用 `ActivityCompat.postponeEnterTransition(this);` 和  `ActivityCompat.startPostponedEnterTransition(ImagePreviewActivity.this)` 来延迟 transition 的执行，等到 shared element 加载到 view tree 后才开始 transition

**默认的 transition 什么时候执行？**


https://stackoverflow.com/questions/27304834/viewpager-fragments-shared-element-transitions

https://stackoverflow.com/questions/27304834/viewpager-fragments-shared-element-transitions


- ListView 或 RecycleView 等延时初始化的 UI 如何设置 EnterTransition --> https://plus.google.com/+ChrisBanes/posts/GnciVAgf9LC
- AdapterView 如何展开
- 有 sharedElement 之间的过渡动画
- transition 在什么时候执行？ 绘制下一个画面之前（preDraw 回调）


### xml

transition manager 也支持用 xml 定义。
