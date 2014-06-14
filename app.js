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


$('.searchForm').submit(function(){
    var foodSearch = $(this).find("input[name='food']").val();
    getFoodResults();

});



});//document ends


var getFoodResults = function(){
    var result = $.ajax({
        url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=harbour&sensor=false&key=AIzaSyAJtuQJKLEM3XhuDjlQwdWp72Oz1QILSG8",
    });
    console.log(result);

};





