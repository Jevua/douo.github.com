---
title: Gradle
date: '2015-04-28'
description:
tags:
- gradle
---




### Gradle

Gradle 提供一个 DSL 来描述构建，这个构建语言基于 groovy。

Gradle 有两种基本元素 projects & tasks

project represent a thing to be built or a thing to be done

比如部署应用到生产环境

每个项目由一或多个任务组成。 task represent some atomic piece of work

- Any method you call in your build script which is not defined in the build script, is delegated to the Project object.
- Any property you access in your build script, which is not defined in the build script, is delegated to the Project object.

### 任务

声明一个任务，`task hello`、`task(hello)`、`task("hello")`. **这里有个疑问，hello 还不是一个变量，为什么不用用引号括起来，可能是某些不懂的 groovy 特性。**

任务可以像是一个闭包序列，

    task hello {
        doLast {
            println 'Hello world!'
        }
    }

    task hello << {
            println 'Hello world!'
        }



执行 `gradle -q hello`， `-q` 表示静默输出。

	Hello world!

#### 任务依赖

    task intro(dependsOn: hello) << {
        println "I'm Gradle"
    }

	// or
	intro.dependsOn hello

表示完成了 hello 任务再执行 intro

输出

    > gradle -q intro
    Hello world!
    I'm Gradle

上面可以在 intro 定义完后再修改任务，这也是 gradle 所支持的。

#### 动态任务

gradle 还支持动态任务

    4.times {
    	task "task$counter" << {
    		println "I'm task number $counter"
    	}
    
    }

#### Task 里定义额外的属性

task myTask {
    ext.myProperty = "myValue"
}

task printTaskProperties << {
    println myTask.myProperty
}

ext 是 `org.gradle.api.internal.plugins.DefaultExtraPropertiesExtension` 的实例，要在闭包里面访问 Task 本身可用 `it` 这个 groovy 通用变量。

#### 默认任务

如果不指明任务 `gradle -q` 将运行默认任务

默认任务可这样声明

	defaultTasks 'clean', 'run'

### Java Plugin

一般常用下面几个任务

- build，Gradle 编译并运行测试，然后打包 JAR 文件。
- clean，删除整个 `build` 目录，移除所有 built 产生的文件。
- assemble，编译打包 JAR，但不会运行单元测试任务。
- check，编译并测试代码，Android 插件还会运行 lint 检查。

### 依赖

一个简单的依赖如下：

    apply plugin: 'java'
    
    repositories {
        mavenCentral()
    }

    dependencies {
        compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'
        testCompile group: 'junit', name: 'junit', version: '4.+'
    }


#### 仓库

仓库，是 gradle 搜索依赖项目的地方。

    repositories {
        mavenCentral()
    	mavenLocal()
    	maven {
            url "http://repo.mycompany.com/maven2"
        }
    	ivy {
            url "http://repo.mycompany.com/repo"
        }
    	ivy {
            url "../local-repo" //本地 url 也支持
        }
    }

可以一次声明多个仓库， gradle 按照声明的顺序进行搜索，一旦找到了便停止向下搜索。

