---
title: Lambda In Android
date: '2017-10-08'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

# 导言

lambda 表达式是 java 8 新引入的特性。可以说 lambda 表达式只是个语法糖。所以即便 Android 还不支持 java 8，要使用 lambda 表达式也是可能得。

先来关注一下 java 8 怎么实现 lambda 表达式。

    invokedynamic #2,  0              // InvokeDynamic #0:getAsInt:()Ljava/util/function/IntSupplier;
    
invokedynamic 需要一个操作数，就是 bootstrap 方法，boostrap 方法返回一个 CallSite 对象。在这里这个 bootstrap 方法就是 `java/lang/invoke/LambdaMetafactory.metafactory`

这个方法做的事情，可以简单说，就是创建一个新类实现 FunctionalInterface，而这个 CallSite 呢就是指向接口对象的唯一方法。这时候操作栈栈顶可以说已经拥有这个接口对象的引用了。
