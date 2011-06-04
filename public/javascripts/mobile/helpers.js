var TemplateHelper = {
  cache: {},
  callbacks: {},
  path: "/javascripts/mobile/templates/",
  extension: ".mustache",
  get: function(templateName, callback) {
    this.callbacks[templateName] = this.callbacks[templateName] || [];

    if(!TemplateHelper.callbacks[templateName].length) {
      $.get(this.path + templateName + this.extension, function(data) {
        TemplateHelper.cache[templateName] = data;
        $.each(TemplateHelper.callbacks[templateName], function(index, callback) {
          callback(data);
        });
      });
    }

    this.callbacks[templateName].push(callback);
  }
};
