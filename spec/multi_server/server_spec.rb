#This is a spec for the class that runs the servers used in the other multi-server specs

require 'spec_helper'
describe Server do
  describe '#initialize' do
    it 'creates a new process' do
      server = Server.new(:port => 4000)
      server.find_old_processes.length.should == 1
    end

    it 'takes a port' do
      server = Server.new(:port => 4123)
      server.find_old_processes.first.should include("-p 4123")
    end
  end

  describe '#find_old_processes' do
    it 'closes old processes' do
      server = Server.new(:port => 4000)
      server_2 = Server.new(:port => 4000)
      server_2.find_old_processes.length.should == 1
    end
  end
end

