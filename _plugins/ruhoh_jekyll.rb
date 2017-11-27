# encoding: utf-8

# 将 ruhoh 的 posts 复制到 jekyll 的 _drafts 下，这个生成器将标题转换为 jekyll 规范并复制到新目录
require 'pp'
module Ruhoh
  class Generator < Jekyll::Generator
    def generate(site)
      @@site = site
#      site.categories.each { |key,vals|
#        puts key
      #      }
      # to_jekyll_title(site)
      # remove_media_url(site)
    end



    def remove_media_url(site)

      dst = 'ruhoh'
      puts site.collections.class
      site.collections.each{ |key,collection|
        pp collection
        collection.docs.each{ |doc|
          content = File.read(doc.path)
          path = File.join(site.in_source_dir(dst),doc.relative_path)
          FileUtils::mkdir_p(File.dirname(path))
          File.open(path,'w'){ |file| file.write(content.gsub("{{urls.media}}/",""))}
        }
      }
    end

    def to_jekyll_title(site)
      dst = 'ruhoh'
      docs = site.collections['posts'].docs
      docs.select{ |d| d.data['draft'] }.each{ |doc|
        path = File.dirname(doc.path).gsub('_drafts','ruhoh')
        puts path
        FileUtils::mkdir_p path
        doc.data.tap{ |data|
          FileUtils::cp(doc.path,
                        File.join(path,data['date'].strftime("%Y-%m-%d-#{data['slug']}#{data['ext']}")))
        }
      }
    end
  end
end
