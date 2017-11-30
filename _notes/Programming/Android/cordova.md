---
title: Cordova
date: '2016-03-11'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

### 如何在已有的项目中嵌入 Cordova

http://www.catharinegeek.com/embed-cordova-webview-in-android-native-app/

1. 导入 [cordova framework](https://github.com/apache/cordova-android)，可通过 ant 打包一个 jar 再导入 as
1.1 也可通过 As 直接导入 framework 文件夹作为模块
2. 用 cordova 创建一个项目
3. 复制必要文件
3.1. www 文件夹：`platforms/android/assets/www -> src/main/assets/www`
3.2. android 插件文件夹 `platforms/android/src/[plugin_folder] -> src/main/java/`
3.3. config.xml `platforms/android/res/xml/config.xml -> src/main/res/xml/`

每次新增插件都要复制一遍

### 自定义插件

#### Java

创建一个类并继承 CordovaPlugin，实现 excute 方法用来分发 js 端的消息到具体的实现的方法。

以 `nl.xservices.plugins.Toast` 为例

    public class Toast extends CordovaPlugin {
    ...
        public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        ...
        final JSONObject options = args.getJSONObject(0);
        ...
        }
    }

在 `res/xml/config.xml`，添加

    <feature name="Toast">
        <param name="android-package" value="nl.xservices.plugins.Toast" />
    </feature>

#### Js

在页面根目录下新建插件文件 `plugin/cordova-plugin-x-toast/www/Toast.js` 

在 cordova/plugin_list 中注册插件

    module.exports = [
          ...
          {
                "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
                "id": "cordova-plugin-x-toast.Toast",
                "clobbers": [
                    "window.plugins.toast"
                ]
            }
          ...
          ]
        module.exports.metadata =
            // TOP OF METADATA
            {
                ...
                "cordova-plugin-x-toast": "2.4.2",
                ...
      };

### cordova.js

#### 模块化原理

##### `modules`

定义了 3 个表用于保存模块，类似模拟出 nodejs 的模块系统。

- modules 全局的列表
- inProgressModules，在加载module的过程中保存 module 在 requireStack 中的位置
- requireStack，在加载module的过程中，保存当前 module，

inProgressModules 和 requireStack 用于检测是否循环依赖

##### `define`

定义一个模块：`cordova.define("cordova-plugin-x-toast.Toast", function(require, exports, module) {...})`

一个模块包括了：

```
modules[id] = {
    id: id,  // id
    factory: factory  //工厂方法
};
```

define 本身还有一个`delete`方法，和一个到 modules 的引用。

要访问全局 modules:`define.moduleMap`

##### `require`

加载 module：

1. 检查是否已经加载过，已经加载过着直接返回 module.exports;
2. push 入 requireStack
3. 调用 factory 方法
4. 返回 module.exports
5. 清理 inProgressModules，requireStack
6. 清理 factory 方法，用于标记 module 是否加载过


换句话说，require 的时候会检查 module 有没有 build。build 后下次 require 就可有直接用，不用再调用工厂方法了。


##### factory

`define` 的第二个参数就是工厂方法，工厂方法有三个传入参数:

```
factory(localRequire, module.exports, module);
```

require 与 localRequire 的区别就在于 localRequire 支持相对路径 `.`。 require 用于当前模块导入其他模块，工厂方法里也可以 require，所以一次 require 可能最后是生成一颗 module 树。

module.exports 就是 require 后返回的对象。

module 模块对象，有一个 id 和一个 exports 方法（factory 方法被删除掉）。

##### 例子

```
cordova.define("cordova-plugin-x-dsbridge.DSBridge", function(require, exports, module) {
    var exec = require('cordova/exec')
    var DSBridge = function() {};
    
    DSBridge.prototype.test = function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, "DSBridge", "test", []);
    };
    module.exports = new DSBridge();
});
```
    
使用:

```
var dsb = cordova.require("cordova-plugin-x-dsbridge.DSBridge");
```


#### 事件机制

