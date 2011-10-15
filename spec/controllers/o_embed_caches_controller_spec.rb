#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe OEmbedCachesController do
  before do
    @status = alice.post(:status_message, :text => "hello", :to => alice.aspects.first)
    @status.o_embed_cache = OEmbedCache.new(:url => "http://oembedable_data.com/abc", :data => "here is some ")

    @controller.stub(:current_user).and_return(bob)
    sign_in :user, bob
  end

  describe '#show' do
    it "renders the oembed html" do
      cache = stub.as_null_object
      @controller.stub(:cache).and_return(cache)
      @cotroller.should_receive(:o_embed_html).
        with(cache).and_return("123")

      post :show, :id => 1, :url => "http://123.com/video"

      response.body.should == "123"
    end
  end

  describe '#cache' do
    it 'finds the cache once' do
      url = "http://1231231.com/video"
      @controller.params[:url] = url
      OEmbedCache.should_receive(:where).with(
        hash_including({:url => url})).once.and_return(stub.as_null_object)

      @controller.cache
      @controller.cache
    end
  end
end
