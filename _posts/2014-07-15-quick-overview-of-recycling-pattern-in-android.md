---
title: 浅谈 Recycle 机制
date: '2014-07-15'
description:
categories:
- coder
tags:
- Android
- Object Recycling
- 对象池
---

这里的 Recycle 机制并不是指 Java 虚拟机中的垃圾回收机制，而是 Android 框架里十分常用的一种设计模式。基本思想很简单，当一个对象不再使用时把它储藏起来，不让虚拟机回收，需要的时候再从仓库里拿出来重新使用，这就避免了对象被回收后再重分配的过程。对于在应用的生命周期内（或者在循环中）需要频繁创建的对象来说这个机制特别实用，可以显著减少对象创建的次数，从而减少 GC 的运行时间。运用得当便可改善应用的性能。唯一的不足只是需要手动为废弃对象调用 `recycle` 方法。

如何实现？首先，我们需要一个仓库用于存放暂时不用的对象；需要新对象的时候我们不能使用 `new` 来分配一个新对象，所以还需要一个方法 `obtain` 来从仓库里获取对象；最后，便是 `recycle` 方法了，用于回收不再使用的对象。一个简单的实现如下所示，技术细节在注释里解释：

    /**
     * Created by Tiou on 2014/7/15.
     * 一个实现 Recycle 机制的对象
     */
    public class Data {
        /**
         * 对象池，就是上文所提到的对象仓库，用于暂时存放不用的对象。
         * 用链表来实现对象池结构，直观，高效，易用。
         * sPool 便是指向链表头部的引用
         */
        private static Data sPool;
        /**
         * 指向链表中的下一个元素，当 next 为 null 时表示已到达链表末端
         */
        private Data next;
    
        /**
         * 隐藏构造函数，避免对象被 new 关键字创建
         */
        private Data(){}
    
        /**
         * 从池里获取一个新对象，没有的话则返回一个新的实例
         * @return 可用的新对象
         */
        public static Data obtain(){
            if(sPool!=null){ // 池中有可用的对象
                // 对于对象池来说顺序并没有关系
                // 这里取链表的第一个对象，主要是因为方便
                Data data = sPool;
                sPool = sPool.next;
                data.next = null;
                return data;
            }
            return new Data();
        }
    
        /**
         * 将当前对象回收，一旦对象被回收，便不能再使用，代码中也不应存有任何到该对象的引用
         */
        public void recycle(){
            clear(); //清理对象
            // 把当前对象作为首元素按入链表中
            next = sPool;
            sPool = this;
        }
    
        /**
         * 重置对象到刚初始化时的状态
         */
        private void clear(){
    
        }
    }


为什么说这是一个简单实现呢？因为这是一个不完善的实现。考虑一个场景，如果一次性 `obtain` 十万个对象，用完后再全部 `recycle`，以后每次可能规模就降到几十个，那这十万个对象的绝大多数就会停留在池里，既不会被用到，也不能被虚拟机回收，占用应用大量的内存。这是个十分糟糕的例子，但意思大致还是说得明白，池的容量不能无限大，不然便有内存泄漏的隐患。至于这个对象数量的上限该如何设置，这里并没有一个规定死的值，可灵活设置，简单说这是一个空间换时间的策略，可根据对象占用的空间，及应用具体需要用到的规模来设置一个合理值。

另外，`obtain` 和 `recycle` 这两个方法都不是原子操作，在多线程的应用场景下，可能会发生各种奇怪的问题。所以我们还要为这两个方法加锁，保证其是多线程安全的。

最终的效果在这个 [gist](https://gist.github.com/douo/ad91b597a61f6825ca35).

至于具体的例子，这个机制在 Android 框架中实在是太常见了，都不用自己再造出什么例子。只要用过 [Message][], [TypedArray][], [Parcel][]，甚至各种 Event 类，等等…都或多或少接触过 recycle 这个方法。这个机制如此常用，以至于 Android 还在 support lib v4 里提供一个 [Pool][] 工具包。

大家可能会奇怪了：「我常常用 `Message`，也没调用过`recycle`，也不见得会怎样。」实际上不调用 `recycle` 确实不会在怎样，因为 [Looper][] 已经帮我们[处理好手尾了][L#153]，只要记得发送过的 `Message` 不能再用便可以。那自己手动回收会怎样？因为 Looper 在调用 `msg.recycle()` 前并没有作检查，`Message` 的对象池来者不拒，不会对进入池中的对象是否已存在进行检查，一旦同一个 `Message` 被回收两次，便会发生糟糕的结果，对象池将会被破坏，变成一条循环链表，该 `Message` 所在节点后面的元素将会被孤立，虽不会造成内存泄漏，但将影响虚拟机回收的回收效率。更糟糕的是，Message 的 Recycle 机制将会失效。

大家可以试试下面的代码：

    Message msg = Message.obtain();
    System.out.println("First obtain:"+System.identityHashCode(msg));
    msg.recycle();
    msg.recycle();
    System.out.println("After recycle twice");
    System.out.println("Second obtain:"+System.identityHashCode(Message.obtain()));
    System.out.println("Third obtain:"+System.identityHashCode(Message.obtain()));
    System.out.println("Fourth obtain:"+System.identityHashCode(Message.obtain()));

输出结果：

	First obtain:1122593040
	After recycle twice
	Second obtain:1122593040
	Third obtain:1122593040
	Fourth obtain:1122846456

可以看到，连续两次 `obtain` 返回相同的对象，一旦出现这样的 Bug，要找问题在哪出来绝对是很困难的，所以，**绝对不要手动调用** `Message#recycle`. 不得不怀疑 Android 把这个方法声明为 `public` 是否合理的。

顺便再提一下，Event 类的回收机制也是由系统控制的，所以不要在监听器触发的方法外保留对监听事件的引用。

本文依据 [Android Programming - Pushing the Limits][Android Programming] 而作，该书同样犯了手动调用 `Message#recycle` 的错误，但仍不失为一本值得一读的技术书，诸君明辨。

[Message]:https://developer.android.com/reference/android/os/Message.html
[TypedArray]:https://developer.android.com/reference/android/content/res/TypedArray.html
[Parcel]:https://developer.android.com/reference/android/os/Parcel.html
[Pool]:https://developer.android.com/reference/android/support/v4/util/Pools.Pool.html
[Looper]:https://developer.android.com/reference/android/os/Looper.html
[L#153]: http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.4.2_r1/android/os/Looper.java#153
[Android Programming]:http://book.douban.com/subject/24550976/
