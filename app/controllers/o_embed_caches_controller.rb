class OEmbedCachesController < ApplicationController
  def show
    @oembed = OEmbedCache.find(params[:id])
    pp @oembed
    render :layout => false
  end
end

