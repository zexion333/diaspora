describe("TemplateHelper", function() {
  var callbackSpy;
  beforeEach(function() {
    jasmine.Ajax.useMock();

    callbackSpy = jasmine.createSpy();
  });

  describe("get", function() {
    it("only makes one ajax request for a template", function() {
      TemplateHelper.get("foo", function() { });
      expect(ajaxRequests.length).toEqual(1);

      TemplateHelper.get("foo", function() { });
      expect(ajaxRequests.length).toEqual(1);
    });

    it("fires all queued callbacks when the ajax request finishes", function() {
      TemplateHelper.get("foo", callbackSpy);
      TemplateHelper.get("foo", callbackSpy);

      mostRecentAjaxRequest().response({status: 200});

      expect(callbackSpy.callCount).toEqual(2);
    });

    it("caches the template", function() {
      TemplateHelper.get("foo", callbackSpy);

      expect(ajaxRequests.length).toEqual(1);
      mostRecentAjaxRequest().response({responseText: "bar", status:200});

      TemplateHelper.get("foo", callbackSpy);
      expect(ajaxRequests.length).toEqual(1);
    });
  });
});