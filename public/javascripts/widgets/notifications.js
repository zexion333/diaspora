/*   Copyright (c) 2010, Diaspora Inc.  This file is
*   licensed under the Affero General Public License version 3 or later.  See
*   the COPYRIGHT file.
*/

(function() {
  var Notifications = function() {
    var self = this;

    this.subscribe("widget/ready", function() {
      self.badge = $("#notification_badge .badge_count")
      self.indexBadge =  $(".notification_count");
      self.onIndexPage = self.indexBadge.length > 0;
      self.notificationArea = $("#notifications");
      self.count = parseInt(self.badge.html()) || 0;

      $(".stream_element.unread").live("mousedown", function() {
        self.decrementCount();

        var notification = $(this);
        notification.removeClass("unread");

        $.ajax({
          url: "notifications/" + notification.data("guid"),
          type: "PUT"
        });
      });

      $("a.more").live("click", function(evt) {
        evt.preventDefault();
        $(this).hide()
          .next(".hidden")
          .removeClass("hidden");
      });
    });

    this.showHTMLNotification = function(notification){
      $(notification.html).prependTo(this.notificationArea)
				.fadeIn(200)
				.delay(8000)
				.fadeOut(200, function() {
	  			$(this).detach();
				});
    };

    this.showNotification = function(notification) {
      // If browser supports webkitNotifications and we have permissions to show those.
      if( window.webkitNotifications && window.webkitNotifications.checkPermission() == 0 ) {
        window.webkitNotifications.createNotification(
          $(notification.html).children("img"), // Icon
          "DIASPORA*", // Headline
          $(notification.html).text() // Body
          ).show();
      }
      else {
        // If browser supports webkitNotifications, but we don't have the permissions to show those... yet!
        if( window.webkitNotifications ) {
          window.webkitNotifications.requestPermission();
        }

        // If browser doesn't support webkitNotifications at all, or we currently don't have permissions
        this.showHTMLNotification(notification);

      }

      if(typeof notification.incrementCount === "undefined" || notification.incrementCount) {
        this.incrementCount();
      }
    };

    this.changeNotificationCount = function(change) {
      this.count += change;

      if(this.badge.text() !== "") {
				this.badge.text(this.count);
				if(this.onIndexPage)
	  		this.indexBadge.text(this.count + " ");

				if(this.count === 0) {
	  			this.badge.addClass("hidden");
	  			if(this.onIndexPage)
	    		this.indexBadge.removeClass('unread');
				}
				else if(this.count === 1) {
	  			this.badge.removeClass("hidden");
				}
      }
    };

    this.decrementCount = function() {
      self.changeNotificationCount(-1);
    };

    this.incrementCount = function() {
      self.changeNotificationCount(1);
    };
  };

  Diaspora.widgets.add("notifications", Notifications);
})();
