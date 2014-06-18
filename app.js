


$(document).ready(function(){

    //google.maps.event.addDomListener(window, 'load', initialize);

    getLocation();

    



	$('#carousel_ul li:first').before($('#carousel_ul li:last')); 
	$('.right-scroll').click(function(){

        $('.left-scroll').show();

		var item_width = $('#carousel_ul li').outerWidth() + 20; //store item width plus the margins
		var left_indent = parseInt($('#carousel_ul').css('left')) + item_width; //cancel out the left attribute

		$('#carousel_ul').animate({'left': left_indent},{queue:false, duration:800},function(){

		$('#carousel_ul li:last').after($('#carousel_ul li:first'));
		
		}); 
	});

    //when user clicks the image for sliding left  
    $('.left-scroll').click(function(){  
  
        var item_width = $('#carousel_ul li').outerWidth() + 20;  
  
        /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */  
        var left_indent = parseInt($('#carousel_ul').css('left')) - item_width;  
  
        $('#carousel_ul').animate({'left' : left_indent},{queue:false, duration:500},function(){  
  
            /* when sliding to left we are moving the last item before the first item */  
        $('#carousel_ul li:first').before($('#carousel_ul li:last'));
   
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

function callback(results, status){
    //after I send my request, handle the results
   

    for (var m in markersOnMap){
        markersOnMap[m].setMap(null);
    }

    $('#carousel_ul').empty();
    $('.right-scroll').hide();
    $('.searchForm').find("input[name='food']").val('');




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

            console.log(eachPhotoinArray);

            $('#carousel_ul').append("<li><div class='food-thumbnail'><img style='width=100%' src='"+eachPhotoinArray2+"'></div></li>");
        }

        var marker = new google.maps.Marker({ //marker for the search results
            position: results[i].geometry.location,
            map: map,
            icon: eachPhotoinArray
        });
        markersOnMap.push(marker);

    }//for loop ends

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
    var marker = new google.maps.Marker({
    position: currentLocation,
    map: map
    //icon:
    });

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









