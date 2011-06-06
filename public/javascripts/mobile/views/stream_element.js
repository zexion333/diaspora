App.Views.StreamElement = Backbone.View.extend({
  tagName: "div",
  className: "stream-element",

  initialize: function(){
    this.model.bind("change", this.render);
    this.render();
  },

  events: {
    "click" : "showPost"
  },

  showPost: function(){
    window.location = "#posts/" + this.model.get('id')
  },

  render: function() {
    var $content = $("#content");
    TemplateHelper.get("stream_element", $.proxy(function(templateHtml) {
      $(this.el).html(
        $.mustache(templateHtml, this.model.toJSON())
      ).appendTo($content);
    }, this));
    return this;
  }

});
