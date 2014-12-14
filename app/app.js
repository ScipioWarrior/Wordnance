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
}
	
	
		
		