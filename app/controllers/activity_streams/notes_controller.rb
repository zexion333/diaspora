class ActivityStreams::NotesController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token, :only => :create

  respond_to :json 
  def create
    @note = current_user.build_post(:status_message, :text => params[:text], :to => current_user.aspects)
    @note.save
    render :nothing =>true, :code => 200
  end
end
