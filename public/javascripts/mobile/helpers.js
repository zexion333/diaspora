var TemplateHelper = {
  path: "/javascripts/mobile/templates/",
  extension: ".mustache",
  get: function(templateName, callback) {
    var template = $("#templates_" + templateName);
    if(template.length) {
      return callback(template.text());
    }

    $.get(this.path + templateName + this.extension, function(data) {
      $("<script/>", {
        id: "templates_" + templateName,
        type: "text/html"
      }).text(data).appendTo("head");

      callback(data);
    });
  }

};
