App.Controllers.Conversations = Backbone.Controller.extend({
  routes: {
    "conversations": "index",
    "conversations/new": "newConvo",
    "conversations/:id": "show"
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
  },

  show: function(id){
    conversation = new App.Models.Conversation({"id" : id});
    conversation.messages.fetch({
      success: function(){
        $("#content").html("");

        _.each(conversation.messages.models, function(model) {
          new App.Views.MessageElement({
            model: model
          }).render();
        }); 

      },

      failure: function(){
        console.log("err0r");
      }
    });

    return this;
  },


  newConvo: function(){
    $("#content").html("");

    return this;
  }

});
