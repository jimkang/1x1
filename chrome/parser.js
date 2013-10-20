// Assumes readability.js was loaded.

function createParser() {
  var Parser = {
    textChunks: [],
    chunkCutoff: 150
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

  Parser.storeChunksFromContent = function storeChunksFromContent(content) {
    var paragraphs = this.textToParagraphs(content);
    if (paragraphs) {
      for (var j = 0; j < paragraphs.length; ++j) {
        var sentences = this.paragraphToSentences(paragraphs[j]);
        if (sentences) {
          for (var i = 0; i < sentences.length; ++i) {
            var sentence = sentences[i];
            if (sentence.length < this.chunkCutoff) {
              this.textChunks.push(sentence);
            }
            else {
              this.storeChunksFromSentence(sentence);
            }
          }
        }      
      }
    }
  };

  Parser.storeChunksFromSentence = function storeChunksFromSentence(sentence) {
    var words = sentence.split(' ');
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

  // Regex lifted from text-parse.
  // https://github.com/srmor/text-parse/blob/master/lib/text-parse.js
  Parser.textToParagraphs = function textToParagraphs(text) {
    return text.split( /[\r\n|\n|\r]+/g );
  };

  // Regex lifted from text-parse.
  // https://github.com/srmor/text-parse/blob/master/lib/text-parse.js
  Parser.paragraphToSentences = function paragraphToSentences(paragraph) {
    paragraph = paragraph.trim();
    return paragraph.match( /[^\.!\?]+[\.!\?(?="|')]+(\s|$)/g );
  };

  return Parser;
}
