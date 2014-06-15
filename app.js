$(document).ready(function(){

	$('#carousel_ul li:first').before($('#carousel_ul li:last')); 
	$('.right-scroll').click(function(){
		var item_width = $('#carousel_ul li').outerWidth() + 20; //get item width plus the margins
		var left_indent = parseInt($('#carousel_ul').css('left')) + item_width; //cancel out the left attribute

		$('#carousel_ul').animate({'left': left_indent},{queue:false, duration:500},function(){

		$('#carousel_ul li:first').after($('#carousel_ul li:last'));
		//$('#carousel_ul').css({'left' : '0px'});
		}); 
	});

//when user clicks the image for sliding left  
        $('.left-scroll').click(function(){  
  
            var item_width = $('#carousel_ul li').outerWidth() + 20;  
  
            /* same as for sliding right except that it's current left indent + the item width (for the sliding right it's - item_width) */  
            var left_indent = parseInt($('#carousel_ul').css('left')) - item_width;  
  
            $('#carousel_ul').animate({'left' : left_indent},{queue:false, duration:500},function(){  
  
            /* when sliding to left we are moving the last item before the first item */  
            $('#carousel_ul li:last').before($('#carousel_ul li:first'));  
   
            //$('#carousel_ul').css({'left' : '0px'});  
            });  
  
        });  






$('.searchForm').submit(function(event){
    event.preventDefault();


    var foodSearch = $(this).find("input[name='food']").val();
    getFoodResults();


});




});//document ends


var getFoodResults = function(){

    var request = {
        //properties go here (what you want)
        radius: 500,
        types: "food|cafe|restaurant",
        sensor: true,
        name: "harbour"
    };




    var result = $.ajax({
        url: "https://maps.googleapis.com/maps/api/place/nearbysearch",
        data: request,
        key: "AIzaSyAJtuQJKLEM3XhuDjlQwdWp72Oz1QILSG8",
        dataType: "JSONP",
        cache:false,
        success:function(){
            console.log(arguments);
        }

    });

}; //getFoodResults ends



// var mapsUrl    = 'http://maps.googleapis.com/maps/api/directions/json' +
//                  '?origin=Toronto&destination=Montreal&sensor=false';
// var encodedUrl = encodeURIComponent(mapsUrl);
// var proxyUrl   = 'http://jsonp.guffa.com/Proxy.ashx?url=' + encodedUrl;


// $.ajax({
//     url: proxyUrl,
//     dataType: 'jsonp',
//     cache: false,
//     success: function (data) {
//         console.log(data);
//     }
// });
    // .done(function(){
    //   console.log('result');
    //     debugger;
    //});

    //};






