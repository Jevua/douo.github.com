---
title: Weird Android
date: '2013-04-19'
description:
tags:
- froyo
- ScrollView
---

### froyo 自定义标题出现阴影（fading edge）


froyo 使用自定义标题默认窗口内容的上边缘会出现阴影（fading edge）,将`windowContentOverlay`设置为`null`可以去掉这阴影。


    <style name="MyTheme" parent="android:Theme.Light">
            <item name="android:windowTitleSize">48dp</item>
            <item name="android:windowBackground">@color/mybg</item>
            <item name="android:windowTitleBackgroundStyle">@style/mytitlebg</item>
            <!-- remove content fadding edge of main framelayout (fix for froyo)-->
    		<item name="android:windowContentOverlay">@null</item>
    </style>


### ScrollView 子View layout_margin 失效

下面这个布局文件，在 2.x 系统中不会出现margin，`LinearLayout` 直接位于 `ScrollView` 的 0,0 位置。

    <?xml version="1.0" encoding="utf-8"?>
    <ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    		android:layout_width="match_parent"
    		android:layout_height="match_parent"
    		 >
    	<LinearLayout
    		android:layout_width="match_parent"
    		android:layout_marginLeft="18dp"
    		android:layout_marginRight="18dp"
    		android:layout_height="wrap_content" android:orientation="vertical">
    </LinearLayout></ScrollView>

必须加上 `android:layout_gravity="top"` 才能让 `layout_margin` 发挥作用。

    <?xml version="1.0" encoding="utf-8"?>
    <ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    		android:layout_width="match_parent"
    		android:layout_height="match_parent"
    		 >
    	<LinearLayout
    		android:layout_width="match_parent"
    		android:layout_marginLeft="18dp"
    		android:layout_marginRight="18dp"
			android:layout_gravity="top"
    		android:layout_height="wrap_content" android:orientation="vertical">
    </LinearLayout></ScrollView>


### Math.abs(long)

在多年编码的生涯中，android 这个 bug 也算是数一数二的了。

在某些机型上，Math.abs(long) 会返回错误的结果，很难想到在这个常用的方法上会出现这么大的 bug。

	Math.abs(-53683l)=4295020979
	Math.abs(-53843l)=4295021139
	Math.abs(-55843l)=4295023139
	...

准确的的讲是起源于客户反馈这两台设备上遇到奇怪的问题，怎么也想不出原因，最后终于在最不可能的情况下找到问题所在了：

	Samsung Galaxy Ace/android 2.3
	Alcatel One Touch/android 2.3

具体的原因见，https://code.google.com/p/android/issues/detail?id=27007

### 如何在 EditText 上捕获到 KEYCODE_DEL 事件

KeyListener 只是针对物理键盘的，Android 上的软键盘（IME）绕过了这个机制，所以要监听到 DEL 按键不是件容易的事。 SO 的[这个答案][1]提供了一个比较完善的方法来监听 DEL 事件，

	private class ZanyInputConnection extends InputConnectionWrapper {

        public ZanyInputConnection(InputConnection target, boolean mutable) {
            super(target, mutable);
        }

        @Override
        public boolean sendKeyEvent(KeyEvent event) {
            if (event.getAction() == KeyEvent.ACTION_DOWN
                    && event.getKeyCode() == KeyEvent.KEYCODE_DEL) {
                ZanyEditText.this.setRandomBackgroundColor();
                // Un-comment if you wish to cancel the backspace:
                // return false;
            }
            return super.sendKeyEvent(event);
        }


        @Override
        public boolean deleteSurroundingText(int beforeLength, int afterLength) {       
            // magic: in latest Android, deleteSurroundingText(1, 0) will be called for backspace
            if (beforeLength == 1 && afterLength == 0) {
                // backspace
                return sendKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL))
                    && sendKeyEvent(new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL));
            }

            return super.deleteSurroundingText(beforeLength, afterLength);
        }

    }

但是仍有问题，一般的 IME 按 删除键后会通过 sendKeyEvent 来发送 KeyEvent 这样可以正常捕获到。一些 IME 却不会发送 KeyEvent，比如 4.4 的原生英文输入法（LatinIME），取而代之是通过 deleteSurroundingText 来通知这个删除行为（见[源码][2]），这个方法有一个问题，就是一旦 EditText 没有文本了，那用户按 del 键，deleteSurroundingText 也不会得到调用。所以一旦 EditText 没了文本，程序就无法知道用户按了 del 键没有。

[@Carl][] 在[这个答案][3]介绍了一个方法:

	@Override
    public Editable getEditable() {
      if(myEditable == null) {
            //100 slash characters
            myEditable =    Editable.Factory.getInstance().newEditable("////////////////////////////////////////////////////////////////////////////////////////////////////");
            Selection.setSelection(myEditable, 100);
        return myEditable;
      }
    }

在没文本的时候也返回一些东西，让 del 键认为有东西可以删除，但是我测试后发现，没有文本的时候 del 键根本没调用 getEditable ，所以这个方法也是无效的。

有一些 bug 与这个问题相关，[42904](https://code.google.com/p/android/issues/detail?id=42904)、[62306](https://code.google.com/p/android/issues/detail?id=62306)

[1]: http://stackoverflow.com/questions/4886858/android-edittext-deletebackspace-key-event/11377462#11377462
[2]: http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android-apps/4.4_r1/com/android/inputmethod/pinyin/EnglishInputProcessor.java#64
[3]: http://stackoverflow.com/a/19980975/851344
[@Carl]: http://stackoverflow.com/users/928054/carl


### EditText requestFocus 不能打开 soft keyboard

EditText requestFocus 不能打开 soft keyboard 应该是因为 Fragment 还没显示.

要让 fragment 弹出键盘很不容易

通过 global layout 来触发

	v.getViewTreeObserver().addOnGlobalLayoutListener(
					new OnGlobalLayoutListener() {
						@Override
						public void onGlobalLayout() {
							Log.i("AnswerViewManager", "onGlobalLayout");
							v.requestFocus();
							InputMethodManager imm = (InputMethodManager) mContext
									.getSystemService(Context.INPUT_METHOD_SERVICE);
							imm.showSoftInput(v,
									InputMethodManager.SHOW_IMPLICIT);
							v.getViewTreeObserver()
									.removeGlobalOnLayoutListener(this);
						}
					});
