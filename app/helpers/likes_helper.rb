#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module LikesHelper
  def likes_list(likes)
    links = likes.collect { |like| link_to "#{h(like.author.name.titlecase)}", person_path(like.author) }
    links.join(", ").html_safe
  end

  def like_action(target, current_user=current_user)
    if target.instance_of?(Comment)
      if current_user.liked?(target)
        link_to like_heart_red, comment_like_path(target, current_user.like_for(target)), :method => :delete, :class => 'unlike', :remote => true
      else
        link_to like_heart, comment_likes_path(target, :positive => 'true'), :method => :post, :class => 'like', :remote => true
      end

    else

      if current_user.liked?(target)
        link_to like_heart_red, post_like_path(target, current_user.like_for(target)), :method => :delete, :class => 'unlike', :remote => true
      else
        link_to like_heart, post_likes_path(target, :positive => 'true'), :method => :post, :class => 'like', :remote => true
      end
    end
  end

  def like_heart
    image_tag('icons/heart.png', :class => "heart")
  end

  def like_heart_red
    image_tag('icons/heart_red.png', :class => "heart")
  end
end
