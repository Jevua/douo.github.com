---
title: PendingIntent
date: '2016-07-31'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

Pending 有悬而未决的意思。 PendingIntent 表示一个发送 Intent 的动作和一个还未发送的 Intent。可以在组件间、进程间传递，最终通过 `PendingIntent#send` 系列方法发送 Intent。如 `Activity#createPendingResult` 创建一个向 Activity 发送 result 的动作。以下面代码为例，把 PendingIntent 传递给 AlarmMamager ，其将定时传送 intent 到 `Activity#onActivityResult`

    PendingIntent pi = createPendingResult(1, new Intent(), 0);
    AlarmManager am = (AlarmManager) getSystemService(ALARM_SERVICE);
    am.setRepeating(AlarmManager.ELAPSED_REALTIME, SystemClock.elapsedRealtime() + 2000, 2000L, pi);


