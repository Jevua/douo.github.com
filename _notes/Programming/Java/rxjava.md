---
title: RxJava
date: '2016-05-12'
description:
type: draft ## 移除这个字段，笔记才会公开发布
tags:
- rxjava
- rxjava2
---



- 被观察者（Observable）
- 观察者（Observer）
- 订阅（subscribe）
- 事件



| Term                        | Definition                                                                                                                 |
| -------------------------   | ------------------------------------------------------------------------------------------------------                     |
| 信号（Signal）              | 名词:表示  `onSubscribe`, `onNext`, `onComplete`, `onError`, `request(n)` or `cancel` 这些方法之一. 动词: 执行调用这个信号 |
| 请求（Demand）              | 名词: 发布者（Publisher）尚未交付（履行）的订阅者（Subscriber）请求的元素的总数. 动词： 请求更多元素这个行为               |
| 同步（Synchronous/ly）      | 在调用者线程执行                                                                                                           |
| 正常返回（Return normally） | 只返回调用者声明的类型， 向`Subscriber`发出失败信号的唯一合法路径是通过 `onError` 方法。                                   |
| 响应（Responsivity）        | 准备好响应. 表示不同的组件不应该损坏彼此的响应能力.（impair each others ability to respond？）                             |
| 非阻塞（Non-obstructing）   | 表示调用者线程的方法没有耗时操作或计算.                                                                                    |
| 终结状态（Terminal state）  | 发布者: `onComplete` 或 `onError` 被调用. 订阅者: 接收到 `onComplete` 或 `onError` 信号.                                   |
| NOP                         | 执行对调用线程没有可检测的影响，并且可以安全地调用任意次数                                                                 |



### 基础概念

[reactive-streams/reactive-streams-jvm: Reactive Streams Specification for the JVM](https://github.com/reactive-streams/reactive-streams-jvm)

public interface Publisher<T> {
    public void subscribe(Subscriber<? super T> s);
}

public interface Subscriber<T> {
    public void onSubscribe(Subscription s);
    public void onNext(T t);
    public void onError(Throwable t);
    public void onComplete();
}

public interface Subscription {
    public void request(long n);
    public void cancel();
}

rpublic interface Processor<T, R> extends Subscriber<T>, Publisher<R> {
}

#### Observable

- Hot Observable，不管有没有订阅者，都会不停的产生信号。

- Cold Observable，只有被订阅的时候，才会开始产生信号。


#### 数据源

rxjava2 的数据源扩充到 4 种：

io.reactivex.Flowable : 0..N flows, supporting Reactive-Streams and backpressure
io.reactivex.Observable: 0..N flows, no backpressure
io.reactivex.Single: a flow of exactly 1 item or an error
io.reactivex.Completable: a flow without items but only a completion or error signal
io.reactivex.Maybe: a flow with no items, exactly one item or an error


#### 调度器（Scheduler）

subscribeOn 指明生产者在哪个线程运算
observeOn 指明订阅者在哪个线程处理信号

RxJava operators don't work with Threads or ExecutorServices directly but with so called Schedulers that abstract away sources of concurrency behind an uniform API.



#### 操作符（Operator）

[ReactiveX - Operators](http://reactivex.io/documentation/operators.html)

##### 创建（Create）

##### 转换（Transforming）

##### 过滤（Transforming）

##### 组合（Combining）

#### RxJava2

默认信号处理类变成接口了，与 java 8 统一。


#### RxAndroid


