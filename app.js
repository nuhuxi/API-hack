
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




function placeDetailsCallbackForPlace (place, status){
    console.log(place);


    if (status == google.maps.places.PlacesServiceStatus.OK) {
        
        var placeAddress = place.address_components;//an array of address objects
        //console.log(placeAddress);

        var longName;
        
        

        for (var i=0; i<placeAddress.length;i++){
            var placeAddressObject = placeAddress[i];//each object in array of address objects
            //need to target object with a property types 'locality'
            
            

            if(placeAddressObject.types[0] === "locality"){ //if the place address object has type property 'locality'
                //console.log(placeAddressObject);

                longName = placeAddressObject.long_name;
                console.log(longName);
                //cityArray.push(longName);
                //console.log(cityArray);
                
                
                var resultValue = $('.results').find('li[value="'+i+'"]');
                resultValue.find('.location').text(longName);
                
                break;

            }//if statement ends

            // else if (!longName){
            //     console.log ('No Long Name');
            //     //$('.location').text("No City");
            // }

        }//for statement ends

    }// if statement ends

} //placeDetailsCallback ends








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


    for(var i = 0; i < results.length; i++){

        //console.log(results[i]);
       
        var photosArray = results[i].photos; //access the photos of each place
        var placeName = results[i].name;
        //var placeLocation = results[i].vicinity;


        var photoForPlace = false;
        var miniPhoto;

        if (photosArray && photosArray.length){ //if there are photos
            photoForPlace = photosArray[0].getUrl({ //make photoForPlace true by accessing the first photo
                minHeight:190,
                maxHeight:250,
                minWidth:230,
                maxWidth:350
            });

            miniPhoto = photosArray[0].getUrl({
                minHeight: 40,
                maxHeight: 40,
                minWidth: 50,
                maxWidth: 50
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

        if((!photoForPlace) || (photoForPlace === undefined)){ //if there are no pics
            //show no picture 
            $('.results').append("<li value ='"+i+"'><div class='food-thumbnail'><img style='width:230px;top: -40px;position: absolute;left: 0;' value = '"+i+"' src='http://www.uwplatt.edu/files/styles/high_resolution/public/image_fields/directory_image/image-not-available_1.jpg?itok=GIB8RUHy'></div><div class='resultName'>"+placeName+"</div><div class='location'></div></li>");
        } else {
            $('.results').append("<li value ='"+i+"'><div class='food-thumbnail'><img style='height:190px;min-width: 230px;' value = '"+i+"' src='"+photoForPlace+"'></div><div class='resultName'>"+placeName+"</div><div class='location'></div></li>");
        }
    




        var placeReference = results[i].place_id;

        var placeDetailsRequest = {
             placeId: placeReference
        };

        service.getDetails(placeDetailsRequest, placeDetailsCallbackForPlace);




        
        // var delayedLookup = function(placeRequest, placeId){ //function using placeDetailsRequest, i

        //     var actionPlace = function(){
        //         var callback = placeDetailsCallbackForPlace(placeId); //placeDetailsCallbackForPlace(for each result)
        //         service.getDetails(placeRequest, callback); //placeDetailsRequest, callback function for each result [i]
        //     };
        //     return actionPlace; //what does this do?

        // };

        // var actionPlace = delayedLookup(placeDetailsRequest, i); //assigning parameters for function
        // window.setTimeout(actionPlace, i*200); //run actionPlace function AFTER assigning parameters
    


        

        var marker = new google.maps.Marker({ //marker for the search results
            position: results[i].geometry.location,
            map: map,
            name: results[i].name,
            //icon: eachPhotoinArray
            //icon: 'http://i.stack.imgur.com/KOh5X.png'
            //icon:miniPhoto
            //icon: miniPhoto{background:url('http://i.stack.imgur.com/KOh5X.png') no-repeat 4px 4px}
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
    //icon:'http://icons.iconarchive.com/icons/pixelkit/gentle-edges/128/Location-Map-icon.png'
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