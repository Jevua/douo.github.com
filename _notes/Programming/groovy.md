---
title: Groovy
date: '2015-04-29'
description:
tags:
- groovy
type: draft ## 移除这个字段，笔记才会公开发布
---

### Groovy 的语法细节

Groovy 不是解释性语言，运行一个脚本时，会先编译为 .class 文件，再交给 JVM 运行。

1. groovy 文件先被 Groovy parser 解析为抽象语法树（AST）
2. groovy class generator 将 AST 生成为 bytecode，可能有一个或多个 class 文件
3. JVM 运行这些 class 文件

> What makes dynamic languages so powerful is their dynamic method dispatch.

Groovy 是一个可选类型的语言（optional type）

默认导入这些包

- java.io.*
- java.lang.*
- java.math.BigDecimal
- java.math.BigInteger
- java.net.*
- java.util.*
- groovy.lang.*
- groovy.util.*


方法调用不造成二义性时可以省略括号

#### 原生类型

groovy 所有原生类型都被当成对象处理，默认情况下浮点数会被当成 `BigDecimal` 处理



| Type               | Literal            |
| ------------------ |:------------------ |
| Integer            | 14, 0x123, 0b01    |
| Long               | 100L, 100l         |
| Float              | 1.23F, 1.23f       |
| Double             | 1.23d, 1.23D       |
| BigInteger         | 123g, 123G         |
| BigDecimal         | 1.23 1.4E4, 1.23g  |



#### 字符串文法

- `'` 表示普通字符串（String），不支持引用变量
- `"` 如果有引用变量则被当成 GString
- `"""`或 `'''` 同 `"`或 `'`，可用于表示多行文本


#### 操作符重载

和 Ruby 一样，Groovy 的操作符也是方法调用的简化，比如 `1 + 2` 等于 `1.plus(2)`，所以操作符可以用于任何对象上面。 当然我更喜欢 Ruby 的形式  `1.+ 1`

