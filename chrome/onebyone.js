var OneByOne = {
  chunkIndex: 0,
  textlayer: null,
  chunkNavEl: null,
  indexDisplayEl: null,
  indexEditingHappening: false,
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
  textlayer.onclick = function respondToClick(e) {
    this.turnChunk(1);
  }
  .bind(this);
  
  drapeEl.appendChild(textlayer);

  return textlayer;
};

OneByOne.createChunkNav = function createChunkNav() {
  var chunknav = document.createElement('div');
  chunknav.id = 'chunknav';
  chunknav.classList.add('reading-chunk');
  chunknav.onclick = this.startIndexEditing.bind(this);
  document.body.appendChild(chunknav);

  this.indexDisplayEl = document.createElement('span');
  this.indexDisplayEl.id = 'indexDisplay';
  this.indexDisplayEl.addEventListener('keydown', 
    this.restrictElInputToNumerals);
  chunknav.appendChild(this.indexDisplayEl);

  return chunknav;
};

OneByOne.respondToDocKeyUp = function respondToDocKeyUp(e) {
  // Esc
  if (e.keyCode === 27) {
    if (this.indexEditingHappening) {
      this.endIndexEditing();
    }
    else {
      // Since Readability alters the page (for now), the only  way out is to 
      // reload the page. 
      location.reload(false);
    }
  }
  else if (this.indexEditingHappening) {
    // Enter
    if (e.which === 13) {
      this.endIndexEditing();
    }
  }
  else {
    switch (e.which) {
      // Right arrow.
      case 39:
        this.turnChunk(1);
        break;
      // Down arrow.
      case 40:
        this.turnChunk(10);
        break;        
      // Left arrow.
      case 37:
        this.turnChunk(-1);
        break;
      // Up arrow.
      case 38:
        this.turnChunk(-10);
        break;
      // 'g'.
      case 71:
        this.startIndexEditing();
        break;
    }
  }
};

// http://stackoverflow.com/a/995193/87798
OneByOne.restrictElInputToNumerals = function restrictElInputToNumerals(event) {
  switch (event.keyCode) {
    // Allow: backspace, delete, tab, escape, enter and .
    case 46: case 8: case 9: case 27: case 13: case 190:
     // Allow: home, end, left, right
    case 35: case 36: case 37: case 38: case 39:
      return;
    default:
      // Allow cmd+A, ctrl+A.
      if (event.keyCode == 65 && (event.metaKey || event.ctrlKey === true)) {
         return;
      }
  }

  // Ensure that it is a number and stop the keypress
  if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && 
    (event.keyCode < 96 || event.keyCode > 105 )) {

    event.preventDefault();
  }
};

OneByOne.changeFragIndex = function changeFragIndex(howMuch) {
  this.chunkIndex += howMuch;
  this.makeIndexSane();
};

OneByOne.makeIndexSane = function makeIndexSane() {
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
  this.indexDisplayEl.innerText = 
    (this.chunkIndex + 1) + ' of ' + this.parser.textChunks.length;
};

OneByOne.startIndexEditing = function startIndexEditing() {
  this.indexEditingHappening = true;
  this.indexDisplayEl.innerText = this.chunkIndex + 1;
  this.chunkNavEl.classList.add('editing-chunk');
  this.indexDisplayEl.contentEditable = true;
  this.indexDisplayEl.focus();

  var selection = window.getSelection();            
  var range = document.createRange();
  range.selectNodeContents(this.indexDisplayEl);
  selection.removeAllRanges();
  selection.addRange(range);
};

OneByOne.endIndexEditing = function endIndexEditing() {
  this.indexDisplayEl.blur();
  this.indexEditingHappening = false;
  var newIndex = parseInt(this.indexDisplayEl.innerText) - 1;
  this.chunkNavEl.classList.remove('editing-chunk');
  this.indexDisplayEl.contentEditable = false;

  this.chunkIndex = newIndex;
  this.makeIndexSane();
  this.turnChunk(0);
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
  this.chunkNavEl = this.createChunkNav(drapeEl);

  this.turnChunk(0);

  document.addEventListener('keyup', this.respondToDocKeyUp.bind(this));
};

OneByOne.load();
