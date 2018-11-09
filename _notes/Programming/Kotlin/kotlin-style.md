---
title: Kotlin Style
date: '2018-07-27'
description:
tags:
- kotlin
---

本文档以 Android 的 [Kotlin Style Guide](https://android.github.io/kotlin-guides/style.html) 为基准。

本文档是Kotlin编程语言中Google的Android源代码编码标准的完整定义。 Kotlin源文件被描述为Google Android Style，当且仅当它符合此处的规则时。

与其他编程风格指南一样，所涉及的问题不仅包括格式化的美学问题，还包括其他类型的约定或编码标准。 但是，本文档主要关注我们普遍遵循的严格规则，并避免提供不明确可执行的建议（无论是通过人工还是工具）。



# 源文件

## 命名

如果源文件仅包含单个顶级类，则文件名应反映区分大小写的名称加上`.kt`扩展名。 否则，如果源文件包含多个顶级声明，请选择描述文件内容的名称，应用PascalCase，并附加`.kt`扩展名。

``` kotlin
// Foo.kt
class Foo { }

// Bar.kt
class Bar { }
fun Runnable.toBar(): Bar = // …

// Map.kt
fun <T, O> Set<T>.map(func: (T) -> O): List<O> = // …
fun <T, O> List<T>.map(func: (T) -> O): List<O> = // …
```

## 结构

`.kt` 文件按顺序包含以下内容：

- 版权和/或许可证标题（可选）
- 文件级注释
- 包声明
- import 语句
- 顶级声明

### import 语句

- 类，函数和属性的导入语句组合在一个列表中并对ASCII进行排序。
- 不允许使用通配符导入（任何类型）。

### 顶级声明

`.kt` 文件可以在顶层声明一个或多个类，函数，属性或类型别名。

文件的内容应该集中在一个主题上。比如单个公共类型或在多个接收器类型上执行相同操作的一组扩展功能。不相关的声明应该分成不同的的文件，并且应该最小化单个文件中的公共声明。

对文件内容的数量和顺序没有明确的限制。

源文件通常是从上往下阅读，这意味着顺序通常应该反映出放着在头部的声明将有助于对放在底部的声明的理解。不同形式的文件可以选择以不同的排序方式。比如，有的文件可以包含100个属性，有的是10个函数，而有的只是是单个类。

最重要的是安排的顺序应该有一些自洽的逻辑，如果被问到，维护者可以解释它。例如，新函数不能习惯性地添加到类的末尾，因为这将产生“按时间顺序添加”排序，这不是有逻辑的排序。

对类里面的成员的排序也是同样道理。

## 格式

### 大括号

当`when`和`if`语句体没有其他`if/else`分支并且适合单行时，不需要大括号。

``` kotlin
if (string.isEmpty()) return

when (value) {
    0 -> return
    // …
}
```

其余情况大括号都是必须的，`if`，`for`，`when`，`do`和`while`语句都需要大括号，即使块是空的或只包含一个语句。

``` kotlin
if (string.isEmpty())
    return  // WRONG!

if (string.isEmpty()) {
    return  // Okay
}
```

### 非空块

对于非空块和类块的结构，大括号遵循 [K&R 风格](https://zh.wikipedia.org/wiki/%E7%BC%A9%E8%BF%9B%E9%A3%8E%E6%A0%BC)

- 开括号前没有断行
- 开括号后断行
- 闭括号前断行
- 闭括号后断行，仅在该大括号终止一个语句或终止函数，构造函数或命名类的主体时。例如，如果后面跟着else或逗号，则在大括号后没有换行符。

``` kotlin
return Runnable {
    while (condition()) {
        foo()
    }
}

return object : MyClass() {
    override fun foo() {
        if (condition()) {
            try {
                something()
            } catch (e: ProblemException) {
                recover()
            }
        } else if (otherCondition()) {
            somethingElse()
        } else {
            lastThing()
        }
    }
}
```

### 空块

空块的结构也必须遵循 K&R 风格

``` kotlin
try {
    doSomething()
} catch (e: Exception) {} // WRONG!
try {
    doSomething()
} catch (e: Exception) {
} // Okay
```

    
### 表达式

仅当整个表达式适合一行时，`if/else` 条件表达式可以省略大括号。

``` kotlin
val value = if (string.isEmpty()) 0 else 1  // Okay
val value = if (string.isEmpty())  // WRONG!
                0
            else
                1
val value = if (string.isEmpty()) { // Okay
    0
} else {
    1
***
```
    
### 缩进

每次打开新的块或块状构造时，缩进增加**四**个空格。 当块结束时，缩进返回到先前的缩进级别。缩进级别适用于整个块中的代码和注释。g

### 每行一个语句

每个语句后面都有一个换行符。 **不使用分号**。

### 换行

代码的列限制为100个字符。 除非另有说明，否则任何超出此限制的行都必须换行，如下所述。

例外：

- 无法遵守列限制的行（例如，KDoc中的长URL）
- 包和 import 语句
- 注释中的命令行可以剪切并粘贴到shell中

#### 何时断行

换行的主要指引是：偏向在更高的句法层面断行：

1. 当在非赋值运算符处断行时，断点出现在符号之前，这也包括其他类操作符的符号，比如 `.` 、`::`
2. 当在赋值运算符处断行时，断行在符号后面。
3. 方法或构造函数总和其左括号`(`在一起
4. 逗号`,` 和其前面的标记符在一起
5. lambda箭头`->`保持附加到它之前的参数列表。

注意：换行的主要目标是拥有清晰的代码，而不一定是适合最小行数的代码。

#### 延续缩进（Continuation indent）

换行时，第一行（每个延续行）之后的每一行从原始行缩进至少两个基础缩进（比如 `2*2` 或 `4*2`）

当存在多个连续断行时，根据需要，缩进可以变化超过两个基础缩进。 通常，当且仅当它们以语法并行元素开头时，两个连续行使用相同的缩进级别。

### 函数

当函数签名不适合单行时，将每个参数声明分解为自己的行。 以此格式定义的参数应使用基础缩进（2 或 4）。 右括号`)`和返回类型放在它们自己的行上，没有额外的缩进。

``` kotlin
fun <T> Iterable<T>.joinToString(
    separator: CharSequence = ", ",
    prefix: CharSequence = "",
    postfix: CharSequence = ""
): String {
    // …
}
```

    
### 函数表达式

当函数只包含单个表达式时，它可以表示为函数表达式（[expression function](https://kotlinlang.org/docs/reference/functions.html#single-expression-functions)）。

``` kotlin
override fun toString(): String {
    return "Hey"
}
override fun toString(): String = "Hey"
```

    

函数表达式不应包含两行。 如果表达式函数增长到需要换行，则使用普通函数体，适用返回声明和普通表达式换行规则。

### 属性

当属性初始值不适合单行时，在等号 `=` 之后中断并使用延续缩进。

``` kotlin
private val defaultCharset: Charset? =
        EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

            
声明`get`或`set`函数的属性应该使用基础缩进将它们放在各自的行上。使用与函数相同的规则格式化它们。

``` kotlin
var directory: File? = null
    set(value) {
        // …
    }
```

只读属性可以使用适合单行的较短语法。

``` kotlin
val defaultExtension: String get() = "kt"
```

## 留白

### 空行

单个空行可以出现在：

1. 在类的连续成员之间：属性，构造函数，函数，嵌套类等。出现在连续成员间的空行用来创建这些成员之间的逻辑分组。空行是可选的
2. 在语句之间，根据需要将代码组织成逻辑子部分。
3. 其他待讨论

### 空格

除了语言或其他样式规则所要求的内容之外，除了文字，注释和KDoc之外，单个ASCII空格也仅出现在以下位置：

将关键字和其后面的 `(` 分隔开，例如`if`，`for`或`catch`

``` kotlin
// WRONG!
for(i in 0..1) {
}
// Okay
for (i in 0..1) {
}
```

将关键字和其后面的大括号`}`隔开

``` kotlin
// WRONG!
}else {
}
// Okay
} else {
}
```

在任何开大括号`{`之前。

``` kotlin
// WRONG!
if (list.isEmpty()){
}
// Okay
if (list.isEmpty()) {
}
```

    
在二元操作符的两边

``` kotlin
// WRONG!
val two = 1+1
// Okay
val two = 1 + 1
```

其他: `->`、`..`、`:`、`,`、`where`

``` kotlin
// WRONG!
ints.map { value->value.toString() }
// Okay
ints.map { value -> value.toString() }

// WRONG
for (i in 1 .. 4) print(i)
// Okay
for (i in 1..4) print(i)

// WRONG!
class Foo: Runnable
// Okay
class Foo : Runnable
// WRONG
fun <T: Comparable> max(a: T, b: T)
// Okay
fun <T : Comparable> max(a: T, b: T)
// WRONG
fun <T> max(a: T, b: T) where T: Comparable<T>
// Okay
fun <T> max(a: T, b: T) where T : Comparable<T>

// WRONG!
val oneAndTwo = listOf(1,2)
// Okay
val oneAndTwo = listOf(1, 2)
// WRONG!
class Foo :Runnable
// Okay
class Foo : Runnable
```

    
双斜线注释的两边

``` kotlin
// WRONG!
var debugging = false//disabled by default
// Okay
var debugging = false // disabled by default
```

    
## 特殊结构

### Enum 类

Enum 没有函数其常量也无需文档可以格式为一行

``` kotlin
enum class Answer { YES, NO, MAYBE }
```

当 Enum 中的常量放在单独的行上时，它们之间不需要空行，除非它们定义了 body。

``` kotlin
enum class Answer {
    YES,
    NO,

    MAYBE {
        override fun toString() = """¯\_(ツ)_/¯"""
    }
}
```

    
### 注解

成员或类型注解放置在被注解结构的前一行，

``` kotlin
@Retention(SOURCE)
@Target(FUNCTION, PROPERTY_SETTER, FIELD)
annotation class Global
```

如果注解没有参数可以放置在同一行

``` kotlin
@JvmField @Volatile
var disposable: Disposable? = null
```

如果只有一个没有参数的注解，则它可以与被注解结构放在同一行

``` kotlin
@Volatile var disposable: Disposable? = null

@Test fun selectAll() {
    // …
}
```

### 隐式的返回和属性类型

如果表达式函数的函数体或属性初始值的设定项是标量，或者可以从主体明确推断返回类型，则可以省略它。

``` kotlin
override fun toString(): String = "Hey"
// becomes
override fun toString() = "Hey"

private val ICON: Icon = IconLoader.getIcon("/icons/kotlin.png")
// becomes
private val ICON = IconLoader.getIcon("/icons/kotlin.png")
```

编写库时，如果它是公共API的一部分，请保留显式类型声明。

## 命名

标识符仅使用ASCII字母、数字、下划线（仅在下面提到的少数情况），因此，每个有效的标识符名称都可以通过正则表达式`\w+`匹配。
不使用特殊前缀或后缀，如:`name_`，`mName`，`s_name`和`kName`

### 包命名

包名都是小写的，连续的单词简单地连接在一起（没有下划线）。

``` kotlin
// Okay
package com.example.deepspace
// WRONG!
package com.example.deepSpace
// WRONG!
package com.example.deep_space
```

### 类型命名

类名用 *PascalCase*，通常是名词或名词短语。 例如，`Character`或`ImmutableList`。 接口名称也可以是名词或名词短语（例如，`List`），但有时可能是形容词或形容词短语（例如，`Readable`）。

测试类的名称从它们正在测试的类的名称开始，以`Test`结束。 例如，`HashTest`或`HashIntegrationTest`。

### 函数命名

函数命名用 *camelCase* 通常是动词或动词短语。 例如，`sendMessage`或`stop`。

允许下划线出现在测试函数名称中以分隔名称的逻辑组件

``` kotlin
@Test fun pop_emptyStack() {
    // …
}
```

### 常量命名

常量命名用 *UPPER_SNAKE_CASE*，全部用大写字母，单词用下划线分隔。 

常量是`val`声明的属性，没有自定义get函数，其内容不可变(immutable)，并且其函数没有可检测的副作用。 这包括不可变类型和不可变类型的不可变集合，以及标记为`const`的标量和字符串。如果实例的任何可观察状态可以更改，则它不是常量。仅仅打算永远不会改变对象是不够的。

``` kotlin
const val NUMBER = 5
val NAMES = listOf("Alice", "Bob")
val AGES = mapOf("Alice" to 35, "Bob" to 32)
val COMMA_JOINER = Joiner.on(',') // Joiner is immutable
val EMPTY_ARRAY = arrayOf<SomeMutableType>()
```

名称通常是名词或名词短语。常量值只能在对象内部定义或作为顶级声明定义。满足常量要求但在类内定义的值必须使用非常量名称。标量值的常量必须使用`const`修饰符。

### 非常量命名

非常量名称是用camelCase编写的。 这些适用于实例属性，局部属性和参数名称。通常是名词或名词短语。

``` kotlin
val variable = "var"
val nonConstScalar = "non-const"
val mutableCollection: MutableSet<String> = HashSet()
val mutableElements = listOf(mutableInstance)
val mutableValues = mapOf("Alice" to mutableInstance, "Bob" to mutableInstance2)
val logger = Logger.getLogger(MyClass::class.java.name)
val nonEmptyArray = arrayOf("these", "can", "change")
```

    
### 后备属性

[后备属性](https://kotlinlang.org/docs/reference/properties.html#backing-properties)，kotlin 引入的概念。当需要后备属性时，其名称应该与属性的名称完全匹配，但前缀为下划线。

private var _table: Map<String, Int>? = null

``` kotlin
val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap()
        }
        return _table ?: throw AssertionError()
    }
