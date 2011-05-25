#This class is for running servers in the background during integration testing.  This will not run on Windows.
class Server
  def initialize(opts)
    @port = opts[:port] || 4000
    @env = opts[:env] || "integration_1"
  end

  def start
    @pid = fork do
      Rails.env = @env
      Rack::Handler::Thin.run(Diaspora, :Port => @port)
    end
  end

  def clear_old_processes
    find_old_processes.each do |p|
      `kill -9 #{p.split(" ").first}`
    end
  end

  def close
    Process.kill(9, @pid)
  end

  def find_old_processes
    processes = `ps -ax -o pid,command | grep '#{@run_line}'`.split("\n").select do |p|
      !p.include?("ps -ax")
    end
  end
end
