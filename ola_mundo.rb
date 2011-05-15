require 'rubygems'
require 'sinatra'
require 'bundler/setup'
require 'net/http'
require "uri"
require 'json'
require 'erb'

APP_ID = "142633465810557"

@@cache = Hash.new

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

get '/geolocations.json' do
	coordinates = []

	params[:locations].split('#').each { |location|
		escaped_location = URI.escape location

		if (@@cache.has_key? location)
			coordinates.push @@cache[location]
		else
			uri = URI.parse("http://maps.googleapis.com/maps/api/geocode/json?address=#{escaped_location}&sensor=false")
			response = Net::HTTP.get_response uri
			result = JSON.parse response.body

			if (result['status'] == 'OK')
				latitude = result['results'][0]['geometry']['location']['lat']
				longitude = result['results'][0]['geometry']['location']['lng']

				coordinates.push({"lat" => latitude, "lng" => longitude})
				@@cache[location] = {"lat" => latitude, "lng" => longitude}
			else
				puts "Geocode for #{location} was not successful for the following reason: #{result['status']}"
			end
		end
	}

	content_type :json
	JSON.generate coordinates
end