cordova 对 document 和 windows 的 add/remove EventListner 重新定义，对于每个新增的监听器，只有 cordova 这边没有定义，才会传递给原来的方法。


    var m_window_addEventListener = window.addEventListener;
    window.addEventListener = function(evt, handler, capture) {
        var e = evt.toLowerCase();
        if (typeof windowEventHandlers[e] != 'undefined') {
            windowEventHandlers[e].subscribe(handler);
        } else {
            m_window_addEventListener.call(window, evt, handler, capture);
        }
    };

cordova 通过这样实现自定义的事件。

```
   /**
     * Methods to add/remove your own addEventListener hijacking on document + window.
     */
    addWindowEventHandler:function(event) {
        return (windowEventHandlers[event] = channel.create(event));
    },
    addStickyDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.createSticky(event));
    },
    addDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.create(event));
    },
    removeWindowEventHandler:function(event) {
        delete windowEventHandlers[event];
    },
    removeDocumentEventHandler:function(event) {
        delete documentEventHandlers[event];
    },
    
    /**
     * Method to fire event from native code
     * bNoDetach is required for events which cause an exception which needs to be caught in native code
     */
    fireDocumentEvent: function(type, data, bNoDetach)
    
    fireWindowEvent: function(type, data) 
```

可以这么说，所有 cordova 事件都对应着一个 channel。


addConstructor: function(func) 注册一个函数在 onCordovaReady 时回调，在 deviceready 之前调用。

如：

```
Toast.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.toast = new Toast();
  return window.plugins.toast;
};

cordova.addConstructor(Toast.install);
```

具体见 Channel 模块

#### 回调机制

同样在 cordova 中实现，维护一个全局的 callbacks 集合。

    callbackId: Math.floor(Math.random() * 2000000000),  //是随机生成的 id，作为当前 cordova 实例所有 callbackId 的起始值，以后每增加一个 callback 便自加一。
    callbacks:  {},  // 存放 callbacks 的地方
    callbackStatus: { //所有 callback 的状态
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },


callbacks 的结构：


    cordova.callbacks[callbackId] = {success:success, fail:fail};


提供 3 个执行回调的方法，供原生端调用回调。通过 id 去定位回调


```
/**
 * Called by native code when returning successful result from an action.
 */
callbackSuccess: function(callbackId, args)
/**
 * Called by native code when returning error result from an action.
 */
callbackError: function(callbackId, args)
/**
 * Called by native code when returning the result from an action.
 */
callbackFromNative: function(callbackId, isSuccess, status, args, keepCallback) 
```



#### 模块


cordova 有两个 api provider

- nativeapiprovider, 通过 addJavascriptInterface  暴露给 js 调用
- promptbasednativeapi，通过 prompt 向 android 传递字符串，通过解析字符串达到调用 api 的效果。



##### cordova/android/nativeapiprovider

Exports the ExposedJsApi.java object if available, otherwise exports the PromptBasedNativeApi.


`_cordovaNative`，在 js 这边是找不到实现的代码的，因为它是通过 Android WebView#addJavascriptInterface 设置。暴露 ExposedJsApi 给 js 这边调用。用于 js 向 native 传递消息的底层接口。

```
/*
 * Any exposed Javascript API MUST implement these three things!
 */
public interface ExposedJsApi {
    public String exec(int bridgeSecret, String service, String action, String callbackId, String arguments) throws JSONException, IllegalAccessException;
    public void setNativeToJsBridgeMode(int bridgeSecret, int value) throws IllegalAccessException;
    public String retrieveJsMessages(int bridgeSecret, boolean fromOnlineEvent) throws IllegalAccessException;
}
```

具体实现是在 SystemExposedJsApi。

##### cordova/android/promptbasednativeapi

 Implements the API of ExposedJsApi.java, but uses prompt() to communicate.
 This is used pre-JellyBean, where addJavascriptInterface() is disabled.

在 js 中调用 prompt，参数会传递到 WebChromeClient#onJsPrompt。使用这样的机制传递消息，可以避免在 4.2 之前，addJavascriptInterface 导致的 bug。

见：http://www.jianshu.com/p/93cea79a2443

##### argscheck

用于检测参数，只对下面的类型有效，传入参数  spec 与 args 要一一对应。

