1x1
===

This is a Chrome extension that finds the content in a web page, breaks it up into sentences, then presents them one at time. The user can move between them with the arrow keys or by clicking.

If you just want to use it, [go here](https://chrome.google.com/webstore/detail/1x1/ndjbmfonldogmcaajhhlogmgngmilnok) and ignore the rest of this.

Installing the extension from source
------------------------------------

1. Go to Extensions in Chrome.
2. Check "Developer mode".
3. Hit "Load unpacked extension" and point it to the chrome directory in this repo.

Structure
---------

__background.js__ waits around in the (wait for it) background to respond to the user hitting the extension's button. When that happens, it loads scripts to be executed in the context of the page in the current tab.

__onebyone.js__ is one of the context scripts. OneByOne creates the elements for displaying the chunks of text and the nav controls. It also kicks off parsing and handles moving chunks onto the display.

__parser.js__ asks the Readability module for the content, then breaks it up into sentences. The regexes it uses come from [srmor's nifty text-parse module](https://github.com/srmor/text-parse).

__readability.js__ finds the content. It's an from an old open source version of Readability ([available here](http://arc90labs-readability.googlecode.com/svn/trunk/js/readability.js)). It was oriented toward changing the DOM to re-present the content, rather than just simple parsing. So, I modified it to give back the content in string arrays. It still modifies the DOM along the way, and I hope to someday get it to a point at which it leaves it unaltered.

License
-------

MIT, except readability.js. That's under Apache 2.0.
