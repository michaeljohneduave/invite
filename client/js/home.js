Template.home.rendered = function () {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var coords = position.coords;
			if(!Session.get('map')) {
				gmaps.initialize(coords.latitude, coords.longitude);
				if(Coordinates.find().count()) {
					var markers = Coordinates.find().fetch();
					_.each(markers, function (marker) {
						gmaps.addMarker(marker);
					})
				}
				google.maps.event.addListener(gmaps.getMap(), 'click', function (event) {
					var marker = {
						lat : event.latLng.k,
						lng : event.latLng.B,
						title : 'Title',
						date : moment().format("dddd, MMMM Do YYYY, HH:mm"),
					}
					Coordinates.insert(marker);
					gmaps.addMarker(marker);
				});

			}
		}, function (err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
		},{
			enableHighAccuracy : true,
			timeout : 5000,
			maximumAge : 0,
		})
	} else {
		console.log("Geolocation is not supported")
	}
	Tracker.autorun(function () {
		var coords = Coordinates.find().fetch();
		_.each(coords, function (coord) {
			gmaps.addMarker(coord);
		});
	});
}

Template.home.events({
	'click #currentlocbtn' : function () {
		var err = function (err) {
			console.warn('ERROR(' + err.code + '): ' + err.message)
		}
		var suc = function (pos) {
			var coords = pos.coords;
			gmaps.setCenter(coords.latitude, coords.longitude);
		}
		var opt = {
			enableHighAccuracy : false,
			timeout : 5000,
			maximumAge : 0,
		};
		navigator.geolocation.getCurrentPosition(suc,err,opt);
	},
})