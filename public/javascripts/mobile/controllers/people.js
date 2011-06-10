App.Controllers.People = Backbone.Controller.extend({
  routes: {
    "people/:id": "show"
  },

  show: function(id){
    var person = new App.Models.Person({id : id});

    console.log(person);

    person.fetch({
      success: function(){
        new App.Views.Person({
          model : person
        }).render();
      }
    });

    return this;
  }

});
