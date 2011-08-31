require 'resque'

begin
  # Configure Redis to Go 
  if redis_to_go = ENV["REDISTOGO_URL"]
    uri = URI.parse(redis_to_go)
    Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)
    Rails.logger.info("resque connected to #{uri.host} on port #{uri.port}")
  end 

  if ENV['SINGLE_PROCESS']
    if Rails.env == 'production'
      puts "WARNING: You are running Diaspora in production without Resque workers turned on.  Please don't do this."
    end
    module Resque
      def enqueue(klass, *args)
        klass.send(:perform, *args)
      end
    end
  end
rescue
  nil
end
