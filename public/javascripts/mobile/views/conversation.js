App.Views.Conversation = Backbone.View.extend({
  className: "post-view",

  initialize: function(){
    this.render();
  },

  events: {
    "submit #new_comment_form" : "submitMessage",
  },

  render: function() {
    var $content = $("#content").html("in here");

    return this;
  },

  submitMessage: function(evt){
    return this;
  }

});
