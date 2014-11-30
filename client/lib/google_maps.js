gmaps = {
	map : null,
	infoBox : null,
	markers : [],
	latLngs : [],
	markerData : [],
	addMarker : function (marker) {
		var gLatLang = new google.maps.LatLng(marker.lat, marker.lng);
		var gMarker = new google.maps.Marker({
			position : gLatLang,
			map : this.map,
			title : marker.title,
			icon : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		});
		this.latLngs.push(gLatLang);
		this.markers.push(gMarker);
		this.markerData.push(marker);
		google.maps.event.addListener(gMarker, 'click', function () {
			gmaps.infoBox.open(gmaps.map,this);
			Session.set('markerid', marker.id);
		});
		return gMarker;
	},
	calcBounds : function () {
		var bounds = new google.maps.LatLangBounds();
		for(var i=0,latLngLength = this.latLngs.length; i < latLngLength; i++) {
			bounds.extend(this.latLngs[i]);
		}
		this.map.fitBounds(bounds);
	},
	markerExists : function (key, val) {
		_.each(this.markerData, function (storedMarker){
			if(storedMarker[key] == val) return true;
		});
		return false;	
	},
	initialize : function (lat, lng) {
		console.log("[+] Intializing Google Maps...");
		var mapOptions = {
			zoom : 16,
			center : new google.maps.LatLng(lat, lng),
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			disableDoubleClickZoom : true,
		};
		this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		Session.set('map', true);
	},
	setCenter : function (lat, lng) {
		this.map.panTo({lat : lat, lng : lng});
	},
	removeMarker : function (marker) {

	},
}