```
var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};
```


##### "cordova/base64"

base64 工具

##### *builder

each： 在上下文中对 objects 自己的属性都传递到 func
clobber: 让 obj.key 返回 value

include： 将 objects 的 key 打入 parent 里面，递归

recursiveMerge：将 src 现有的属性合并入 target ；如果两边有相同属性名的对象，那么会合并而不是覆盖。


在 modulemapper 中使用

##### utils

实现了一个兼容的 [defineGetterSetter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/__defineGetter__)

##### channel

订阅者模式。也就是 js 中事件的分发模式


```
//在 androidExec.init 中触发，通过 prompt 获取到 bridgeSecret 后
 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript

 *      pause                 App has moved to background
 *      resume                App has returned to foreground
```

一个 Channel 对象，有一个 字符串类型的 type 和 一个用于标记 sticky（在事件触发后再新增的订阅者会立刻被通知，对于只触发一次的事件有用，比如 deviceready）


需要注意的是，页面加载过程中，cordova 事件的加载顺序（* 表示 sticky）：

- onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
- onNativeReady*              Internal event that indicates the Cordova native side is ready.
- onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
- onDeviceReady*              User event fired to indicate that Cordova is ready
- onResume                    User event fired to indicate a start/resume lifecycle event
- onPause                     User event fired to indicate a pause lifecycle event


##### exec

```
jsToNativeModes = {
        PROMPT: 0,
        JS_OBJECT: 1
    },
    nativeToJsModes = {
        // Polls for messages using the JS->Native bridge.
        POLLING: 0,
        // For LOAD_URL to be viable, it would need to have a work-around for
        // the bug where the soft-keyboard gets dismissed when a message is sent.
        LOAD_URL: 1,
        // For the ONLINE_EVENT to be viable, it would need to intercept all event
        // listeners (both through addEventListener and window.ononline) as well
        // as set the navigator property itself.
        ONLINE_EVENT: 2
    },
```

- nextTick 用于异步执行 func，如果支持 Promise 则用 Promise 机制，不然便用 setTimeout
- messagesFromNative 保存原生返回的消息列表

向原生发送消息的代码在

    function androidExec(success, fail, service, action, args)
    
每次调用生成一个新的 callbackid

    var callbackId = service + cordova.callbackId++,
    

- bridgeSecret
- Msg


##### platform



#### argscheck


#### modulemapper

#### pluginloader

### Node.js

https://nqdeng.github.io/7-days-nodejs/

导入模块

```
var http = require("http");
```

server.js

```
var http = require("http");

function start() {
  function onRequest(request, response) { // 事件驱动
    console.log("Request received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;  // 导出函数
```


```
var server = require("./server");  //相对路径，忽略后缀。执行这个文件里的代码，文件当成一个类，exports 表示开放的函数
                                   //多次 require 不会执行多次，都是返回同一个对象
server.start();
```


### 白名单机制

Cordova 默认是不允许打开 http/https 的。

需要通过插件 https://github.com/apache/cordova-plugin-whitelist 配置白名单通配符。


### Java

Cordova Android，主要做 3 件事

- 处理 js 与 native 的消息传递，NativeToJsMessageQueue
- 插件管理，PluginManager、ConfigXmlParser
- 暴露 Android 核心功能给 js，CoreAndroid
- 增强 WebView 的功能



- 如何处理跳转到下一页后前一页的请求。

Cordova#sendJavascript

brdgeSecret

#### CordovaBridge

##### Prompt

1. gap
2. gap_bridge_mode
3. gap_poll
4. gap_init java 在这里生成 bridgeSecret 返回给 js




#### PluginManager

负责实际代码的执行

向插件分发事件（广播模式，每个 plugin 都会收到）


PluginEntry

- 服务名
- 实现类名
- onload 标志，表示插件是否应该在 pluginmanager 初始化的时候创建。
- CordovaPlugin

CordovaPlugin，实际执行代码的类

按启动时间可分为两种：

1. onload 时自动加载（PluginManager#startupPlugins）
2. 懒性加载，exec 的时候才加载（PluginManager#getPlugin 懒性方法）

