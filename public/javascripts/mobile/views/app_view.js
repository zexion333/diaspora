App.Views.Index = Backbone.View.extend({
  template: $.mustache,

  el: $("#diasporamobile"),

  className: "stream-element",

  initialize: function() {
  
    this.render();
  },

  render: function() {
    App.Collections.Stream.fetch();
    return this;
  }

});
