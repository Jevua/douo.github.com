# encoding: utf-8

=begin
1. 将 ruhoh posts 的文件复制到 jekyll 的 _drafts 下，
   并运行 convert_post 将标题转换为 jekyll 规范并复制到新目录，然后关闭 jekyll 服务
2. 将 ruhoh notes 的文件复制到 jekyll 的 _notes 下，并在 _config 中配置：
collections:
  notes:
    output: true
    to_tree: true
3. 将 media 负责到 jekyll 根目录下，并运行 convert_media_url
=end

require 'pp'
module Ruhoh
  class Generator < Jekyll::Generator

    MEDIA_URLS_MATCHER = %r(\{\{\s*urls\.media\s*\}\}\/([^ "\)]+))
    MATH_BLOCK_MATCHER = %r(^\b*```mathjax$\n([^```]+)\b*```)m
    MATH_INLINE_MATCHER = %r(`\$([^$`]+)\$`)
    def generate(site)
      # convert_post(site)
      # convert_content(site)
      # convert_notes_index(site)
    end

    # 需要先启用 show_drafts: true
    # 将 ruhoh posts 的文件复制到 jekyll 的 _drafts 下，这个生成器将标题转换为 jekyll 规范并复制到新目录
    def convert_post(site)
      dst = '_posts'
      docs = site.posts.docs
      docs.select{ |d| d.data['draft'] }.each{ |doc|
        # 原来的 drafts 文件还是继续呆在 drafts 目录里
        unless doc.cleaned_relative_path.sub('_drafts','').start_with? "/drafts"
          path = File.dirname(doc.path).gsub('_drafts',dst)
          FileUtils::mkdir_p path
          doc.data.tap{ |data|
            FileUtils::mv(doc.path,
                         File.join(path,data['date']
                                         .strftime("%Y-%m-%d-#{data['slug']}#{data['ext']}")))
          }
        end
      }
    end

    # 将 _post/date-name.md 转为 _res/posts/date-name
    def doc_resource_path(base, doc)
      File.join(base, doc.collection.label, doc.cleaned_relative_path)
    end


    # 移除 ruhoh 的 urls.media 标签
    # 并将文章相关的资源文件移动到 _res 目录相应的文章目录下
    def convert_media_url(site, doc, content)
      base = site.in_source_dir("_res")
      res_dir = doc_resource_path(base, doc)
      # 移除 mustache 标签 {{urls.media}}
      content.gsub(MEDIA_URLS_MATCHER) do
        res_file = Regexp.last_match[1]
        ruhoh_media = File.join("media",res_file)
        # pp ruhoh_media
        if(File.exist?(ruhoh_media))
          FileUtils::mkdir_p(File.dirname(File.join(res_dir, res_file)))
          FileUtils::mv(ruhoh_media,File.join(res_dir, res_file))
        end
        res_file
      end
    end

    def convert_content(site)
      site.collections.each{ |key,collection|
        # pp collection
        collection.docs.each{ |doc|
          # pp doc.path
          content = File.read(doc.path)
          content = convert_media_url(site, doc, content)
          content = convert_math(site, doc, content)
          File.open(doc.path,'w'){ |file| file.write(content)}
        }
      }
    end

    # 将 ruhoh 的 math 语法转换为 kramdown 语法
    def convert_math(site, doc, content)
      content.gsub(MATH_BLOCK_MATCHER){
        latex = "$$\n#{Regexp.last_match[1]}$$"
        latex
      }.gsub(MATH_INLINE_MATCHER){
        latex = "$$ #{Regexp.last_match[1]} $$"
        # pp latex
        latex
      }
    end

    # TODO 将 ruhoh 作为父节点内容的文件转换为 meta 文件
    # 比如将 Android/android.md 转为 Android/index.md
    # 配合 tree_generator 刚好 jekyll 能识别出标题
    def convert_notes_index(site)
      site.collections['notes'].files.each do |f|
        pp f.path # 打印非法的笔记文件
      end

      site.collections['notes'].docs.each do |doc|
        #if doc.basename.start_with?('index') or
          # 找出 xx/xxx/Android/android.md 的 doc
        if doc.cleaned_relative_path.split("/").inject({:pre=>nil,:result=>false}){|acc, e|
             {:pre => e, :result => acc[:pre] && e.casecmp(acc[:pre]).zero?}
           }[:result]
          FileUtils.mv(doc.path,File.join(File.dirname(doc.path),"index.md"))
        end
      end
    end
  end
end


# 将 ruhoh
# widgets :
#   math:
#     enable : true
# 转换为
# math : true
#
Jekyll::Hooks.register :documents, :pre_render do |doc|
  if doc.data['widgets']
    doc.data['widgets'].each{ |k,v|
      if v['enable']
        doc.data[k] = true
      end
    }
  end
end
