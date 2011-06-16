App.Models.Conversation = Backbone.Model.extend({

 initialize: function() {
    this.messages = new App.Collections.Messages;
    this.messages.url = '/conversations/' + this.id + ".json";
    //this.messages.bind("refresh", this.updateCounts);
  }

});
