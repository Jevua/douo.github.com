# coding: utf-8

module Moon
  class Resource < Jekyll::StaticFile
    def initialize(site, base, dir, name, realpath)
      @site = site
      @base = base
      @dir = dir
      @name = name
      @realpath = realpath
    end

    def modified_time
      @modified_time ||= File.stat(@realpath).mtime
    end

    # Is source path modified?
    #
    # Returns true if modified since last write.
    def modified?
      self.class.mtimes[@realpath] != mtime
    end

    private
    def copy_file(dest_path)
      if @site.safe || Jekyll.env == "production"
        FileUtils.cp(@realpath, dest_path)
      else
        FileUtils.copy_entry(@realpath, dest_path)
      end

      unless File.symlink?(dest_path)
        File.utime(self.class.mtimes[@realpath], self.class.mtimes[@realpath], dest_path)
      end
    end
  end

  class ResourceGenerator < Jekyll::Generator
    RESOURCE_DIR = "_res"

    attr_accessor :site
    # dir - dir 目录下的文件将作为 static file 读取
    # top - 是否是资源根目录，只有根目录下的目录才会被当成 collection 处理
    def read(dir, top=true)
      base = site.in_source_dir(dir)

      # _ 开头的文件或者目录会被忽略
      dot = Dir.chdir(base) { filter_entries(Dir.entries("."), base) }
      dot_dirs = dot.select { |file| File.directory?(@site.in_source_dir(base, file)) }
      dot_files = (dot - dot_dirs)
      retrieve_resource_files(dir, dot_files)
      if top
        retrieve_top_dir(base, dot_dirs)
      else
        dot_dirs.each{ |dir| read(dir, false)}
      end
    end

    def retrieve_resource_files(dir,files)
      files.each do |file|
        site.static_files << Resource.new(site, site.source, dir, file, File.join(dir,file))
      end
    end

    def retrieve_top_dir(base, dirs)
      dirs.each do |dir|
        if site.collections[dir]
          retrieve_collection_resource(base, dir, site.collections[dir])
        else
          read(dir, false)
        end
      end
    end

    def retrieve_collection_resource(base, dir, collection)
      collection.docs.each do |doc|
        doc_dir = File.join(base, dir, doc.cleaned_relative_path)
        if File.exist?(doc_dir)
          Dir.chdir(site.in_source_dir(doc_dir)) do
            retrieve_doc_resource(doc_dir, ".", doc)
          end
        end
      end
    end

    # base doc resource 目录的绝对路径比如 ：_res/posts/2013-10-22-the-pain-of-note-2
    # dir 当前遍历的目录
    # doc 当前 doc 对象
    def retrieve_doc_resource(base, dir, doc)
      pp [base, dir]
      filter_entries(Dir.entries(dir)).each do |file|
        file = File.join(dir,file)
        if File.directory?(file)
          retrieve_doc_resource(base, file, doc)
        else
          # 只支持 pretty 形式的 permalinks，也就是说不能有 .html 后缀名
          url = doc.url
          pp url[0..-(File.extname(url).length + 1)]
          pp site.in_source_dir(File.join(base,file))
          site.static_files << Resource.new(site,
                                            site.source,
                                            url,
                                            file,
                                            site.in_source_dir(File.join(base,file)))
        end
      end
    end

    def filter_entries(entries, base_directory = nil)
      Jekyll::EntryFilter.new(site, base_directory).filter(entries)
    end

    # 将 _post/date-name.md 转为 posts/date-name
    def doc_resource_path(base, doc)
      File.join(base, doc.collection.label, doc.cleaned_relative_path)
    end

    def generate(site)
      self.site = site
      require 'pp'
      # site.posts.docs.each{ |doc|  pp doc.url}
      #read(RESOURCE_DIR)
      res_dir = RESOURCE_DIR
      base = site.in_source_dir(res_dir)
      site.collections
        .select{|_,c| File.exist?(File.join(res_dir, c.label))}
        .flat_map{|_, c| c.docs}
        .select { |doc| File.exist?(doc_resource_path(base, doc))}
        .each { |doc|
        doc_dir = doc_resource_path(base, doc)
        Dir.chdir(site.in_source_dir(doc_dir)) do
          retrieve_doc_resource(doc_dir, ".", doc)
        end
      }
    end
  end
end
