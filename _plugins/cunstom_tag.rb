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

    class TreeGenerator

      def tree
        return @root if @root
        @root = Node.new(@site)
        dictionary
        @root
      end

      def to_json
        @root.class
      end

      def tree_add(data)
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

    module TreeFilter
      def tree(data)
        site = @context.registers[:site];
        t = TreeGenerator.new
        data.each{ |doc|
          t.tree_add(doc)
        }
        t.tree.to_json
      end
    end
end

Liquid::Template.register_filter(Moon::TreeFilter)