[RepositoryHandler - Gradle DSL Version 2.3](http://gradle.org/docs/current/dsl/org.gradle.api.artifacts.dsl.RepositoryHandler.html)

#### 声明依赖

外部依赖：

    dependencies {
        compile group: 'org.hibernate', name: 'hibernate-core', version: '3.6.7.Final'
		compile 'org.hibernate:hibernate-core:3.6.7.Final'
    }

外部依赖需要 group、name 和 version 来识别，也可以写出 `group:name:version` 这样简短的格式。

相对应的还有，项目内的依赖：

	dependencies {
        compile project(':module')

    }

依赖可以有多种配置，如 `compile` 和 `testCompile`

[DependencyHandler - Gradle DSL Version 2.3](http://gradle.org/docs/current/dsl/org.gradle.api.artifacts.dsl.DependencyHandler.html)



#### Dependency Configuration

    dependencies {
        compile fileTree(dir: 'libs', include: ['*.jar'])
        compile 'com.android.support:support-v4:22.1.1'
        compile 'com.android.support:appcompat-v7:22.1.1'
    
    }

依赖被组织到不同的配置项中（Configuration），如上面的 `compile` 就是一个配置项。可以同通过 `configurations.compile` 来访问到 `compile` 所有的依赖。

配置项可以是 Gradle 插件预定制的，比如 Java 插件，就定制 `compile` `runtime` `testCompile` 等等，`compile` 表示编译时的依赖，`runtime` 表示运行时的依赖，不同的配置项的依赖的不同作用是由插件定义的。 配置项之间也是有层级关系的，比如 `runtime` 依赖是继承 `compile` 的，表示运行时的依赖同时也是编译时的依赖。

配置项也可以自己定义，比如

    configurations {
      jaxDoclet
    }
    
    dependencies {
	  jaxDoclet "some.interesting:Dependency:1.0"
    }
    
    task generateRestApiDocs(type: Javadoc) {
      source = sourceSets.main.allJava
      destinationDir = reporting.file("rest-api-docs")
      options.docletpath = configurations.jaxDoclet.files.asType(List)
      options.doclet = "com.lunatech.doclets.jax.jaxrs.JAXRSDoclet"
      options.addStringOption("jaxrscontext", "http://localhost:8080/myapp")
    }

一个配置项其实是一个 [FileCollection](http://gradle.org/docs/current/javadoc/org/gradle/api/file/FileCollection.html) 实例。见 [Configuration - Gradle DSL Version 2.4](http://gradle.org/docs/current/dsl/org.gradle.api.artifacts.Configuration.html)


#### 依赖传递

http://a123159521.iteye.com/blog/774322

### 生命周期

Gradle build 有三个阶段

1. 初始化（Initialization），定位并加载 setting.gradle ，决定当前项目是 single 还是 multiproject。决定哪些项目需要参与这次构建。为每个参与的项目初始化 Project 对象
2. 配置（Configuration）
3. 执行（Execution）

settings.gradle

	println 'This is executed during the initialization phase.'

build.gradle

    println 'This is executed during the configuration phase.'
    
    task configured {
        println 'This is also executed during the configuration phase.'
    }
    
    task test << {
        println 'This is executed during the execution phase.'
    }
    
    task testBoth {
        doFirst {
          println 'This is executed first during the execution phase.'
        }
        doLast {
          println 'This is executed last during the execution phase.'
        }
        println 'This is executed during the configuration phase as well.'
    }



### Android Plugin

https://sites.google.com/a/android.com/tools/tech-docs/new-build-system

android.libraryVariants

https://sites.google.com/a/android.com/tools/tech-docs/new-build-system/user-guide

Running the build twice without change will make Gradle report all tasks as UP-TO-DATE, meaning no work was required. This allows tasks to properly depend on each other without requiring unneeded build operations.

An Android project has at least two outputs: a debug APK and a release APK

[Android Plug-in for Gradle | Android Developers](https://developer.android.com/tools/building/plugin-for-gradle.html)

#### Basic Build Customization

- minSdkVersion
- targetSdkVersion
- versionCode
- versionName
- applicationId
- Package Name for the test application
- Instrumentation test runner

The defaultConfig element inside the android element is where all this configuration is defined.

#### Build Types


By default, 2 instances are created, a debug and a release one.


##### 定义一个Build Type

    android {
        buildTypes {
            debug {
                applicationIdSuffix ".debug"
            }
			//复制debug的配置初始一个新 build type: jnidebug
            jnidebug.initWith(buildTypes.debug)
            jnidebug {
				//配置 buid type 的属性
                packageNameSuffix ".jnidebug"
                jniDebuggable true
            }
        }
    }



一个 build type 有下面这些属性

    Property name	 Default values for debug	 Default values for release / other
     debuggable	 true	 false
     jniDebuggable	 false	 false
     renderscriptDebuggable	 false	 false
     renderscriptOptimLevel	 3	 3
     applicationIdSuffix	 null	 null
     versionNameSuffix	 null	 null
     signingConfig	 android.signingConfigs.debug	 null
     zipAlignEnabled	 false	 true
     minifyEnabled	 false	 false
     proguardFile	 N/A (set only)	 N/A (set only)
     proguardFiles	 N/A (set only)	 N/A (set only)


BuildType 还可以有自己的 SourceSet，默认是

	src/<buildtypename>/  //所以 BuildType 不能是 main 或 androidTest

新的 sourceSet 可以

- The manifest is merged into the app manifest
- The code acts as just another source folder
- The resources are overlayed over the main resources, replacing existing values.

每个 BuildType 都会生成相应的任务，如 `assemble<BuildTypeName>`


#### Dependecies

每个 BuildType 都有自己的 Dependecies 配置项，<buildtype>Compile


#### Library

#### Product Flavor

    android {
        ....
    
        productFlavors {
            flavor1 {
                ...
            }
    
            flavor2 {
                ...
            }
        }
    }


flavor 名称不能与 BuildType 名称相同

Build Type + Product Flavor = Build Variant

### Android Studio

Android Studio 项目有两种 `build.gradle` ，

- 项目级别，配置可以影响所以模块
- 模块级别

#### 项目级别 build.gradle


    buildscript {
     
    //Project-level Gradle build files use buildscript to define dependencies.//
	//定义项目级别 build files 依赖
     
        repositories {
     
            jcenter()
        }
     
    //This file relies on the jJCenter repository.//
     
        dependencies {
     
       classpath 'com.android.tools.build:gradle:1.0.0'
     
    //Project is dependent on version 1.0.0 of the Android plugin for Gradle.// 
     
        }
    }
     
    allprojects {
     
    //Defines the dependencies required by your application.//
     
        repositories {
            jcenter()
        }
    }
     
    //Application depends on the jCenter repository.//



#### 项目内其他 Gradle 配置文件


##### gradle-wrapper.properties

位于 `gradle/wrapper` 的 `gradle-wrapper.properties`，帮助其他人构建你的项目，即便他的机器没有安装 gradle，配合 `gradlew` 这个文件让用户下载合适的 gradle 版本。

    distributionBase=GRADLE_USER_HOME
     
    //Determines whether the unpacked wrapper distribution should be stored in the project, or in the Gradle user home directory.//
     
    distributionPath=wrapper/dists
     
    //The path where the Gradle distributions required by the wrapper are unzipped.//
     
    zipStoreBase=GRADLE_USER_HOME
     
    zipStorePath=wrapper/dists
     
    distributionUrl=https\://services.gradle.org/distributions/gradle-2.2.1-all.zip
     
    //定义当前项目所用 Gradle 版本的下载地址//

GRADLE_USER_HOME 一般位于 `{user.dir}/.gradle`，比较奇怪的是似乎每个项目都要下载一份，不管是不是相同版本的 gradle。

##### settings.gradle

这个文件用来声明当前项目所用的模块，不知是否还有其他功能 #TODO

	include ':app'

##### gradle.properties

用来配置针对这个项目的 gradle 运行偏好，默认为空。

##### local.properties

用来配置针对本地的偏好，比如 sdk 的地址，或者其他个人信息，这个文件应该保留在本地，不应上传至仓库。

	sdk.dir=E\:\\Android\\android-sdk





### 加速 Gradle

####　Gradle daemon



Android Studio 默认就开启了这个选项。也可以在 `gradle.properties` 中加上

	org.gradle.daemon=true

也可以通过命令行

	gradle build --daemon

daemon 让 Gradle 在后台一直运行，不用每次打包都启动一次。缺点就是会占用大量内存，听说要好几百 MB。

##### 关闭

	gradle --stop

Android Studio 在设置 `Build, Execution, Deployment > Compiler` 可关掉 `Use in-process build`

#### 平行编译（Gradle parallel）

平行编译互相之间独立的模块，一般应用似乎没什么用

	org.gradle.parallel=true

或者

	gradle build --parallel --parallel-threads=N

Android Studio 在设置 `Build, Execution, Deployment > Compiler` 中可开启，线程数应该要通过 `Command-line options` 指定

#### Configure projects on demand

不用每次编译都配置所有模块

	org.gradle.configureondemand=true

或者

	gradle build --configure-on-demand

Android Studio 在设置 `Build, Execution, Deployment > Compiler` 中可开启，默认开启。



### 链接

- [The Ins and Outs of Gradle](http://code.tutsplus.com/tutorials/the-ins-and-outs-of-gradle--cms-22978)
- [Speeding up Gradle builds - jimu Mirror: Live previews of Android layouts](http://jimulabs.com/2014/10/speeding-gradle-builds/)
- [Customizing Your Build With Gradle | ToastDroid](http://toastdroid.com/2014/03/28/customizing-your-build-with-gradle/)
- [Messages from mrhaki](http://mrhaki.blogspot.de/search/label/Gradle%3AGoodness)
- [Android Studio, gradle and NDK integration | ph0b's](http://ph0b.com/android-studio-gradle-and-ndk-integration/)



#### 2015-12-24

### Custom Task Classes


rootProjectDir/buildSrc/src/main/groovy directory
