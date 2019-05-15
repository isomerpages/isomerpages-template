# frozen_string_literal: true

module Isomer
  module Base
    def initialize(tag_name, options, tokens)
      super
    end

    def markdown_converter
      @context.registers[:site].find_converter_instance(::Jekyll::Converters::Markdown)
    end
  end
end
