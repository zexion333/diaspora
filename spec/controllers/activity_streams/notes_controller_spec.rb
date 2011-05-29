require 'spec_helper'

describe ActivityStreams::NotesController do
  before do
    @json = {:format => :json}
  end
  describe '#create' do
    it 'allows token authentication' do
      bob.reset_authentication_token!
      get :create, @json.merge!(:auth_token => bob.authentication_token)
      response.should be_success
      warden.should be_authenticated
    end
  end
end
