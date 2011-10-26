class OEmbedCachesController < ApplicationController
  def show
    @oembed = OEmbedCache.find(params[:id])
    render :layout => false
  end
end

