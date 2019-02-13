# coding: utf-8
module Moon
  module Tags
    class MermaidBlock < Liquid::Block
      def initialize(tag_name, markup, tokens)
        super
      end

      def render(context)
        "<div class=\"mermaid\">#{super}</div>"
      end
    end
  end
end

Liquid::Template.register_tag("mermaid", Moon::Tags::MermaidBlock)
