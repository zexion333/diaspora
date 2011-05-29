class ActivityStreams::NotesController < ApplicationController
  before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token, :only => :create

  respond_to :json 
  def create
    puts params.inspect
    render :nothing =>true
  end
end
