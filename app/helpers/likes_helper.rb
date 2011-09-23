#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module LikesHelper
  def likes_list(likes)
    links = likes.collect { |like| link_to "#{h(like.author.name.titlecase)}", person_path(like.author) }
    links.join(", ").html_safe
  end

  def like_action(target, current_user=current_user, opts= {})
    if current_user.liked?(target)
      already_liked_link(target, current_user, opts)
    else
      not_yet_liked_link(target, current_user, opts)
    end
  end

  def already_liked_link(target, current_user=current_user, opts= {})
    link_opts = {:method => :delete, :class => 'unlike', :remote => true}
    link_opts[:class] << " #{opts[:class]}" if opts[:class]

    if target.is_a?(Comment)
      link_target = comment_like_path(target, current_user.like_for(target))
    else
      link_target = post_like_path(target, current_user.like_for(target))
    end

    link_to like_heart_red, link_target, link_opts
  end

  def not_yet_liked_link(target, current_user=current_user, opts= {})
    link_opts = {:method => :post, :class => 'like', :remote => true}
    link_opts[:class] << " #{opts[:class]}" if opts[:class]

    if target.is_a?(Comment)
      link_target = comment_likes_path(target, :positive => 'true')
    else
      link_target = post_likes_path(target, :positive => 'true')
    end
    
    link_to like_heart, link_target, link_opts
  end

  def like_heart
    image_tag('icons/heart.png', :class => "heart")
  end

  def like_heart_red
    image_tag('icons/heart_red.png', :class => "heart")
  end
end
