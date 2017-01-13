---
date: '2011-05-28'
title: System.in的困惑
tags:
- Java
- System.in
categories:
- coder
meta:
  _edit_last: '1'
  _wp_old_slug: a_puzzle_of_system-in
postid: '519'
guid: http://dourok.info/?p=519
---
先看下下面代码先 

```java
static class Thread1 extends Thread {
        @Override
        public void run() {
            try {
                InputStream in = System.in;
                OutputStream out = System.out;
                int i = 0;
                while ((i = in.read()) != -1) {
                    out.write(i);
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
```


这段代码很正常，线程跑起来的结果和你想的一样，在终端上输入一行，按下回车就回显这一行，显然System.in是行缓冲的(linebuffered)，不是像getch那样输入一个就回显一个。在没有按下回车之前in.read()就一直阻塞。
再来看下这一段代码 

```java
static class Thread2 extends Thread {
        @Override
        public void run() {
            try {
                InputStream in = System.in;
                OutputStream out = System.out;
                byte buffer[] = new byte[10];
                int i = 0;
                    while ((i=in.read(buffer))!=-1) {
                        out.write(buffer, 0, i);
                    }
            } catch (IOException ex) {
               ex.printStackTrace();
            }
        }
    }
```


Thread2跑起来结果跟Thread1一模一样，输入一行回显一行，但代码却有点区别，多了`byte buffer[] = new byte[10];`这是一个缓冲，读取的时候不是一次一个字节了，而是`in.read(buffer)`，这个方法等同于`in.read(buffer, 0, buffer.length)`，也就是说要先把buffer读满，read方法才会结束。然后我困惑了，Thread2运行起来竟然Thread1一模一样。如果你输入abc然后回车，Thread2也会立刻回显abc。这时候的字节数只有4还没把buffer填满，但in.read(buffer)却返回了，我参考了文档对InputStream中read(byte[]
b, int off, int len) 的说明：

> ...将输入流中最多 len 个数据字节读入字节数组。尝试读取多达 len
> 字节，但可能读取较少数量。以整数形式返回实际读取的字节数。
> 在输入数据可用、检测到流的末尾或者抛出异常前，此方法一直阻塞。...

前一句又「尝试"又"可能"的，太模糊暂时忽略，第二提出了不阻塞的情况，看似除了「输入数据可用」理解有点模糊外，其他都明显不符合，那理应阻塞的方法是什么原因让它提前返回呢？带着这个疑问，我看了下InputStream的源码，并在Thread3中实现了一个一模一样的方法（如文档所说的，就是反复调用read()）：


```java
static class Thread3 extends Thread {
       static int read(InputStream in, byte b[], int off, int len) throws IOException {
        if (b == null) {
            throw new NullPointerException();
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }
        int c;
             c= in.read();
            if (c == -1) {
                return -1;
            }
        b[off] = (byte) c;

        int i = 1;
        try {
            for (; i < len; i++) {
                    c = in.read();
                    if (c == -1) {
                        break;
                    }
                b[off + i] = (byte) c;
            }
        } catch (IOException ee) {
        }
        return i;
    }
        @Override
        public void run() {
            try {
                InputStream in = System.in;
                OutputStream out = System.out;
                byte buffer[] = new byte[10];
                int i = 0;
                    while ((i=read(in,buffer,0,buffer.length))!=-1) {
                        out.write(buffer, 0, i);
                    }
            } catch (IOException ex) {
               ex.printStackTrace();
            }
        }
    }
```


Thread3跑起来果然跟Thread2不一样，算是比较可理解了，不管你按下多少次回车，只有但buffer读满了，read(in,buffer,0,buffer.length)才会返回。当然这并不是说明System.in有什么问题，System.in必须是InputStream的子类，read(byte[]
b, int off, int len)
被重载，必须的。我只是好奇它到底是怎么实现的，在Thread4我做了一些尝试：


```java
static class Thread4 extends Thread {
       static int read(InputStream in, byte b[], int off, int len) throws IOException {
        if (b == null) {
            throw new NullPointerException();
        } else if (off < 0 || len < 0 || len > b.length - off) {
            throw new IndexOutOfBoundsException();
        } else if (len == 0) {
            return 0;
        }
        int c;
             c= in.read();
            if (c == -1) {
                return -1;
            }
        b[off] = (byte) c;

        int i = 1;
        try {
            for (; i < len; i++) {
                if (in.available() > 0) {
                    c = in.read();
                    if (c == -1) {
                        break;
                    }
                } else {
                    break;
                }
                b[off + i] = (byte) c;
            }
        } catch (IOException ee) {
        }
        return i;
    }
        @Override
        public void run() {
            try {
                InputStream in = System.in;
                OutputStream out = System.out;
                byte buffer[] = new byte[10];
                int i = 0;
                    while ((i=read(in,buffer,0,buffer.length))!=-1) {
                        out.write(buffer, 0, i);
                    }
            } catch (IOException ex) {
               ex.printStackTrace();
            }
        }
    }
```


在in.available()永远有效且准确的前提下这个方法就跟System.in一样了，但我觉得这个前提很无力啊，但实际System.in它的实现是怎样的呢，还有为什么？

希望能在[深入理解计算机系统](http://book.douban.com/subject/1230413/)找到答案，

最近看开始这本书，太棒了，才看第一章就对它入迷了，大学时代与它失之交臂真是遗憾啊。。。。啊。。。
