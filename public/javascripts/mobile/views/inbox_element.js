App.Views.InboxElement = Backbone.View.extend({
  tagName: "div",
  className: "inbox-element",

  initialize: function(){
    this.model.bind("change", this.render);
    this.render();
  },

  events: {
    "click" : "showConversation"
  },

  showConversation: function(){
    alert('unimplemented');
  },

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
