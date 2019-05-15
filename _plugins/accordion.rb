# frozen_string_literal: true

module Jekyll
  class AccordionTagBlock < Liquid::Block
    def initialize(tag_name, title, tokens)
      super
      @title = title
    end

    def render(context)
      text = super
      "<div class=\"accordion\"><div class=\"col is-large bp-accordion-header padding has-icons-right field has-addons is-marginless pointer\">
    		<div class=\"col is-expanded is-fullwidth is-paddingless\">
    			<h5 class=\"has-text-grey-dark is-marginless\"><b>#{@title}</b></h5>
    		</div>
    		<span class=\"sgds-icon sgds-icon-plus is-size-4 bp-accordion-button\"></span>
    	</div><div class=\"col padding bp-accordion-body\"><p class=\"margin--top--none\">#{text}</p></div></div>"
    end
  end
end

Liquid::Template.register_tag('accordion', Jekyll::AccordionTagBlock)
