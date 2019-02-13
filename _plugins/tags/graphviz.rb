# coding: utf-8
require 'cgi'
module Moon
  module Tags
    # TODO 增加直接加载文件，参考 include tag
    class GraphvizBlock < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
      end

      def render(context)
        "<div class=\"graphviz\" data-graph=\"#{CGI.escapeHTML(super)}\">
        </div>"
      end
    end
  end
end

Liquid::Template.register_tag("graphviz", Moon::Tags::GraphvizBlock)
