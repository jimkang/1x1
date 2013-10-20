var OneByOne = {
  chunkIndex: 0,
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
    // Since Readability alters the page (for now), the only  way out is to 
    // reload the page. 
    location.reload(false);
  }
  else {
    switch (e.which) {
      // Down arrow.
      case 40:
      // Right arrow.
      case 39:
        this.turnChunk(1);
        break;
      // Up arrow.
      case 38:
      // Left arrow.
      case 37:
        this.turnChunk(-1);
        break;
    }
  }
};

OneByOne.changeFragIndex = function changeFragIndex(howMuch) {
  this.chunkIndex += howMuch;

  if (this.chunkIndex >= this.parser.textChunks.length) {
    this.chunkIndex = 0;
  }
  else if (this.chunkIndex < 0) {
    this.chunkIndex = this.parser.textChunks.length - 1;
  }
};

OneByOne.turnChunk = function turnChunk(howMuchToTurnBy) {
  this.changeFragIndex(howMuchToTurnBy);
  this.textlayer.innerText = this.parser.textChunks[this.chunkIndex];
};

OneByOne.load = function load() {
  var existingDrape = document.querySelector('#drape');
  if (existingDrape) {
    return;
  }

  this.parser.parsePageWithReadability();

  this.insertCSS();  
  var drapeEl = this.createDrape();
  this.textlayer = this.createTextlayer(drapeEl);

  this.turnChunk(0);

  document.addEventListener('keyup', this.respondToDocKeyUp.bind(this));
};

OneByOne.load();
