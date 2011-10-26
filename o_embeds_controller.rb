class OEmbedCachesController < ApplicationController
  def show
    @oembed = OEmbedCache.find(params[:id])
  end
end

