var currentLocation;
var players;
var map;

$(document).ready(function() {
	
	setEventHandlers();
	if(map.testForGeoLocation()){	
		navigator.geolocation.getCurrentPosition(initialise);
	}else{
		printErrorScreen("Geolocation is not supported by this browser");
	}//geoLocation test	
});

function setEventHandlers(){
	
	$('#btnSearch').on('click', function(){
		
		var postcode = $('#txtPostcode').val();
		if(postcode.length > 0){
			setDestination(postcode);
		}		
	});	
}

function printErrorScreen(errText){
	document.getElementById("nogeolocation").innerHTML = errText;
}

function init(){
	
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};


	players = returnPlayers();
	navigator.geolocation.getCurrentPosition(initialise, error, options);
}

function success(pos){
	console.log('xxx');
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

function initialise(position){
	
	currentLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

	//draw the map
	map = new google.maps.Map(document.getElementById('map-canvas'), {
	  center: currentLocation,
	  zoom: 9
	});
	
	//draw the current position
	var userPosition  = new google.maps.Marker({
		position: currentLocation,
		map: map,
		icon: "Content/currentlocation.png",
		title: 'You are here'
	});
	
	//draw the other people
	for(var i = 0; i < players.length; i++){
		var peoplePosition  = new google.maps.Marker({
			position: players[i].pos,
			map: map,
			icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|FF0000|000000',
			title: players[i].playerName
		});			
	}

}//initialise

function setDestination(postcode){
	
	convertPostcode(postcode, drawDestination);
	
}

function drawDestination(location){
	
	addItemToMap(location);
	getDistances(location);
}

function convertPostcode(postcode, callback){
	//converts postcode to long lat
	
	var geocoder = new google.maps.Geocoder();

	// get our postcode value
	var postcode = postcode;

	//send value to google to get a longitude and latitude value 
	geocoder.geocode({'address': postcode}, function(results, status) 
	{   
		if (status == google.maps.GeocoderStatus.OK) 
		{
			callback(results[0].geometry.location);
		
			//addItemToMap(results[0].geometry.location);
		}
	});
}

function addItemToMap(location){
	
		var newMarker  = new google.maps.Marker({
			position: location,
			map: map,
			icon: 'Content/golf.png',
			title: 'Destination'
		});		
	
}

function returnPlayers(){
	
	var result = new Array();
	
	var person = new Object();
	person.lat = 51.6004496;
	person.lon = -0.1705118;
	person.pos = new google.maps.LatLng(person.lat, person.lon);
	person.playerName = 'Player 1';
	result.splice(result.length, 1, person);
	
	person = new Object();
	person.lat = 51.3613088;
	person.lon = -0.3077117;
	person.pos = new google.maps.LatLng(person.lat, person.lon);
	person.playerName = 'Player 2';
	result.splice(result.length, 1, person);
	
	person = new Object();
	person.lat = 52.3411322;
	person.lon = -0.225516;
	person.pos = new google.maps.LatLng(person.lat, person.lon);
	person.playerName = 'Player 3';
	result.splice(result.length, 1, person);	
	
	return result;
	
}

function returnPlayerPositions(){
	
	var result = new Array(players.length);
	
	for(var i = 0; i < players.length; i++){
		result[i] = players[i].pos;
	}

	return result;
	
}

function findPlayer(player, playerName) { 
    return player.name === playerName;
}

function getDistances(location){
		
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
	  {
		origins: returnPlayerPositions(),
		destinations: [location],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false,
	  }, allocateDistances);
	
}

function allocateDistances(data){
	
	var x = "k;d";
	
	for(var i = 0; i < players.length; i++){
		players[i].journey = data.rows[i].elements[0];
	}
	
	drawPlayers();
}

function drawPlayers(){
	
	var template = $('#playerLineTemplate').html();
	
	for(var i = 0; i < players.length; i++){
		$('#playerInfo').append(Mustache.render(template, players[i]));		
	}	
}

var map ={
	
	testForGeoLocation: function(){		
		return !navigator.geolocation ?  false : true;
	},//testForGeoLocation
	
}//map ends