var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var marker;
var browserSupportFlag = new Boolean();
var map;
var geocoder;

function initialize() {
	var myOptions = {
		zoom: 3,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	geocoder = new google.maps.Geocoder();

	// Try W3C Geolocation (Preferred)
	if (navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
			marker = new google.maps.Marker({
				map:map,
				draggable:false,
				animation: google.maps.Animation.DROP,
				position: initialLocation
			});

			social_map();
			google.maps.event.addListener(marker, 'click', toggleBounce);
		}, function() {
			handleNoGeolocation(browserSupportFlag);
		});
		// Try Google Gears Geolocation
	} else if (google.gears) {
		browserSupportFlag = true;
		var geo = google.gears.factory.create('beta.geolocation');
		geo.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
			map.setCenter(initialLocation);
			marker = new google.maps.Marker({
				map:map,
				draggable:false,
				animation: google.maps.Animation.DROP,
				position: initialLocation
			});
			google.maps.event.addListener(marker, 'click', toggleBounce);
		}, function() {
			handleNoGeoLocation(browserSupportFlag);
		});
		// Browser doesn't support Geolocation
	} else {
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}

	function handleNoGeolocation(errorFlag) {
		if (errorFlag == true) {
			alert("Geolocation service failed.");
			initialLocation = newyork;
		} else {
			alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			initialLocation = siberia;
		}
		map.setCenter(initialLocation);
	}

	function toggleBounce() {

		if (marker.getAnimation() != null) {
			marker.setAnimation(null);
		} else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}
}

function placeMarker(address) {
	if (cachedLocations[address] != null) {
		var marker = new google.maps.Marker({
			map: map,
			draggable:false,
			animation: google.maps.Animation.DROP,
			position: cachedLocations[address]
		});
		drawPolyline(initialLocation, cachedLocations[address]);
	} else {
		geocoder.geocode({ 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
//                  map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					draggable:false,
					animation: google.maps.Animation.DROP,
					position: results[0].geometry.location
				});
				cachedLocations[address] = results[0].geometry.location;
				drawPolyline(initialLocation, results[0].geometry.location);
			} else {
				console.log("Geocode for " + address + " was not successful for the following reason: " + status);
//                      let's retry
//                      setTimeout(placeMarker(address), 1000);
			}
		});
	}
}

function drawPolyline(from, to) {
	var flightPlanCoordinates = [
		from,
		to
	];
	var flightPath = new google.maps.Polyline({
		path: flightPlanCoordinates,
		strokeColor: "#dc322f",
		strokeOpacity: 0.5,
		strokeWeight: 1
	});
	flightPath.setMap(map);
}