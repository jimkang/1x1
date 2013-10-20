// Assumes readability.js was loaded.

function createParser() {
  var Parser = {
    textFragments: []
  };

  Parser.parsePage = function parsePage() {
    var containerNodes = document.querySelectorAll('div,span,li,p');
    for (var i = 0; i < containerNodes.length; ++i) {
      this.storeFragmentsFromNode(containerNodes[i]);
    }    
  };

  Parser.parsePageWithReadability = function parsePageWithReadability() {
       /* Before we do anything, remove all scripts that are not readability. */
      window.onload = window.onunload = function() {};

      readability.removeScripts(document);

      // if(document.body && !readability.bodyCache) {
      //     readability.bodyCache = document.body.innerHTML;
      // }

      /* Make sure this document is added to the list of parsed pages first, so we don't double up on the first page */
      readability.parsedPages[window.location.href.replace(/\/$/, '')] = true;

      /* Pull out any possible next page link first */
      var nextPageLink = readability.findNextPageLink(document.body);
      
      readability.prepDocument();

      debugger;
  };

  Parser.storeFragmentsFromNode = function storeFragmentsFromNode(node) {
    if (node.innerText && typeof node.innerText === 'string') {
      var words = node.innerText.split(' ');
      var fragment = '';
      for (var i = 0; i < words.length; ++i) {
        var word = words[i];
        if (word.length > 0 && word[0] !== '\n') {
          fragment += (word + ' ');
          if (fragment.length > 100) {
            this.textFragments.push(fragment);
            fragment = '';
          }
        }
      }

      if (fragment.length > 0) {
        this.textFragments.push(fragment);
      }
    }
  };

  return Parser;
}
