---
title: Coroutine
date: '2020-04-10'
description:
---

# what



## 什么是有限状态机
把业务模型抽象成一个有限状态机
状态机四要素：现态、次态、条件、动作
三特征：
1. 状态有限
2. 同一时刻只处于一种状态中
3. 某种条件下，会从一种状态转移到另一种状态

很多业务其实也能套用状态模式，什么情况该用状态模式？

*
 * State: each State has incoming Transitions and outgoing Transitions.
 * When {@link State#mBranchStart} is true, all the outgoing Transitions may be triggered, when
 * {@link State#mBranchStart} is false, only first outgoing Transition will be triggered.
 * When {@link State#mBranchEnd} is true, all the incoming Transitions must be triggered for the
 * State to run. When {@link State#mBranchEnd} is false, only need one incoming Transition triggered
 * for the State to run.
 * Transition: three types:
 * 1. Event based transition, transition will be triggered when {@link #fireEvent(Event)} is called.
 * 2. Auto transition, transition will be triggered when {@link Transition#mFromState} is executed.
 * 3. Condiitonal Auto transition, transition will be triggered when {@link Transition#mFromState}
 * is executed and {@link Transition#mCondition} passes.
 * @hide
 */

一个从 A 到 B 的转移，那么他就是 A 的传出转移 B 的传入转移。每个状态各自维护两个传出、传入转移列表

triggered 触发，
BranchStart，triggered




# how

- 如何将回调转为挂起函数
-

# why
