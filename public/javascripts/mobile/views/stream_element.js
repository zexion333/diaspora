App.Views.StreamElement = Backbone.View.extend({
  tagName: "div",
  className: "stream-element",

  initialize: function(){
    this.model.bind("change", this.render);
    this.render();
  },

  render: function() {
    TemplateHelper.get("stream_element", $.proxy(function(templateHtml) {
      $(this.el).html(
        $.mustache(templateHtml, this.model.toJSON())
      ).appendTo("#content");
    }, this));
    return this;
  }

});
