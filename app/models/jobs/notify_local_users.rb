#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module Jobs
  class NotifyLocalUsers < Base
    @queue = :receive_local

    require File.join(Rails.root, 'app/models/notification')

    def self.perform(user_ids, object_klass, object_id, person_id)
      object = object_klass.constantize.find_by_id(object_id)

      user = object.author.owner
      users = object.users_to_be_notified(user)

      pp '=================================================='
      pp users
      pp '=================================================='

      person = Person.find_by_id(person_id)
      users.each do |user|
        Notification.notify(user, object, person)
      end
    end
  end
end
