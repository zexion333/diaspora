module NavigationHelpers
  def path_to(page_name)
    case page_name
      when /^the home(?: )?page$/
        root_path
      when /^step (\d)$/
        if $1.to_i == 1
          getting_started_path
        else
          getting_started_path(:step => $1)
        end
      when /^the tag page for "([^\"]*)"$/
        tag_path($1)
      when /^its ([\w ]+) page$/
        send("#{$1.gsub(/\W+/, '_')}_path", @it)
      when /^the ([\w ]+) page$/
        send("#{$1.gsub(/\W+/, '_')}_path")
      when /^my edit profile page$/
        edit_profile_path
      when /^my profile page$/
        original_person_path(:username => @me.person.username, :pod => @me.person.pod)
      when /^my acceptance form page$/
        accept_user_invitation_path(:invitation_token => @me.invitation_token)
      when /^"([^\"]*)"'s page$/
        person = User.find_by_email($1).person
        original_person_path(:username => person.username, :pod => person.pod)
      when /^my account settings page$/
        edit_user_path
      when /^the photo page for "([^\"]*)"'s post "([^\"]*)"$/
        photo_path(User.find_by_email($1).posts.find_by_text($2))
      when /^"(\/.*)"/
        $1
      else
        raise "Can't find mapping from \"#{page_name}\" to a path."
    end
  end
end

World(NavigationHelpers)
