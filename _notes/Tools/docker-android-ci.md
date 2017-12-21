---
title: 用 docker 配置 Android CI
date: '2016-08-23'
description:
tag:
- docker
- gitlab
- ci
---

# Docker

推荐阅读 [Docker —— 从入门到实践 · GitBook](https://www.gitbook.com/book/yeasy/docker_practice/details)，了解镜像、容器、仓库的概念。

对象底层原理有兴趣推荐阅读陈皓的 [Docker 系列文章](http://coolshell.cn/tag/docker)，可以一窥 Docker 的实现原理。


## 安装 Docker

- 开发环境：Arch Linux
- 服务器：openSuse leap 42.1
Arch 和 openSuse 的官方源都有 docker ，安装很简单

Arch :

    $ sudo pacman -S docker

openSuse:

    $ sudo zypper in docker
    
两个系统都是 systemd，配置服务命令也一模一样

开启服务：

    $ sudo systemctl start docker

配置开机自启动：

    $ sudo systemctl enable docker
    
具体安装步骤可看[官方文档](https://docs.docker.com/engine/installation/linux/)。

### OSX
使用 [Docker For Mac][https://docs.docker.com/docker-for-mac/]

## 配置 gitlab
gitlab 官方也提供了 docker 镜像，安装过程很简单，一句命令搞定。可见 [GitLab Documentation](http://docs.gitlab.com/omnibus/docker/) 。

    sudo docker run --detach \
            --hostname gitlab \
            --publish 443:443 --publish 80:80 --publish 2222:22 \ # 将 22 端口映射到 2222 主要是不要干扰 host 本身的 22 端口
            --name gitlab \
            --restart always \
            --volume /srv/gitlab/config:/etc/gitlab \
            --volume /srv/gitlab/logs:/var/log/gitlab \
            --volume /srv/gitlab/data:/var/opt/gitlab \
            gitlab/gitlab-ce:latest
            
在 OSX 中，可将 `/srv` 替换为 `/Users/Shared`

### Docker Hub 镜像
`run` 命令，首先将会下载 gitlab-ce 镜像（本地没有的话），后在本地建立新容器并运行。Docker Hub 的下载速度堪忧，可用国内的镜像（register-mirror）替换。我选择的是阿里云的加速器。使用 systemd 的话，需在 `/etc/systemd/system/docker.service.d/mirror.conf` 写入

    [Service] 
    ExecStart= 
    ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://{id}.mirror.aliyuncs.com

覆盖掉默认的 docker 启动命令。可参考[阿里云的文档](https://cr.console.aliyun.com/#/accelerator)。顺便八卦下为什么 `ExecStart` 要先赋空值，见 [systemd - ArchWiki](https://wiki.archlinux.org/index.php/Systemd#Examples)。

### 网络
`--detach` 让容器启动后在后台运行，相对应的 docker 还有 `attach` 命令，让容器的启动进程附加到当前终端上。但由于容器的启动进程 pid 为 1，强制杀死的信号对它没有用，也就是说 `Ctrl-c` 也不能强制中断当前进程，Docker 提供了个快捷键用来让容器重新回到后台：`Ctrl-p, Ctrl-q`，但是我在 konsole 上这个快捷键没有效，可能是因为 `Ctrl-p` 绑定了`上一行`功能，所以只能关掉标签页了事。

`--hostname` 建议设置，我设置为 `gitlab`，因为容器内的 ip 段是 `172.17.0.*`，不同于外部 ip，设置 hostname 更灵活，而后可在其他容器或主机配置 `/etc/hosts` 来设置具体 ip。

`--publish 2222:22` 把容器的 22 端口映射到主机的 2222 端口，不和默认的 sshd 服务端口冲突。

[`gitlab/gitlab-ce:latest`](https://hub.docker.com/r/gitlab/gitlab-ce/) 就是镜像。

容器启动完毕，容器将在后台启动 gitlab 相关服务。

    $ sudo docker logs gitlab
    
可以打印出容器的日志输出。通过 [dockerfile](https://hub.docker.com/r/gitlab/gitlab-ce/~/dockerfile/) 可知道实际跑的是`/usr/local/bin/wrapper` 这个脚本，也可以手动执行这个脚本来启动服务。等待几分钟 gitlab 启动就完毕了。

最后，在主机的 `/etc/hosts` 加上这条记录

    127.0.0.1    gitlab
    
便可以在本机通过 `http://gitlab` 访问，就这么简单一条命令部署好整个环境。

如果不绑定域名，直接使用 IP 访问的话，可能需要修改 `/etc/gitlab/gitlab.rb`：

    external_url 'http://IP[:PORT]'  # 如 http://192.168.x.x:6080 能让 gitlab-runner 访问到的地址

然后运行 `gitlab-ctl reconfigure`。不然 gitlab-runner 用的是默认的外部地址，可能导致 clone 失败，见 [issues 1977](https://gitlab.com/gitlab-org/gitlab-runner/issues/1977) 和 https://stackoverflow.com/a/28005168/851344

## 配置 gitlab-runner
gitlab-runner 的安装也很简单：

    docker run -d --name gitlab-runner --restart always \
      -v /srv/gitlab-runner/config:/etc/gitlab-runner \
      gitlab/gitlab-runner:latest
      
安装好后，先进入 bash 配置环境，

    $ sudo docker exec -it gitlab-runner /bin/bash

### 网络
首先  `/etc/hosts` 加上这条记录

    172.17.0.1    gitlab
    
将 gitlab 指向主机，试试看下面指令能否成功：

    $ curl http://gitlab
    
如果不能访问，也可以直接指向 gitlab 容器，可以通过获取到 gitlab 容器的 ip：

    $ sudo docker inspect gitlab
    
安装之后，便需要注册 [gitlab-runner](https://docs.gitlab.com/runner/register/index.html)。当然要跑起来之前，还需要配置 Android 环境和`.gitlab-ci.yml` 脚本。

可以遇到 [bash - how to remove "TERM environment variable not set" - Stack Overflow](https://stackoverflow.com/questions/19425727/how-to-remove-term-environment-varia
ble-not-set)

## 配置 Android 环境
接下来安装 android sdk 和 gradle 的依赖。gitlab-runner 基于 Ubuntu 14.04，下面命令可打印出系统版本：
    
    $ cat /etc/issue 

建议配置[网易 Ubuntu 镜像](http://mirrors.163.com/.help/ubuntu.html)，可以 `docker cp` 命令将外部文件拷入容器：

    $ sudo docker cp  ~/Downloads/sources.list.trusty gitlab-runner:/etc/apt/sources.list.trusty

接着用 `apt-get` 下载依赖，这里使用的是 jdk7

    $ apt-get -qq update && apt-get install -qqy --no-install-recommends curl html2text openjdk-7-jdk libc6-i386 lib32stdc++6 lib32gcc1 lib32ncurses5 lib32z1 unzip && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
    
如果项目用了  lambda 或其他需要 jdk8 支持的特性，那么就需要安装 jdk8 了，见 https://stackoverflow.com/a/32944272/851344

### Build Tools

环境搭好后，便可以安装 Android Sdk 了。因为服务器是隔离外网环境，所以我直接主机的 sdk 和 gradle 缓存拷进容器，构建时便无需访问网络了。

    $ sudo docker cp $ANDROID_HOME gitlab-runner:/sdk
    $ sudo docker cp ~/.gradle gitlab-runner:/home/gitlab-runner/.gradle

建议删除其他无用的 API 版本和 build tools 版本以节省空间。`.gradle` 可以只保留相应的 wrapper 版本和项目用到的 maven 库的缓存。

如果服务器能访问外网，建议直接安装 [Android 命令行工具](https://developer.android.com/studio/index.html)，然后通过 `sdkmanager` 安装需要的工具，比如：`sdkmanager  "platforms;android-26"`

也可，直接在 docker 仓库上找一些现成的容器更方便，比如 [jangrewe/gitlab-ci-android](https://hub.docker.com/r/jangrewe/gitlab-ci-android/~/dockerfile/)。


# CI

## .gitlab-ci.yml

关于 unaligned apk：
https://stackoverflow.com/questions/30366905/difference-between-app-debug-apk-and-app-debug-unaligned-apk/33886306

多分支


### Cache


在每个 jobs 之间共享文件，可以跨 pipeline。在每个 job 开始的时候，恢复 cache。在 完成 job，上传 artifacts 之前上传。

下面的配置，在不同 pipeline 相同 job 之间共享 cache，`$CI_JOB_NAME` 指的是当前 job 的名称：

        # Define list of files that should be cached between subsequent runs
        cache:
          key: "$CI_JOB_NAME" # To enable per-stage caching
          untracked: true # Cache all Git untracked files
          
### Job

在 job 名称前加一个 `.` 可以停用该 job

    .hidden_job:
      script:
        - run test
