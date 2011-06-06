App.Views.Post = Backbone.View.extend({
  tagName: "div",
  className: "post-view",

  initialize: function(){
    this.render();
  },

  render: function() {
    var $content = $("#content").html("");
    TemplateHelper.get("post", $.proxy(function(templateHtml) {
      $(this.el).html(
        $.mustache(templateHtml, this.model.toJSON())
      ).appendTo($content);
    }, this));
    return this;
  }

});
