/*
Contains all methods with the Web object, including the synonym finder
*/
var Web = {
	syns: [],
	key: "fVjb0OFYzLkAdlwF0cFh",
	reset: function(){
		// Reset the synonym list
		Web.syns = [];
		// Clear the synonym list box
		$("div.synonyms").empty();
		$("div.synonyms").append("<h4>Synonym List</h4><br />");
		// Unselect selected words in list box
		$("#view-synonyms div.table td").each(function(){
			$(this).css( "fontWeight", "400" );
		});
	},
	findSyn: function(word){
		Web.reset();
		word.css( {fontWeight: "bold"} );
		// Creates a call to the Altervista Thesaurus
		var s = document.createElement("script"); 
		s.src = "http://thesaurus.altervista.org/service.php?word="+word.text()+"&language=en_US&output=json&key="+Web.key+"&callback=Web.printSyn"; // NOTE: replace test_only with your own KEY 
		document.getElementsByTagName("head")[0].appendChild(s);
	},
	printSyn: function(result){
		var output = "";
		var list = "";
		// The Web.syns array will be full of objects
		// Ex: Web.syns[0].synonyms = "baking (similar term) | x | x | etc."
		for(var key in result.response){
			Web.syns.push(result.response[key].list);
		}
		Web.syns = Web.syns[0].synonyms.split(" | ");
		Web.syns = Web.syns[0].split("|");
		for(var word in Web.syns){
			// Remove the (similar term) string that's attached to some of the words
			var removeChar = Web.syns[word].indexOf( "(" );
			// The API sometimes returns antonyms, so we must delete those
			var antonym = Web.syns[word].indexOf("antonym");
			if( antonym > -1 ){
				Web.syns.splice( word, 1 );
				break;
			}
			else if( removeChar > -1 ){
				Web.syns[word] = Web.syns[word].substring(0, removeChar);
			} 
			$("div.synonyms").append("<span class='syn'>" + Web.syns[word] + "</span><br />" );
		}
	},
}
