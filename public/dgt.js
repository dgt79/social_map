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

var cachedLocations = new Array();

cachedLocations['Geneva, Switzerland'] = new google.maps.LatLng(46.1983922, 6.1422961);
cachedLocations['Montreal, Canada'] = new google.maps.LatLng(45.5088889, -73.5541667);
cachedLocations['Epsom, United Kingdom'] = new google.maps.LatLng(51.3307293, -0.2700590);
cachedLocations['Chisinau, Moldova'] = new google.maps.LatLng(47.0268590, 28.8415510);
cachedLocations['Sighisoara, Romania'] = new google.maps.LatLng(46.2169444, 24.7911111);
cachedLocations['Kronstadt, Romania'] = new google.maps.LatLng(45.6556510, 25.6108000);
cachedLocations['Baia Mare, Romania'] = new google.maps.LatLng(47.6666667, 23.5833333);
cachedLocations['Zarnesti, Romania'] = new google.maps.LatLng(45.5666667, 25.3333333);
cachedLocations['London, United Kingdom'] = new google.maps.LatLng(51.5001524, -0.1262362);
cachedLocations['Brasov, Romania'] = new google.maps.LatLng(45.6556510, 25.6108000);