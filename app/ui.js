// Change window size on start
window.resizeTo(760, 720);

// Get views on start
$(document).ready(function(){
	View.getViews();
});

// View management
var View = {
	// Keep a hold of all the views in the application
	views: [],
	getViews: function(){
		// We look through all elements with an id attribute
		// and add the ones that have the "view-" prefix
		$("body [id] ").each(function(){
			if( $(this).attr("id").indexOf("view-") != -1 ){
				View.views.push( $(this).attr("id") );
			}
		});
	},
	// Return our current view
	current: function(){
		return document.URL.substring( document.URL.indexOf("#") );
	},
	// Changes views by hiding all but the chosen one (adding class "hidden")
	// and revealing the chosen one (adding class "visible")
	change: function( newView ){
		var viewList = View.views;
		for(var view in View.views){
			if( viewList[view] === newView ){
				$("#"+viewList[view]).addClass("visible").removeClass("hidden");
			}
			else{
				$("#"+viewList[view]).removeClass("visible").addClass("hidden");
			}
		}
	}
}

// Run view swap on all anchor links
$(document).ready(function(){
	$( "a[href*='#']" ).click(function(){
		var link = $(this).attr('href').substring( $(this).attr('href').indexOf("#")+1 );
		//console.log( link );
		View.change( link );
		if( link === "view-analyze" ){
			App.start( $(".essay").val() );
		}
		if( link === "view-synonyms" ){
			App.start( $(".essay").val() );
		}
	});
});
// Listen for filter option change
$(document).ready(function(){
	$("#prepositions").change(function(){
		if( $(this).is(":checked") ){
			Filters.prepositions.add();
		}
		else{
			Filters.prepositions.remove();
		}
	});
	$("#helpingVerbs").change(function(){
		if( $(this).is(":checked") ){
			Filters.helpingVerbs.add();
		}
		else{
			Filters.helpingVerbs.remove();
		}
	});
});
	
		