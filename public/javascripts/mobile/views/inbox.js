App.Views.Inbox = new (Backbone.View.extend({
  template: $.mustache,

  className: "conversation",

  render: function() {
    $("#content").html("");
    _.each(App.Collections.Inbox.models, function(model) {
      new App.Views.InboxElement({
        model: model
      }).render();
    }); 

    return this;
  }
}));
