---
title: 帮助
permalink: /help/
layout: page
math : true
graphviz : true
---

## Markdown

基于 [kramdown](https://kramdown.gettalong.org/syntax.html)。同时支持 [Liquid](https://jekyllrb.com/docs/liquid/) 模板语言进行扩展


### Math

math 基于 mathjax，启用 mathjax 脚本，需要在 Front Matter 加入：

```
---
...
math: true
---
```

#### 块

以 `$$` 包围的块：

```
$$
\begin{align*}
  & \phi(x,y) = \phi \left(\sum_{i=1}^n x_ie_i, \sum_{j=1}^n y_je_j \right)
  = \sum_{i=1}^n \sum_{j=1}^n x_i y_j \phi(e_i, e_j) = \\
  & (x_1, \ldots, x_n) \left( \begin{array}{ccc}
      \phi(e_1, e_1) & \cdots & \phi(e_1, e_n) \\
      \vdots & \ddots & \vdots \\
      \phi(e_n, e_1) & \cdots & \phi(e_n, e_n)
    \end{array} \right)
  \left( \begin{array}{c}
      y_1 \\
      \vdots \\
      y_n
    \end{array} \right)
\end{align*}
$$

```

$$
\begin{align*}
  & \phi(x,y) = \phi \left(\sum_{i=1}^n x_ie_i, \sum_{j=1}^n y_je_j \right)
  = \sum_{i=1}^n \sum_{j=1}^n x_i y_j \phi(e_i, e_j) = \\
  & (x_1, \ldots, x_n) \left( \begin{array}{ccc}
      \phi(e_1, e_1) & \cdots & \phi(e_1, e_n) \\
      \vdots & \ddots & \vdots \\
      \phi(e_n, e_1) & \cdots & \phi(e_n, e_n)
    \end{array} \right)
  \left( \begin{array}{c}
      y_1 \\
      \vdots \\
      y_n
    \end{array} \right)
\end{align*}
$$

#### 行内

```
The following is a math block:

$$ 5 + 5 $$

But next comes a paragraph with an inline math statement: $$ 5 + 5 $$ 

This is block: \$$ 5 + 5 $$ 

This is block: \$\$ 5 + 5 $$ 

```
The following is a math block:

$$ 5 + 5 $$

But next comes a paragraph with an inline math statement: $$ 5 + 5 $$ 

This is block: \$$ 5 + 5 $$ 

This is block: \$\$ 5 + 5 $$ 

#### FIX:表格

强制 Kramdown 把 `|` 开头的行才作为表格处理，相关讨论 https://github.com/gettalong/kramdown/issues/151

## Liquid 

### 标签逃逸

```
{% raw %}用 {% raw %} 标签{% endraw %} 
```

### Graphviz


要支持 [graphviz](https://www.graphviz.org/documentation/) 需要在 Front Matter 加入 

```
---
...
graphviz: true
---
```

```
{% raw %}{% graphviz %}
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;

	start [shape=Mdiamond];
	end [shape=Msquare];
}
{% endgraphviz %}{% endraw %} 
```

{% graphviz %}
digraph G {

	subgraph cluster_0 {
		style=filled;
		color=lightgrey;
		node [style=filled,color=white];
		a0 -> a1 -> a2 -> a3;
		label = "process #1";
	}

	subgraph cluster_1 {
		node [style=filled];
		b0 -> b1 -> b2 -> b3;
		label = "process #2";
		color=blue
	}
	start -> a0;
	start -> b0;
	a1 -> b3;
	b2 -> a3;
	a3 -> a0;
	a3 -> end;
	b3 -> end;

	start [shape=Mdiamond];
	end [shape=Msquare];
}
{% endgraphviz %}



### Mermaid

[Mermaid](https://mermaidjs.github.io/) 与 graphviz 有一定的重复，默认启用无需 Front Matter。

```
{% raw %}{% mermaid %}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;

  click A "http://google.com" "This is a link"
  click B "http://google.com" "This is a link"
  click C "http://google.com" "This is a link"
  click D "http://google.com" "This is a link"
{% endmermaid %}

{% mermaid %}
 classDiagram
      Class01 <|-- AveryLongClass : Cool
      Class03 *-- Class04
      Class05 o-- Class06
      Class07 .. Class08
      Class09 --> C2 : Where am i?
      Class09 --* C3
      Class09 --|> Class07
      Class07 : equals()
      Class07 : Object[] elementData
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
{% endmermaid %}

{% mermaid %}
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
{% endmermaid %}{% endraw %}
```

{% mermaid %}
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;

  click A "http://google.com" "This is a link"
  click B "http://google.com" "This is a link"
  click C "http://google.com" "This is a link"
  click D "http://google.com" "This is a link"
{% endmermaid %}


{% mermaid %}
 classDiagram
      Class01 <|-- AveryLongClass : Cool
      Class03 *-- Class04
      Class05 o-- Class06
      Class07 .. Class08
      Class09 --> C2 : Where am i?
      Class09 --* C3
      Class09 --|> Class07
      Class07 : equals()
      Class07 : Object[] elementData
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
{% endmermaid %}

{% mermaid %}
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
{% endmermaid %}
