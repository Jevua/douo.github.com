---
title: Android Tip
date: '2013-08-05'
description:
tags:
- cookie
- webview
- measureText
- getMethodName
---


#### WebView 与 CookieStore 共享 Cookie

Apache 的 Http 框架通过 CookieStore 来管理 Cookies，可以通过 `HttpContext.getAttribute(ClientContext.COOKIE_STORE)` 来获取。

WebView 使用 [CookieManager][1] 来管理 Cookie， `CookieManager.getInstance()` 获取 CookieManager 实例。

用下面的方法可将 WebView 得到的 Cookie 写入 [CookieStore][2]。参考自[WebViewとHttpClientのCookie共有][3]

    private WebViewClient mWebViewClient = new WebViewClient() {
		@Override
		public void onPageFinished(WebView view, String url) {//页面加载完成后再来读取cookie
			super.onPageFinished(view, url);
			if (url.indexOf(TargetUrl) > -1) { // 需要提取 cookie 的url
				String cookie = CookieManager.getInstance().getCookie(
						SomeUrl);  // 得到该 url 的 cookie
				String[] oneCookie = cookie.split(";");
				for (String namAndVal : oneCookie) {
					d("namAndVal:" + namAndVal);
					namAndVal = namAndVal.trim();
					String[] cookieSet = namAndVal.split("=");
					BasicClientCookie bCookie = new BasicClientCookie(
							cookieSet[0], cookieSet[1]);
					bCookie.setDomain(SomeUrl);
					bCookie.setPath("/");
					CookieStore store = getCookieStore(); //需要写入的 cookiestore
					store.addCookie(bCookie);
				}
			}
		}


为 WebView 设置 Cookie，下面的方法在页面加载前调用

	private void syncCookie() {
		CookieManager cm = CookieManager.getInstance();
		for (Cookie c : getCookieStore().getCookies()) {
			if (c.getDomain().indexOf(someUrl) > -1) { // 过滤出需要同步的 cookie
				String cs = c.getName() + "=" + c.getValue() + "; domain="
						+ c.getDomain();
				d("syncCookie:" + cs);
				cm.setCookie(someUrl, cs);

			}
		}
		CookieSyncManager.getInstance().sync();
	}

这个方法未仔细使用过，可能有坑。见 [Passing cookie to webview][4]


[1]: http://developer.android.com/reference/android/webkit/CookieManager.html
[2]: http://developer.android.com/reference/org/apache/http/client/CookieStore.html
[3]: http://wavetalker.blog134.fc2.com/blog-entry-44.html
[4]: http://code.walletapp.net/post/46414301269/passing-cookie-to-webview


#### .measureText() 与 .getTextBounds() 的区别
 
Paint 中用 `measureText` 和 `getTextBounds` 获取相同字符串的宽度是不同的。

![-measureText vs getTextBounds](http://i.stack.imgur.com/cYnF6.png "Optional title")

见：[Android Paint: .measureText() vs .getTextBounds()](http://stackoverflow.com/questions/7549182/android-paint-measuretext-vs-gettextbounds)

Rect `toShortString` `toString` 方法可以直接打印出 Rect

#### 获取当前代码所在的方法的方法名

代码如下:

	public static String getMethodName() {
		StackTraceElement[] stacktrace = Thread.currentThread().getStackTrace();

		StackTraceElement e = stacktrace[3];
		String methodName = e.getMethodName();
		return methodName;
	}
	
举个例子说明下

      private void handleMock(AsyncHttpResponse HandlerresponseHandler) {
           StackTraceElement[] stacktrace=Thread.currentThread().getStackTrace();
           Log.d("Mock","stacktrace:"+stacktrace.length);
           for(inti=0;i<stacktrace.length;i++) {
                Log.d("Mock",i+": "+stacktrace[i].getMethodName());
           }
           StackTraceElemente=stacktrace[2];
           StringmethodName=e.getMethodName();

           ModelResponseHandlerhandler=(ModelResponseHandler)responseHandler;
           try{
                handler.handleSuccessModelMessage(200,null,readJson(methodName));
           }catch(IOExceptione1) {
                e1.printStackTrace();
           }
     }

     public void init(AsyncHttpResponse HandlerresponseHandler) {
           handleMock(responseHandler);
     }


打印出:

    07-03 15:23:07.469: D/Mock(30768): stacktrace:21
    07-03 15:23:07.469: D/Mock(30768): 0: getThreadStackTrace
    07-03 15:23:07.469: D/Mock(30768): 1: getStackTrace
    07-03 15:23:07.469: D/Mock(30768): 2: handleMock
    07-03 15:23:07.469: D/Mock(30768): 3: init
    07-03 15:23:07.469: D/Mock(30768): 4: init
    07-03 15:23:07.469: D/Mock(30768): 5: onStart
    07-03 15:23:07.469: D/Mock(30768): 6: callActivityOnStart
    07-03 15:23:07.469: D/Mock(30768): 7: performStart
    07-03 15:23:07.469: D/Mock(30768): 8: performRestart
    07-03 15:23:07.469: D/Mock(30768): 9: performResume
    07-03 15:23:07.469: D/Mock(30768): 10: performResumeActivity
    07-03 15:23:07.469: D/Mock(30768): 11: handleResumeActivity
    07-03 15:23:07.469: D/Mock(30768): 12: handleMessage
    07-03 15:23:07.469: D/Mock(30768): 13: dispatchMessage
    07-03 15:23:07.469: D/Mock(30768): 14: loop
    07-03 15:23:07.469: D/Mock(30768): 15: main
    07-03 15:23:07.469: D/Mock(30768): 16: invokeNative
    07-03 15:23:07.469: D/Mock(30768): 17: invoke
    07-03 15:23:07.469: D/Mock(30768): 18: run
    07-03 15:23:07.469: D/Mock(30768): 19: main
    07-03 15:23:07.469: D/Mock(30768): 20: main

如日志所示，可见 stacktrace 的 index 为 2 就是当前方法名，3 就是前一个方法。



