// Array.unique( strict ) - Remove duplicate values
Array.prototype.unique = function(b) {
	var a = [], i, l = this.length;
	for (i = 0; i < l; i++) {
		if (a.indexOf(this[i], 0, b) < 0) {
			a.push(this[i]);
		}
	}
	return a;
};

function linkLocation(title, lat, lng) {
	var coordinate = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
			map: map,
			draggable:false,
			animation: google.maps.Animation.DROP,
			position: coordinate,
			title: title
		});
		drawPolyline(initialLocation, coordinate);
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