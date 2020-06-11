# coding: utf-8

module Moon
  # 生成用于搜索要素的 json
  #
  class IndexGenerator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      data = []
      site.collections.flat_map{ |_,c| c.docs }.each do |d|
        data << {
          :ref => d.url,
          :title => d.data['title'],
          :token => tokenizer(d.data['title']),
          :tags => d.data['tags']
        }
        #puts "#{data[-1][:title]}:#{d.data['title']}"
      end
      file = PageWithoutAFile.new(site, site.dest, "",'index.json')
      file.content = data.to_json
      file.data["layout"] = nil
      file.data["sitemap"] = false
      file.output
      site.pages << file
    end

    # 对英文进行分词
    # 对中文和英文进行分隔
    # TODO 对中文进行分词
    def tokenizer(text)
      text.strip.chars.reduce([nil]) do |result, c|
        last_word = result[-1]
        # splits on whitespace and hyphens.
        if c =~ /[\s\-]/
          result << nil if last_word
        elsif last_word
          if type(last_word[-1]) != type(c)
            result << c
          else
            result[-1] = last_word + c
          end
        else
          result[-1] = c
        end
        result
      end
    end

    # 判断字符是否为中文
    def type(char)
      char =~ /\p{Han}/
    end

  end
end
