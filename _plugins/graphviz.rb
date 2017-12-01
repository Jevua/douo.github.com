# coding: utf-8
require 'cgi'
module Moon
  module Tags
    # TODO 增加直接加载文件，参考 include tag
    class GraphvizBlock < Liquid::Block
      require 'pp'
      def initialize(tag_name, markup, tokens)
        pp "initialize"
        super
      end

      def render(context)
        s = "<div class=\"graphviz\" data-graph=\"#{CGI.escapeHTML(super)}\">
        </div>"
        puts s
        s
      end
    end
  end
end

Liquid::Template.register_tag("graphviz", Moon::Tags::GraphvizBlock)
