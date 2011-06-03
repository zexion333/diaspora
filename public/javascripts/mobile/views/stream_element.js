var StreamElement = Backbone.View.extend({
  template: $.mustache,
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
      $(self.template(templateHtml, self.model.toJSON())).appendTo("body");
    });
    
    return this;
  }

});
