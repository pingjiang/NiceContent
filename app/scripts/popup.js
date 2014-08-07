'use strict';

var bg = chrome.extension.getBackgroundPage();
var convertTo = bg.convertTo;

jQuery(document).ready(function($) {
  $('#convertToMarkdown').click(function() {
    bg.convertTo('md');
  });
  
});