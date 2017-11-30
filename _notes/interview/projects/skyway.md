q---
title: Skyway
date: '2017-10-25'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

移动办公 App ，包括 IM，集团管理，文件共享。


### 主要的库

- Android Architecture Component
- Databinding
- dagger2


网络方面

- glide
- okhttp
- retrofit


### 推送

对小米和华为进行优化

# AAC 和 Databinding

## LiveField

    public class LiveField<T> extends ObservableField<T> {
      private MutableLiveData<T> source;
    
      public LiveField(LifecycleOwner owner, T t) {
        source = new MutableLiveData<>();
        source.observe(owner, super::set);
      }
    
      public void release(LifecycleOwner owner) {
        source.removeObservers(owner);
      }
    
      @Override public void set(T value) {
        source.postValue(value);
      }
    }

整合 LiveData 和 Databinding，当 LiveData 数据发送变化时，通过 Observable 通知 View 进行更新。主要用于 LceViewModel。

LiveData keeps a strong reference to the observer and the owner as long as the
     * given LifecycleOwner is not destroyed.

## LceViewModel

继承自 AndroidViewModel，有三个状态（代表 Resource 的各个状态），都是 LiveField，当状态发送改变时，都能通过 Databinding 通知 View 进行更新。

1. content，ViewModel 的主数据，可以是列表或者 pojo 等等
2. loading，表示是否加载中，一般和 RefreshLayout 的 refreshing 状态双向绑定
3. error，表示加载失败，用于弹出 Snackbar 等等

LceViewModel 还实现了 `LifecycleObserver` 分别注册 onCreate 和 onDestroy 的回调，onCreate 回调将 Live<Resourece> 和这三个状态关联起来。

onDestroy 回调需要释放 LiveField，因为 LiveData 需要一个 LifecycleOwner 来观察，这个 Owner 实际就是当前 Activity。LiveData 释放持有 Activity 还不确定，所以需要需要一个 release 方法，用来移除观察者。//TODO

# ViewModel 和 Dagger

ViewModel 配合 Dagger 有两种方法：见 [Android Architecture Components](notes/programming/android/android-architecture-components#toc_11)

# Dagger 的特点

项目结构更清晰，更容易测试。比如我们可以把网络方面需要的配置都写入到一个 NetworkModule 里面。

# 缓存

什么时候让数据失效是个大问题。最简单的情况下，可以让其在 Wifi 环境自动刷新在数据流量环境手动刷新。

想一些比较稳定的数据，比如集团通讯录，每当服务端的数据发送变化时，下发推送透传给影响的用户。这个还是比较粗糙。因为用户资料发生变化并不会触发推送。只有成员结构发送变化才会推送。节点级别的推送。

还有就是，单据状态变更的推送，也会让本地缓存的数据失效。

# LiveData 结合 Retrofit

单单网络求来说，用 LiveData 是不太合适的，因为它是一个单一事件。主要的好处还是 Lifecycle-aware。

不过 Service 层都是经过 Repository 层隔离了。Service 层返回 LiveData 方便在 Repository 层对各个 LiveData 进行整合，将 APIResponse 转化为 Resource。比如 NetworkBoundResource 或 NetworkBoundAction

# 登录 

界面状态颗粒度

usernameInvalidMsg,passwordInvalidMsg,loggingIn,error

登录逻辑，要处理两种情况，后台未登录，后台已登录 IM 未登录

1. 后台未登录
  - 登录后台
  - 注册推送 token
  - 登录 IM
  - 获取登录用户 IM 信息
  - 初始化备注（可选）

2. 后台已登录，每次切换回前台都要检查
  - IM 初始化
  - 登录 IM
  - 获取登录用户 IM 信息
  - 初始化备注（可选）
  
# 其他

搜索和分页不做缓存。

