/*
 Define the App object 
 Contains methods to obtain data from input
 Wires together entire program with the App.start() method
*/
var App = {
	// Store wordList
	words: [],
	// Store word-frequency list in [word, frequency] pairs 
	finalList: [],
	// Store data associated with each "run" of the app
	data: {
		averageLength: 0,
		wordCount: 0,
		paragraphCount: 0
	},
	// Resets the program
	init: function(){
		App.words = [];
		App.finaList = [];
		// Reset all properties
		for(var prop in App.data){
			App.data[prop] = 0;
		}
		// Reset the UI
		$("table").remove();
		$("div.table").append("<table class='words'><tbody><tr><th>Word</th><th>Frequency</th></tr></tbody></table>");
	},
	// Get the number of paragraphs
	getParagraphs: function(textInput){
		var results = textInput.match(/\t/g);
		if( results === null ){
			return 0;
		}
		else{
			return results.length;
		}
	},
	/*
		- @textInput is essay from textbox 
		- Splits string into words by using " " as delimitter
		- Removes white-space chars and replaces with regular " "
		- Returns wordList
	*/
	getWords: function(textInput){
		// Deals with spacing issues
		for(var chars in textInput){
			// Replace new line characters
			textInput = textInput.replace("\n", " ");
			// Tab characters 
			textInput = textInput.replace("\t", " ");
			// Multiple white-space chars
			textInput = textInput.replace(/\s+/g, " ");
		}
		App.words = textInput.split(" ");
	},
	/*
		- Chooses which filters are needed in the data-processing
		- Returns a modified wordList
	*/		
	filters: function(){
		Filters.punctuation( Filters.punctuation( App.words ) );	// Run twice to ensure all chars are taken care of
		if( $("#white_list").is(":checked")  ){
			return Filters.whiteList( App.words );
		}
		else if( $("#black_list").is(":checked") ){
			 return Filters.blackList( Filters.blackList( App.words ) );	// Run twice to ensure filtering of single-letters
		}
		else{
			return App.words;
		}
	},
	/*
		- Checks if capitalization is needed 
		- Returns a modified wordList
	*/
	ignoreLetterCase: function(){
		return ( $("#case").is(":checked") ) ? Filters.ignoreLetterCase( App.words ) : App.words;
	},
	/*
		- Checks if alphabetical order is specififed
		- Returns a modified wordList
	*/
	sorting: function(){
		if( $("#alphabetize_f").is(":checked") ){
			Sorting.alphabetize( App.words, "f" );
		}
		else if( $("#alphabetize_r").is(":checked") ) {
			Sorting.alphabetize( App.words, "r" );
		}
		else {
			return App.words;
		}

	},
	/*
		- @wordList is the list of words to be counted
		- Sorts the words into an object: {word: frequency}
		- Creates finalList, a 2D array of word and frequency for easier sorting: [word, frequency]
		- Returns finalList
	*/
	getList: function(wordList){
		var tableOnWords = {};
		var finalList = [];
		for(var word in wordList){
			// If the word exists, we increment it's frequency. Otherwise, it is 1.
			tableOnWords[ wordList[word] ] ? tableOnWords[ wordList[word] ]++: tableOnWords[ wordList[word] ] = 1;
		}
		for(var entry in tableOnWords){
			finalList.push( [entry, tableOnWords[entry]] );
		}
		return finalList;
	},
	/*
		- @finalList is the 2D array of [word, frequency]'s
		- Outputs each word in finaList to an HTML table
		- Binds click-events to each word for synonym searching (see Web.js)
		
	*/
	UI: function(finalList){
		if( typeof( finalList[0] ) != "object"  ){
			alert( "Essay is blank, or there are no words due to your filters. \n Check your filter settings." );
		}
		// We go through each word in the table
		for(var word in finalList){
			// Append the word itself (word) and the frequency value (table[word]) to an HTML table
			$("#view-analyze table tbody").append(
				"<tr class='entry'><td title='These are the words in your essay' class='word'>"+finalList[word][0]+"</td>"+"<td>"+finalList[word][1]+"</td></tr>"
			);
			$("#view-synonyms table tbody").append(
				"<tr class='entry'><td title='Click on a word to find a list of synonyms for it' class='word'>"+finalList[word][0]+"</td>"+"<td>"+finalList[word][1]+"</td></tr>"
			);
			// Sets up the table in the Find Synonyms view to be clickable
			$("#view-synonyms div.table td.word").unbind('click').click(function(){
				Web.findSyn( $(this) );
			});
		}
		// Update stats
		$(".average_length").html( App.data.averageLength );
		$(".word_count").html( App.data.wordCount );
		$(".paragraph_count").html( App.data.paragraphCount );
	},
	/*
		- @textInput is the essay from the textbox in the "Your Essay" view
		- Wires all the above methods together and executes them in order (see flowchart)
		- Checks if "Sort by frequency" is needed
	*/
	start: function(textInput){
		App.init();
		App.getWords(textInput);
		App.words = App.filters();
		App.words = App.ignoreLetterCase();
		App.sorting();
		App.finalList = App.getList( App.words );
		// Check user preference for frequency sorting
		if( $("#ascending").is(":checked") ){
			App.finalList = Sorting.frequency( App.finalList, "ascending" );
		}
		else if( $("#descending").is(":checked") ){
			App.finalList = Sorting.frequency( App.finalList, "descending" );
		}
		// Calculate word stats
		App.data.paragraphCount = App.getParagraphs(textInput);
		App.data.averageLength = Stats.averageLength( App.words );
		App.data.wordCount = Stats.wordCount( App.finalList );
		App.UI( App.finalList );
	}	
};
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
/*
 Define the Filters object
 Contains all filters and methods
*/
var Filters = {
	/*
		- @wordList is the list of words in the essay
		- Filter out all punctuation from the words and the wordList
		- Returns a filtered wordList
	*/
	punctuation: function(wordList){
		var punctuationChars = [".", ",", "!", "?", ":", ";", "'"," ",];
		for(var word in wordList){
			wordList[word] = wordList[word].replace(/['";:,`.\/!?\\-]/g, '');
			// Takes care of curved quotation marks, both single and double
			wordList[word] = wordList[word].replace(/\u201C/g, '');
			wordList[word] = wordList[word].replace(/\u201D/g, '');
			wordList[word] = wordList[word].replace(/\u2018/g, '');
			wordList[word] = wordList[word].replace(/\u2019/g, '');
			for(var symbol in punctuationChars){
				if( wordList[word] === ""){
					wordList.splice(word, 1);
				}
				// Removes standalone punctuation in words[] array
				else if( punctuationChars[symbol] == wordList[word] ){
					wordList.splice(word, 1);
				}
			}
		}
		return wordList;
	},
	/*
		- @wordList is the list of words in the essay
		- Changes all words to lower case
		- Returns wordList
	*/
	ignoreLetterCase: function(wordList){
		for(var word in wordList){
			// Keep "I" as "I"
			if( wordList[word] === "I" ){
				wordList[word] = "I";
			}
			else{
				wordList[word] = wordList[word].toLowerCase();
			}
		}
		return wordList;
	},
	/*
		- Container for the list of filterWords
		- Defines add and remove methods
	*/
	filterList: {
		// Stores our words
		words: [],
		/*
			- @textInput is the string to be filtered out, from textbox
			- @wordClass is the type of word it is (filterWords from the UI are given a class "word"
			- Adds words to the filterWordList
			- Binds click event to trigger word removal
		*/
		add: function(textInput, wordClass){
			var filterList = Filters.filterList.words;
			textInput = jQuery.trim(textInput);
			if( textInput === "" || textInput === " " ){
				alert("Empty spaces cannot be filtered out");
			}
			else if( jQuery.inArray( textInput, filterList ) != -1 ){	// Checks if the word already exists
				alert("This word is already in the filter.");
			}
			else{
				filterList.push( textInput );
				// If no wordClass is specified, it's given the default regular "word" class
				$("<span title='You can remove this word from the list by clicking it'>"+textInput+"</span><br class='space' />").addClass("word " + wordClass).appendTo(".listItems");
			}
		},
		/*
			- @selectedWord is the clicked word, an HTML element
			- Removes words from the filterList (handles UI and internals)
		*/
		removeUI: function(selectedWord){
			var filterWordList = Filters.filterList.words;
			// Tells user which word they've selected
			selectedWord.css( { fontWeight: "bold" } );
			if( confirm("Remove " + selectedWord.text() + " from the list?") ){
				$(selectedWord).next(".space").remove();	// Remove the preceding space after the word,
				selectedWord.remove();
				filterWordList.splice( jQuery.inArray( selectedWord.text(), filterWordList ), 1 );	// Delete the word from the filterWordList
				
			}
			else{
				selectedWord.css( { fontWeight: "normal" } );
				return false;
			}	
		},
		/*
			- @wordClass is the word type to be removed
			- @removalList is the list of words that are for removal
			- Removes words of a given class
		*/
		removeClass: function(wordClass, removalList){
			var filterList = Filters.filterList.words;
			for(var word in removalList){
				filterList.splice( jQuery.inArray( removalList[word],  filterList ), 1 );
			}
			$( ".listItems" + " ." + wordClass ).each(function(){	// Iterates over each word with the given class
				$(this).remove();
			});
		}
	},
	/*
		- @wordList is the list of words in the essay
		- Removes all words from the wordList but the ones in the filterList
		- Returns modified wordList
	*/
	whiteList: function(wordList){
		// Keeps track of the whiteListed words
		var newWords = [];
		// Short form for the list of filter words
		var filterWordList = Filters.filterList.words;
		// Search to see if the essay word should be filtered out
		for(var filterWord in filterWordList){
			for(var word in wordList){
				if( filterWordList[filterWord] === wordList[word] ){
					newWords.push( filterWordList[filterWord] );
				}
			}
		}
		return newWords;
	},
	/*
		- Contains a list of American English prepositions
		- Defines add and remove methods for the prepostion list
	*/
	prepositions: {
		words: ["a","abaft",
							  "aboard",
							  "about",
							  "above",
							  "absent",
							  "across",
							  "afore",
							  "after",
							  "against",
							  "along",
							  "alongside",
							  "amid",
							  "amidst",
							  "among",
							  "amongst",
							  "an",
							  "anenst",
							  "apropos",
							  "apud",
							  "around",
							  "as",
							  "aside",
							  "astride",
							  "at",
							  "athwart",
							  "atop",
							  "barring",
							  "before",
							  "behind",
							  "below",
							  "beneath",
							  "beside",
							  "besides",
							  "between",
							  "beyond",
							  "but",
							  "by",
							  "circa",
							  "concerning",
							  "despite",
							  "down",
							  "during",
							  "except",
							  "excluding",
							  "failing",
							  "following",
							  "for",
							  "forenenst",
							  "from",
							  "given",
							  "in",
							  "including",
							  "inside",
							  "into",
							  "lest",
							  "like",
							  "mid",
							  "midst",
							  "minus",
							  "modulo",
							  "near",
							  "next",
							  "notwithstanding",
							  "of",
							  "off",
							  "on",
							  "onto",
							  "opposite",
							  "out",
							  "outside",
							  "over",
							  "pace",
							  "past",
							  "per",
							  "plus",
							  "pro",
							  "qua",
							  "regarding",
							  "round",
							  "sans",
							  "save",
							  "since",
							  "than",
							  "through",
							  "throughout",
							  "till",
							  "times",
							  "to",
							  "toward",
							  "towards",
							  "under",
							  "underneath",
							  "unlike",
							  "until",
							  "unto",
							  "up",
							  "upon",
							  "versus",
							  "via",
							  "vice",
							  "with",
							  "within",
							  "without",
							  "worth"
		],
		/*
			- Calls the filterList function passing in the preposition list above
		*/
		add: function(){
			var prepositions = Filters.prepositions.words;
			for(var word in prepositions){
				Filters.filterList.add( prepositions[word], "preposition" );
			}
		},
		remove: function(){
			Filters.filterList.removeClass("preposition", Filters.prepositions.words);
		}
	},
	/*
		- Contains a list of American English helping verbs 
	*/
	helpingVerbs:{
		words:["can", "could", "would", "should", "may", "might", "will", "shall", "must", "ought to", "need", "dare", "used to", "be", "is", "are", "was", "were", "have", "has", "had", "does", "do"],
		add: function(){
			var helpingVerbs = Filters.helpingVerbs.words;
			for(var word in helpingVerbs){
				Filters.filterList.add( helpingVerbs[word], "helpingVerb" );
			}
		},
		remove: function(){
			Filters.filterList.removeClass("helpingVerb", Filters.helpingVerbs.words);
		}
	},
	/*
		- @wordList is the list of words in the essay
		- Removes all words in the filterList from the wordList
		- Returns modified wordList
	*/
	blackList: function(wordList){
		// Short form for the list of filter words
		var filterWordList = Filters.filterList.words;
		// Loop through all the filterWords to compare to each individual word
		for(var word in wordList){
			for(var filterWord in filterWordList){
				// If a filter word is found in the main word list, we remove it
				if( filterWordList[filterWord] === wordList[word] ){
					console.log("Filtered: " + wordList[word] );
					wordList.splice( word, 1 );
				}
			}
		}
		return wordList;
	}
};
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
// Attached events
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
	$("div.listItems span").click(function(){
		Filters.filterList.removeUI( $(this) );
	});
});
/*
	Defines all sorting procedures
*/
var Sorting = {
	/*
		- @wordList is the list of words
		- @order is the string that specifies the order 
		- Returns a sorted wordList
	*/
	alphabetize: function(wordList, order){
		if( order === "r"){
			return ( wordList.sort() ).reverse();
		}
		else{
			return wordList.sort();
		}
	},
	/* 
		- @finalList is the word-frequency list in a 2D array: [word, frequency]
		- @order is the string that specifies the order 	
		- Returns a sorted finalList
	*/
	frequency: function(finalList, order){
		finalList = finalList.sort(function(a,b){
			if( order === "ascending" ){
				return a[1] - b[1];
			}
			else{
				return b[1] - a[1];
			}
		});
		return finalList;
	}
};
/* 
Define the Stats object and all methods associated with it

Required vars:

* wordList: Defined as the array of words from the essay input
* finalList: Defined as the 2D array of [word, frequency] pairs

*/
var Stats = {
	// Finds the number of words in the paper
	wordCount: function(finalList){
		var count = 0;
		// We iterate through the frequency table
		// and keep a running total of the values
		for(var word in finalList){
			count += finalList[word][1];
		}
		return count;
	},
	// Calculate the average length of a word
	averageLength: function(wordList){
		var length = 0;
		// We iterate through a wordList to 
		// add to a running total (wordList[word].length), and then divide
		// by the number of words (wordList.length)
		for(var word in wordList){
			length += wordList[word].length;
		}
		length /= wordList.length;
		return Math.round(length);
	}
};
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
};

	
				
		

			
	
		
	
	
		
		