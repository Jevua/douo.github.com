---
title: ADB
date: '2014-06-28'
description:
---

### ADB

https://developer.android.com/tools/help/adb.html

#### Logcat

logcat 的用法

	adb logcat [options] <tag>:<priority>

如果要过滤出标签 `System.out` Debug 以上级别的日志， filterspec 可以这样写 `System.out:D`，但是这样还不够。可以将这个 filterspec 理解成添加一条规则：“输出标签 `System.out` Debug 以上级别的日志”，但是其他标签还是默认输出 Info 以上级别的日志，所以需再加一个 filterspec `"*:S"`，注意要加引号。`*:S` **让 logcat 静默其他输出**，`-s` 也可以实现同样的效果。

	adb logcat "System.out:D" "*:S"

或

	adb logcat -s "System.out:D"

`-d` 可以输出当前的所有日志，然后退出。

`-t <count>` 输出最近 `<count>` 行的日志，然后退出。**和 filterspec 一起用，过滤最近 `<count>` 行的日志**，而不是从过滤结果中输出最近 `<count>` 行。

`-b <buffer>`， 可输出不同的日志，有'main', 'system', 'radio', 'events'. 默认是 main 和 system。应用的日志在 main. 


#### 通过 Wi-Fi 连接设备

	$ adb devices 
	List of devices attached 
	0070015947d30e4b             device
	$ adb tcpip 5555   # 重启 adb 到 tcp/ip 模式
	$ adb connect 192.168.1.104 # 设备 ip
	$ adb devices
	List of devices attached 
	192.168.1.104:5555     device

#### am

`am` 应该是 Activities Manager 的缩写，通过它可以启动 Activity、Service、broadcast，可以 FC、杀死应用进程，杀死所有后台，还有其他 debug 功能。

	adb shell am startservice –a <intent action>

#### pm

`pm`, Packages Manager 可以处理 Package、权限、用户的相关事宜。


       pm list packages [-f] [-d] [-e] [-s] [-3] [-i] [-u] [--user USER_ID] [FILTER]
       pm list permission-groups
       pm list permissions [-g] [-f] [-d] [-u] [GROUP]
       pm list instrumentation [-f] [TARGET-PACKAGE]
       pm list features
       pm list libraries
       pm list users
       pm path PACKAGE
       pm install [-l] [-r] [-t] [-i INSTALLER_PACKAGE_NAME] [-s] [-f]
                  [--algo <algorithm name> --key <key-in-hex> --iv <IV-in-hex>]
                  [--originating-uri <URI>] [--referrer <URI>] PATH
       pm uninstall [-k] PACKAGE
       pm clear [--user USER_ID] PACKAGE
       pm enable [--user USER_ID] PACKAGE_OR_COMPONENT
       pm disable [--user USER_ID] PACKAGE_OR_COMPONENT
       pm disable-user [--user USER_ID] PACKAGE_OR_COMPONENT
       pm disable-until-used [--user USER_ID] PACKAGE_OR_COMPONENT
       pm grant PACKAGE PERMISSION
       pm revoke PACKAGE PERMISSION
       pm set-install-location [0/auto] [1/internal] [2/external]
       pm get-install-location
       pm set-permission-enforced PERMISSION [true|false]
       pm trim-caches DESIRED_FREE_SPACE
       pm create-user USER_NAME
       pm remove-user USER_ID
       pm get-max-users


#### dumpsys

`dumpsys activity` http://blog.iderzheng.com/debug-activity-task-stack-with-adb-shell-dumpsys/
