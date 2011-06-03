var AppView = Backbone.View.extend({
  template: $.mustache,

  el: $("#diasporamobile"),

  className: "stream-element",

  initialize: function() {
    this.render();
  },

  render: function() {
    Stream.fetch({
      success: function() {
        TemplateHelper.get("stream_element", function(template) { 
          _.each(Stream.models, function(model) {
            $($.mustache(template, model.toJSON())).appendTo(document.body);
          });
        });
      }
    });
    return this;
  }

});
