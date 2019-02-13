---
title: '站点日志'
date: '2012-10-23'
permalink: /log/
layout: page
description:
---

这里只记录一些比较大的改动和想法，更详细的记录请查看[这里](https://github.com/douo/douo.github.com/commits/develop)

### TODO

#### 博客

- 使用 html 的简化模板 haml>slim(支持haml似乎更好)
- 用 [swiftype][2] 做站内搜索，分为 posts 和 notes，设计 schema

#### 筆記

- 專門描述應用內引用的語法，參考wiki語法，实现文内引用到文中其他小节的便利方法
- 反向链接
- 看看能不能利用 Evernote api ，把笔记输出到 evernote 中

[1]: https://swiftype.com/

### 2019-02-13

支持 mermaid

### 2018-01-02

用 Jekyll 重新实现，见 [新年新博客](/2018/01/02/new-year-new-blog/)

### 2015-04-10

### 2015-04-10

移除 pure，用 [RWD-with-Sass-Compass](https://snugug.github.io/RWD-with-Sass-Compass/#/nested-grid-inner-1-scss) 重构。

使用 `typo.css`



### 2014-05-04



### 2014-02-06

为日记实现卡片式布局，实现了一个逆向的 collated 方法，方便把新日记排在前面，添加了 [masonry](http://masonry.desandro.com/)，通过它来实现瀑布流式的卡片布局。

### 2014-01-11

修复笔记的排序功能，有子节点的项排在前面，相同的按字符表顺序大的排在前面

### 2014-01-10

写了一个脚本批量更新速记的结构，这是其中一个：

    quick.each do |m| 
      path = m.data['pointer']['realpath']
      name = File.basename path
      dir = File.dirname path
      date = m.data['date']
      title = date.strftime(notes.config['quick_title'])
      nn = name.gsub('untitled','note')
      c = File.read(path)
      w = c.gsub(/^title:\s*$/,"title: #{title}")
      File.open(path, 'w:UTF-8') { |f| f.puts w }
      FileUtils.mv(path,File.join(dir,nn))
    end && nil

完成笔记的命令行接口：

	{
        "command" => "new <(category title)/title>",
        "desc" => "Create a new note. Specific category and title or just title. if no title will create quick note",
      },
      {
        "command" => "drafts",
        "desc" => "List all drafts.",
      },
      {
        "command" => "list",
        "desc" => "List all resources.",
      }
	}

更新 categories.org ，Other 替换为 Uncategory，为快捷笔记增加一个新分类 Quick


### 2013-10-11

用 semantic-ui 为笔记建了个简单的主题。接下来等有时间再来打造前端的开发工具链。guard 似乎在 cygwin 下用不了。

### 2013-10-10

	双十节。

更改日志记录的排序方式，新的记录排在前面。另外改动实在太多了，无法一一表述了，更新到 ruhoh 2.5 ，旧的代码也尽量往新的结构优化，基本上也完成的差不多，还有少许bug。

### 2013-03-30

扩展了 markdown 的 image 语法

原本是

	![Alt text](/path/to/img.jpg "Optional title")

现在是

	![-<>Alt text](/path/to/img.jpg "Optional title")
	
将 ALt text 的第一个字符作为标志，其中`-` => `无样式`，`<` => `pull-left`， `>` => `pull-right`。其他字符则当成 Alt text 的字符，显示默认样式 `display`。


### 2013-02-21

为笔记数据即`ruhoh.db.notes`生成树状索引，collection_view#navigation 不用再每次调用都重新生成。

### 2013-02-18

ruhoh 2 的分类目录文章列表没有按照日期排序，增加个`Ruhoh::Resources::Page::CollectionView#categories_sorted` 返回排序好的列表


### 2013-02-08

面包屑导航

### 2013-02-07

通过递归导入 partial 实现让 mustache 展示递归结构的数据，重构了笔记 navigation 和 toc 的 mustache 接口

### 2013-01-20

升级到ruhoh2.0，ruhoh2 抽象了一个resource的概念，可以极大的减少diary和
notes与ruhoh系统的耦合，但仍然不能作为附加插件存在，在 `resource_interface` 和 `preview` 中仍然需要一些硬编码。不过其实实现这个并
不困难。posts，pages，diary，notes 都是继承自Page。

### 2012-11-22

重新設計博客的響應式導航欄，用一個導航欄實現兩種佈局，現在感覺良好。

### 2012-11-17

移除 toc plus widget，把js文件加入到主题中。

### 2012-11-16

正式開始新站點的日誌記錄，重新實現了一個更有靈活性的TOC插件，為筆記系統添加了樣式，twitter-bootstrap 的經典結構。


