App.Views.MessageElement = Backbone.View.extend({
  className: "inbox-element",

  render: function() {
    var $content = $("#content");
    TemplateHelper.get("inbox_element", $.proxy(function(templateHtml) {
      $(this.el).html(
        $.mustache(templateHtml, this.model.toJSON())
      ).appendTo($content);
    }, this));
    return this;
  }

});
