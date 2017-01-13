---
date: '2010-12-30'
title: Groovy初接触
tags:
- Groovy
- Java
- 闭包
categories:
- coder
meta:
  _edit_last: '1'
  _aioseop_title: Groovy初接触
  _aioseop_description: Groovy:77484ms，没错，你没看错是5位数，77秒！几乎是java版的110倍。天啊，这也忒慢了吧，是不是我触犯了什么禁忌啊，很可能出现在列表结构上面
  dsq_thread_id: '796842606'
  _aioseop_keywords: Groovy,groovy efficiency,groovy closure,groovy闭包,groovy效率
  _wp_old_slug: groovy_introduce
postid: '446'
guid: http://dourok.info/?p=446
---
### Groovy

Groovy是一种运行在Java虚拟机上的脚本语言，语法相比java起来简单很多。而且完全支持Java语法，这个不知道是不是好事，写习惯groovy再去写java会不会很容易混淆？所有Java的库都可以在Groovy上使用，可以说跟Java是互通的。Groovy的就是一跑在jvm上的脚本语言嘛，Groovy的代码最后也要被编译成为jvm上的字节码。

一直都打算学一种脚本语言来写脚本和小程序的，本来是用python的，用了几天，一放松又用回Java了。Java虽然库比较熟悉，代码比较亲切，但是用来写脚本还是太繁琐了。接触都Groovy后，感觉就是它了，有脚本语言的语法和Java的库，对于会Java的人来说，学习Groovy几乎是零成本的！

