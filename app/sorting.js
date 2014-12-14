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
}
			