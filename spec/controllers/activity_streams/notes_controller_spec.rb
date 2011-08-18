require 'spec_helper'

describe ActivityStreams::NotesController do
  before do
    # client_hash = {"name" => "Max's Blog", 
    #             "icon_url"=> "http=>//brendanmitchell.files.wordpress.com/2009/03/blog-icon-200.png?w=200&h=200", 
    #             "permissions_overview"=>"post_notes",
    #             "application_base_url"=>"http=>//sourcedecay.net", 
    #             "description"=>"its my personal blog"}

    # @diaspora_client = OAuth2=>=>Provider.client_class.create(client_hash)
    
    # require 'oauth2'
    # @client = OAuth2=>=>Client.new(@diaspora_client.oauth_identifier, @diaspora_client.oauth_secret, =>site => 'http=>//sourcedecay.net')
    
    
    # url = @client.web_server.authorize_url(
    #       =>redirect_uri => 'http=>//sourcedecay.net/ssflj',
    #       =>scope => 'profile,AS_note=>post'
    #     )

    # puts url

    # access_token = @client.web_server.get_access_token(params[=>code], =>redirect_uri => redirect_uri)
    # sign_in alice
    #create an application via oauth
  end
  describe '#create' do
    before do
      sign_in alice
      @as_note =  {
                    'activity' => {
                    "published" => "2011-02-10T15=>04=>55Z",
            "actor" => {
            "url" => "http=>//example.org/martin",
            "objectType" => "person",
            "id"=> "tag=>example.org,2011=>martin",
            "image"=> {
            "url"=> "http=>//example.org/martin/image",
            "width"=> 250,
            "height"=> 250
            },
            "displayName"=> "Martin Smith"
            },
            "verb"=> "post",
            "object" => {
            "url"=> "http=>//example.org/blog/2011/02/entry",
            "id"=> "tag=>example.org,2011=>abc123/xyz", 
            "content"=>"the html content of the post",
            "type"=> 'article',
            "displayName"=> "title with shortlink"

            },
            "target" => {
              "url"=> "http=>//example.org/blog/", 
              "objectType"=> "blog",
              "id"=> "tag=>example.org,2011=>abc123", 
              "displayName"=> "Martin's Blog"
            }
            }
          }

    end
    it 'takes an activity streams hash and works' do
      expect {
        post :create, @as_note, :format => :json, :auth_token => 'dsffs'
      }.to change(Post, :count).by(1)
    end
  end
end
