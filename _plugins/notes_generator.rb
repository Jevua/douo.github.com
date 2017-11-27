# coding: utf-8
module Moon
  class Node
    attr_accessor :name, :level, :data, :parent
    attr_reader :children, :site

    def initialize(site,is_leaf = false)
      @site = site
      @level = 0
      @children = [] unless is_leaf
    end

    def []=(name, node)
      node.name = name
      node.level = @level + 1
      insert(node)
    end

    def [](name)
      children.each{|c| return c if c.name==name}
      nil
    end

    def insert(node)
      idx = 0
      children.each do |v|
        break if (node <=> v) > 0
        idx += 1
      end
      children.insert(idx,node)
    end

    def has_child
      @children && @children.size > 0
    end

    def is_leaf
      ! @children
    end

    def size
      @children ? @children.size : 0
    end

    # 计算所有叶节点数目，也就是当前分类的所有笔记数目
    # Returns 所有叶节点数目，叶节点返回 1
    # 可用 DP 算法，优化编译的效率
    def count
      if has_child
        @children.inject(0){|sum,child|
          sum + child.count
        }
      else
        1
      end
    end

    def order (y)
      order = @site['notes']["order"]
      if order.index(name)
        if order.index(y.name)
          order.index(y.name) <=> order.index(name) 
        else
          1
        end
      else
        -1
      end
    end

    def <=> (y)
      if level == 1
        order(y)
      elsif !is_leaf and y.is_leaf
        1
      elsif is_leaf and !y.is_leaf
        -1
      else
        name<=>y.name
      end
    end

    def submenu
      level>1
    end

    def simple_data
      data = {'title' => @data ? @data['title'] : name}
      data['url'] = @data.url if @data
      data['children'] = @children.map{|c| c.simple_data} if @children
      data
    end

    def to_json(*a)
      simple_data.to_json(*a)
    end
  end

  class Tree

    def initialize(site)
      @site = site
    end

    def tree
      return @root if @root
      @root = Node.new(@site)
      dictionary
      @root
    end

    def to_json
      @root.to_json
    end

    #
    #  根据目录添加到树中
    #
    def add(data)
      @root ||= Node.new(@site)
      p = @root
      link = data.relative_path.split(File::SEPARATOR)
      link.each{|n|
        if File.basename(n,'.*') == 'index'
          break
        end
        if !p[n]
          node = (n == link.last ? Node.new(@site,true) : Node.new(@site))
          node.parent = p
          p[n] = node
        end
        p = p[n]
      }
      p.data = data
    end

    # TODO
    def tree_delete(pointer)
      puts 'node_delete'
      puts pointer
    end
  end

  class JSONPage < Jekyll::Page
  end

  # 如果 collection 的 metadata  to_tree 为 true
  # 那么插件将在 collection 目标目录下生成一个 tree.json 文件
  # 
  class NotesGenerator < Jekyll::Generator

    def generate(site)

      site.collections.each do |_,collection|
        next unless collection.metadata['to_tree']
        full_path = "#{site.dest}/#{collection.label}/"
        ensure_directory(full_path)

        tree = Tree.new(site)
        collection.docs.each{ |doc|
          tree.add(doc)
        }

        pp collection.metadata
        pp full_path

        file = Moon::JSONPage.new(site, site.dest, collection.label, 'tree.json')
        file.content = tree.to_json
        file.data["layout"] = nil
        file.data["sitemap"] = false
        file.output
        site.pages << file
        collection.metadata["tree"] = "/#{collection.label}/tree.json"
      end
    end

    def ensure_directory(path)
      FileUtils.mkdir_p(path)
    end

  end

end
