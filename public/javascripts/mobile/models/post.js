App.Models.Post = Backbone.Model.extend({
  url: function(){
    return '/status_messages/' + this.id + '.json'
  }
});
