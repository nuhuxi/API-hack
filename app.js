
var carouselEnd;
var searchFieldValue;


$(document).ready(function () {
    //google.maps.event.addDomListener(window, 'load', initialize);

    getLocation();



    $('.searchForm').submit(function(event){
        event.preventDefault();

        if ($.trim($(".userChoice").val()) === ""){
            alert('Enter your craving!');
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
var infowindow;
var marker;
var cityArray = [];


function placeDetailsCallbackForPlace (placeID){
    var placeValue = placeID;

    var  placeDetailsCallback = function (place, status){

    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //console.log (place);
        var placeAddress = place.address_components;//an array of address objects
        //console.log(placeAddress);

        cityArray = [];

        for (var i=0; i<placeAddress.length;i++){
            var placeAddressObject = placeAddress[i];//each object in array of address objects
            //need to target object with a property types 'locality'

            


            if(placeAddressObject.types[0] === "locality"){ //if the place address object has type property 'locality'
                console.log(placeAddressObject);
                var longName = placeAddressObject.long_name;
                console.log(longName);
                //cityArray.push(longName);
                //console.log(cityArray);
                var resultValue = $('.results').find('li[value="'+placeValue+'"]');
                resultValue.find('.location').text(longName);
                console.log (placeValue);
                console.log(resultValue.find('.location'));
                //var locationText= $('.location').text(cityArray[resultValue]);

                //var locationText = $('.location').text(longName);
                break;
            }//if statement ends

        }//for statement ends
    }// if statement ends

    };

    return placeDetailsCallback;

}// callback ends

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

        //console.log(results[i]);
       
        var photosArray = results[i].photos; //access the photos of each place
        var placeName = results[i].name;
        //var placeLocation = results[i].vicinity;

        var placeReference = results[i].place_id;

        var placeDetailsRequest = {
            placeId: placeReference
        };


        

        var photoForPlace = false;

        if (photosArray && photosArray.length){ //if there are photos
            photoForPlace = photosArray[0].getUrl({ //make photoForPlace true by accessing the first photo
                minHeight:190,
                maxHeight:250,
                minWidth:230,
                maxWidth:350
            });
        }


        var userSearch = $('.user-search').find($('.user-search-response'));
        var userSearchNumber = $('.user-search-number').find($('.user-search-response-number'));
        var userSearchNumberText = results.length;

        $('.user-search').show();
        $('.user-search-number').show();
        userSearch.text(searchFieldValue);
        userSearchNumber.text(userSearchNumberText);
        $('.error-message').hide();

        if((!photoForPlace) || (photoForPlace === undefined)){
            //show no picture 
            $('.results').append("<li value ='"+i+"'><div class='food-thumbnail'><img style='width:230px;top: -40px;position: absolute;left: 0;' value = '"+i+"' src='http://www.uwplatt.edu/files/styles/high_resolution/public/image_fields/directory_image/image-not-available_1.jpg?itok=GIB8RUHy'></div><div class='resultName'>"+placeName+"</div><div class='location'>''</div></li>");
        } else {
            $('.results').append("<li value ='"+i+"'><div class='food-thumbnail'><img style='height:190px;min-width: 230px;' value = '"+i+"' src='"+photoForPlace+"'></div><div class='resultName'>"+placeName+"</div><div class='location'>''</div></li>");
        }
        
        console.log("Added item "+ i);

        
        
        var delayedLookup = function(placeId)
        {
            var placePlace = placeId;
            var action = function(){
                placeDetailsCallbackForPlace(placePlace);
            };
            return action;

        }
        var action = delayedLookup(i);
       //window.setTimeout(action, i*200);
       action();
       
        

        

        var marker = new google.maps.Marker({ //marker for the search results
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
        radius: '50000',
        types: ['cafe','restaurant','bakery','food'],
        //rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: searchFieldValue
    };

    service.nearbySearch(request, callback);
    
}






function initialize(){
    
    if (!currentLocation){ //if no currentLocation, then do this...
        $('#map').hide();
        $('.loading').show();
        //currentLocation = new google.maps.LatLng(-34.397, 150.644);
    }

    //how the map should look
    var mapOptions = {
        zoom: 15,
        center: currentLocation
    };

    //map object
    map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

    //map marker for current location
    var markerCurrent = new google.maps.Marker({
    position: currentLocation,
    map: map,
    icon: new google.maps.MarkerImage('https://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',new google.maps.Size(22,22),new google.maps.Point(0,18),new google.maps.Point(11,11)),
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









