# coding: utf-8
require 'pp'
module Jekyll
  module Converters
    # 查找 markdown 中的所有相对链接
    # 如果链接在 media 中影子目录中存在的话
    # 则将链接替换为影子目录中文件的链接
    class SmartRef < Converter
      safe true # not sure
      priority :high # 必须在 markdown converter 之前执行


      # 能匹配出
      # ![](IMAG00071.jpg "IMAG0007")
      # [![](IMAG00071.jpg "IMAG0007")](some-url)
      # 中的图片链接
      INLINE_IMAGE_MATCHER = %r(!\[([^\[\]]*)\]\((?'url'[^ \)]*)\b+([^\)]*)\))
      # 能匹配出
      # [label](url)
      # [![](IMAG00071.jpg "IMAG0007")](some-url)
      # 甚至多层嵌套
      # 中的 url
      INLINE_LINK_MATCHER = %r((?<!!)(?<label>\[[^\[\]]*\g<label>?[^\[\]]*\])\((?'url'[^\)]*)\))
      # 匹配引用链接
      # [lable]: url
      REFERENCE_LINK_MATCHER = %r(^\s*\[[^\]]+\]:\s*(?'url'.*)$)

      # Initialize the converter.
      #
      # Returns an initialized Converter.
      def initialize(config = {})
        super(config)
        Jekyll::Hooks.register :pages, :pre_render do |doc, payload|
          # 用于标记当前 document 是不是摘要。
          # 每个 post 都会被当成两个 doc 转换
          # 一次是 post 本身，接下来是 post 摘要
          @excerpt = false
          @doc = doc
          @payload = payload
        end
        Jekyll::Hooks.register :documents, :pre_render do |doc, payload|
          @excerpt = false
          @doc = doc
          @payload = payload
        end
      end

      # same as markdown
      def matches(ext)
        extname_list.include?(ext.downcase)
      end

      def extname_list
        @extname_list ||= @config["markdown_ext"].split(",").map do |e|
          ".#{e.downcase}"
        end
      end

      def output_ext(ext)
        ext
      end

      def media_name
        "media"
      end

      def convert(content)
        dir_parts = [@doc.site.in_source_dir(media_name)]
        # puts @doc.data['title']
        if not @doc.is_a?(Jekyll::Page)
          dir_parts << @doc.collection.label
          remain = @doc.data['draft'] ? @doc.path.sub(@doc.site.in_source_dir("_drafts"),"") :
                     @doc.path.sub(@doc.collection.directory,"")
          dir_parts << File.dirname(remain)
          dir_parts << File.basename(remain,File.extname(remain))
        end
        media_dir = File.join(*dir_parts)
        convert_inline_image(media_dir, content).tap{
          convert_inline_link(media_dir, content).tap{
            convert_reference_link(media_dir, content).tap{
              @excerpt = true
            }
          }
        }
      end

      def convert_inline_link(media_dir,content)
        convert_inner(media_dir,content,INLINE_LINK_MATCHER)
      end

      def convert_inline_image(media_dir,content)
        convert_inner(media_dir,content,INLINE_IMAGE_MATCHER)
      end

      def convert_reference_link(media_dir,content)
        convert_inner(media_dir,content,REFERENCE_LINK_MATCHER)
      end



      # 根据正则替换掉各个 url
      def convert_inner(media_dir,content,matcher)
        content.gsub!(matcher) do
          m = Regexp.last_match
          url = to_smart_url(media_dir,m['url'])
          str = m.to_s.dup
          # 如果 url 被转换到 media 目录下的文件，则将原 url 替换成新 url
          if not m['url'] == url
            offset = m.offset(0)[0]
            start = m.begin('url')-offset
            _end  = m.end('url')-m.begin('url')
            str.slice!(start,_end)
            str.insert(start,url)
          end
          str
        end
        content
      end

      # 将相对路径转换到指向 media 内相同文件的绝对路径
      # 如果文件不存在或不是相对路径，则返回原 url
      def to_smart_url(media_dir,url)

        if url.include?("://") or Pathname.new(url).absolute?
          url
        else
          dst = File.join(media_dir,url)
          # puts dst
          # if not File.exist?(dst)
          #   move_to_dst(media_dir,url)
          # end
          File.exist?(dst) ? dst.sub(@doc.site.in_source_dir,"") : url
        end
      end

      # 用于转换旧博客的文件，生产无用
      def move_to_dst(media_dir,url)
        @sets ||= []
        if @sets.include? url
          puts "--------------error------------"
        end
        @sets << url
        src = @doc.site.in_source_dir(File.join(media_name,url))
        dst = File.join(media_dir,url)
        puts "move: #{src}"
        puts "to: #{dst}"
        FileUtils::mkdir_p(File.dirname(dst))
        FileUtils::mv(src,dst) if File.exist?(src)
      end
    end
  end
end
