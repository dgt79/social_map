require 'rubygems'
require 'sinatra'
require 'bundler/setup'


get '/' do
  req = Rack::Request.new(env)
  req.inspect
end	
