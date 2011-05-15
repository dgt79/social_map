window.fbAsyncInit = function() {
	FB.init({appId: '142633465810557', status: true, cookie: true, xfbml: true});

	FB.Event.subscribe('auth.login', function(response) {
		login();
	});

	FB.Event.subscribe('auth.logout', function(response) {
		logout();
	});

	FB.getLoginStatus(function(response) {
		if (response.session) {
			login();
		}
	});
};
(function() {
	var e = document.createElement('script');
	e.type = 'text/javascript';
	e.src = document.location.protocol +
//			'//connect.facebook.net/en_US/all.js';
			'//static.ak.fbcdn.net/connect/en_US/core.debug.js';
	e.async = true;
	document.getElementById('fb-root').appendChild(e);
}());

function login() {
	FB.api('/me', function(response) {
//            document.getElementById('login').style.display = "block";
		document.getElementById('login').innerHTML = response.name + " succsessfully logged in!";
	});
}
function logout() {
	document.getElementById('login').style.display = "none";
}

function friends_location() {
	FB.getLoginStatus(function(rsp){
//		FB.api('/me', ...); gives an "An active access token must be used to query information about the current user."
//		the work around is to call getLoginStatus and get the user id from the response, then use it instead of '/me'

		FB.api('/' + rsp.session.uid, function(response) {
			var query = FB.Data.query("SELECT name, current_location from user where uid in " +
					'(SELECT uid2 from friend where uid1={0})', response.id);
			FB.Data.waitOn([query], function() {
				var locations = new Array();
				FB.Array.forEach(query.value, function(row) {
					if (row.current_location != null) {
						var location = row.current_location['city'] + ', ' + row.current_location['country'];
						locations.push(location);
					} else {
//					location is not shared
//					TODO
					}
				});
//				go to the server to get the coordinates. It can be done on the client as well, but making lots of
//				requests to google geocoder results in QUERY_OVER_LIMIT error responses (too many requests in a very short time).
//				A solution could be the use of a timeout, but javascript doesn't have a real timeout; google docs recommends
//				getting the coordinates on the server.
				$.getJSON("geolocations.json", {locations: locations.unique().join('#')}, function(data) {
					data.forEach(function(item) {
						var coordinate = new google.maps.LatLng(item.lat, item.lng);
						placeMarker2(coordinate);
					});
				});
			});
		});
	});
}
