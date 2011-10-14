class ApiV1Controller < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  # this is a temporary test to check if the basic auth is working as it should
  # this file will get removed later.

  def me
    respond_to do |format|
      format.json { render :json => Profile.find(@current_user.id)}
    end
  end
end
