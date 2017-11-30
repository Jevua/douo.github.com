---
title: cwac-wakeful
date: '2013-11-04'
description:
tags:
- cwac-wakeful
---

### 定时启动服务

#### cwac-wakeful 简析

cwac-wakeful 其实很简单。 `WakefulIntentService` 继承自 `IntentService`，加上一个 `WakeLock` 处理机制， `doWakefulWork(Intent intent) ` 等同于 `onHandleIntent(Intent intent)` ，当服务启动时会获取 `WakeLock`, 在 `onHandleIntent()` 中调用 `doWakefulWork` ，当其返回时便会释放`WakeLock`。所以 `doWakefulWork` 的代码不是在UI线程执行，可以直接处理耗时操作，在 `doWakefulWork`  开启一个新线程要小心，方法一旦返回就会释放掉`WakeLock` 

另外还提供一些便利的方法，实现一个 AlarmManager 的简单模式。
AlarmListener 和 AlarmReceiver，两者需要配合使用。

    public interface AlarmListener {
    		// 设置闹钟
    		void scheduleAlarms(AlarmManager mgr, PendingIntent pi, Context ctxt);
    		// 闹钟时间到的时候调用
    		void sendWakefulWork(Context ctxt);
    
    		long getMaxAge();
    	}

AlarmReceiver 同时接收 `BOOT_COMPLETED` 和 `ALARM` 的广播。需要加入这个一段声明，

    <receiver android:name="com.commonsware.cwac.wakeful.AlarmReceiver">
    			<intent-filter>
    				<action android:name="android.intent.action.BOOT_COMPLETED"/>
    			</intent-filter>
    
    			<meta-data
    				android:name="com.commonsware.cwac.wakeful"
    				android:resource="@xml/wakeful"/>
    		</receiver>
    
    		<service android:name=".AppService">
    		</service>

xml/wakeful 格式如下：用于声明自己实现的 AlarmListener

    <WakefulIntentService
      listener="com.commonsware.cwac.wakeful.demo.AppListener"
    />


`WakefulIntentService#scheduleAlarms` 向`AlarmManager` 注册
`AlarmReceiver` 。

	// 注意传递进来的 listener 与响应 alarm 的listener 不是同一个对象
    public static void scheduleAlarms(AlarmListener listener, Context ctxt,
    			boolean force) {
    		Log.v("WakefulIntentService", "scheduleAlarms");
    		SharedPreferences prefs = ctxt.getSharedPreferences(NAME, 0);
    		long lastAlarm = prefs.getLong(LAST_ALARM, 0);
    		// 当前时间与最后一次ALARM触发时间差小于maxAge，这个方法会被忽略。
    		if (lastAlarm == 0
    				|| force
    				|| (System.currentTimeMillis() > lastAlarm && System
    						.currentTimeMillis() - lastAlarm > listener.getMaxAge())) {
    			AlarmManager mgr = (AlarmManager) ctxt
    					.getSystemService(Context.ALARM_SERVICE);
    			Intent i = new Intent(ctxt, AlarmReceiver.class);
    			PendingIntent pi = PendingIntent.getBroadcast(ctxt, 0, i, 0);
    
    			listener.scheduleAlarms(mgr, pi, ctxt);
    		}
    	}

AlarmReceiver 的 onReceive 方法

    public void onReceive(Context ctxt, Intent intent) {
    	// 这里会创建一个新的 listener 对象，也就是说无法利用 Listener 直接通过内存传递参数
        AlarmListener listener=getListener(ctxt);
        Log.i("onReceive",ctxt+"");
        if (listener!=null) {
          if (intent.getAction()==null) { // 根据这个来判定广播是来着 Alarm 还是 来自 BOOT_COMPLETED
        	  // 处理 Alarm 的广播
            SharedPreferences prefs=ctxt.getSharedPreferences(WakefulIntentService.NAME, 0);
    
            prefs
              .edit()
              .putLong(WakefulIntentService.LAST_ALARM, System.currentTimeMillis())
              .commit();
            
            listener.sendWakefulWork(ctxt);
          }
          else {
            WakefulIntentService.scheduleAlarms(listener, ctxt, true);
          }
        }
      }



用起来有点别扭，DEMO#1 是 AlarmReceiver 的例子。用自己的 Receiver 来处
理会更灵活一点， DEMO#2 是例子。

cancelAlarms 也需要注意一下：

    public static void cancelAlarms(Context ctxt) {
    		AlarmManager mgr = (AlarmManager) ctxt
    				.getSystemService(Context.ALARM_SERVICE);
    		Intent i = new Intent(ctxt, AlarmReceiver.class);
    		PendingIntent pi = PendingIntent.getBroadcast(ctxt, 0, i, 0);
    		// Intent.filterEquals 来判定是否取消，这里  AlarmReceiver.class 是相同的，跟传入的 context 无关
    		// 实际会取消所有 WakefulIntentService 注册的 Alarm
    		mgr.cancel(pi);
    	}
