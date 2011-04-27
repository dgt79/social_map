require 'rubygems'
require 'sinatra'
require 'bundler/setup'
require 'net/http'
require "uri"
require 'json'

get '/' do
#  req = Rack::Request.new(env)
#  req.inspect
  ip = request.ip == '127.0.0.1' ? '' : request.ip
  response = Net::HTTP.get_response URI.parse("http://freegeoip.net/json/#{ip}")
  result = JSON.parse response.body
  puts result.inspect
  "Hello from #{result['country_name']}, #{result['city']}"
end	
