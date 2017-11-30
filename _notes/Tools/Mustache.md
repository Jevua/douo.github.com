---
title: Mustache
date: '2012-11-06'
description:
tags:
---


{{! 关闭掉mustache的默认分隔符，因为要罗列mustache的代码}}
{{=<% %>=}}

一个Logic Less（不知道怎么翻译，目的大概是把逻辑还给代码，让模板保持简洁。见[stackoverflow][]）的模板语言，所以同样以语言无关为目标的 ruhoh 采用了它作为模板语言。参考它的 [demo][] 可以大致了解它的特性

json 对象:

    {
      "header": "Colors",
      "items": [
          {"name": "red", "first": true, "url": "#Red"},
          {"name": "green", "link": true, "url": "#Green"},
          {"name": "blue", "link": true, "url": "#Blue"}
      ],
      "empty": false
    }

模板：

    <h1>{{header}}</h1>
    {{#bug}}
    {{/bug}}
    
    {{#items}}
      {{#first}}
        <li><strong>{{name}}</strong></li>
      {{/first}}
      {{#link}}
        <li><a href="{{url}}">{{name}}</a></li>
      {{/link}}
    {{/items}}
    
    {{#empty}}
      <p>The list is empty.</p>
    {{/empty}}

结果：

    <h1>Colors</h1>
    <li><strong>red</strong></li>
    <li><a href="#Green">green</a></li>
    <li><a href="#Blue">blue</a></li>

对于  `"tags"=>["forkosh", "LaTex", "mathtex"]` 这样列表或者数组(top-level-array)，没有 key 所以要这样处理

    <ul>
      {{#tags}}
      <li>{{& .}}</li>  <!-- 等同于 {{{ . }}} 不转义html字符 -->
      {{/tags}} 
    </ul>

**scope 内部可否访问外部数据**

下面基本上就是 if-else 结构，但是功能有限

    {{#repo}}
      <b>{{name}}</b>
    {{/repo}}
    {{^repo}}
      No repos :(
    {{/repo}}

`{{! ignore me }}` `"!"`用于注释


`{{> partial}}` 用于导入模板。如。
    
    {{# tags }}
      {{> tags_list }}
    {{/ tags }}

tags_list 是

    <li>
      <a href="{{ url }}">{{ name }} <span>{{ count }}</span></a>
    </li>

模板是在运行时渲染，可以用独立文件另外配置，增加了自定制和模块化的能力。
但上例中的两个文件可以整合成一个
   
    {{# tags }}
       <li>
      <a href="{{ url }}">{{ name }} <span>{{ count }}</span></a>
       </li>
    {{/ tags }}

Mustache 通过调用partial(name)来获取模板，默认行为是在当前目录读取`name.mustache`文件。看起来可以为 Mustache 增加递归的能力，未测试。

要显示`{{ }}`，参考[mustache(5)][] 的Set Delimiter，用`{{=xx xx=}}`代替更改默认的语法标识符。当然 ruhoh 还有个 raw_code 来 escape。

[mustache(5)]: http://mustache.github.com/mustache.5.html
[stackoverflow]: http://stackoverflow.com/questions/3896730/whats-the-advantage-of-logic-less-template-such-as-mustache
[demo]: http://mustache.github.com/#demo

### 其他

如何处理tree这样的递归结构，
http://stackoverflow.com/questions/12520783/recursive-mustache-partial-in-ruby

`{{<}}` 与 `{{>}}` 一样？


<%={{ }}=%>
{{! 切换回默认的分隔符，免得出现奇怪的问题}} 
