var App =  {
  initialize: function() {
    _.each(this.Controllers, function(controller) {
      new controller();
    });
    Backbone.history.start();

    if(window.location.hash === "#" || window.location.hash == "") {
      //hack for now
      _.each(Backbone.history.handlers, function(handler) {
        if(handler.route.test("aspects")) {
          handler.callback("aspects");
        }
      });
    }
    var $asteriskLogo = $("#asterisk-logo");
    $(document).ajaxStart(function() {
      $asteriskLogo.addClass("rideSpinners");
    }).ajaxSuccess(function() {
      $asteriskLogo.removeClass("rideSpinners");
    });
  },
  Collections: {},
  Controllers: {},
  Models: {},
  Views: {}
};

/* alias away the sync method */
Backbone._sync = Backbone.sync;

/* define a new sync method */
Backbone.sync = function(method, model, success, error) {
  /* only need a token for non-get requests */
  if (method == 'create' || method == 'update' || method == 'delete') {
    /* grab the token from the meta tag rails embeds */
    var auth_options = {};
    auth_options[$("meta[name='csrf-param']").attr('content')] =
                 $("meta[name='csrf-token']").attr('content');
    /* set it as a model attribute without triggering events */
    model.set(auth_options, {silent: true});
  }
  /* proxy the call to the old sync method */
  return Backbone._sync(method, model, success, error);
}

$(document).ready(function() {
  App.initialize();
});
