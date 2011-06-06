var App =  {
  initialize: function() {
    _.each(this.Controllers, function(controller) {
      new controller();
    });
  },
  Collections: {},
  Controllers: {},
  Models: {},
  Views: {}
};
