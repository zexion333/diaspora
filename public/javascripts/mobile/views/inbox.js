App.Views.Inbox = new (Backbone.View.extend({
  template: $.mustache,

  className: "conversation",

  render: function() {
    $("#content")
        .html("")
        .prepend("<div id=\"new_message_button\">+ new message</div>");

    _.each(App.Collections.Inbox.models, function(model) {
      new App.Views.InboxElement({
        model: model
      }).render();
    }); 

    return this;
  }

}));
