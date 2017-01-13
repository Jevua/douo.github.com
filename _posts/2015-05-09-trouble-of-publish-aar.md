---
title: Android 项目打包到 JCenter 的坑
date: '2015-05-09'
description:
tags:
- android
- gradle
- jcenter
- maven
---

搜索下如何发布 Android 项目的信息，大部分都会找到这篇文章 [Publishing Gradle Android Library to jCenter Repository][]，中文的指引可以看[使用Gradle发布项目到JCenter仓库][]。不过，如果按照这些文章提供的 `build.gradle`，可能还会遇到一些坑。

[使用Gradle发布项目到JCenter仓库]: http://zhengxiaopeng.com/2015/02/02/%E4%BD%BF%E7%94%A8Gradle%E5%8F%91%E5%B8%83%E9%A1%B9%E7%9B%AE%E5%88%B0JCenter%E4%BB%93%E5%BA%93/
[Publishing Gradle Android Library to jCenter Repository]: https://www.virag.si/2015/01/publishing-gradle-android-library-to-jcenter/

### 调用 getBootClassPath() 出错

具体的错误信息是

	Cannot call getBootClasspath() before setTargetInfo() is called.

这个是 gradle 的 android plugin 1.1.0 版本的 bug，见 [Issue 152811 - android - Android Gradle Plugin 1.1.0 breaks Javadoc tasks][Issue 152811]。将插件更新到 1.1.1 以上版本就可以了。

	classpath 'com.android.tools.build:gradle:1.1.2'

