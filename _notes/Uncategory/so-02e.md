---
title: so-02e
date: '2013-06-18'
description:
type: draft
---




目前使用该[307 固件](http://android.zone.it.sohu.com/thread-11870447-1-1.html)，配合该[工具](http://android.zone.it.sohu.com/thread-11870450-1-1.html)可实现root。然后用 Flashtool 安装一遍 busybox，再安装 [SuperSU](www.coolapk.com/apk/eu.chainfire.supersu) 一切工作良好（NFC 失效）。

可成功刷入该 [recovery](http://forum.xda-developers.com/showthread.php?t=2261606)

修复 wifi 经常自动断开的是问题时(见 [Wifi fix](http://forum.xda-developers.com/showthread.php?t=2207559))，遇到自动重启。

	mount -o rw,remount /dev/block/mmcblk0p1 /system 
	
用该命令或者 re 挂载 r/w 都会导致重启。[rootfixer](http://forum.xda-developers.com/showthread.php?t=2317432) 解决问题。

### 日版

[Can SO-02E(Japanese version) flash other brand roms?](http://forum.xda-developers.com/showthread.php?t=2202140)

### Bootloader 无法解锁

[Xperia Z in Japan SO-02E](http://forum.xda-developers.com/showthread.php?t=2121879)

### 刷其他 Rom NFC 会失效

[NFC broken after flashing](http://forum.xda-developers.com/showthread.php?t=2200196)

[Z日版機刷國際版NFC有解了。](http://www.mobile01.com/topicdetail.php?f=569&t=3336839) 没有下文

### exFat

[讓你的XPERIA Z支援exFAT](http://www.mobile01.com/topicdetail.php?f=569&t=3253300&p=1)

### 日版固件

[XPERIA Z SO-02E ほぼ１クリックrootingkit](http://blog.huhka.com/2013/03/root-xperia-z-so-02e-rootingkit.html) ,343 无法 rooted

另外可能导致 NFC 失效，解决如下(刷了港版 307 该方法无效,所以NFC仍不可用)：

	報告
	NFC　の不具合は起こりませんでした。しかし、おサイフケータイは起動しませんでした。
	私のバージョンは　最新ビルド番号：10.1.D.0.322　です。
	以下にあるようにdocomoはアップデートを行っています。これが関係あるように思えます。

	http://www.nttdocomo.co.jp/support/utilization/product_update/list/so02e/index.html

	尚、data/usf　の削除についてですが、shell　上で一つ一つファイルを削除して、原因を検証しようと試みましたが再起動すると削除したはずのファイルが復活していましたので諦めました。
	　素直にディレクトリーごと削除する方が簡単でした。

	ESファイルマネージャーで削除る方法が一番簡単です。追記ですがESファイルマネージャーのデフォルトでは　data/usf　は見つけられません。設定変更して、内部を覗けるようにしてください。

	「設定」「ルートオプション」「ルートエクスプローラー」をチェック「前の戻る」チェック。これで、内部が覗けます。　data/usf　が見つけられると思います。
	　あとは自己責任で・・・。


[Rooted 10.1.D.0.343](http://forum.xda-developers.com/showthread.php?t=2319563) ,未尝试


### 其他

[不要買-xperia-z-的理由](http://sobakome.pixnet.net/blog/post/37541456-%E4%B8%8D%E8%A6%81%E8%B2%B7-xperia-z-%E7%9A%84%E7%90%86%E7%94%B1)


https://twitter.com/goroh_kun

http://developer.sonymobile.com/downloads/all-android/

http://www.xperiablog.net/

[固件更新歷程](http://apk.tw/thread-261293-1-1.html)
