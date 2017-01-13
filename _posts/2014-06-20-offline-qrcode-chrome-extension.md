---
title: 本地生成二维码的 Chrome 扩展
date: '2014-06-20'
description:
categories: coder
tags:
- chrome extension
- qrcode
---
最近谷歌被全面封杀，用了多年的 [QR-Code Tag Extension][] 基本处于不可用状态，特色版 Firefox 自带有本地生成二维码（QRCode）功能，于是便想找一下 Chrome 有没有在本地生成二维码的扩展，结果没有发现，反而找到了一个 [jquery.qrcode.js][]（主要实现绘制的工作，生成二维码的功能是 [QR Code Generator][] 实现的），一个可在本地生成二维码的 jquery 插件，很易用。想必用它做一个 Chrome 扩展是个很容易的事情，毕竟[之前也写过][shanbay-chrome-extension] Chrome 扩展，虽说是两三年前的事。

本来以为一两个小时可以搞定，结果从完善功能到打包发布可能得花掉一天时间，API、流程基本忘光了，都得跟着文档慢慢做。[jquery.qrcode.js][] 中文乱码，让它支持 UTF-8 编码费了不少时间，[contextMenus][] + [Programmatic injection][] 也比较麻烦，还尝试下 i18n，样式用的是 [Pure][].

可以在 Chrome WebStore 下载 [Offline QRCode Generator](https://chrome.google.com/webstore/detail/offline-qrcode-generator/nffnfjmgmedijakadedogccmghenomnk)。

1. 提供了最基本的扩展工具栏按钮，点击可直接为当前标签的 URL 生成二维码，也输入自定义文本来生成。
2. 支持页面右键菜单，可为当前页面网址，所选文本或所选超链接生成二维码。
3. 使用 Event Pages 技术，只有当需要时（点击右键菜单的时候）才会加载后台进程。
4. Lazy Load 技术注入脚本，只有点击右键菜单生成二维码的时候，才会为当前页面注入脚本，不会对正常浏览网页产生影响。

源码在此：[js-qrcode-chrome-extension][].

BTW: 要发布之前起名的时候，反而找到不少有此功能的扩展。

[QR-Code Tag Extension]: https://chrome.google.com/webstore/detail/qr-code-tag-extension/bcfddoencoiedfjgepnlhcpfikgaogdg
[jquery.qrcode.js]: http://larsjung.de/qrcode/
[QR Code Generator]: https://d-project.googlecode.com/svn/trunk/misc/qrcode/index.html
[shanbay-chrome-extension]: https://code.google.com/p/shanbay-chrome-extension/
[contextMenus]: https://developer.chrome.com/extensions/contextMenus
[Programmatic injection]: https://developer.chrome.com/extensions/content_scripts#pi
[js-qrcode-chrome-extension]: https://github.com/douo/js-qrcode-chrome-extension
[Pure]: http://purecss.io/
