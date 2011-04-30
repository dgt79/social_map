require 'rubygems'
require 'sinatra'
require 'bundler/setup'
require 'net/http'
require "uri"
require 'json'
require 'erb'
require 'omniauth/oauth'
require 'fb_graph'

APP_ID = "142633465810557"
APP_SECRET = "xxx"

use Rack::Session::Cookie # OmniAuth requires sessions.
use OmniAuth::Builder do
	provider :facebook, APP_ID, APP_SECRET, { :scope => 'user_location, friends_location' }
end

get '/' do
#  ip = request.ip == '127.0.0.1' ? '' : request.ip
#  response = Net::HTTP.get_response URI.parse("http://freegeoip.net/json/#{ip}")
#  result = JSON.parse response.body
#  @latitude = result['latitude']
#  @longitude = result['longitude']
	erb :index
end

get '/friends' do
	if session['fb_auth']
		@friends ||= Hash.new
		user = FbGraph::User.me(session['fb_token'])
		user.friends.each do |u|
			@friends[u.name] = FbGraph::User.fetch(u.identifier, :access_token => session['fb_token'])
			puts "#{@friends[u.name].inspect}\n\n"
		end
		erb :friends
	else
		"<a href='auth/facebook'>Login</a>"
	end
end

get '/auth/facebook/callback' do
	session['fb_auth'] = request.env['omniauth.auth']
	session['fb_token'] = session['fb_auth']['credentials']['token']
	session['fb_error'] = nil

	puts "welcome #{session['fb_auth']['user_info']['name']}"

	redirect '/friends'
end

get '/auth/failure' do
	clear_session
	session['fb_error'] = 'In order to use this site you must allow us access to your Facebook data<br />'
	redirect '/'
end

get '/logout' do
	clear_session
	redirect '/'
end

def clear_session
	session['fb_auth'] = nil
	session['fb_token'] = nil
	session['fb_error'] = nil
end
