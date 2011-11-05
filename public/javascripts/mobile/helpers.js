var TemplateHelper = {
  cache: {},
  deferreds: {},
  path: "/javascripts/mobile/templates/",
  extension: ".mustache",
  get: function(templateName, callback) {
    if(this.deferreds[templateName]) {
      this.deferreds[templateName].done(callback);
    }
    else {
      this.deferreds[templateName] = $.get(this.path + templateName + this.extension)
        .done(function(template) { TemplateHelper.cache[templateName] = template; })
        .done(callback);
    }
  }
};
