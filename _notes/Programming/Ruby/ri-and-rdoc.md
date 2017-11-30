---
title: ri and RDoc
date: '2013-02-21'
description:
---

ri (Ruby Index) RDoc(Ruby Documentation)

`ri` 是查询文档的命令行工具，`rdoc`是生成文档的命令行工具。

`ri Hash` 可以会提示

	Nothing known about Hash
	
需要更新数据包
	
	gem install rdoc-data

	# Regenerate system docs
	rdoc-data --install

	# Regenerate all gem docs
	gem rdoc --all --overwrite

如果只是缺少一部分文档，可以尝试下面的命令

	gem rdoc --all --ri --no-rdoc
	
如果使用 rvm 可以尝试

	rvm docs generate all

通过下面的命令来查询文档

	$ ri File
	$ ri Fil
	$ ri File.directory?
	$ ri Socket#accept
	$ ri ActiveRecord::Base.touch
	
`ri	-i` 交互模式比较好用。
	
ri 的 emacs 插件: [yari.el](https://github.com/hron/yari.el/blob/master/yari.el)

### Reference

[5 Reasons You Should Use ri To Read Ruby Documentation](http://www.jstorimer.com/ri.html)

[Why does my Ruby 'ri' tool not return results in command prompt?](http://stackoverflow.com/questions/1575373/why-does-my-ruby-ri-tool-not-return-results-in-command-prompt)


[Up and Running With Ruby Interactive (Ri)](http://samuelmullen.com/2012/01/up-and-running-with-ruby-interactive-ri/)
