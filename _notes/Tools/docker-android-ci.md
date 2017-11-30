---
title: 用 docker 配置 Android CI
date: '2016-08-23'
description:
tag:
- docker
- gitlab
- ci
---

### Docker

推荐阅读 [Docker —— 从入门到实践 · GitBook](https://www.gitbook.com/book/yeasy/docker_practice/details)，了解镜像、容器、仓库的概念。

对象底层原理有兴趣推荐阅读陈皓的 [Docker 系列文章](http://coolshell.cn/tag/docker)，可以一窥 Docker 的实现原理。


### 安装 Docker

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
    

具体安装步骤可看[官方文档](https://docs.docker.com/engine/installation/linux/)。安装后 Docker 版本是 1.12.1。

### 配置 gitlab

gitlab 官方也提供了 docker 镜像，安装过程很简单，一句命令搞定。可见 [GitLab Documentation](http://docs.gitlab.com/omnibus/docker/) 。

    sudo docker run --detach \
            --hostname gitlab \
            --publish 443:443 --publish 80:80 --publish 2222:22 \
            --name gitlab \
            --restart always \
            --volume /srv/gitlab/config:/etc/gitlab \
            --volume /srv/gitlab/logs:/var/log/gitlab \
            --volume /srv/gitlab/data:/var/opt/gitlab \
            gitlab/gitlab-ce:latest
            
`run` 命令，首先将会下载 gitlab-ce 镜像（本地没有的话），后在本地建立新容器并运行。Docker Hub 的下载速度堪忧，可用国内的镜像（register-mirror）替换。我选择的是阿里云的加速器。使用 systemd 的话，需在 `/etc/systemd/system/docker.service.d/mirror.conf` 写入

    [Service] 
    ExecStart= 
    ExecStart=/usr/bin/docker daemon -H fd:// --registry-mirror=https://{id}.mirror.aliyuncs.com

覆盖掉默认的 docker 启动命令。可参考[阿里云的文档](https://cr.console.aliyun.com/#/accelerator)。顺便八卦下为什么 `ExecStart` 要先赋空值，见 [systemd - ArchWiki](https://wiki.archlinux.org/index.php/Systemd#Examples)。

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


### 配置 gitlab-runner

gitlab-runner 的安装也很简单：

    docker run -d --name gitlab-runner --restart always \
      -v /srv/gitlab-runner/config:/etc/gitlab-runner \
      gitlab/gitlab-runner:latest
      
安装好后，先进入 bash 配置环境，

    $ sudo docker exec -it gitlab-runner /bin/bash

首先  `/etc/hosts` 加上这条记录

    172.17.0.1    gitlab
    
将 gitlab 指向主机，试试看下面指令能否成功：

    $ curl http://gitlab
    
如果不能访问，也可以直接指向 gitlab 容器，可以通过获取到 gitlab 容器的 ip：

    $ sudo docker inspect gitlab
    
接下来安装 android sdk 和 gradle 的依赖。gitlab-runner 基于 Ubuntu 14.04，下面命令可打印出系统版本：
    
    $ cat /etc/issue 

建议配置[网易 Ubuntu 镜像](http://mirrors.163.com/.help/ubuntu.html)，可以 `docker cp` 命令将外部文件拷入容器：

    $ sudo docker cp  ~/Downloads/sources.list.trusty gitlab-runner:/etc/apt/sources.list.trusty


接着用 `apt-get` 下载依赖

    $ apt-get -qq update && apt-get install -qqy --no-install-recommends curl html2text openjdk-7-jdk libc6-i386 lib32stdc++6 lib32gcc1 lib32ncurses5 lib32z1 unzip && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


环境搭好后，便可以安装 Android Sdk 了。因为服务器是隔离外网环境，所以我直接主机的 sdk 和 gradle 缓存拷进容器，构建时便无需访问网络了。

    $ sudo docker cp $ANDROID_HOME gitlab-runner:/sdk
    $ sudo docker cp ~/.gradle gitlab-runner:/home/gitlab-runner/.gradle

建议删除其他无用的 API 版本和 build tools 版本以节省空间。`.gradle` 可以只保留相应的 wrapper 版本和项目用到的 maven 库的缓存。

如果服务器能访问外网，直接在 docker 仓库上找一些现成的容器更方便，比如 [jangrewe/gitlab-ci-android](https://hub.docker.com/r/jangrewe/gitlab-ci-android/~/dockerfile/)。

[bash - how to remove "TERM environment variable not set" - Stack Overflow](https://stackoverflow.com/questions/19425727/how-to-remove-term-environment-variable-not-set)

export TERM=${TERM:-dumb}

### .gitlab-ci.yml

关于 unaligned apk：
https://stackoverflow.com/questions/30366905/difference-between-app-debug-apk-and-app-debug-unaligned-apk/33886306


多分支
