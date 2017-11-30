---
title: SICP
date: '2016-07-30'
description:
type: draft ## 移除这个字段，笔记才会公开发布
widgets :
  math :
    enable : true

---

### 准备工作


https://github.com/DeathKing/Learning-SICP

#### 安装 `mit-scheme`

Arch 通过 aur 安装：[AUR (en) - mit-scheme](https://aur.archlinux.org/packages/mit-scheme/)

#### scheme 

安装后就可以进入 scheme 交互环境(REPL)了：

    `$ scheme`

scheme 脚本保存为 `.scm` 文件，可以通过下面命令允许 `.scm`

    `$ scheme < file.scm`

也可以通过 `(load "file.scm")` 加载 scm 文件。

http://www.kancloud.cn/kancloud/yast-cn

`(trace-entry func)`  可以跟踪函数执行了多长时间。

#### 答题

答题位置 `$RUHOH/media/sicp`

我们在适当的时候隐藏起一些细节，通过创造抽象去控制复杂性


### 第一章

#### 过程与数据

表达式（Expressions），包括基本的类型和基本过程 + * 等

用括号括起一些表达式为组合式，形成一张表，用于表示一个过程应用

如`(+ 1 2)`， 最左边的元素称为运算符，其他元素称为运算对象。

运算符放在最左边称为前缀表示（prefix notation）

#### 命名与环境

`(define size 2)` 定义一个变量，环境决定表达式中各个符号的意义

`(define size 2)` 并不是一个组合式，对 define 的求值并不是将 define 应用与两个参数，而是将 size 关联一个值， size 是一个符号，所以 define 是一种特殊形式（special forms）


#### 过程定义

    (define (<name> <formal parameters>)
        <body>)
        
<name> 是一个表示过程的符号


- 正则序求值，展开
- 应用序求值，代换，也就是将表达式传入过程，如果是组合式会求值后再传入


条件表达式

    (cond (<p1> <e1>)
          (<p2> <e2>)
          .
          .
          (<pn> <en>)
    )

表达式 p 是谓语解释为真假， e 是表达式， p、e 是一对表达式，p 是一个谓词（predicate），表示他的值可以解释为真或假


    (cond (<p1> <e1>)
          (<p2> <e2>)
          .
          .
          (else <en>)
    )
    
else 放在最后一条子句，相当于 default


if

    (if <predicate> <consequence> <alternative>)

<predicate> 为真，解释并返回 <consequence> 否则 <alternative>

#### 应用序和正则序

- 应用型：先求值再将值应用于函数
- 正则序：先

#### 过程抽象


**形式参数**（formal parameter），过程定义的参数称为形式，在过程调用之前，该参数只有形式，没有具体的值，如：


    (define (sum a b) (+ a b))
    
a，b 就是形式参数。

**实际参数**（actual argument），当过程被调用时，a、b 有了具体的值。这时的 a、b 就是实际参数。

**约束变量**（bound variable），过程的形式参数，为过程绑定（bind）的变量，称为约束变量，意思是约束变量只是一个占位符，他的名称是没有意义，在过程内可以替换为任意合法字符，在过程外部是不可见的。

相对约束变量，还有**自由变量**（free variable），自由变量是在过程调用外部上下文定义的变量，过程不能随意更改自由变量的名称，正是通过名称来指向自由变量

    (define (addb a) (+ a b))

a 是过程 addb 的约束变量，b 是自由变量。

内部定义，过程的内部也允许定义过程，称为子过程局部化，这样结构称为块结构（block structure），外部过程的形式参数 x，对于内部过程来说 x 是自由变量。x 作为实参传递时，子过程也能访问导相同的 x，这样的规则称为词法作用域（lexical scoping）



##### 牛顿迭代法求平方根


求平方根 a 的函数为 :`$f(x) = x^2-a$` 导数：`$f'(x) = 2x$`

函数上点 `$x_0$` 斜率函数: `$g_0(x) = f'(x_0)x+b$`，代入 `$(x_0, f(x_0))$` 得, `$f(x_0)=f'(x_0)x_0+b$` 

求得 `$b = x_0^2-a-2x_0^2  = -(x_0^2+a)$` 

代入 `$g_0(x) = 0$`，解得 `$x_1$` 

`$x_1$` 比 `$x_0$` 更靠近 `$\sqrt{a}$`，得出迭代式 `$x_{n+1} = \frac{x_n^2 + a}{2*x_n}$`

原理见：[求牛顿开方法的算法及其原理](http://www.guokr.com/question/461510/)

#### 递归


递归计算过程，需要保存过程调用深度

迭代计算过程（iterative process）

尾递归，等同于迭代，

递归过程(recursive procedure)与递归计算过程(recursive prcess)是不同的。递归过程，说明过程的定义中间接或直接地引用了本身，递归过程也可能产生迭代的计算过程。


#### 斐波那契的迭代计算法

    a<-a+b
    b<-a

令 `$a=Fib_1,b=Fib_0$`， 迭代 n 次后， `$a=Fib_(n+1), b=Fib_n$`


#### 阶（Order）

表示函数增长的速度，

高阶，低阶是两个函数比较而言的！ 在同一自自变量变化过程中 变化趋势的速度快慢不同！ 比如在趋于无穷时 lnx 比 x 变化快 所以是更高阶的无穷小！


#### 求幂

将 O(n) 转换为 O(logn)，当存在一个关系使得 T_n^2 = T_2n


#### 高阶函数

所谓高阶过程（Higher-Order Procedures），就是将过程作为参数，操作过程的过程。

    (define (identity x) x)
    
返回本身的函数，起名`identity`

习题 1.33 中文版是计算 a，b 间所有素数的和，英文版是计算所有素数的平方和。

##### lambda

lambda 与 define 同样的方式创建过程，除了无需提供过程名

    (lambda (formal-parameters) <body>)
    
lambda 返回过程本身

    ((lambda (x y z) (+ x y (square z))) 1 2 3)
    ;; 12

局部变量相当于块结构中的约束变量，所以使用 lambda 来约束变量便可以使用局部变量，比如需要设计过程：如果表达式 exp 等于 0 则返回 1 否则返回 exp 本身的值，如果没有局部变量：

    (if (= exp 0) 1 exp)
    
exp 需要被计算两次，如果使用 lambda 来绑定变量
    
    ((lambda (v) (if (= v 0) 1 v)) exp)

那么 exp 只计算一次。lisp 提供特殊形式 `let` 来绑定局部变量

    (let ((v exp))
        (if (= v 0) 1 v))

`let` 的一般形式

    (let ((<var1> <exp1>)
          (<var2> <exp2>)
          ...
        )
        <body>)

等价于
    
    ((lambda (<var1> <var2> ...)
        <body>
    ) <exp1> <exp2> ...)

所以 `let` 只是 `lambda` 的语法糖


##### 一等公民

- 可用用变量命名
- 可用作为过程参数
- 可作为过程返回值
- 可包含在数据结构中


Lisp 中过程是作为第一公民


### 第二章


#### 序对(pair)

- `cons`，取两个参数，构造一个序对 ex:`(define x (cons 1 2))`
- `car`，取地址部分，`Contents of Address part of Register` ex: `(car x) -> 1`
- `cdr`，取减量部分，`Contents of Decrement part of Register` ex: `(cdr x) -> 2`



数据抽象屏障

数据抽象方法使我们能推迟决策时间，而不会阻碍系统其他部分的工作进展


数据的过程性表示


通过嵌套 cons 形成的一个序对的序列称为一个表，`list` 是 Scheme 提供的一个方便构造表的基本操作。

    (list <a1> <a2> <a3> ... <an>)

等价于

    (cons <a1> (cons <a2> (cons <a3> (cons ... (cons <an> nil)))))
    

例如 `(list a b) = (cons a (cons b ()))`

`()` 在 mit-scheme 中表示 nil

#### 不定参数

    (define (f x y . z) <body>)
    
f 可传递大于等于 2 个参数，多出的参数作为列表存放于 z

#### 层次性结构

(cons (list 1 2) (list 3 4)) 可表示为树结构

`pair?` 用于判断变量是否为序对

高阶过程 `map`，表示将列表的各个元素应用于过程将结果形成新列表。

利用 `map` 和递归也能对层次性结构进行映射。





### Video

essence of computer science


计算过程（process）进行形式化描述

techniques for Controlling complexity



基本元素
组合的方法
抽象的方法，（封装）

