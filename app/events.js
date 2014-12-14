/*
	Sets up all event listeners
*/
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
	$("body .word").click(function(){
		Filters.filterList.removeUI( $(this) );
	});
});