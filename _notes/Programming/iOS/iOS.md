---
title: iOS
date: '2012-08-11'
description:
---

### strong weak ###

automatic reference counting

不同於垃圾收集機制，當對象失去最後一個strong 指針，就會馬上被釋放，沒有延遲。


### Foundation 框架 ###

### NSObject

所有對象的基類

### NSString

Unicode 編碼的任意語言的字符串

在ios 中代替 c 語言的char *

immutable

#### 连接字符串



### NSMutableString

mutable 的 NSString

### NSNumber

封裝了所有原生類型

### NSValue

封裝其他非對象數據

### NSData

二進制數據

### NSDate

時間

### NSArray

有序的對象集合，immutable

不能放 nil ，可以用NSNull 代替。

### NSMutableArray

Mutable 繼承  NSArray 

### NSDictionary

immutable hash 表

### NSMutableDiction

	//遍历 key 和 value
	NSEnumerator *enumerator = [dic keyEnumerator];
    id key;
    NSLog(@"%@",template);
    while ((key = [enumerator nextObject]))
    {
		NSLog(@">>>>>>>>>@@@>>>%@:%@", key,[dic valueForKey:key]);
    
    }

### NSSet

不可變的無序集合
不同同時保存兩個相同的對象

### NSMutableSet

### NSOrderedSet

NSSet + NSArray 有序不能有重複對象

### NSMutableOrderedSet

### 枚舉 
### Property List ####

NSArray ， NSDictionary，NSNumber，NString，NSDate，NSData

#### NSUserDefaults ####

只能存放 Property List 的輕量數據庫

類似 Android 的 sharedperference  


### App Launch Sequence

http://oleb.net/blog/2011/06/app-launch-sequence-ios/

`application:didFinishLaunchingWithOptions:`

与C一样，以main 作为入口函数。下面是 xcode 默认生成的入口函数，加了些
注释。

    int main(int argc, char *argv[]) //是命令行传递的参数。
    {
		// 创建一个Cocoa程序必须的自动回收池
        NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
		// 后面另有论述
        int retVal = UIApplicationMain(argc, argv, nil, nil);
		// 释放 自动回收池
        [pool release];
        return retVal;
    }

`int argc, char *argv[]`



#### UIApplicationMain

[![](http://oleb.net/media/ios-4-app-launch-flow.png "IMAG0007")](http://oleb.net/media/ios-4-app-launch-flow.png)

`UIApplicationMain(argc, argv, nil, nil)` 第三个参数，是UIApplication
子类的类名，为`nil`则创建默认的UIApplication实例。

第四个参数是application delegate的类名，如
`NSStringFromClass([SBAppDelegate class])`


### NSNotificationCenter

每一个运行中的 Cocoa 程序都有一个默认的 notification center
就是设计模式中的观察者模式，可以看作一个信息的中转中心。

	+ (NSNotificationCenter *)defaultCenter

返回notification center ，类
方法,返回全局对象

    - (void)addObserver:(id)anObserver
               selector:(SEL)aSelector
                   name:(NSString *)notificationName
                 object:(id)anObject

注册anObserver对象:接受名字为notificationName, 发送者为anObject的
notification. 当anObject发送名字为notificationName的notification时, 将
会调用anObserver的aSelector方法,参数为该notification 

- 如果notificationName为nil. 那么notification center将anObject发送的所有notification转发给observer
- 如果anObject为nil.那么notification center将所有名字为notificationName的notification转发给observer

	- (void)postNotification:(NSNotification *)notification

发送notification至notification center

	- (void)postNotificationName:(NSString *)aName
		  object:(id)anObject
		  
创建并发送一个notification

	- (void)removeObserver:(id)observer
 
移除observer


一个实例


    // 注册一个观察者
    [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleNotification:)
                                                     name:kFetcherNotifi
                                                   object:nil];
    
    // 向消息中心发送消息，消息中心将通知所有注册了kFetcherNotifi的观察者
    [[NSNotificationCenter defaultCenter] postNotificationName:kFetcherNotifi
                                                            object:self
                                                          userInfo:dict];
    													  
    // 实际就是调用观察者中注册的方法，以 NSNotification 作为参数
    - (void)handleNotification:(NSNotification *)notif {
        [notif userInfo]  // 获取 userInfo   


### NSTimer

NSTimer 有四个静态工厂方法，使用TImer可以分为两种方式

    //这种方式返回一个新的NSTimer对象，并将它以default 模式加入到当前的run loop 当中
    
    NSTimer *  timer = [NSTimer scheduledTimerWithTimeInterval:timeSeq[timeSeqCursor++] target:self selector:@selector(requeue) userInfo:nil repeats:NO];
    
    //这种方式返回一个新的NSTimer 对象，但不会将timer加入到 RunLoop 中，需
    //要手动调用 runloop 的 addTimer 方法
    
    NSTimer *  timer = [NSTimer timerWithTimeInterval:timeSeq[timeSeqCursor++] target:self selector:@selector(requeue) userInfo:nil repeats:NO];
    
    [[NSRunLoop currentRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];


NSTimer 可以分为重复(repeating)和不重复(non-repeating)，不重复的Timer
到期后将会被自动移除run loop 后被release。重复的Timer需要手动用
`[timer invalidate]`来从 run loop 移除。

`[timer fire]` 将会立刻除非timer，调用fire后，如果是重复的Timer将不会
影响到他的调度周期，而不重复的Timer 强制fire后，会自动被 invalidated。


### KeyValueObjectMapping

rich text

- OHAttributedLabel
