#   Copyright (c) 2010, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class BaseController < ApplicationController
  class AuthenticationFilter
    def initialize(scope = nil)
      @scope = scope
    end

    def filter(controller, &block)
      if controller.params[:auth_token]
        if controller.current_user
          yield
        else
          controller.fail!
        end
      else
        controller.request.env['oauth2'].authenticate_request! :scope => @scope do |*args|
          controller.sign_in controller.request.env['oauth2'].resource_owner
          block.call(*args)
        end
      end
    end
  end

  around_filter AuthenticationFilter.new, :only => :create
  skip_before_filter :verify_authenticity_token, :only => :create
  def fail!
    render :nothing => true, :status => 401
  end
end

