App.Views.Person = Backbone.View.extend({
  className: "person-view",

  initialize: function(){
    this.render();
  },


  events: {
  },


  render: function() {
    var $content = $("#content").html("");
    TemplateHelper.get("person", $.proxy(function(templateHtml) {
      $(this.el).html(
        $.mustache(templateHtml, this.model.toJSON())
      ).appendTo($content);
    }, this));
    return this;

  }

});
