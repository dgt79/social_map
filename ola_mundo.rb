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
	erb :social_map
end

get '/social_map' do
	erb :social_map
end

get '/geolocations.json' do
	coordinates = []

	params[:locations].split('#').each { |location|
		id_location_pattern = /(.*):\s*(.*)$/
		matches = id_location_pattern.match	location
		location_id = matches[1]
		location_name = matches[2]

		escaped_location = URI.escape location_name

		if (@@cache.has_key? location_id)
			coordinates.push @@cache[location_id]
		else
			uri = URI.parse("http://maps.googleapis.com/maps/api/geocode/json?address=#{escaped_location}&sensor=false")
			response = Net::HTTP.get_response uri
			result = JSON.parse response.body

			if (result['status'] == 'OK')
				latitude = result['results'][0]['geometry']['location']['lat']
				longitude = result['results'][0]['geometry']['location']['lng']

				coordinate = {"id" => location_id, "lat" => latitude, "lng" => longitude}
				coordinates.push(coordinate)
				@@cache[location_id] = coordinate
			else
				puts "Geocode for #{location} was not successful for the following reason: #{result['status']}"
			end
		end
	}

	content_type :json
	JSON.generate coordinates
	end

get '/geolocation.json' do
		location = params[:location]
		escaped_location = URI.escape location

		if (@@cache.has_key? location)
			coordinate = @@cache[location]
		else
			uri = URI.parse("http://maps.googleapis.com/maps/api/geocode/json?address=#{escaped_location}&sensor=false")
			response = Net::HTTP.get_response uri
			result = JSON.parse response.body

			if (result['status'] == 'OK')
				latitude = result['results'][0]['geometry']['location']['lat']
				longitude = result['results'][0]['geometry']['location']['lng']

				coordinate = {"lat" => latitude, "lng" => longitude}
				@@cache[location] = coordinate
			else
				puts "Geocode for #{location} was not successful for the following reason: #{result['status']}"
			end
		end

	content_type :json
	JSON.generate @@cache[location]
end