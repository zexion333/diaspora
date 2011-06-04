var StreamElement = Backbone.View.extend({
  tagName: "div",
  className: "stream-element",

  events: {
    "click": "showStreamElement"
  },

  showStreamElement: function() {
    alert("hi");
  },

  render: function() {
    var self = this;
    TemplateHelper.get("stream_element", function(templateHtml) {
      $(self.el).html(
        $.mustache(templateHtml, self.model.toJSON())
      ).appendTo("body");
    });
    
    return this;
  }

});
