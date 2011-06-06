App.Controllers.Aspects = Backbone.Controller.extend({
  routes: {
    "aspects": "index"
  },

  index: function() {
    App.Collections.Stream.fetch({
      success: function() {
        App.Views.Stream.render();
      }
    });

    return this;
  }
});
