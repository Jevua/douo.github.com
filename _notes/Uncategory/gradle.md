---
title: gradle
date: '2014-03-03'
description:
---

API http://www.gradle.org/docs/current/javadoc/

gradle 中文文档

http://www.android-studio.org/index.php/docs/guide/136-gradle-3



http://www.vogella.com/tutorials/AndroidBuild/article.html


Full User Guide

http://tools.android.com/tech-docs/new-build-system



[Gradle for Android](https://www.youtube.com/watch?v=rXww768LUUM)


### Simple

build.gradle

    task hello {
        doLast {
            println 'Hello world!'
        }
    }

gradle 就是 groovy 脚本

### Java

[Java Plugin](http://www.gradle.org/docs/current/userguide/java_plugin.html)

默认路径

- 源码 src/main/java
- 测试 src/test/java
- 资源文件 src/main/resources
- 测试时包含的资源文件 src/test/resources
- 打包目录 build/libs


以 src/main/java/Main.Java 为例

    apply plugin: 'java'
    
    jar {
        manifest.attributes("Main-Class": "Main")
    }

这样生成一个可运行的 jar 文件。

要在命令行窗口运行，需要[Application Plugin](http://www.gradle.org/docs/current/userguide/application_plugin.html)。

指定 main class

    mainClassName = "Main"

运行 `gradle run`

#### Dependencies

    dependencies {
        compile group: 'commons-collections', name: 'commons-collections', version: '3.2'
        testCompile group: 'junit', name: 'junit', version: '4.+'
    }

    configurations.compile.collect{println it}


需要指定 repositories，一个或多个

    repositories {
        mavenCentral()
    }

###Script

Project　实例

在　build.gradle 中调用的方法，会先在 build.gradle 查找

找不到再去当前 Project 实例中查找


### Android

    buildscript {
        repositories {
            mavenCentral()
        }
    
        dependencies {
            classpath 'com.android.tools.build:gradle:0.8.+'
        }
    }
    
    allprojects {
        repositories {
            mavenCentral()
        }
    }
    
    
    apply plugin: 'android'
    
    android {
        compileSdkVersion 19
        buildToolsVersion "19.0.2"
    
        defaultConfig {
            minSdkVersion 7
            targetSdkVersion 19
            versionCode 1
            versionName "1.0"
        }
        buildTypes {
            release {
                runProguard false
                proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
            }
        }
    }
    
    task hello{
         println "android:$android"
         sourceSets.all{println it}
    
    }




The closure passed to the buildscript() method configures a ScriptHandler instance



配置 ANDROID_HOME，local.properties

	sdk.dir=/.../Android/sdk




Note: srcDir will actually add the given folder to the existing list of source folders (this is not mentioned in the Gradle documentation but this is actually the behavior).



    android {
        sourceSets {
            main {
                manifest.srcFile 'AndroidManifest.xml'
                java.srcDirs = ['src']
                resources.srcDirs = ['src']
                aidl.srcDirs = ['src']
                renderscript.srcDirs = ['src']
                res.srcDirs = ['res']
                assets.srcDirs = ['assets']
            }
    
            androidTest.setRoot('tests')
        }
    }


不同的 build type 有何用？

debug release

android {
    buildTypes {
        debug {
            packageNameSuffix ".debug"
        }

        jnidebug.initWith(buildTypes.debug)
        jnidebug {
            packageNameSuffix ".jnidebug"
            jnidebugBuild true
        }
    }
}


`packageNameSuffix` set its package to be <app package>.debug to be able to install both debug and release apk on the same device


Library projects

In the above multi-project setup, :libraries:lib1 and :libraries:lib2 can be Java projects, and the :app Android project will use their jar output.


### Build Variants
