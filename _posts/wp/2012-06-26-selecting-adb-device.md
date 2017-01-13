---
date: '2012-06-26'
title: 可交互的 adb devices
tags:
- adb
- ADT
- Android
categories:
- coder
meta:
  _edit_last: '1'
  dsq_thread_id: '796841088'
postid: '854'
guid: http://dourok.info/?p=854
---


```bash
$ adb hell
1) HT18HTB00535 device
2) HT04RL901008 device
Select the device to use, <q> to quit: 1
shell@android:/ $
```



即便有了方便的 Eclipse+ADT ，偶尔在命令行下敲个 adb
也是少不了的。像我这样每天要切换操作系统的开发者，下面这个错误提示是每天都要遇到的：

> Re-installation failed due to different application signatures. You
> must perform a full uninstall of the application. WARNING: This will
> remove the application data! Please execute 'adb uninstall
> your.package.namespace' in a shell.[^1)^](#e1)

如果你忘记了你已连接了多台设备就兴匆匆地敲入， 

```bash
adb uninstall your.package.namespace
```


那么下面这个错误也是不可避免的： 

```bash
error: more than one device and emulator
```

 这时候又得用


```bash
adb devices
```


然后再选择，复制，粘帖打印出来的目标序列号，才能再执行。


```bash
adb -s uninstall your.package.namespace
```


不过现在好了，[dtmilano](http://dtmilano.blogspot.com/)
提供了一个可交互的adb，[原文见此。](http://dtmilano.blogspot.com/2012/03/selecting-adb-device.html)

这个交互的 adb
由两个脚本组成，第一个是 **android-select-device** 。用于提示用户选择设备。


```bash
#! /bin/bash
# selects an android device

PROGNAME=$(basename $0)
UNAME=$(uname)
DEVICE_OPT=
for opt in "$@"
do
case "$opt" in
-d|-e|-s)
DEVICE_OPT=$opt
;;
esac
done
[ -n "$DEVICE_OPT" ] && exit 0
DEV=$(adb devices 2>&1 | tail -n +2 | sed '/^$/d')
if [ -z "$DEV" ]
then
echo "$PROGNAME: ERROR: There's no connected devices." >&2
exit 1
fi
N=$(echo "$DEV" | wc -l | sed 's/ //g')

case $N in
1)
# only one device detected
D=$DEV
;;

*)
# more than one device detected
OLDIFS=$IFS
IFS="
"
PS3="Select the device to use, <q> to quit: "
select D in $DEV
do
[ "$REPLY" = 'q' -o "$REPLY" = 'Q' ] && exit 2
[ -n "$D" ] && break
done</q>

IFS=$OLDIFS
;;
esac
if [ -z "$D" ]
then
echo "$PROGNAME: ERROR: target device coulnd't be determined" >&2
exit 1
fi

# this didn't work on Darwin
# echo "-s ${D%% *}"
echo "-s $(echo ${D} | sed 's/ .*$//')"
```

 把上面代码复制保存到 **android-select-device** 
这个文件里。第二个文件是 **my-adb** ，它是用来代替原本的adb的。当adb
devices 多于一个的时候就会调用 **android-select-device** 让用户选择设备。 

```bash
#! /bin/bash
# This command can be used as an alias for adb and it will prompt for the
# device selection if needed
# alias adb=my-adb

set +x
PROGNAME=$(basename $0)
ADB=$(which adb)
if [ -z "$ADB" ]
then
echo "$PROGNAME: ERROR: cannot found adb"
exit 1
fi

set -e
if [ $# == 0 ]
then
# no arguments
exec $ADB
elif [ "$1" == 'devices' ]
then
# adb devices should not accept -s, -e or -d
exec $ADB devices
else
# because of the set -e, if selecting the device fails it exits
S=$(android-select-device "$@")
exec $ADB $S "$@"
fi
```

 同样的把上面代码复制保存到文件
**my-adb** 。 接下来把这两个脚本加入到 \$PATH 里面。我的做法是在
\$ANDROID\_SDK\_HOME 里面建个 my-tools 文件夹，再把脚本放进去。然后直接在
\$PATH 里添加这个目录 

```bash
export PATH=$PATH:$ANDROID_SDK_HOME/my-tools
```



最后给 my-adb 加个 adb 别名，让它替换掉原来的 adb。 

```bash
alias adb=my-adb
```



确保环境变量生效后，就可以键入 adb
试试看了。如果运行失败，确保两个脚本的权限为可执行，如 744 。

运行 adb hell 后，如果有多个设备的话，你应该可以看到文章一开始的输出：


```bash
$ adb hell
1) HT18HTB00535 device
2) HT04RL901008 device
Select the device to use, <q> to quit: 1
shell@android:/ $
```



不过这个脚本也是有缺陷的，不管 adb
的子命令需不需要指定device，只要多于一个设备连接着，它都会提示选择设备。

### 注解

​1)
这个问题是由于不同的机器使用不同的**debug.keystore**，导致安装的时候验证错误。所有开发的机器使用相同的**debug.keystore**便可以避免这个问题再次发生。在
Eclipse 下 Window -\> Preferences -\> Android -\> Build -\> Custom debug
keystore 中可以更改。
