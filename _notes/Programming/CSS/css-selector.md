---
title: CSS 选择器
date: '2014-05-31'
description:
tag:
- css
- css selector
---

### 选择器

http://www.ruanyifeng.com/blog/2009/03/css_selectors.html

http://www.w3school.com.cn/css/css_selector_type.asp

#### 类型选择器（type selector）

直接匹配某个 HTML 元素

        html {color:black;}
        h1 {color:blue;}
        h2 {color:silver;}

可以将任意多个选择器分组在一起

    h1, h2, h3, h4, h5, h6 {color:blue;}

#### 类选择器

类选择器允许以一种独立于文档元素的方式来指定样式。

    <h1 class="important">
    This heading is very important.
    </h1>

    *.important {color:red;}


结合元素选择器

	p.important {color:red;}

多类选择器

    <p class="important warning">
    This paragraph is a very important warning.
    </p>

	.important.warning {background:silver;}


#### ID 选择器

允许以一种独立于文档元素的方式来指定样式

	<p id="intro">This is a paragraph of introduction.</p>

	*#intro {font-weight:bold;}

类选择器还是 ID 选择器？

1. 只能在文档中使用一次
2. 不能使用 ID 词列表，ID 选择器不能结合使用
3. ID 能包含更多含义

#### 属性选择器（Attribute Selector）

属性选择器可以根据元素的属性及属性值来选择元素。

	*[title] {color:red;} /* 把包含标题（title）的所有元素变为红色 */

还可以根据多个属性进行选择，只需将属性选择器链接在一起即可

	a[href][title] {color:red;}


根据具体属性值选择

[attribute]	用于选取带有指定属性的元素。
[attribute=value]	用于选取带有指定属性和值的元素。
[attribute~=value]	用于选取属性值中包含指定词汇的元素。
[attribute|=value]	用于选取带有以指定值开头的属性值的元素，该值必须是整个单词。
[attribute^=value]	匹配属性值以指定值开头的每个元素。
[attribute$=value]	匹配属性值以指定值结尾的每个元素。
[attribute*=value]	匹配属性值中包含指定值的每个元素。


#### 后代选择器（descendant selector）

后代选择器可以选择作为某元素后代的元素

	h1 em {color:red;}

在后代选择器中，规则左边的选择器一端包括两个或多个用空格分隔的选择器。选择器之间的空格是一种结合符（combinator）。每个空格结合符可以解释为“... 在 ... 找到”、“... 作为 ... 的一部分”、“... 作为 ... 的后代”，但是要求必须从右向左读选择器。

后代选择器有一个易被忽视的方面，即两个元素之间的层次间隔可以是无限的。

#### 子元素选择器（Child selectors）

与后代选择器相比，子元素选择器（Child selectors）只能选择作为某元素子元素的元素。

	h1 > strong {color:red;}  /*选择作为 h1 元素子元素的所有 strong 元素*/

##### 相邻兄弟选择器（Adjacent sibling selector）

可选择紧接在另一元素后的元素，且二者有相同父元素。
	
	h1 + p {margin-top:50px;}


##### 伪类 (Pseudo-classes)

	selector : pseudo-class {property: value}


:first-child 伪类来选择元素的第一个子元素，这个特定伪类很容易遭到误解，下面例子将 first text 变为红色，因为 p 是 body 的第一个子元素。

	<html>
	<head>
	<style type="text/css">
	p:first-child {
	color: red;
	} 
	</style>
	</head>

	<body>
	<p>first text</p>
	<p>second text</p>
	</body>
	</html>

所有伪类

    :active	向被激活的元素添加样式。	1
    :focus	向拥有键盘输入焦点的元素添加样式。	2
    :hover	当鼠标悬浮在元素上方时，向元素添加样式。	1
    :link	向未被访问的链接添加样式。	1
    :visited	向已被访问的链接添加样式。	1
    :first-child	向元素的第一个子元素添加样式。	2
    :lang	向带有指定 lang 属性的元素添加样式。	2


#### 伪元素 (Pseudo-elements)

CSS 伪元素用于向某些选择器设置特殊效果。

	selector:pseudo-element {property:value;}
	
全部伪元素

    :first-letter	向文本的第一个字母添加特殊样式。	1
    :first-line	向文本的首行添加特殊样式。	1
    :before	在元素之前添加内容。	2
    :after	在元素之后添加内容。	2
