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

function display_my_social_graph() {
	FB.getLoginStatus(function(rsp) {
//		FB.api('/me', ...); gives an "An active access token must be used to query information about the current user."
//		the work around is to call getLoginStatus and get the user id from the response, then use it instead of '/me'
		FB.api('/' + rsp.session.uid, function(response) {
			var query = FB.Data.query("SELECT name, current_location from user where uid in " +
					'(SELECT uid2 from friend where uid1={0})', response.id);
			FB.Data.waitOn([query], function() {
				FB.Array.forEach(query.value, function(row) {
					if (row.current_location != null) {
						var current_location = row.current_location['city'] + ', ' + row.current_location['country'];
						$.getJSON("geolocation.json", {location: current_location}, function(data) {
//							randomize the location a bit, as some friends might live in same place
							var latitude_offset = Math.floor(Math.random()*101);
							if (latitude_offset < 10) latitude_offset = 99 - latitude_offset;

							var longitute_offset = Math.floor(Math.random()*101);
							if (longitute_offset < 10) longitute_offset = 99 - longitute_offset;

							linkLocation(row.name, data.lat + latitude_offset / 10000, data.lng + longitute_offset / 10000);

//							console.log(row.name + " - " + data.lat + latitude_offset / 10000 + ", " + data.lng + longitute_offset / 10000);
						});

					} else {
//					location is not shared
//					TODO
					}
				});
			});
		});
	});
}
