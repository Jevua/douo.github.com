---
title: JavaScript The Good Parts
date: '2014-04-16'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

### Object

对象是一个可变的键控集合

	var empty_object = {}; //最简单的对象
	var stooge = {name:"D"};

#### Retrieval


	var status = flight.status || "unknown";
	flight.equipment && flight.equipment.model

#### Prototype

> Every object is linked to a prototype object from which it can inherit properties.
> All object create from object literals art linked to `Object.prototype`

但

    empty_object.prototype; //却是 undefined


实际上只有构造函数有 `prototype`，`Object` 是构造函数所以 `Object` 有 `prototype` 而 `empty_object` 没有（[来源](http://stackoverflow.com/a/14450766/851344)）。不过可以通过 `Object.getPrototypeOf(empty_object)` 来获取 `empty_object` 的 `prototype`。

实际上因为 Javascript 不能分辨哪个函数是构造函数，所以所有函数都有`prototype`。

这里的构造函数可以理解成**类**， prototype 是类的属性，不是对象的属性。

书里的 `beget` 就是将 `prototype` 赋与构造函数， 而不是对象。

    if(typeof Object.beget != 'function'){
        Object.beget = function(o){
    	var F = function(){};
    	F.prototype = o;
    	return new F();
        }
    }


对于对象来说，protype 和对象的关系用的词是 **linked to**。我是这样理解的，从对象中找一个属性，如果对象没有该属性，则继续搜索对象的 `prototype`，没有则再搜索 `prototype` 的 `prototype`，直到 `Object.prototype`。

通过 `delete` 从对象删除一个属性，不会影响到该对象的 `prototype`。

### Function

每个方法接收两个参数：`this` 和 `arguments`

四种调用方法，

1. 方法调用模式，作为对象的方法调用，如 `o.method`
2. 函数调用模式，全局方法或对象内方法，`add`
3. 构造器调用，方法前加上 `new` 的调用，一般采用驼峰式命名，`new People("D")`
4. `apply` 调用，`apply` 是 `Function` 对象的一个方法，通过 `apply` 可以直接绑定 `this` 传递参数列表，如`var array[3,4];var sum=add.apply(null,array);`

`arguments` 不是真正的数组，它只有 `length` 属性，但并没有其他数组的方法。

每个函数都有返回值，如果没有声明则返回 `undefined`。

#### 构造函数

如果在一个函数前面带上 new 来调用，那么将创建一个**隐藏连接**到该函数的 `prototype` 成员的新对象。`this` 会绑定到这个对象上。

构造器，会改变 `return` 的行为，如果返回不是对象，则返回 `this`。

#### Exception

`throw` 需要一个 `exception` 对象：

    throw{
    	name:'TypeError',
    	message:'msg'
    }

	try{
	 //
	}catch(e){} // exception obj


#### Basic types Augmenting

给类型增加方法，类似于 Ruby 的 monkey patch。为 String 增加 `trim` 方法。

    Function.prototype.method = function(name,func){
    	this.prototype[name] = func;
    	return this;
    }
    String.method('trim',function(){
    	return this.replace(/^\s+|\s+$/g,'');
    });
	

#### Recursion

JavaScript 没有提供尾递归优化。

#### Scope

JavaScript 没有 block 作用域，但是有函数作用域。所以，在函数开始的时候定义所有要用到的变量是个好习惯。

#### Closure

闭包

    var memorizer = function(memo,fundamental){
    	var shell = function(n){
    		var result = memo[n];
    		if(typeof result !== 'number'){
    		   result = fundamental(shell,n);
    		   memo[n] = result;
    	    }
    		return result
    	}
    	return shell;
    };


内部函数可以访问外部函数的变量：

    var quo = function(status) {
    	return {
    		get_status: function() {
    			return status;
    		}
    	}
    }

调用 `quo` 后，`get_status` 方法仍能访问 `quo` 的 `status`，这样的函数可以访问它被创建时所处的上下文环境，称为闭包。

### 减少全局变量污染

#### 只创建一个全局变量

	var MYAPP = {};

其他定义都在`MYAPP`下，如：

	MYAPP.stooge = {};

### Inheritance

#### 伪类

#### 原型


将一个旧对象作新类的原型，来实现继承。

#### 函数化

函数化仍有缺陷，下面是我作为练手实现的一个链表。

    function node(name){
        var name = name;
        var next = null;
        var that = {};
        that.get_name = function(){
    	return name;
        }
        that.set_name = function(n){
    	name = n;
        }
        that.get_next = function(){
    	return next;
        }
        that.set_next = function(n){
    	if(typeof n == "string"){
    	    next = node(n);
    	}else{
    	    next = n;
    	}
        }
        that.is_tail = function(){
    	return next === null;
        }
        that.get_last = function(){
    	var root = this;
    	while(!root.is_tail()){
    	    root = root.get_next();
    	}
    	return root;
        }
        that.add = function(n){
    	this.get_last().set_next(n);
        }
        return that;
    }


在 `add` 方法中，如 Java 之类的面向对象语言，应该可以通过 `this.get_last()` 应该可以直接访问 `next` 字段。但是这里 Javascript 却无能为力。


http://bonsaiden.github.io/JavaScript-Garden/zh/

http://howtonode.org/object-graphs-2


