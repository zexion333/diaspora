/*   Copyright (c) 2010, Diaspora Inc.  This file is
*   licensed under the Affero General Public License version 3 or later.  See
*   the COPYRIGHT file.
*/
(function() {
  var WidgetCollection = function() {
    this.ready = false;
    this.collection = {};
  };

  WidgetCollection.prototype.add = function(id, Widget) {
    var namespaces = id.split("."),
      widgetId = namespaces.pop(),
      namespace = this.namespace(namespaces);

    Widget.prototype._superClass = namespace;

    namespace[0][widgetId] = namespace[1][widgetId] = new Widget();
  };

  WidgetCollection.prototype.remove = function(id) {
    var namespaces = id.split("."),
      widgetId = namespaces.pop(),
      namespace = this.namespace(namespaces);

    delete namespace[0][widgetId];
    delete namespace[1][widgetId];
  };

  WidgetCollection.prototype.namespace = function(namespaces) {
     var collections = [this, this.collection],
       part;

    while(part = namespaces.shift()) {
      $.each(collections, function(index, collection) {
        if(typeof collection[part] === "undefined") {
          collection[part] = {};
        }
        collections[index] = collection[part];
      });
    }

    return collections;
  };

  WidgetCollection.prototype.start = function() {
    this.ready = true;
    for(var key in this.collection) {
     if(typeof this.collection[key].start !== "undefined") {
       this.collection[key].start();
     }
    }
  };

  window.Diaspora = {
    WidgetCollection: WidgetCollection,
    widgets: new WidgetCollection()
  };

})();