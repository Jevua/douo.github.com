---
title: greenDao
date: '2014-03-05'
description:
---

[GreenDao](http://greendao-orm.com/) 是一个面向 Android 的 ORM（对象关系映射）工具。

[greenDao 的效率](http://greendao-orm.com/features/)，[与 ORMLite 的对比](http://software-workshop.eu/content/comparing-android-orm-libraries-greendao-vs-ormlite)

greendao 使用预生成代码的技术来做 ORM。
使用 greendao 需要建一个新的 Java 项目用于自动生成 Java Data Objects 和对应的 Dao。

### Android Studio 中使用 greenDao

首先创建一个新 Module，选择 Java Library。

修改 build.gradle 如下：

    apply plugin: 'application'
    mainClassName = "com.diaoser.tmr.generator.TmrGenerator"
    
    
    dependencies {
        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile group: 'de.greenrobot', name: 'greendao', version: '1.3.7'
        compile group: 'de.greenrobot', name: 'greendao-generator', version: '1.3.0'
    }


配置一下，run configurations

要点：Working directory 现在 项目路径，而不是模块路径

Use classpath of module，选择模块本身


### Entity

    book.setSuperclass("Model");
    book.getAdditionalImportsEntity().add("info.dourok.android.data.Model");

