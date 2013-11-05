function equal_div_heights(container){

	function set_all_same_height_as_highest(array){

		var max_height = 0;

		// Find highest element
		for( i=0; i<array.length; i++ ){
			if( array[i].height() > max_height ){
				max_height = array[i].height();
			}
		}

		// Set all elements the height of highest element
		for( j=0; j<array.length; j++ ){
			array[j].height(max_height);
		}
	}

	if( container.length < 1 ){
		return;
	}

	var container_width = container.width(),
		items = container.children("div"),
		items_per_row = Math.floor( container_width / items.eq(0).width() ),
		total_rows = Math.ceil( items.length / items_per_row )
	;

	for( var i = 0; i < total_rows; i++ ){

		var array = [];
		
		for( j=0; j < items_per_row; j++ ){

			if( items.eq(i*items_per_row + j).length < 1 ){
				break;
			}

			array[array.length] = items.eq(i*items_per_row + j);
		}

		set_all_same_height_as_highest(array);
		
	}
}

function set_min_element_height_as_window_height(element){
	if( element.length < 1 ){
		return;
	}

	element.height( $(window).height() );
}

// DOCUMENT READY -----------------------------------
	$(function() {

	    equal_div_heights( $(".js-c-4-8-equal-heights") );

	    set_min_element_height_as_window_height( $(".js-left-column") );

		$(window).resize(function() {
			set_min_element_height_as_window_height( $(".js-left-column") );
		});

		$("#js-bind-demo1").click(function(){
			window.location.href = "demo1.html";
		});
	    
	});
//