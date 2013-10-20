var OneByOne = {
  fragmentIndex: 0,
  textlayer: null,
  parser: createParser()
};

OneByOne.insertCSS = function insertCSS() {
  var link = document.createElement('link');
  link.href = chrome.extension.getURL('onebyone.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
};

OneByOne.createDrape = function createDrape() {
  var drape = document.createElement('div');
  drape.id = 'drape';
  document.body.appendChild(drape);
  return drape;
};

OneByOne.createTextlayer = function createTextlayer(drapeEl) {
  var textlayer = document.createElement('div');
  textlayer.id = 'textlayer';
  
  drapeEl.appendChild(textlayer);

  return textlayer;
};

OneByOne.respondToDocKeyUp = function respondToDocKeyUp(e) {
  // Esc
  if (e.keyCode === 27) {
    // e.stopPropagation();
    // if (TextStuff.contentZone.classed('editing')) {
    //   TextStuff.changeEditMode(false);
    // }
  }
  else {
    switch (e.which) {
      // 'e'.
      case 69:
        e.stopPropagation();
        if (TextStuff.contentZone.style('display') === 'block') {
          TextStuff.changeEditMode(true);
        }
        break;
      // Down arrow.
      case 40:
        console.log('DOWN!');
        break;
      // Up arrow.
      case 38:
        break;
      // Left arrow.
      case 37:
        break;
      // Right arrow.
      case 39:
        break;
    }
  }
};

OneByOne.displayNextFragment = function displayNextFragment() {
  ++this.fragmentIndex;
  if (this.fragmentIndex >= this.parser.textFragments.length) {
    this.fragmentIndex = 0;
  }
  this.textlayer.innerText = this.parser.textFragments[this.fragmentIndex];
};

OneByOne.load = function load() {
  var existingDrape = document.querySelector('#drape');
  if (existingDrape) {
    return;
  }

  this.insertCSS();  
  var drapeEl = this.createDrape();
  this.textlayer = this.createTextlayer(drapeEl);

  this.parser.parsePage();
  this.displayNextFragment();

  document.addEventListener('keyup', this.respondToDocKeyUp.bind(this));
};

OneByOne.load();
