---
title: Kotlin Note
date: '2018-06-14'
description:
tags:
- kotlin
---

- 静态类型
- 类型推定

Kotlin 哲学，务实、简洁、安全、与 java 互操。

没有 `static` 关键字

## 运算符


`*[...]` spread operator

## 变量

- `val`，value，常量
- `var`，variable，变量

调用构造方法可以不用 `new` 关键字。

### 字符串

字符串模板，`"Hello $name You age is ${a+b}"`

使用三双引号，必要避免正则表达式转义：`"""regex"""`




## when

## 整合类型检查与转换

    if (e is Num) {
        // e 自动当成 Num
        //val n = e as Num
    }

## range 语法糖

    for(i in 1..100) // [1,...,100]
    for(i in 100 downTo 1 step 2) [100,98,...,2]
    for(i in 1 until 100) [1,...,99]

## fun

参数支持默认参数，和指定参数名


monkey patch:  `receiverClass.newFun()`  为 `receiverClass` 增加一个实例方法


- `vararg` 声明一个参数是可变长度的
- `infix` 声明一个函数，可以使用 ruby 那样的函数调用方式，方法名称立即放置在目标对象名称和参数之间，没有额外的分隔符。 `1 to 2`


局部函数

    fun a(){
       fun b(){}
    }

## Returns and jumps


```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

``` kotlin
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        // lambda 内的 return 默认是返回外部函数
        if (it == 3) return@lit // local return to the caller of the lambda, i.e. the forEach loop
        print(it)
    }
    print(" done with explicit label")
    
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // local return to the caller of the lambda, i.e. the forEach loop
        print(it)
    }
    print(" done with implicit label")
}
}
```

如果是带有返回值的`return@a 1`:"return `1` at label `@a`"


    
## 集合

- Kotlin没有定义自己的集合类，而是通过扩展函数和属性使用更丰富的API来增强Java集合类。

## 类

复写方法需要用修饰符 `override`

super 使用尖括号，来指定方法所属的父类 `super<Father>.name()`

kotlin 的继承的看法来自 Effective Java：

> design and document for inheritance or else prohibit it.

`open` 关键字修饰的类和方法才可以被继承和重写。

`override` 修饰的方法，同意继承父类方法可以被继承，需要 `final** 关键字修饰

### 访问控制修饰符

与 java 的区别有：

1. 默认是 public
2. internal 对应 java 的默认（package）
3. protected 不再拥有包范围内的可访问性
4. 外部类看不到内部类的私有成员，内部类默认不持有外部类的引用，除非用`inner`关键字修饰。使用`this@Outer`，访问外部类


### sealed 

    sealed class Expr {
        class Num(val value: Int) : Expr()
        class Sum(val left: Expr, val right: Expr) : Expr()
    }
    
可以限制子类，Expr 只能被 Num 和 Sum 继承。

### 构造函数

直接在 `class` 关键字后定义构造函数

    class User(val nickname: String)

这称为**主构造函数（primary constructor）**，既定义了构造函数的参数，同时参数也被定义为类的属性。等同于如下代码：

    class User constructor(_nickname: String) {
        val nickname: String
        init {
            nickname = _nickname
        } 
    }
    
主构造函数不能有函数体，所以需要 init block.

`constructor` keyword begins the declaration of a primary or secondary constructor. The `init` keyword introduces an initializer block.

