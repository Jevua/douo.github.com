---
title: SASS
date: '2014-05-31'
todo: true
description:

---

### 注释

SCSS 除了 CSS 的 `/**/` 外，还支持 `//` 行注释。

### SCSS 选择器

`&` 相当于 `this`

    .mod {
        &.on{
            color: green;
        }
    }

编译出来就是

    .mod.on {
        color: green;
    }

其实也可以简单理解为字符串替换。

    a {
        color: red;

        .nav-menu &{
            color: blue;
        }
    }

生成的CSS:

    a {
      color: red;
    }
    .nav-menu a {
      color: blue;
    }

### Mixin

	@mixin m($a: #123){
		// ...
	}

通过 `@include` 调用，`$a` 是参数名，`#123` 是默认值。

	@include m;
	@include m(#321);
	@include m($a: #321); //可直接指定参数名

### Function

`@function` 类似于 `@mixin`， 但是`@function`必须有返回值：

    @function grid-width($cells) {
    	@return ($cell-width + $cell-padding) * $cells;
    }
#### 常用

	if($condition,  $if-true,  $if-false) //chooses between two values based on  a  Boolean  value.  If  $condition  is  true,  then  it  returns  $if-true.

#### Color

	adjust($color, ...) //ex: adjust($color, $lightness: 15%, $hue: 10deg)
	scale($color, ...)
	mix($color-1,  $color-2,  [$weight])

### Interpolation

插值 `#{...}`，在字符串中插入变量的值，同 Ruby 的语法，CSS 选择器也可以使用。

    @mixin thing($class, $prop) {
    	.thing.#{$class} {
    		prop-#{$prop}: val;
    	}
    }
    // 结果
    .thing.foo {
    	prop-bar: val;
    }
	//字符串插值
	"This element is #{$color}";

#### Bug
{{ TODO }}
插值遇到一个 Bug。

    @each $vendor in ('-webkit-', '-moz-', '-ms-', '-o-', '') {
        @include glowheader($vendor);
    }

    @mixin glowheader($vendor) {
        $at: '@';
        @debug #{$at}#{$vendor}keyframes; //正常
        #{$at}#{$vendor}keyframes glowheader { //出错
            from,to {
             color: inherit;
             #{$vendor}transform: translateX(0);
         }
         35% {
             color: $flash;
             #{$vendor}transform: translateX(-.5em);
         }
        }
    }


#### Lists

列表可以通过`空格`或者`逗号`分隔，`a b c` 或 `a, b, c`


`nth($list, $n)`, 返回列表中的第 n 个值。 **Sass 的列表由 l 开始算起。**

`join($list1, $list2, [$separator])` 整合两个列表返回一个新列表。

`length($list)` 返回列表的程度


### Controll directives

#### @for

	@for $i from 1 to 5 { ... }

#### @each

    @each $section in home, about, archive, projects {
    	nav .#{$section} {
    		background-image: url(/images/nav/#{$section}.png);
    	}
    }

#### @if

    @if $alpha < 0.2 {
    	background-color: black;
    } @else if $alpha < 0.5 {
    	background-color: gray;
    } @else {
    	background-color: white;
    }



### !default

	// Set the variable to false only if it's not already set.
	$base-color: false !default;


### 算术运算

**算术运算的空格很重要**


### Compass

#### Abstracting URLs

通过 `image-url`，`font-url`，`stylesheet-url` 可以用相对路径来定位 assets，

比如：

    @include font-face("fontello",
    		  font-files(
    		      "fontell.woof", "woff",
    		      "fontello.tff", "truetype",
    		      "fontello.svg", "svg"),
    		      "fontello.eot", normal, normal);


font-files 自动通过 `font-url` 来加载文件，具体的路径可以在 config.rb 中设置，

    # Set this to the root of your project when deployed:
    http_path = "/"
    css_dir = "stylesheets"
    sass_dir = "sass"
    images_dir = "assets/media"
    fonts_dir = "assets/media/font"
    javascripts_dir = "javascripts"



#### compass 与 bourbon 不兼容

    error sass/test.scss (Line 21 of sass/bourbon/helpers/_linear-angle-parser.scss: Invalid CSS after "       webkit-image": expected ")", was ": -webkit- + $p...")



### SCSS bug


一个纠结的 Bug，我想用 post-content 里的 header，继承更高一级 header的样式，代码如下：

    .post-content {
        @for $i from 3 through 6 {
    	h#{$i} { @extend h#{$i - 1};}
        }
    }

但生成的结果却是这样的，触发了 Chaining Extends。

    /* line 141, ../sass/_pure.scss */
    h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6 {
      font-size: 1.5em;
      margin: 0.83em 0;
    }

    /* line 146, ../sass/_pure.scss */
    h3, .post-content h4, .post-content h5, .post-content h6 {
      font-size: 1.17em;
      margin: 1em 0;
    }

    /* line 151, ../sass/_pure.scss */
    h4, .post-content h5, .post-content h6 {
      font-size: 1em;
      margin: 1.33em 0;
    }

    /* line 156, ../sass/_pure.scss */
    h5, .post-content h6 {
      font-size: 0.83em;
      margin: 1.67em 0;
    }

    /* line 161, ../sass/_pure.scss */
    h6 {
      font-size: 0.67em;
      margin: 2.33em 0;
    }

理想中的结果应该是这样的，

    h2, .post-content h3 {
      font-size: 1.5em;
      margin: 0.83em 0;
    }

    h3, .post-content h4 {
      font-size: 1.17em;
      margin: 1em 0;
    }

    h4, .post-content h5 {
      font-size: 1em;
      margin: 1.33em 0;
    }

    h5, .post-content h6 {
      font-size: 0.83em;
      margin: 1.67em 0;
    }


只要我把标签改不相同，便可以出来正确的结果：

    .post-content {
        @for $i from 3 through 6 {
		a#{$i} { @extend h#{$i - 1};}
        }
    }



我想可能是，作用域的问题，把 `extend` 放到 `mixin` 中再调用结果一样。

    @mixin extendHeader($i) {
        @extend h#{$i};
    }

    .post-content {
        @for $i from 3 through 6 {
    	h#{$i} { @include extendHeader($i - 1)}
        }
    }

换成倒序的，计算的时候，内部引用还不存在，结果还是一样：

    .post-content {
        $i: 6;
        @while $i > 2 {
    	h#{$i} { @extend h#{$i - 1}; }
    	$i: $i - 1;
        }
    }

占位符也没有用：

    @for $i from 3 through 6 {
         %post-h#{$i} { @extend h#{$i - 1} ; }
    }


    .post-content {
        @for $i from 3 through 4 {
    	h#{$i} { @extend %post-h#{$i} ; }
        }
    }

简化一下问题，

    .foo {
        margin: 2em;
    }

    .bar {
        padding: 1em;
    }

    .test {
       .foo {
           @extend .bar
       }
       .bar {
           @extend .foo;
       }

    }

Output：

	/* line 348, ../sass/screen.scss */
    .foo, .test .bar, .test .foo {
      margin: 2em;
    }

    /* line 352, ../sass/screen.scss */
    .bar, .test .foo, .test .bar {
      padding: 1em;
    }


我想要的：

	/* line 348, ../sass/screen.scss */
    .foo, .test .bar {
      margin: 2em;
    }

    /* line 352, ../sass/screen.scss */
    .bar, .test .foo {
      padding: 1em;
    }
