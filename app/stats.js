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
}
	