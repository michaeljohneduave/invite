Session.setDefault("markerinfo", null);

Template.home.rendered = function () {	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var coords = position.coords;
			if (!Session.get('map')) {
				gmaps.initialize(coords.latitude, coords.longitude);
				gmaps.infoBox = new InfoBox({
					content : document.getElementById("infobox"),
					disableAutoPan : false,
					maxWidth : 150,
					pixelOffset : new google.maps.Size(-140, 0),
					zIndex : null,
					boxStyle : {
						background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
						opacity : 0.75,
						width : "280px",
					},
					closeBoxMargin : "12px 4px 2px 2px",
					closeBoxURL : "http://www.google.com/intl/en_us/mapfiles/close.gif",
					infoBoxClearance : new google.maps.Size(1, 1),
				});
				Session.set("gmapStart", true);
				if (Events.find().count()) {
					var events = Events.find().fetch();
					_.each(events, function (event) {
						var objMarker = {
							id : event._id._str,
							lat : event.marker.lat,
							lng : event.marker.lng,
							title : event.marker.title,
						}
						if (!gmaps.markerExists('id', objMarker.id))
							gmaps.addMarker(objMarker);
					})
				}
				google.maps.event.addListener(gmaps.map, 'click', function (event) {
					gmaps.infoBox.close();
					if(Session.get("create_event_EN")) {
						var marker = {
							lat : event.latLng.k,
							lng : event.latLng.B,
							date : moment().format("dddd, MMMM Do YYYY, HH:mm"),
						}
						$('#markermodal').modal('show')
						Session.set("markerinfo", marker);
					}
				});
			}
		}, function (err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
		},{
			enableHighAccuracy : false,
			timeout : 5000,
			maximumAge : 0,
		});
	} else {
		console.log("Geolocation is not supported")
	}
}

Tracker.autorun(function () {
	if(Session.get('gmapStart')) {
		eventsCursor = Events.find();
		eventsCursor.observe({
			added : function (event) {
				var objMarker = {
					id : event._id._str,
					lat : event.marker.lat,
					lng : event.marker.lng,
					title : event.marker.title,
				}
				if(!gmaps.markerExists('id', objMarker.id))
					gmaps.addMarker(objMarker);
			},
			removed : function (event) {
				console.log("Removed" + id);
			}
		})
	}
});

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
	'hide.bs.modal #markermodal' : function () {
		Session.set("create_event_EN", false);
		Session.set("markerinfo", null);
		gmaps.map.setOptions({
			draggableCursor : null,
			draggingCursor : null,
		});
	},
	'submit #eventform' : function (e, t) {
		e.preventDefault();
		var marker = Session.get("markerinfo");
		marker['title'] = $("#eventnamefield").val();
		event = {
			name : $("#eventnamefield").val(),
			start : moment($("#eventstartfield").val()).format("MMMM D YYYY"),
			end : moment($("#eventendfield").val()).format("MMMM D YYYY"),
			marker : marker
		}
		Events.insert(event);
		gmaps.addMarker(marker);
		$('#markermodal').modal('hide')
		$("#eventnamefield").val("");
		$("#eventstartfield").val("");
		$("#eventendfield").val("");
	},
	'click .event-container' : function (e, t) {
		var latLng = new google.maps.LatLng($("#" + e.target.id).attr("lat"), $("#" + e.target.id).attr("lng"))
		gmaps.map.panTo(latLng);

	},
	'click #addeventbtn' : function () {
		Session.set("create_event_EN", true);
		gmaps.map.setOptions({
			draggableCursor : "url(http://maps.google.com/mapfiles/ms/icons/blue-dot.png), auto",
			draggingCursor : "url(http://maps.google.com/mapfiles/ms/icons/blue-dot.png), auto",
		});
	}
});

Template.home.helpers({
	EventName : function () {
		if (Session.get("markerid"))
			return Events.findOne({_id : new Meteor.Collection.ObjectID(Session.get("markerid"))}).name;
	},
	EventStart : function () {
		if (Session.get("markerid"))
			return Events.findOne({_id : new Meteor.Collection.ObjectID(Session.get("markerid"))}).start;
	},
	EventEnd : function () {
		if (Session.get("markerid"))
			return Events.findOne({_id : new Meteor.Collection.ObjectID(Session.get("markerid"))}).end;
	},
	EventTicker : function () {
		return Events.find({}, {sort : {"marker.date" : -1}}).fetch();
	},
})

Template.home.destroyed = function () {
	eventsCursor.stop();
}

Meteor.setInterval(function () {

}, 3000)