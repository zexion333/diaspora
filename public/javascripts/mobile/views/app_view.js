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
        _.each(Stream.models, function(model){
          new StreamElement({
            model: model
          }).render();
        });
      }
    });
    return this;
  }

});
