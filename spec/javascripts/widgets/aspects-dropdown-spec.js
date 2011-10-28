describe("Diaspora.Widgets.AspectsDropdown", function() {
  var aspectsDropdownWidget,
    aspectsDropdown;

  describe("when the dropdown is a publisher dropdown", function() {
    beforeEach(function() {
      spec.loadFixture("aspects_index");

      Diaspora.Page = "TestPage";
      Diaspora.instantiatePage();

      aspectsDropdown = $("#publisher .dropdown");
      aspectsDropdownWidget = Diaspora.BaseWidget.instantiate("AspectsDropdown", aspectsDropdown);
    });

    describe("clicking a radio button", function() {
      describe("integration", function() {
        it("calls AspectsDropdown#radioClicked", function() {
          aspectsDropdownWidget = new Diaspora.Widgets.AspectsDropdown();

          spyOn(aspectsDropdownWidget, "radioClicked");

          aspectsDropdownWidget.publish("widget/ready", [aspectsDropdown]);

          aspectsDropdownWidget.radioSelectors.first().click();

          expect(aspectsDropdownWidget.radioClicked).toHaveBeenCalled();
        })
      });

      it("clears the selected aspects", function() {
        var aspectSelectors = aspectsDropdown.find(".aspect_selector").click();

        expect(aspectsDropdown).toContain("li.aspect_selector.selected");

        aspectsDropdown.find(".radio:first").click();

        expect(aspectsDropdown).not.toContain("li.aspect_selector.selected");
      });

      it("clears selected radio buttons", function() {
        aspectsDropdown.find(".selected").removeClass("selected");

        var firstRadioSelector = aspectsDropdown.find(".radio:first"),
          lastRadioSelector = aspectsDropdown.find(".radio:last");

        expect(firstRadioSelector).not.toHaveClass("selected");
        expect(lastRadioSelector).not.toHaveClass("selected");

        firstRadioSelector.click();

        expect(firstRadioSelector).toHaveClass("selected");

        lastRadioSelector.click();

        expect(firstRadioSelector).not.toHaveClass("selected");
        expect(lastRadioSelector).toHaveClass("selected");
      });

      it("toggles the radio selector", function() {
        var radioSelector = aspectsDropdown.find(".radio:first");

        expect(radioSelector).not.toHaveClass("selected");

        radioSelector.click();

        expect(radioSelector).toHaveClass("selected");

        radioSelector.click();

        expect(radioSelector).not.toHaveClass("selected");
      });
    });

    describe("clicking an aspect", function() {
      describe("integration", function() {
        it("calls through to AspectsDropdown#toggleAspectSelection", function() {
          aspectsDropdownWidget = new Diaspora.Widgets.AspectsDropdown();

          spyOn(aspectsDropdownWidget, "toggleAspectSelection");

          aspectsDropdownWidget.publish("widget/ready", [aspectsDropdown]);

          aspectsDropdownWidget.aspectSelectors.first().click();

          expect(aspectsDropdownWidget.toggleAspectSelection).toHaveBeenCalled();
        });
      });

      it("deselects the radio buttons", function() {
        var aspectSelector = aspectsDropdownWidget.aspectSelectors.first(),
          radioSelector = aspectsDropdown.find(".radio:last");

        expect(radioSelector).toHaveClass("selected");

        aspectSelector.click();

        expect(radioSelector).not.toHaveClass("selected");
      });
    });

    describe("clicking on an aspect", function() {
      it("toggles the aspect selector", function() {
        var aspectSelector = aspectsDropdownWidget.aspectSelectors.first().removeClass("selected")  ;

        expect(aspectSelector).not.toHaveClass("selected");

        aspectSelector.click();

        expect(aspectSelector).toHaveClass("selected");

        aspectSelector.click();

        expect(aspectSelector).not.toHaveClass("selected");
      });
    });
  });

  describe("toggleAspectMembership", function() {
    var aspectListItem;
    beforeEach(function() {
      spec.loadFixture("people_show");

      Diaspora.Page = "TestPage";
      Diaspora.instantiatePage();

      aspectsDropdown = $(".aspect_membership.dropdown");
      aspectsDropdownWidget = Diaspora.BaseWidget.instantiate("AspectsDropdown", aspectsDropdown);
      aspectListItem = aspectsDropdownWidget.aspectSelectors.first();
    });

    it("doesn't do anything if the button has class of disabled or newItem", function() {
      aspectListItem.addClass("disabled");

      expect(aspectListItem).not.toHaveClass("selected");

      aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

      expect(aspectListItem).not.toHaveClass("selected");

      aspectListItem.removeClass("disabled");
      aspectListItem.addClass("newItem");

      expect(aspectListItem).not.toHaveClass("selected");

      aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

      expect(aspectListItem).not.toHaveClass("selected");
    });

    it("adds the loading class to the list item", function() {
      expect(aspectListItem).not.toHaveClass("loading");

      aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

      expect(aspectListItem).toHaveClass("loading");
    });

    describe("when the aspect is selected", function() {
      beforeEach(function() {
        aspectListItem.addClass("selected");
      });

      it("DELETEs to the aspects membership controller with the aspect id and person id", function() {
        spyOn($, "post");

        aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

        expect($.post).toHaveBeenCalledWith("/aspect_memberships/42.json", {
          aspect_id: aspectListItem.data("aspect_id"),
          person_id: aspectsDropdown.find("ul").data("person_id"),
          _method: "DELETE"
        }, jasmine.any(Function));
      });

      describe("when the ajax request succeeds", function() {
        beforeEach(function() {
          jasmine.Ajax.useMock();
        });

        it("removes the loading class", function() {
          expect(aspectListItem).not.toHaveClass("loading");

          aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

          expect(aspectListItem).toHaveClass("loading");

          mostRecentAjaxRequest().response({
            responseHeaders: {
              "Content-type": "application/json"
            },
            responseText: spec.readFixture("ajax_remove_from_aspect"),
            status: 200
          });

          expect(aspectListItem).not.toHaveClass("loading");
        });

        it("removes the selected class", function() {
          expect(aspectListItem).toHaveClass("selected");

          aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

          mostRecentAjaxRequest().response({
            responseHeaders: {
              "Content-type": "application/json"
            },
            responseText: spec.readFixture("ajax_remove_from_aspect"),
            status: 200
          });

          expect(aspectListItem).not.toHaveClass("selected");
        });
      });
    });

    describe("when the aspect is not selected", function() {
      beforeEach(function() {
        aspectListItem.removeClass("selected");
      });

      it("POSTs to aspects_membership", function() {
        spyOn($, "post");

        aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

        expect($.post).toHaveBeenCalledWith("/aspect_memberships.json", {
          aspect_id: aspectListItem.data("aspect_id"),
          person_id: aspectsDropdown.find("ul").data("person_id"),
          _method: "POST"
        }, jasmine.any(Function));
      });

      describe("when the ajax request succeeds", function() {
        it("removes the loading class", function() {
          expect(aspectListItem).not.toHaveClass("loading");

          aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

          expect(aspectListItem).toHaveClass("loading");

          mostRecentAjaxRequest().response({
            responseHeaders: {
              "Content-type": "application/json"
            },
            responseText: spec.readFixture("ajax_add_to_aspect"),
            status: 200
          });

          expect(aspectListItem).not.toHaveClass("loading");
        });

        it("removes the selected class", function() {
          expect(aspectListItem).not.toHaveClass("selected");

          aspectsDropdownWidget.toggleAspectMembership(aspectListItem);

          mostRecentAjaxRequest().response({
            responseHeaders: {
              "Content-type": "application/json"
            },
            responseText: spec.readFixture("ajax_add_to_aspect"),
            status: 200
          });

          expect(aspectListItem).toHaveClass("selected");
        });
      });
    });
  });
});