
var carouselEnd;
var searchFieldValue;


$(document).ready(function () {
    //google.maps.event.addDomListener(window, 'load', initialize);

    getLocation();



    $('.searchForm').submit(function(event){
        event.preventDefault();

        if ($.trim($(".userChoice").val()) === ""){
            alert('Please Search Food');
            return false;
        }

        // else if (!listeningToBounds)//if false
        // {
        //     listeningToBounds = true;
        //     google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
        // }

        performSearch();
        $('#map').css('margin-bottom','40px');
        $('.liBorder').css('display','block');
    });




});//document ends

var map;
var service;
var currentLocation;
var markersOnMap = [];
var listeningToBounds = false;
var eachPhotoinArray;
var eachPhotoinArray2;
var infowindow;
var marker;


function callback(results, status){
    //after I send my request, handle the results
   
  
    
    if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        $('.user-search').hide();
        $('.user-search-number').hide();
        $('.error-message').show();
        $('.user-search-response-error').text($('.searchForm').find("input[name='food']").val());
    }

    for (var m in markersOnMap){
        markersOnMap[m].setMap(null);
    }

    markersOnMap = [];


    $('.results').empty();
    //$('.right-scroll').hide();


    for(var i = 0; i < results.length; i++){

        console.log(results[i]);
        console.log(results.length);
        console.log(results[i].photos);

        var photosArray = results[i].photos; //access the photos of each place
        var placeName = results[i].name;
        var placeLocation = results[i].vicinity;

        for(var j in photosArray){
            eachPhotoinArray = photosArray[j].getUrl({
                maxHeight:30,
                maxWidth:30
            });

            eachPhotoinArray2 = photosArray[j].getUrl({
                minHeight:230,
                maxHeight:350,
                minWidth:190,
                maxWidth:350
            });
        }//photo loop


        var userSearch = $('.user-search').find($('.user-search-response'));
        var userSearchNumber = $('.user-search-number').find($('.user-search-response-number'));
        var userSearchNumberText = results.length;

        $('.user-search').show();
        $('.user-search-number').show();
        userSearch.text(searchFieldValue);
        userSearchNumber.text(userSearchNumberText);
        $('.error-message').hide();

        $('.results').append("<li><div class='food-thumbnail'><img style='width=100%' value = '"+i+"' src='"+eachPhotoinArray2+"'></div><div class='resultName'>"+placeName+"</div><div class='location'>"+placeLocation+"</div></li>");

        marker = new google.maps.Marker({ //marker for the search results
        position: results[i].geometry.location,
        map: map,
        name: results[i].name
        //icon: eachPhotoinArray
        });

        markersOnMap.push(marker);


        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.name);
            infowindow.open(map, this);
        });
    
    }//for loop ends

    $('.results img').click(function(){
        var pictureValue = $(this).attr('value');
        new google.maps.event.trigger(markersOnMap[pictureValue], 'click');
    });

    //$(".userChoice").val('');

} //callback ends here




function performSearch(){

    searchFieldValue = $('.searchForm').find("input[name='food']").val();
    
    //what I am looking for and asking the google api
    var request = {
        bounds: map.getBounds(), //Returns the south-west latitude/longitude and the north-east latitude/longitude of the current viewport
        // radius: '10',
        types: ['cafe','restaurant','bakery','food'],
        keyword: searchFieldValue
    };

    service.nearbySearch(request, callback);
    //service.getDetails(request, callback);
}






function initialize(){
    
    if (!currentLocation){ //if no currentLocation, then do this...
        $('#map').hide();
        $('.loading').show();
        //currentLocation = new google.maps.LatLng(-34.397, 150.644);
    }

    //how the map should look
    var mapOptions = {
        zoom: 10,
        center: currentLocation
    };

    //map object
    map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

    //map marker for current location
    var markerCurrent = new google.maps.Marker({
    position: currentLocation,
    map: map
    //icon:
    });

    infowindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
}






function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(gotlocation, initialize);
    }
    else{
        alert('error');
        initialize();
    }
}
    
    



function gotlocation(pos){
  
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');

  currentLocation = new google.maps.LatLng(crd.latitude, crd.longitude);

  initialize();

}









