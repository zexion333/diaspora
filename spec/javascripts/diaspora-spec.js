/*   Copyright (c) 2010, Diaspora Inc.  This file is
*   licensed under the Affero General Public License version 3 or later.  See
*   the COPYRIGHT file.
*/

describe("Diaspora", function() {
  describe("WidgetCollection", function() {
    describe("prototype", function() {
      beforeEach(function() {
        window.widgets = new Diaspora.WidgetCollection();
      });

      describe("add", function() {
        it("adds a widget to the collection", function() {
          expect(window.widgets.collection["nameOfWidget"]).not.toBeDefined();
          window.widgets.add("nameOfWidget", function() { });
          expect(window.widgets["nameOfWidget"]).toBeDefined();
        });

        it("sets a shortcut by referencing the object on Diaspora.widgetCollection", function() {
          expect(window.widgets.sup).toBeFalsy();
          window.widgets.add("sup", function() { });
          expect(window.widgets.sup).toEqual(window.widgets.sup);
        });
      });

      describe("remove", function() {
        it("removes a widget from the collection", function() {
          window.widgets.add("nameOfWidget", function() { });
          expect(window.widgets["nameOfWidget"]).toBeDefined();
          window.widgets.remove("nameOfWidget");
          expect(window.widgets["nameOfWidget"]).not.toBeDefined();
        });
      });

      describe("init", function() {
        it("calls the start method on all of the widgets present", function() {
          window.widgets.add("nameOfWidget", function() {
            this.start = function() { }
          });

          spyOn(window.widgets["nameOfWidget"], "start");
          window.widgets.start();
          expect(window.widgets["nameOfWidget"].start).toHaveBeenCalled();
        });
        it("changes the ready property to true", function() {
          expect(window.widgets.ready).toBeFalsy();
          window.widgets.start();
          expect(window.widgets.ready).toBeTruthy();
        });
      });
    });
  });
});
