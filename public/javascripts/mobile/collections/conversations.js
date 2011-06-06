App.Collections.Conversations = Backbone.Collection.extend({
  url: "/conversations.json",
  model: App.Models.Conversation

});
