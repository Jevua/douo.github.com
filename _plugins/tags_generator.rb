# coding: utf-8

module Moon
    # 生成用于搜索要素的 json
    #
  class TagsGenerator < Jekyll::Generator
    safe true
    priority :lowest

      def generate(site)

        file = PageWithoutAFile.new(site, site.dest, "",'tags.json')
        file.content = site.tags.map{|k,v|
          {:name => k,
          :size => v.size}
        }.to_json
        file.data["layout"] = nil
        file.data["sitemap"] = false
        file.output
        site.pages << file
      end
    end
  end
