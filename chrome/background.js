var scriptchain = createScriptChain(
  ['readability.js', 'parser.js', 'onebyone.js'], null, false
);

chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
  scriptchain.loadChain();
});

