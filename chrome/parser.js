// Assumes readability.js was loaded.

function createParser() {
  var Parser = {
    textChunks: [],
    chunkCutoff: 100
  };

  Parser.parsePage = function parsePage() {
    var containerNodes = document.querySelectorAll('div,span,li,p');
    for (var i = 0; i < containerNodes.length; ++i) {
      this.storeChunksFromNode(containerNodes[i]);
    }    
  };

  Parser.parsePageWithReadability = function parsePageWithReadability() {
     /* Before we do anything, remove all scripts that are not readability. */
    window.onload = window.onunload = function() {};

    readability.removeScripts(document);

    /* Make sure this document is added to the list of parsed pages first, so we don't double up on the first page */
    readability.parsedPages[window.location.href.replace(/\/$/, '')] = true;

    /* Pull out any possible next page link first */
    var nextPageLink = readability.findNextPageLink(document.body);
    
    readability.prepDocument();

    var contentChunks = readability.grabArticleAsTextArray();
    contentChunks.forEach(this.storeChunksFromContent.bind(this));
  };

  Parser.storeChunksFromContent = 
  function storeChunksFromContent(content) {
  
    var words = content.split(' ');
    var chunk = '';
    for (var i = 0; i < words.length; ++i) {
      var word = words[i];
      if (word.length > 0 && word[0] !== '\n') {
        chunk += (word + ' ');
        if (chunk.length > this.chunkCutoff) {
          this.textChunks.push(chunk);
          chunk = '';
        }
      }
    }

    if (chunk.length > 0) {
      this.textChunks.push(chunk);
    }
  };

  return Parser;
}