kotlin 通过 `constructor` 关键字定义构造函数。跟在类名后定义的构造函数称为主构造函数，在类内部定义的构造函数称为次构造函数（secondary constructors）。

    class MyButton : View {
        constructor(ctx: Context)
            : super(ctx) {
    // ... }
        constructor(ctx: Context, attr: AttributeSet)
            :  super(ctx, attr) {
            // ...
            } 
    }

是否调用父类方法，采用了与继承相同的操作符`:`，如果是调用本类的其他方法，也是接在 `:` 后面，使用 `this` 关键字。


### Backing Field

`field` 关键字，用在 getter 和 setter 的作用域中，表示当前成员变量实际存储字段的访问，避免递归调用。

    class User{
        var firstName : String  
            get() = field
            set(value) {field = value}
        
       var lastName : String  
            get() = field
            set(value) {field = value}
    }

### data classes


    data class Client(val name: String, val postalCode: Int)
    
`data` 修饰的类，kotlin 会针对各个属性，生成 `equals`、`hashCode`、`toString` 等方法。
对于不可变的 data 类，还提供一个 `copy` 方便修改生成新实例。

### class delegation

kotlin 可以直接实现装饰器模式，通过 `by` 关键字。

    class DelegatingCollection<T>(
            innerList: Collection<T> = ArrayList<T>()
    ) : Collection<T> by innerList {
    
### object 关键字

`object` 定义一个类，并产生一个实例。实际是为该类生成一个 `INSTANCE** 常量。

- 用于定义单例，定义的**同时**便创建实例。没有构造函数，因为没有意义。
- `companion** 伴生对象，定义在类内部，可以访问类的私有变量，等同于类的静态方法。（kotlin 没有了 static 关键字）。可或不匿名。
- 用于定义内部匿名类。不是单例，每次定义代码执行都会创建一个**新实例**

### 标准库方法

- run
- let
- apply
- also
- with

![](https://user-gold-cdn.xitu.io/2018/1/24/16123d48e78959f5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

另外还有 

- repeat
- takeIf
- takeUnless

## lambda

- 标准语法：`{x: Int, y: Int -> x + y}`
- 省略`{ expr }`
- 默认参数名，`{ it }`，与 groovy 相同
- 成员引用（member ref）,`Class::Member`，对于非类函数可以这样引用：`::fun`，构造函数: `::Class`，绑定引用: `instance::fun`

调用 lambda，

- `{ expr }()`
- infix `run` 方法：`run { expr }`
- 如果方法只有一个 lamdbda 参数，可以将 lambda 放在方法调用后面，如果仅有一参数还可以可省略方法调用的括号：`people.maxBy { it.age }`

lambda 通用具有闭包的特点，捕获定义时的上下文变量，只不过比起 java 只能捕获 `final`，kotlin 捕获的变量是可以修改的。kotlin 实现原理实际是使用一个 Wrapper 类。



### Sequences

java 8 的 `Stream`，懒操作

    people.asSequence()
        .map(Person::name)
        .filter { it.startsWith("A") }
        .toList()
        
`generateSequence`创建序列

### receivers

通过 `with` 和 `apply` 方法可以设置 lambda 的 receiver。

    with(instance){
      this // instance
      func // instance.func
    }
    
    instance.apply{
      // same
    }
    
### 高阶函数

#### inline

mark a function with the inline modifier, the compiler won’t generate a function call when this function is used and instead will replace every call to the function with the actual code implementing the function.

内联函数支持非本地返回

`noinline`，标记内联函数的 lambda 参数不可内联
`crossinlne` ，标记内联函数的 lambda 参数不可局部返回

## 类型系统

### nullable

Kotlin 的类型不允许空， `Type? = Type or null`

- `?.`，safe-call。`s?.toUpperCase()`
- `?:`，猫王运算符（Elvis oerator）。`a?:0"`，`a` 不为空返回 `a` 否则返回 `0`
- `as?`，safe casts。`foo as? Type`，等于 `foo as Type` 或 `null`
- `!!`，非空检查。`sNotNull:String = s!!`，等于 `s` 或抛出 NPE(`KotlinNullPointerException`)
- `let`，实例方法传入 `lambda`，在 lambda 中绑定该实例。`foo?.let{ ...it... /*not null*/}`，为空的时候 lambda 不执行
- `lateinit`  关键字，允许定义变量未初始化，初始化前使用会抛出异常。`private lateinit var myService: MyService`

### 基本类型

- `Int` 一般情况被编译为 java 的原生类型，除非是作为类型参数，会被当做 `Integer`。相同的还有包括其他 java 原生类型
- 可空类型的原生类型也会被当成原型类
- `Any`，是所有非空类型的超类。
- `Unit` java 中的 `void`。可用于声明函数无返回值：`fun f(): Unit{}`。
- `Nothing` 表示没有返回值。


### 操作符重载


#### conventions

``` kotlin
data class Point(val x: Int, val y: Int) {
  operator fun plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
  } 
}
```

也可以定义为扩展函数
```kotlin
operator fun Point.plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
}
```

操作符重载支持不同类型，但 kotlin 不能主动实现交换律，即便运算是可交换的。

#### compound assignment operators.

`+=` 对于 `plusAssign`，`-=` ...

#### 一元运算符

一元运算符也可以重载

#### 相同判断

`a==b` 等价于 `a?.equals(b) ?: (b == null)`

`===`  identity equals。判断是否是相同对象，**不可被重载**

#### a[b] index operator

与 ruby 一样

- `[]` get,正常多参数 x[a,b] 等价于 x.get(a,b)
- `[]=` set

#### destructuring declarations.

`val (a,b) = p`  等价于  `val a = p.component1() val b = p.component2()`，对于 data 类来说 1、2 就是成员属性定义的顺序。对于非 data 类，也可以手动声明

``` kotlin
class Point(val x: Int, val y: Int) {
    operator fun component1() = x
    operator fun component2() = y
}
```


 
### 泛型

未加限制的泛型默认是可为空的，等价于`Any?`

#### Reified（具体化）

Reified(具体的) type parameters，

     inline fun <reified T> isA(value: Any) = value is T

可以在函数体类型变量进行检查，类型变量不会被擦除。可以进行如下操作。

- In type checks and casts (is, !is, as, as?)
- To use the Kotlin reflection APIs, as we’ll discuss in chapter 10 (::class) 
- To get the corresponding java.lang.Class (::class.java)
- As a type argument to call other functions

`reified` 关键字只能用于内联函数


``` kotlin
val items = listOf("one", 2, "three")
println(items.filterIsInstance<String>())
[one, three]
```

#### 可变性

非空类型是可空类型的子类型，`A` 是 `A?` 的子类型

- 协变，A 是 B 的子类型，f(A) 是 f(B) 的子类型（满足里氏替换原则），则称 f() 是协变的。参数类似是协变的，在kotlin 用 `out` 修饰，表示类只会产出 `out` 类型的对象，而不能消费。
- 逆变，
- 不变

      
      interface Function1<in P, out R> {
        operator fun invoke(p: P): R
      }
 
      val f = object : Function1<Number, String> {
        override fun invoke(p: Number): String = p.toString()
      }
      //P 是逆变，Int 是 Number 的子类型，
      //R 是协变，Any 是 String 的父类型
      //所以 Function1<Int, Any> 是 Function1<Number, String> 的父类型，满足里氏替换。 
      var f2 : Function1<Int, Any> = f
 
declaration-site variance，在类定义的时候使用 `interface Function1<in P, out R>`。use-site variance，  java 的  `? extends` `? super`  每次使用类型变量的时候都可以声明，kotlin 可以在返回值声明 `out`，参数声明 `in`

#### `<*>` Star projection

>> star-projection syntax you can use to indicate that you have no information about a generic argument.

>> MutableList<*> is a list that contains elements of a specific type, but you don’t know what type it is.

以 Function1 为例 `Function1<*, *>` 被编译器认为是 `Function1<in Nothing,out Any?>`。
如果不依赖特定的参数化类型的话，就可以使用`<*>`，可避免使用 use-site variance 

    fun printFirst(list: List<*>) {
        if (list.isNotEmpty()) {
            println(list.first())
        }
    }



### DSL

- reciever
- invoke



### Coroutines

避免 callback hell

``` kotlin
requestToken
createPost
processPost
```



Future/Promise/Rx

避免学太多 combinator

#### suspending functions

composition

#### coroutine buidle

- launch 

#### async / await

async/await 是 C# 家族的设计，

kotlin 用的是 `suspend` 关键字，

- 避免 await 关键字，
- 不返回 future
- 为模仿序列化的执行而设计 by default 

async 在 kotlin 只是一个方法，await 是 `Deferred` 的方法

#### coroutines

#### java interop

#### generator

- buildSequence 
- yield

#### jvm

#### continuation passing style(CPS)

- action
- continuation

``` kotlin
requestToken //action
createPost // continuation
```

cps == callbacks

``` kotlin
requestToken{ token ->  // action
  createPost(token,item) //continuation
}
```

#### coroutines direst style

Continuation<T>

suspendCoroutine  regular function to suspend function

#### Coroutine context

what thread it resumes on

map of element

dispatcher 

#### job

CoroutineContext.Element

join
cancel，通过 isActive 去判断

#### Communicating Sequential Processes(CSP)

- Channel<T>
- Actors, named coroutine & inbox channel


|Receiver|Suspending function|Select clause|Non-suspending version|
|--- |--- |--- |--- |
|Job|join|onJoin|isCompleted|
|Deferred|await|onAwait|isCompleted|
|SendChannel|send|onSend|offer|
|ReceiveChannel|receive|onReceive|poll|
|ReceiveChannel|receiveOrNull|onReceiveOrNull|poll|
|Mutex|lock|onLock|tryLock|
|none|delay|onTimeout|none|


