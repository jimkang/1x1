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
