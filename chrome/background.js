chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
  chrome.tabs.executeScript(null, {
    file: "onebyone.js",
    allFrames: true
  });  
});

