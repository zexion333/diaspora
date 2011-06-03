var Posts = Backbone.Collection.extend({
  url: "/aspects.json",
  model: Post,

  comparator: function(post) {
    return post.get('date');
  },
}),
Stream = new Posts();
