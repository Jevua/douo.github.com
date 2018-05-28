# coding: utf-8

# 修复 markdown 中一行出现 `|` 字符，就会被 Kramdown 认为是表格的问题
# 强制 Kramdown 把 `|` 开头的行才作为表格处理
# 相关讨论 https://github.com/gettalong/kramdown/issues/151
# 原理，monkey patch：https://github.com/gettalong/kramdown/blob/master/lib/kramdown/parser/kramdown/table.rb
module Kramdown
  module Parser
    class Kramdown
      TABLE_LINE = /\|.*?\n/
    end
  end
end


# This class is the actual custom Jekyll converter.
class Jekyll::Converters::Markdown::KramdownFix

  def initialize(config)
    require 'kramdown'
    @config = config
  rescue LoadError
    STDERR.puts 'You are missing a library required for Markdown. Please run:'
    STDERR.puts '  $ [sudo] gem install kramdown'
    raise FatalException.new("Missing dependency: kramdown")
  end

  def convert(content)
    html = Kramdown::Document.new(content, {
        :auto_ids             => @config['kramdown']['auto_ids'],
        :footnote_nr          => @config['kramdown']['footnote_nr'],
        :entity_output        => @config['kramdown']['entity_output'],
        :toc_levels           => @config['kramdown']['toc_levels'],
        :smart_quotes         => @config['kramdown']['smart_quotes'],
        :kramdown_default_lang => @config['kramdown']['default_lang'],
        :input                => @config['kramdown']['input'],
        :hard_wrap            => @config['kramdown']['hard_wrap']
    }).to_html
    return html;
  end
end
