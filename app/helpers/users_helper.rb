module UsersHelper
  def owner_image_tag(opts)
    person_image_tag(current_user.person, opts)
  end

  def owner_image_link
    person_image_link(current_user.person)
  end

  def mine?(post)
    current_user.owns? post
  end
end
