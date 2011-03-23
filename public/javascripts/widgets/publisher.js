/*   Copyright (c) 2010, Diaspora Inc.  This file is
 *   licensed under the Affero General Public License version 3 or later.  See
 *   the COPYRIGHT file.
 */
(function() {
  var Publisher = function() {
    this.start = function() {
      this.form = $("#publisher form");
      this.input = this.form.find("#status_message_fake_message");
      this.submit = this.form.find("#status_message_submit");
      this.hiddenInput = this.form.find("#status_message_message");
      this.photoDropZone = this.form.find("#photodropzone");
      this.publicField = this.form.find("#status_message_public");


      this.input.val(this.hiddenInput.val());

      if (this.input.val().trim() === "") {
        this.close();
      }

      this.input.focus(function() {
        this.open();
      });

      $(".service_icon").click(function(evt) {
        evt.preventDefault();

        $(this).toggleClass("dim");
        this.toggleServiceField($(this).attr('id'));
      });

      $(".public_icon").click(function(evt) {
        evt.preventDefault();

        $(this).toggleClass("dim");
        if(this.publicField.val() === "false") {
          this.publicField.val("true");
        }
        else {
          this.publicField.val("false");
        }
      });

      this.input.keyup(this.canSubmit);
    };
  };

  Publisher.prototype.close = function() {
    this.form.addClass("closed");
    this.input.css("min-height", "");
  };

  Publisher.prototype.open = function() {
    this.form.removeClass("closed");
    this.input.css("min-height", "42px");
    this.canSubmit();
  };

  Publisher.prototype.canSubmit = function() {
    var blank = (this.input.val().trim() === ""),
      isSubmitDisabled = this.submit.attr("disabled");

    if(blank && !isSubmitDisabled) {
      this.submit.attr("disabled", true);
      return false;
    }
    else if(!blank && isSubmitDisabed) {
      this.submit.removeAttr("disabled");
      return true;
    }
  };

  Publisher.prototype.clear = function() {
    this.photoDropZone.empty();
    this.input.removeClass("with_attachments");
  };

  Publisher.prototype.toggleServiceField = function(service) {
    var hiddenField = this.form.find("#service_" + service);

    if(hiddenField.length) {
      hiddenField.detach();
    }
    else {
      $("<input/>", {
        id: "service_" + service,
        name: "services[]",
        value: service
      }).appendTo(this.form.find("form"));
    }
  };

  Diaspora.widgets.add("publisher", Publisher);
})();