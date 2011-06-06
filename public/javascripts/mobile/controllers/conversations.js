App.Controllers.Conversations = Backbone.Controller.extend({
  routes: {
    "conversations": "index"
  },

  index: function() {
    App.Collections.Inbox.fetch({
      success: function() {
        App.Views.Inbox.render();
      }, 
      error: function() {
        console.log("err0r");
      }
    });

    return this;
  }
});