[Issue 152811]:(https://code.google.com/p/android/issues/detail?id=152811)


### GBK 编码问题

Windows 用户可能会遇到这个问题，因为你将文件设置为 UTF-8 编码，javadoc 默认的是系统编码，Windows 就是 GBK 编码。所以一旦 java 文件中出现中文注释就会报错，提示`无法映射的GBK编码`。

这个很容易解决，为 javadoc 指明编码就可以。在 gradle 可以这么做： `options.encoding = "utf-8"`，具体的任务代码如下：

    task javadoc(type: Javadoc) {
    	...
        options.encoding = "utf-8"
    	...
    }

### javadoc 的依赖问题

    task javadoc(type: Javadoc) {
        source = android.sourceSets.main.java.srcDirs
        classpath += project.files(android.getBootClasspath().join(File.pathSeparator))
    }

文章中的 `javadoc` 任务是这样的，重点在 classpath 那一行，这一行的意思是添加 Android 框架到 `javadoc` 的 classpath 中。不过，如果你的项目使用了其他第三方依赖，那 `javadoc` 任务很可能会执行失败的，因为上面的代码并没有这些添加第三方依赖到 classpath 中。比如我的项目，有下面这些依赖：

    dependencies {
        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile 'com.google.code.gson:gson:2.3.1'
        compile 'com.android.support:gridlayout-v7:22.1.1'
        compile 'com.android.support:support-v4:22.1.1'
        compile 'com.android.support:appcompat-v7:22.1.1'
    }

跑起上面的 `javadoc` 就会报错，类似下面的错误：

		xxxx.java:20: 错误: 找不到符号
        public static <T> T create(JsonElement json, Class<T> classOfModel) {
                                   ^
      符号:   类 JsonElement
      位置: 类 xxxx

这时最简单的方法就是把第三方依赖加入 classpath：

	 classpath += project.files(configurations.compile.files,android.getBootClasspath().join(File.pathSeparator))

但是仍然报错

	Error:Could not find com.android.support:gridlayout-v7:22.1.1.
	Searched in the following locations:
    USER_HOME/.m2/repository/com/android/support/gridlayout-v7/22.1.1/gridlayout-v7-22.1.1.pom
    USER_HOME/.m2/repository/com/android/support/gridlayout-v7/22.1.1/gridlayout-v7-22.1.1.jar
    https://jcenter.bintray.com/com/android/support/gridlayout-v7/22.1.1/gridlayout-v7-22.1.1.pom
    https://jcenter.bintray.com/com/android/support/gridlayout-v7/22.1.1/gridlayout-v7-22.1.1.jar
	...

这时我的 repositories 是这样的：

    allprojects {
        repositories {
            mavenLocal()
            jcenter()
        }
    }

找不到 support 库，因为 support 库是 sdk 下载下来的，所以在这两个位置找不到也很正常。Android Plugin 自带的任务执行起来却不会报错，想必是做了特殊处理。

sdk 目录下也有个 maven repository，就是那些 support libs 所在的位置。

	ANDROID_HOME\extras\android\m2repository

加进去再试一下

    Properties properties = new Properties()
    properties.load(project.rootProject.file('local.properties').newDataInputStream()) // local.properties 有 sdk 的绝对位置
    allprojects {
        repositories {
            maven {
                url properties.getProperty("sdk.dir")+"/extras/android/m2repository"
            }
            mavenLocal()
            jcenter()
        }
    }


依然报错，这次是找到那些库了，但因为 sdk 目录下的库是 aar 格式的，javadoc 不支持。所以问题到这里近乎无解了，幸好我在 stackoverflow 找到另一个 [android 生成 javadoc 的方法](http://stackoverflow.com/a/24026735/851344)。稍加改写就可以生成 javadoc 为 maven 所用：

    android.libraryVariants.all { variant ->
        println variant.javaCompile.classpath.files
        if(variant.name == 'release') { //我们只需 release 的 javadoc
            task("generate${variant.name.capitalize()}Javadoc", type: Javadoc) {
                // title = ''
                // description = ''
                source = variant.javaCompile.source
                classpath = files(variant.javaCompile.classpath.files, project.android.getBootClasspath())
                options {
                    encoding "utf-8"
                    links "http://docs.oracle.com/javase/7/docs/api/"
                    linksOffline "http://d.android.com/reference", "${android.sdkDirectory}/docs/reference"
                }
                exclude '**/BuildConfig.java'
                exclude '**/R.java'
            }
            task("javadoc${variant.name.capitalize()}Jar", type: Jar, dependsOn: "generate${variant.name.capitalize()}Javadoc") {
                classifier = 'javadoc'
                from tasks.getByName("generate${variant.name.capitalize()}Javadoc").destinationDir
            }
            artifacts {
                archives tasks.getByName("javadoc${variant.name.capitalize()}Jar")
            }
        }
    }

以 support-v4 为例，`configurations.compile` 和 `variant.javaCompile.classpath` 打印出来的位置是不同的，分别是

- `SDK_HOME\extras\android\m2repository\com\android\support\support-v4\22.1.1\support-v4-22.1.1.aar`
- `PROJECT_HOME/MODULE/build/intermediates/exploded-aar/com.android.support/support-v4/22.1.1/jars/libs/internal_impl-22.1.1.jar`

看来 Android Plugin 确实有特殊处理。生成 javadoc 没问题其他的也基本没有什么问题，最终的 `build.gradle` 见 [gist](https://gist.github.com/douo/ef1856415c461953d3c1)。

关于 javadoc 的坑写得十分啰嗦，主要是想和大家分享一些 gradle 的使用经验，其实 gradle 并不困难，主要是 Android Plugin 缺乏文档又鲜有例子，所以折腾起来比较难受。Android Plugin 的用户指南是在 [New Build System](https://sites.google.com/a/android.com/tools/tech-docs/new-build-system) 而 DSL 文档则是在 [Android Plug-in for Gradle](https://developer.android.com/tools/building/plugin-for-gradle.html) 右边有个下载 DSL 文档按钮。Gradle 可看官方的用户指南 [Gradle User Guide](http://gradle.org/docs/current/userguide/userguide)，我还有一个[乱糟糟的笔记](/notes/tools/gradle/) 这个不足为看了。

如何上传到 JCenter 这个按照一开始提及文章的操作应该是没什么问题的，反正我没遇到问题，成功上传了 [lru-image](https://github.com/douo/lru-image)。其实，不用上传到 jcenter 单单运行 `install` 任务， gradle 会在 maven 的本地仓库中生成工件（artifact），只需将 mavenLocal 添加到 repositories，我们可以像发布到 JCenter 一样引用自己的库，方便打包那些多个项目共享又不想发布的私有库。

    allprojects {
        repositories {
            mavenLocal()
            jcenter()
        }
    }

### Java 8 doclint 导致打包失败



把下面代码加入 build.gradle 后面：


```
if (JavaVersion.current().isJava8Compatible()) {
    allprojects {
        tasks.withType(Javadoc) {
            options.addStringOption('Xdoclint:none', '-quiet')
        }
    }
}
```

见 [Stephen Colebourne's blog: Turning off doclint in JDK 8 Javadoc](http://blog.joda.org/2014/02/turning-off-doclint-in-jdk-8-javadoc.html)
