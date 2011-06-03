var AspectsController = Backbone.Controller.extend({
  routes: {
    "aspects": "index"
  },

  index: function() {
    var post = new Post({
      author: "dan",
      content: "foo",
      date: new Date
    });

    console.log(post);
  }
});
