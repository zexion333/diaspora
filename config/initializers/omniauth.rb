#   Copyright (c) 2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

Rails.application.config.middleware.use OmniAuth::Builder do
  if AppConfig.configured_services.include?('twitter')
    provider :twitter, SERVICES['twitter']['consumer_key'], SERVICES['twitter']['consumer_secret']
  end

  if AppConfig.configured_services.include?('tumblr')
    provider :tumblr, SERVICES['tumblr']['consumer_key'], SERVICES['tumblr']['consumer_secret']
  end

  if AppConfig.configured_services.include?('facebook')
    provider :facebook, SERVICES['facebook']['app_id'], SERVICES['facebook']['app_secret'], { :scope => "publish_stream,email,offline_access",
                                                                                              :client_options => {:ssl => {:ca_file => AppConfig[:ca_file]}}}
  end

  if AppConfig.configured_services.include?('google')
    provider :google, SERVICES['google']['client_id'], SERVICES['google']['client_secret'], {:scope => 'https://www.google.com/m8/feeds/'}
  end
end
