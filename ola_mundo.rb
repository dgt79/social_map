require 'rubygems'
require 'sinatra'
require 'bundler/setup'
require 'net/http'
require "uri"
require 'json'
require 'erb'

APP_ID = "142633465810557"

get '/' do
#  ip = request.ip == '127.0.0.1' ? '' : request.ip
#  response = Net::HTTP.get_response URI.parse("http://freegeoip.net/json/#{ip}")
#  result = JSON.parse response.body
#  @latitude = result['latitude']
#  @longitude = result['longitude']
	erb :index
end

get '/social_map' do
	erb :social_map
end