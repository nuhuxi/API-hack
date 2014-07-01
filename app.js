
var carouselEnd;


$(document).ready(function () {
    //google.maps.event.addDomListener(window, 'load', initialize);

    getLocation();




    $('.right-scroll').click(function () {
        $('.left-scroll').show();
        var item_width = $('#carousel_ul li').outerWidth() + 20; //store item width plus the margins
        var left_indent = parseInt($('#carousel_ul').css('left')) - item_width; //give left attribute

        $('#carousel_ul').animate({
            'left': left_indent
        }, 300, function () {
            if(parseInt($('#carousel_ul').css('left')) <= -Math.abs(parseInt($('#carousel_ul').css('width')))){ //if carousel ul left is more than the negative value of the ul width.
                $('.right-scroll').hide();
            }
        });
    });

    //when user clicks the image for sliding left  
    $('.left-scroll').click(function () {
        $('.right-scroll').show();
        var item_width = $('#carousel_ul li').outerWidth() + 20;
        var left_indent = parseInt($('#carousel_ul').css('left')) + item_width;

        $('#carousel_ul').animate({
            'left': left_indent
        }, 300, function () {
            if($('#carousel_ul').css('left') == '0px'){   //if the carousel ul is at starting position
                $('.left-scroll').hide();
            }
        });
    }); 




    $('.searchForm').submit(function(event){
        event.preventDefault();

        if (!listeningToBounds)
        {
            listeningToBounds = true;
            google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
        }

        performSearch();


    });




});//document ends

var map;
var service;
var currentLocation;
var markersOnMap = [];
var listeningToBounds = false;
var eachPhotoinArray;
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


    $('#carousel_ul').empty();
    $('.right-scroll').hide();


    for(var i = 0; i < results.length; i++){

        console.log(results[i]);
        var photosArray = results[i].photos; //access the photos of each place

        for(var j in photosArray){
            eachPhotoinArray = photosArray[j].getUrl({
                maxHeight:30,
                maxWidth:30
            });

            eachPhotoinArray2 = photosArray[j].getUrl({
                maxHeight:113,
                maxWidth:140
            });



            if(i === 5){
                $('.right-scroll').show();
            }


            var userSearch = $('.user-search').find($('.user-search-response'));
            var userSearchNumber = $('.user-search-number').find($('.user-search-response-number'));
            var userSearchNumberText = results.length;
            var userInput = $('.searchForm').find("input[name='food']").val();

            $('.user-search').show();
            $('.user-search-number').show();
            userSearch.text(userInput);
            userSearchNumber.text(userSearchNumberText);
            $('.error-message').hide();

            $('#carousel_ul').append("<li><div class='food-thumbnail'><img style='width=100%' value = '"+i+"' src='"+eachPhotoinArray2+"'></div></li>");
        }

            marker = new google.maps.Marker({ //marker for the search results
            position: results[i].geometry.location,
            map: map,
            name: results[i].name
            //icon: eachPhotoinArray
            });
            markersOnMap.push(marker);


            google.maps.event.addListener(markersOnMap[i], 'click', function() {
                infowindow.setContent(this.name);
                infowindow.open(map, this);
            });
    
    }//for loop ends

    $('#carousel_ul img').click(function(){
        var pictureValue = $(this).attr('value');
        new google.maps.event.trigger(markersOnMap[pictureValue], 'click');
    });

} //callback ends here




function performSearch(){

    var searchFieldValue = $('.searchForm').find("input[name='food']").val();
    //what I am looking for and asking the google api
    var request = {
        bounds: map.getBounds(),
        types: ['cafe','restaurant','bakery','food'],
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

  /*map.setCenter(currentLocation);
  

    //map marker
    var marker = new google.maps.Marker({
    position: currentLocation,
    map: map
    });*/
}









