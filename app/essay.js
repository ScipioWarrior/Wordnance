/*
 Define the Essay object
 Stores textInput from essay textbox
 Contains methods for saving and loading essay revisions
*/	
 var Essay = {
	1: "",
	2: "",
	3: "",
	4: "",
	/*
		- @slot is the 'slot' the essay is to be saved under
	*/
	add: function(slot){
		Essay[slot] = $(".essay").val();
		$(".essay").val("");
	},
	/*
		- @slot is the 'slot' the essay is to be loaded from
	*/
	load: function(slot){
		$(".essay").val( Essay[slot] );
	}
};
/*
Thanks a lot to:
http://stackoverflow.com/questions/4431130/this-regex-to-strip-punctuation-also-incorrectly-makes-the-word-baenou-into-beno
http://stackoverflow.com/questions/7252511/jquery-click-keeps-adding-to-the-event-rather-than-replacing-it 
http://stackoverflow.com/questions/1069666/sorting-javascript-object-by-property-value 
*/