[The Apache Groovy programming language - Operators](http://groovy-lang.org/operators.html#Operator-Overloading)

#### 集合

##### 列表

`[]` 不是创建数组，而是创建一个空列表

支持和数组一样的下标访问，支持负数下标，表示倒数第几个

比较奇怪的是一些列表的操作方法（each、find、collect、etc）都是定义在对象类里的：[Object (Groovy JDK enhancements)](http://docs.groovy-lang.org/latest/html/groovy-jdk/java/lang/Object.html)

- collect = map
- inject = reduce

`+` 为列表添加元素会创建一个新列表，而 `<<` 则添加进元列表

`*[]` 可以展开列表

##### Range

可以用 `..`(`[]`) 或 `..<`(`[)`) 创建序列的值。

也可以用于裁剪列表

这个操作可以用于对象，只要对象

1. 实现了 next 和 previous 方法
2. 实现了 Comparable 接口

##### `*.` 操作符

`obj*.xxx  == obj.collect{it.xxx}`


##### Map

用 `[:]` 创建 Map。[key:val]，key 在这里表示文字，等同于字符串"key"，所以要表示变量需要用括号转义`(key)`，括号内的内容会被当成表达式。

    def a = 'Bob'
    def ages = [a: 43]
    assert ages['Bob'] == null // `Bob` is not found
    assert ages['a'] == 43     // because `a` is a literal!
    
    ages = [(a): 43]            // now we escape `a` by using parenthesis
    assert ages['Bob'] == 43   // and the value is found!


`*:[:]` 可以展开 map

#### 流程控制 

任何非 void 对象都可以用于流程控制语句，作为条件判断。取值用的是 `Object#asBoolean`

switch 语句：

    switch (candidate) {
      case classifier1 : handle1() ; break 
      case classifier2 : handle2() ; break
      default : handleDefault()
    }

等同于

    if (classifier1.isCase(candidate)) handle1() 
    else if (classifier2.isCase(candidate)) handle2()
    else handleDefault()

所以 switch 语句也可用于任意对象中

##### in 操作符

a in b，相当于 b.isCase(a)

#### 类

对于类成员变量的访问，可用用下标操作符`[]`与`.`操作符可以互通，['str'] 等同于调用 `get(String)`，[int] 等同于调用 `getAt(int)`

用 `.@` 可以避免`.`与`[]`和 accessor 的互通，直接访问字段。

实例化对象也有几种方法

    def first = new VendorWithCtor('Canoo','ULC')
    def second = ['Canoo','ULC'] as VendorWithCtor
    VendorWithCtor third = ['Canoo','ULC']


##### 类文件

1. `.groovy` 文件可以没有类声明，groovy 会生成一个 Script 的子类，并把文件的内容放入 run 方法内。这个 Script 子类里面还会生成一个 main 方法作为入口。
2. `.groovy` 文件可以有多个 public 类声明，文件名不必和类名相同
3. 可以混合两者

##### trait

[Traits](http://docs.groovy-lang.org/next/html/documentation/core-traits.html) 可以被看作是具有方法实现和状态的接口，使用`trait`关键字定义。而且 trait 可以在运行时动态插入实例，类定义的时候用 `implements` 和接口一样引入 trait。

- 一个类可以实现多个trait。
- 实现类可重写trait中的默认方法。
- trait可以继承另一个trait使用关键字extends，若要继承多个则使用implements关键字。
- 可以在运行时动态实现trais，使用关键字as。

##### Expando

Map 与 Expando 的区别

    a = new Expando()
    a.b = 1
    a.c = {println it+b} 
    a.c(1) // 2
    
    a = [:]
    a.b = 1
    a.c = {println it+b}
    a.c(1) // 报错，找不到 b


#### MOP

每当Groovy调用一个方法时，它不会直接调用它，而是要求一个中间层来代替它。  中间层通过钩子允许我们更改方法调用的行为。这个中间层就是 MOP（meta object proctol），MOP 作为方法派发的中心枢纽提供动态编程的能力。MOP 是 Groovy 运行时系统如何处理方法调用请求的规则的集合，以及如何控制中间层。在 Groovy 中编写的每个方法调用是真正的调用MOP，无论调用目标是使用 Groovy 还是 Java 进行编译。 这同样适用于静态和实例方法调用，构造函数调用和属性访问，即使目标是与调用者相同的对象。如果是在 java 中的方法调用，groovy 的动态性就无法发挥作用了。


MOP需要大量信息才能为其服务的每个方法调用找到正确的调用目标。 该信息存储在所谓的 MetaClass 中。


MOP 做的事情大概就是对于每个方法调用，检查目标对象是否有对应的方法，如果没有则将调用转移给钩子方法：

##### 钩子方法（hook）

1. `Object methodMissing(String name, Object arguments)`
2. `Object propertyMissing(String name)`

##### metaClass

所有由 Groovy 编译的类都实现 GroovyObject 接口，这个接口有如下几个方法

- `MetaClass getMetaClass()`
- `void      setMetaClass(MetaClass metaClass)`
- `invokeMethod(String methodName, Object args)`
- `Object getProperty(String propertyName)`
- `void setProperty(String propertyName, Object newValue)`

MOP 有如下特性

- 每一次访问属性等同于调用 getProperty 方法
- 每一次修改属性等同于调用 setProperty 方法
- 每个未知方法的调用都调用 invokeMethod 方法。 如果该方法是已知的，那只有当类实现GroovyObject和标记接口GroovyInterceptable时，才调用invokeMethod 方法

具体的实现由 MetaClass 代理，GroovyObject 只是调用 MetaClass 中相同的方法而已。

    `getMetaClass().invokeMethod(this, "foo", EMPTY_PARAMS_ARRAY)`
    


每个类都有一个对应 metaclass 实例给类的实例共享。 metaclass 维护了类的方法和属性和一部分附加方法：[DefaultGroovyMethods (groovy 2.4.0 API)](http://docs.groovy-lang.org/2.4.0/html/gapi/org/codehaus/groovy/runtime/DefaultGroovyMethods.html)。这样我们才可以在类的方法体内调用 println 之类的像关键字一样的方法。

也可以单独为一个实例设置 MetaClass。

metaclass 有几种

1. MetaClassImpl
2. ExpandoMetaClass
3. ProxyMetaClass


ExpandoMetaClass，可以动态扩展属性和方法。如果修改通过 metaClass 给一个类扩展属性或方法。那么这个类的 metaClass 会变成 ExpandoMetaClass

    assert String.metaClass =~ /MetaClassImpl/
    String.metaClass.low    = {-> delegate.toLowerCase() }
    assert String.metaClass =~ /ExpandoMetaClass/
    assert "DiErK".low() == "dierk"


ProxyMetaClass，代理模式，可以在方法的调用前后插入代码。

##### Monkey patch

groovy 用自定义 metaclass 来实现 monkey patch。ruby 用打开类来实现，并用 `refine` 来限定 monkey patch 的作用域域。

而 groovy 用的是 `Object#use(CategoryClass,Closure)`

CategoryClass 里面的静态方法：

    static ReturnType methodName(Receiver self, optionalArgs) {...}

在 Closure 作用域中会被变成 

    ReturnType methodName(optionalArgs) {...}

比如 `TimeCategory`，为 Integer 扩展了很多方法

    use TimeCategory, {
        Date   xmas = janFirst1970 + 1.year - 7.days
        assert xmas.month == Calendar.DECEMBER
        assert xmas.date  == 25
    }


另外还可以用 [module descriptor](http://groovy-lang.org/metaprogramming.html#module-descriptor)


用 `@Category` 注解：

    @Category(Integer)
    class IntegerMarshal {
       String marshal() {
         toString()
       } 
    }



#### 闭包

> Java has no concept of “a particular piece of code” unless it’s buried in a method.
> each piece of code needs its own (pos- sibly anonymous) class, and life gets very messy.

方法可以当成闭包：

    def c = receiver.&method

方法会被 MethodClosure 包起来，对于方法重载，groovy 会根据不同参数，在运行时判断调用哪个方法。

闭包的调用可以为`c.call()`或`c()`

闭包参数可以声明默认值：`{x=1 -> println x}`

闭包有一个函数来实现柯里化：`c.curry(...params)`

    def mult = { x,y - >return x*y }
    def twoTimes = mult.curry(2)
    assert twoTimes(5) == 10

it 闭包内预定义的变量，表示传入闭包的第一个参数。

##### 作用域

局部变量，会在声明期（declaration time）绑定到闭包里，所以局部变量会和 Closure 的实例变量一样优先被解析。不过如果局部变量和 Closure 的实例变量声明相同的名字调用改变量时会报错。

若不是上述变量，则会在，下面三个引用中查找。

1. this，表示声明闭包时所在外部的类，this 等同于 getThisObject() 也可简化为 thisObject
2. owner, 表示声明闭包时所在外部的对象，可以是闭包或者是类
3. delegate, 可以在运行时更改的一个引用，默认等于 owner

默认情况是 OWNER_FIRST，不过可以通过 Closure#resolveStrategy 进行配置。而 this 总是最后解析的。见 [The Apache Groovy programming language - Closures](http://groovy-lang.org/closures.html#closure-this)

groovy 对早返回比较无力，不像 ruby 有 Proc 和 lambda 的区别

#### Annotations

#### 正则表达式

语言级别支持 

- `//` 表示正则表达式，不过只是字符串，`~//` 才是 Pattern
- `=~` find
- `==~` match

#### AST

### Groovy 的最佳实践

http://groovy-lang.org/groovy-dev-kit.html
