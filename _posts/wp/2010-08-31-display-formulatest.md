---
date: '2010-08-31'
title: 插入!数学公式测试，附上一个很SB的Java程序
tags:
- forkosh
- LaTex
- mathtex
- Robot
- 数学公式
categories:
- coder
- otaku
meta:
  _edit_last: '1'
  dsq_thread_id: '796842536'
  _wp_old_slug: display_formula_test
postid: '316'
guid: http://dourok.info/?p=316
---
实际上我不喜欢插入这个词!

在网页上嵌入数学公式，之前已经在wiki上试过，尝试了[jsMath](http://www.math.union.edu/~dpvc/jsmath/)和[mathJax](http://www.mathjax.org/)。这两个都不是在服务器是渲染Latex代码，而是用javascript在客户端渲染，而且渲染出来的不是图片而是文本，也就是说可以复制粘贴到文本编辑器上，不知这个算不算优点，好处节省下带宽，但实际在IE8上可以说又慢又卡，chromium还可以接受但下标有点错位，也许是我配置的问题，对FireFox的支持是最好的。但是为了获得最佳的显示效果客户端必须要安装某种最佳字体，选择mathJax会自动下载该字体。点击[这里看下mathJax的效果](http://dourok.info/mathjax/test/)。相对来说mathJax比jsMath更方便些。

总的来说，用js还是有点麻烦，所以回到传统考虑在服务器上生成图片。这个可以自己架设，也可以用一些公共服务，比如说forkosh.dreamhost，更多的参考[这篇文章](http://blog.chaoskey.com/2009/06/21/857)。
forkosh的使用十分简单，只需在`http://www.forkosh.dreamhost.com/mathtex.cgi?`后面加入Latex代码。如加上e\^{i}+1=0，即`http://www.forkosh.dreamhost.com/mathtex.cgi?e^{i\pi}+1=0`，出来的就是欧拉恒等式

![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24e%5E%7Bi%5Cpi%7D+1=0%24%7D "欧拉恒等式")

可以用来指定颜色，如`\color{red}\frac{\int_{-\pi}^\pi \sqrt{1+\cos^2{t}}dt }{2\pi}`。

出来的效果是：![](http://www.forkosh.dreamhost.com/mathtex.cgi?%20%5CLarge%5Cparstyle%5Ccolor%7Bred%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24%5Cfrac%7B%5Cint_%7B-%5Cpi%7D%5E%5Cpi%20%5Csqrt%7B1+%5Ccos%5E2%7Bt%7D%7Ddt%20%7D%7B2%5Cpi%7D%24%7D%7D "\color{red}\frac{\int_{-\pi}^\pi \sqrt{1+\cos^2{t}}dt }{2\pi}")。

更多forkosh参考[这篇文章](http://ggggqqqqihc.javaeye.com/blog/161957)，和[forkosh主页](http://www.forkosh.com/)，forkosh提供一个很实用的[practice
box](http://www.forkosh.com/mathtextutorial.html)，编辑时候用来测试很方便。

话说贴图片的时候还遇到不少麻烦，[ShadowBlue](http://interjc.net/dev/shadowblue)这个主题为图片添加了样式——渐变的边框和白色背景，在内嵌图片到文本的时候相当不和谐。但自己改了css后，发现居然不生效，费了我半天时间改css和半天时间学习css的优先级。后来发现居然是我把css代码复制了多一份，改的时候是改前面的然后又被后面的改覆盖了，不过总算搞定了。

发现以前的一篇文章来测试数学公式，倒是挺合用的。

### 很SB的Java程序在此

[![SB](wp-content/uploads/2010/08/9191a5cc799b343d01e928d8.jpg.png "SB")](wp-content/uploads/2010/08/9191a5cc799b343d01e928d8.jpg.png)

其实这个程序的行为很简单，就是用java来控制鼠标，确切的说应该是用java来控制鼠标的运动轨迹。想用java来控制鼠标并不是一件困难的事。因为java本身提供了一个类Robot。在帮助文档中对Robot类是这样描叙的：此类用于为测试自动化、自运行演示程序和其他需要控制鼠标和键盘的应用程序生成本机系统输入事件。Robot
的主要目的是便于 Java 平台实现自动测试。

虽说字都看的懂，不过什么意思还真有点不明白。不过这个程序我们主要用到的就是Robot类里的mouseMove(int
x, int
y)方法。这个方法可以将鼠标移动到屏幕上坐标(x,y)的位置上。通过这个方法就可以来控制鼠标的运动轨迹。比如说，要让鼠标画上图的轨迹。

那么只需让鼠标跟着这些轨迹移动就可以，具体的实现可以逐个像素改变y坐标的值，并实时计算x的值。每次更新都调用一次Robot的实例化方法mouseMove(x,
y)，这样就可以实现鼠标指针沿轨迹移动的效果。

另外也可以一次性运算好所有点。并保存成Point[]，之后每一次画轨迹，只需按顺序历遍Point[]上的值。代码大致如下:



```java
for(int i = 0 ; points.length ; i++){

           robot.delay(speed);

           robot.mouseMove(points[i].x， points[i].y);

       }
```



接下来，我们再来看下如何画出上图的轨迹。首先，我们看下红色的轨迹，似乎可以很牵强地把它看成字母’S’，但是实际上它是一条正弦函数取区间![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24%5Cleft%5B-%5Cpi,%5Cpi%5Cright%5D%24%7D "\left[-\pi,\pi\right]")的曲线。当然也可以说是余弦函数。这不是重点，重点是如何这条曲线映射到屏幕上的实际位置。无非通过缩放、旋转、移位。知道曲线和横坐标距离是![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%242%5Cpi%24%7D "2\pi")。而相对应于屏幕上的距离![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24d=p_2-p_1%24%7D "d=p_2-p_1")。所以可以知道曲线放大的倍数就是![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24n=(p_2-p_1)/2%5Cpi%24%7D "n=(p_2-p_1)/2\pi")。显示在屏幕上的曲线是旋转![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%2490%5Ctextdegree%24%7D "90\textdegree")的。也就是原本曲线的y变成屏幕上的x。而x变成屏幕上的y。在加上偏移量m。就可以算出屏幕上x，y的值了。让i为正弦函数的变量，取![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24i=-%5Cpi%24%7D "i=-\pi")
可知y每增加一个像素，![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24i%24%7D "i")便增加![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24%20%5Cfrac%20in%24%7D "\frac in")。

![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5CLarge%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Cbegin%7Bequation%7D%5Cleft%5C%7B%5Cbegin%7Barray%7D%7Bc%7Dsx_k%20=%20m%20+%20n%20*%20sin(i%20+%20k*%5Cfrac%201n),%20%5C%5Csy_k%20=%20y_1%20+%20k,%20%5C%5C0<k%5Cleq%7Bd%7D,k%5Cin%5Cmathbb%7BZ%7D.%5Cend%7Barray%7D%5Cright.%5Cend%7Bequation%7D "\Large\parstyle \begin{equation}\left\{\begin{array}{c}sx_k = m + n * sin(i + k*\frac 1n), \\sy_k = y_1 + k, \\0<k\leq{d},k\in\mathbb{Z}.\end{array}\right.\end{equation}")

这样就定义红色曲线的轨迹方程。当然屏幕上的点是离散。只能是整数。需要对sx的值取整，这个调用`Math.round(double d)`就可以实现四舍五入，另外d也是这轨迹上所有离散的点的个数。

接下来看蓝色的轨迹，很明显是条直线。其方程也一目了然。

![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5CLarge%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Csetcounter%7Bequation%7D%7B1%7D%5Cbegin%7Bequation%7D%5Cleft%5C%7B%20%5Cbegin%7Barray%7D%7Bc%7Dlx_k%20=%20x_3,%20%5C%5Cly_k%20=%20y_1%20+%20k,%20%5C%5C0<k%5Cleq%7Bd%7D,k%5Cin%5Cmathbb%7BZ%7D.%5Cend%7Barray%7D%5Cright.%5Cend%7Bequation%7D "\Large\parstyle\setcounter{equation}{1}\begin{equation}\left\{ \begin{array}{c}lx_k = x_3, \\ly_k = y_1 + k, \\0<k\leq{d},k\in\mathbb{Z}.\end{array}\right.\end{equation}")

最后看下橙色的轨迹，其实就是对正弦函数取绝对值得到的曲线。实际上，是可以不用进行正弦计算的，因为我们已经计算好保存在sx里了。利用sx我们可以得到橙色轨迹的方程如下，当然这里是建立在![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Ccolorbox%5Brgb%5D%7B0.067,0.067,0.067%7D%7B%24y_1=y_3%24%7D "y_1=y_3")的前提下。

![](http://www.forkosh.dreamhost.com/mathtex.cgi?%5CLarge%5Cparstyle%5Ccolor%5Brgb%5D%7B0.73,0.73,0.73%7D%5Csetcounter%7Bequation%7D%7B2%7D%5Cbegin%7Bequation%7D%5Cleft%5C%7B%20%5Cbegin%7Barray%7D%7Bc%7Dbx_k%20=%20x_3%20+%20%7Csx_k-x_1%7C,%20%20%5C%5Cby_k%20=%20y_1%20+%20k,%20%20%5C%5C0<k%5Cleq%7Bd%7D,k%5Cin%5Cmathbb%7BZ%7D.%5Cend%7Barray%7D%5Cright.%5Cend%7Bequation%7D "\Large\parstyle\setcounter{equation}{2}\begin{equation}\left\{ \begin{array}{c}bx_k = x_3 + |sx_k-x_1|,  \\by_k = y_1 + k,  \\0<k\leq{d},k\in\mathbb{Z}.\end{array}\right.\end{equation}")

现在就可以写出生成所有轨迹的点的集合的代码了，具体如下:



```java
final int m = 150;// 上下的边距
final int xpoints[];// 保存x坐标.因为y是递增的，规律简单，可以不用保存
final int dist = 200;// 两条曲线间的距离
final int y1 = m,
y2 = Toolkit.getDefaultToolkit().getScreenSize().height - m;
final int d = y2 - y1;
final double n = (y2 - y1) / (2 * Math.PI);
final int x1 = (Toolkit.getDefaultToolkit().getScreenSize().width - dist)
                / 2 - (int) Math.round(n);
final int x3 = x1 + dist;
xpoints = new int[d * 3];// 点的总量是d*3;
double i = -Math.PI;
int nn = 0;
while (nn < d) {
        xpoints[nn] = (int) Math.round(x1 + n * Math.sin(i));// 红色轨迹
        xpoints[d + nn] = x3;// 蓝色轨迹
        xpoints[2 * d + nn] = x3 + Math.abs(xpoints[nn] - x1);// 橙色轨迹
        nn++;
        i += 1 / n;
}
```

 接下来就是主角登场了。 

```java
final int speed=5;//休眠时间，就是是鼠标运动的速度
     try {
        Robot r = new Robot();//实例化一个Robot对象
        int tmpY= 0 ;
       while(true){
           if(nn>=d&&nn<=2*d)
        //为保持鼠标移动速度的一致，直线的距离要比两条曲线的距离短，而实际的关键点是一样多.所以每个关键像素的
           //停留时间都要缩短一下，当然1/2是不准确的估计.见@http://dourok.info/2010/08/316/最上面的红色公式.
               r.delay(speed/2);
           else
               r.delay(speed);
        r.mouseMove(xpoints[nn]，(tmpY+y1));//mouseMove移动的是绝对位置而不是相对位置
        tmpY=(tmpY+1)%(d);
        nn=(nn+1)%xpoints.length;//让鼠标不断循环的画轨迹
       }
    }catch (AWTException ex) {
        ex.printStackTrace();
    }
```


程序到此就完成了，直接放在main方法里就可以运行。请注意，程序无法退出,并且鼠标无法操作，要怎么结束呢?没错，任务管理器。嗯，确实挺无聊的。当Robot非但不无聊，还很强大，顺便一提delay()其实就是睡眠当前线程。Thread.sleep()一样。不过注意delay()里的参数是int。而且如果不在
0 到 60，000 毫秒的范围内，就会抛出错误。

还有另一个方法setAutoDelay()是设置Robot
在生成一个事件后睡眠的毫秒数。貌似该程序更适合用这个方法。如果问我为啥不用，我只能说，我写完程序后才发现。懒得改了。

Robot的强大还在于它不只能控制鼠标，键盘的任意行为，还有

public BufferedImage createScreenCapture(Rectangle
screenRect)这个方法用来获取屏幕在Rect区域内的图像。基本上有这个方法，做抓屏软件就不是什么问题了。

public Color getPixelColor(int x,int
y)这个方法是返回给定屏幕坐标处的像素颜色。是不是感觉更按键精灵的功能很相像。

可以得到当前屏幕的图像，又可以控制鼠标，键盘的行为，实际上，Robot就是经常被用来做远程操控软件的。在游戏开发中Robot也可以用来做鼠标强制居中，对这个类也是停留在刚刚认识的阶段。

[程序在此！](http://dourok.info/wp-content/uploads/2010/09/Robot.jar)