官网:[http://groovy.codehaus.org](http://groovy.codehaus.org)
（二级域名...orz） 装Groovy前要先安装好Java环境。 Groovy的环境配置：

文档方面:英文的该有还是有的.中文的就比较稀少了.
netbeans下有个Groovy插件挺好用的，在同一个项目里Groovy文件可以跟java文件混用

groovy没有强制分号
groovy也没像python那样的强制缩进.还是得用花括号，这个比较可惜。

Groovy 默认导入了下面这些包

java.io.\*

java.lang.\*

java.math.BigDecimal

java.math.BigInteger

java.net.\*

java.util.\*

groovy.lang.\*

groovy.util.\*

「==」操作符，不再比较引用，如下面的的代码输出2个true



```groovy
a = new String("wtf")
b = new String("wtf")
println a == b
println a.equals(b)
```

 `Output:true
true
`
正则表达式也有独立的操作符，正则表达式要用两个斜杠包围起来。 是否匹配
==\~ 如 `println "potatoe" ==~ /potatoe/` `Output:true` 匹配结果 =\~\
会返回一个相当于java.util.regex.Matcher的对象。

### 闭包(Closure)

用python的时候还没用过闭包，毕竟是没接触过的特性所以有股阻力，Lisp则是想学还没动手，所以学Groovy也算是我第一次接触闭包了。

闭包就像这样 `s = {println it}` 一个变量名 指向一个代码块 调用s(5)
就会打印出 5 官方帮助的例子是



```groovy
square = { it * it}

println square(9)
```



`Output:81`

闭包也可以当成方法的参数去传递； 如 `[ 1, 2, 3, 4 ].collect(square)`
闭包在java成面就是groovy.util.Closure这个类，
所以可以这样传递还可以理解。 关于闭包的参数；
默认一个参数就是it，可以不用声明直接用便可。
多于一个参数可以用下面这种方式来指定参数列表 `closure = {a,b,...n ->  code}
closure(a,b,...n)`
还可以匿名`[ "yue" : "wu", "lane" : "burks", "sudha" : "saseethiaseeleethialeselan" ].each(
{
key, value -> println key + "=" + value
})` 闭包匿名的时候可以省略括号
`[ "yue" : "wu", "lane" : "burks", "sudha" : "saseethiaseeleethialeselan" ].each
{
key, value -> println key + "=" + value
}`

还可以这样写 

```groovy
n = 5;
({
for(int i in 1..100)
println i*n
}).call()
```

 闭包内部可以调用其外部的变量
这个如何实现的也很好奇啊 在官网上的例子还看过这么一个用法


```groovy
def groovyImage = new GroovyImage();
def argAndClosure = ['-d':{groovyImage.srcDir = new File(it)},
'-q':{groovyImage.outputPattern = it},
'-p':{groovyImage.pattern = it},
'-h':{groovyImage.help()}];
```

 闭包当成Map的Value，直接Map[key].call()果然很方便。

看了一天目前知道的差不多就这些，刚接触闭包，概念还待慢慢理解；Groovy其他的特点还待慢慢发掘。

### Groovy的效率

最后再看看Groovy的效率如何，分别在Java、Python、Groovy上写了个生成素数表的方法，代码几乎一致。
Java： 

```java
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package org.dou.euler;

import java.util.ArrayList;

/**
 *
 * @author DouO
 */
public class Prime {
 public static ArrayList<Long> primes = new ArrayList<Long>(100);
    public static void buildPrimeTable(int n){
        primes.add(2L);
        primes.add(3L);
        int k = 2;
        long s = 5;
        for (int i = 0; i < n-2; i++) {
            int j = 0;
            int q = (int) Math.ceil(Math.sqrt(s));;
            while (j < i ) {
                if (primes.get(j)<=q&&s % primes.get(j) == 0) {
                     s+=k;
                     k = (k+k)%6;
                     q = (int) Math.ceil(Math.sqrt(s));
                      j = 0;
                } else {
                    j++;
                }
            }
            j = 0;
            primes.add(s);
            s+=k;
            k = (k+k)%6;
            q = (int) Math.ceil(Math.sqrt(s));
        }
    }
    public static void main(String[] args) {
        long t = System.currentTimeMillis();
        buildPrimeTable(10001);
        System.out.println(System.currentTimeMillis() - t);
        System.out.println(primes.get(10000));
    }
}
```

 Python: 

```python
import math
import time
primes = []
def buildTable(n):
#    if(len(primes)<=0):
#        primes.append(2)
#        sindex = 1;
#    else:
#        sindex = len(primes+1);
    primes.append(2)
    primes.append(3)
    s = 5
    k = 2
    for i in range(0,n):
        j=0
        q = int(math.sqrt(s)+0.5)
        while(j<i):
            if(primes[j]<=q and s%primes[j]==0):
                s+=k
                k=(k+k)%6
                q = int(math.sqrt(s)+0.5)
                j=0
            else:
                j+=1
        primes.append(s)
        s+=k
        k=(k+k)%6
        q = int(math.sqrt(s)+0.5)

time.clock()
buildTable(10000)
print primes[10000]
print time.clock()
```

 Groovy:


```groovy
primes = []
def buildPrimeTable(n){
    primes.add(2)
    primes.add(3)
    s = 5
    k = 2
    for(i in 0..n-2){
        j = 0
        q = (int) Math.ceil(Math.sqrt(s))
        while(j<i){
            if(primes[j]<=q && s%primes[j]==0){
                s+=k
                k=(k+k)%6
                q = (int) Math.ceil(Math.sqrt(s))
                j = 0
            }else{
                j++;
            }
        }
        primes.add(s)
        s+=k
        k = (k+k)%6
        q = (int) Math.ceil(Math.sqrt(s))
    }
}
t = System.currentTimeMillis()
buildPrimeTable(10000)
println System.currentTimeMillis() - t
println primes[10000]
```

 以生成前10000位素数为例，结果如下：
Java:718ms，表现不错。
Python:8833ms，8秒，java的10倍，也可能是我代码写的不好。
Groovy:77484ms，没错，你没看错是5位数，77秒！几乎是java版的110倍。天啊，这也忒慢了吧，是不是我触犯了什么禁忌啊，很可能出现在列表结构上面，下次再弄清楚啦。