Plugin 有点像不带 ui 的 fragment

**multitasking** ？？


#### CallbackContext

用于向 js 发送回调。由 CordovaWebview 负责发送。发送内容由 PluginResult 携带。



#### CoreAndroid

`org.apache.cordova.CoreAndroid#loadPage`

没有开放使用

通过 `messageChannel` 事件获取一个 callback 向 js 发生核心事件，包括按钮事件，pause、resume 等

#### CordovaWebView

showWebPage 参数不能带过去

#### CordovaWebViewEngine

CordovaWebView 和 SystemWebView 之间的胶水类

操作实际的 WebView 视图，封装一个 SystemWebivew 对象

    // AppCache
    settings.setAppCacheMaxSize(5 * 1048576);
    settings.setAppCachePath(databasePath);
    settings.setAppCacheEnabled(true);

在这里暴露 SystemExposedJsApi 给 webview


#### NativeToJsMessageQueue 

通过 JsMessage 构造需要的数据

将 PluginResult 转换为 JsMessage 存入队列，通过 Bridge 触发 js 来读取队列

##### enqueue

CordovaWebViewImpl#sendPluginResult ->

NativeToJsMessageQueue#addPluginResult -> NativeToJsMessageQueue#equeueMessage -> queue(LinkedList<JsMessage>)  Thread[JavaBridge,9,main]

###### pop ######

SystemExposedJsApi#retrieveJsMessages -> CordovaBridge#jsRetrieveJsMessages -> NativeToJsMessageQueue#popAndEncode Thread[JavaBridge,9,main]

触发的源头来自 cordova.js:

    function pollOnce(opt_fromOnlineEvent) {
        if (bridgeSecret < 0) {
            // This can happen when the NativeToJsMessageQueue resets the online state on page transitions.
            // We know there's nothing to retrieve, so no need to poll.
            return;
        }
        var msgs = nativeApiProvider.get().retrieveJsMessages(bridgeSecret, !!opt_fromOnlineEvent);
        if (msgs) {
            messagesFromNative.push(msgs);
            // Process sync since we know we're already top-of-stack.
            processMessages();
        }
    }

pollOnce 的触发又回到 Java，每次 enqueue 后还会调用

    NativeToJsMessageQueue#equeueMessage -> BridgeMode#onNativeToJsMessageAvailable

onNativeToJsMessageAvailable 最终会让 js 调用 pollOnce

总共四种 BridgeMode

- NoOpBridgeMode，由 js 端通过定时轮询来获取消息。 # 在 CordovaWebView 加入
- LoadUrlBridgeMode，loadUrl("javascript:" + js, false) 来直接调用js。# 在 CordovaWebView 加入
- OnlineEventsBridgeMode，需要实现 OnlineEventsBridgeModeDelegate，所以在 CordovaWebViewEngine 加入，通过切换 setNetworkAvailable 来通知 js 是否有新的事件 
- EvalBridgeMode,


OnlineEventsBridgeMode 有一个严重的 bug，

1. NetworkAvailable 是一个全局的状态，
2. NetworkAvailable 的状态，OnlineEventsBridgeMode 自己维护，因为系统没有提供 API 来获取这个状态
3. 多个 Actvity 也就有多个 CordovaWebViewEngine 也就有多个 OnlineEventsBridgeMode，也就有多个 NetworkAvailable 状态
4. 当 Activity A 的状态是 online 跳转到 Activity B 其将状态改为 offline
5. 回到 Activity A ，它仍认为 NetworkAvailable 的状态为 online
6. 为了触发 js 端拉取消息，onNativeToJsMessageAvailable 将 NetworkAvailable 的状态为 offline
7. 全局 NetworkAvailable 已经是 false， 所以 ActivityA 的更改无效，不会触发到 js 的事件。
8. 最终导致 Activity A 的 nativeToJs 队列阻塞

#### CordovaResourceApi


### 其他

#### X5

腾讯推出的 Web 引擎。基于 Blink。

#### crossway

https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview

#### ionic

Ionic Native is a TypeScript wrapper for Cordova/PhoneGap plugins
