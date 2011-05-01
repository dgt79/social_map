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
			'//connect.facebook.net/en_US/all.js';
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

function social_map() {
	FB.api('/me', function(response) {
		var query = FB.Data.query("SELECT name, current_location from user where uid in " +
				'(SELECT uid2 from friend where uid1={0})', response.id);
		FB.Data.waitOn([query], function() {
			FB.Array.forEach(query.value, function(row) {
				if (row.current_location != null) {
//                        console.log(row.current_location);
					var location = row.current_location['city'] + ', ' + row.current_location['country'];
					placeMarker(location);
				}
			});
		});
	});
}