```

        
### 类型变量命名

每个类型变量都以两种样式之一命名：

- 单个大写字母，可选地后跟单个数字（例如`E`，`T`，`X`，`T2`）
- 用于类的形式的名称，后跟大写字母T（例如`RequestT`，`FooBarT`）

### 驼峰命名转换规则

有时，将英语短语转换为驼峰大小写的方法不止一种，例如当存在首字母缩略词或“IPv6”或“iOS”等不寻常的结构时。 要提高可预测性，请使用以下方案。

1. 将短语转换为纯ASCII并删除任何撇号。 例如，“Müller’s algorithm” 可能成为 “Muellers algorithm”
2. 将此结果划分为单词，拆分空格和任何剩余的标点符号（通常为连字符）。
3. 现在小写所有内容（包括首字母缩略词），然后只大写第一个字符
4. 最后，将所有单词连接成一个标识符。


| 句子                     | 正确                | 错误                |
| “XML Http Request”     | `XmlHttpRequest`    | `XMLHTTPRequest`    |
| “new customer ID”      | `newCustomerId`     | `newCustomerID`     |
| “inner stopwatch”      | `innerStopwatch`    | `innerStopWatch`    |
| “supports IPv6 on iOS” | `supportsIpv6OnIos` | `supportsIPv6OnIOS` |
| “YouTube importer”     | `YouTubeImporter`   | `YoutubeImporter`   |


## 注释

在此示例中可以看到KDoc块的基本形式：

``` kotlin
/**
 * Multiple lines of KDoc text are written here,
 * wrapped normally…
 */
fun method(arg: String) {
    // …
}
```

    
单行示例：

``` kotlin
/** An especially short bit of KDoc. */
```

基本形式总是可以接受的。当整个KDoc块（包括注释标记）可以适合单行时，可以替换单行形式。请注意，这仅适用于没有`@return`等块标记的情况。

