App.Views.Person = Backbone.View.extend({
  className: "person-view",

  initialize: function(){
    this.render();
  },

  events: {
  },

  render: function() {
    var $content = $("#content").html("");
    TemplateHelper.get("person", $.proxy(function(personTemplateHtml) {
      TemplateHelper.get("stream_element", $.proxy(function(postTemplateHtml) {

        $(this.el).html(
          $.mustache(personTemplateHtml, this.model.toJSON(), {stream_element: postTemplateHtml})
        ).appendTo($content);
      }, this));
    }, this));

    return this;
  }

});
