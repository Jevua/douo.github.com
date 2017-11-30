---
title: Jekyll
date: '2016-11-22'
description:
type: draft ## 移除这个字段，笔记才会公开发布
---

### Document 

日期的逻辑:首先从 YAML 读取日期，没有的话，draft 取文件创建日期，post 取站点日期


document.rb #60:

    def date
        data["date"] ||= (draft? ? source_file_mtime : site.time)
    end
    
    
#### draft

This is only the case if the document is in the 'posts' collection but in a different directory than '_posts'.

    if draft?
        categories_from_path("_drafts")
    else
        categories_from_path(collection.relative_directory)
    end

### Site

Jekyll build 的流程，需要 -I 来开启增进式构建，不然每次修改都重建整个站，非常缓慢。

初始化 Config

构建 site，可见 site.rb#65 

    def process
      reset
      read
      generate
      render
      cleanup
      write
      print_stats
    end


#### reset

清理 site 数据


#### read

reader.rb#14 read

将硬盘上的数据转换成 jekyll 内部的数据结构

首先加载 layout 

过滤掉隐藏文件或备份文件：

    .
    #
    ~

还有 site content ： 以 "_" 开头的文件或目录

过滤掉目录，剩下的文件有 yaml_header 的 jekyll 认为是 pages 文件。再剩下的便是 static file

接下来加载 posts

post_reader.rb#24 遍历文件构造 document，再通过 document.read 初始化数据。

document.rb#418 read_post_data

首先解析标题，接着分类，接着标签，最后生成摘要


collection，列出所有文件/目录。再用 jekyll 过滤起过滤掉无需的文件。

有 yaml_header 的转换成 documents，没有的当成 static file 处理。




#### generate

通过生成器生产站点，有多个生成器。比如 feed 生成器



#### render

将 Site 渲染到目标文件

到了这一层， posts 也被当成 collection 处理了

转换器在这一层工作， 

renderer.rb#82 读取 doc.content，进行 liquid 转换，再走转换器

convertor 与所有插件一样按照 pirority 排序，markdown convertor 是默认 pirority：normal


#### write


将 static files 和渲染后的目标文件写入目标位置

#### print_stats

打开 profile，这个方法才起作用，输入 stats_table


### Config

_config.yml 的改动不会触发自动重生成。

liquid  模板读取配置可通过 `{{ site.key }}` 读取 key 对应的 value

插件代码中是通过 `site.config['key']`



