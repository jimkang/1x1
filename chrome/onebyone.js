var OneByOne = {
  sentences: [],
  paragraphs: []  
};

OneByOne.createDrape = function createDrape() {
  var drape = document.createElement('div');
  drape.id = 'drape';
  drape.style.backgroundColor = 'yellow';
  drape.style.position = 'absolute';
  document.body.appendChild(drape);
  return drape;
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

OneByOne.load = function load() {
  var existingDrape = document.querySelector('#drape');
  if (existingDrape) {
    return;
  }
  
  this.createDrape();
  document.addEventListener('keyup', this.respondToDocKeyUp.bind(this));
};

OneByOne.load();
