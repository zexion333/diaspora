App.Controllers.Posts = Backbone.Controller.extend({
  routes: {
    "posts/:id": "show"
  },

  show: function(id){

    var post = new App.Models.Post({id : id});


    post.fetch({
      success: function(){
        new App.Views.Post({
          model : post
        }).render();
      }
    });

    return this;
  }

});
