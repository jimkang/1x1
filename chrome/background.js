chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
  chrome.tabs.executeScript(null, {
    file: "readability.js",
    allFrames: false
  },
  doWhenReadabilityIsLoaded);  
});

function doWhenReadabilityIsLoaded() {
  chrome.tabs.executeScript(null, {
    file: "parser.js",
    allFrames: false
  },
  doWhenParserIsLoaded);   
}

function doWhenParserIsLoaded() {
  chrome.tabs.executeScript(null, {
    file: "onebyone.js",
    allFrames: false
  });
}

