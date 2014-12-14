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
			// If no wordClass is specified, it's a regular word
			wordClass === "undefined" ? wordClass="word" : wordClass;
			textInput = jQuery.trim(textInput);
			if( textInput === "" || textInput === " " ){
				alert("Empty spaces cannot be filtered out");
			}
			else if( jQuery.inArray( textInput, filterList ) != -1 ){	// Checks if the word already exists
				alert("This word is already in the filter.");
			}
			else{
				filterList.push( textInput );
				$("<span title='You can remove this word from the list by clicking it'>"+textInput+"</span><br class='space' />").addClass(wordClass).appendTo(".listItems");
				// Bind remove event on click
				$(".listItems span").unbind('click').click(function(){
					Filters.filterList.removeUI( $(this) );
				});
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
		- Defines add and remove methods for the preposition list
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
}

			
	
		