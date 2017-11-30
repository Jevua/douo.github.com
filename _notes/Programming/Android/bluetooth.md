---
title: Bluetooth
date: '2014-05-06'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---




 `createRfcommSocketToServiceRecord` `socket.connect` 某些情況下不會自動配對，而是鏈接超時報錯。比如 Note 2 連 MX2（Flyme 3.4.5）

`BluetoothDevice#createBond`, `BluetoothDevice#removeBond` 可以實現配對和取消配對，但直到 4.4 Android 才將 createBond 這個接口公開。其他版本可以通過反射調用。


http://stackoverflow.com/questions/14228289/android-device-bluetooth-pairing

http://stackoverflow.com/questions/17168263/how-to-pair-bluetooth-device-programmatically-android
