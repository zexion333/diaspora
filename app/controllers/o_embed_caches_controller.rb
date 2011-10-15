#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.
#

class OEmbedCachesController < ApplicationController
  before_filter :authenticate_user!
  helper_method :cache

  def show
    unless cache
      render :nothing => true
    end

    render :layout => false
  end

  def cache
    @cache ||= OEmbedCache.where(:url => params[:url]).first
  end
end
