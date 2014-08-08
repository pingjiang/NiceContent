'use strict';

var bg = chrome.extension.getBackgroundPage();
var convertTo = bg.convertTo;

jQuery(document).ready(function($) {
  $('#convertToMarkdown').click(function() {
    bg.convertTo('md');
  });
  
  $('#setOptions').click(function() {
    // var url = 'chrome-extension://__MSG_@@extension_id__/options.html';
    // console.log('Open options page ', url);
    chrome.tabs.create({
        url: 'options.html'
    });
  });
  
  
  
});