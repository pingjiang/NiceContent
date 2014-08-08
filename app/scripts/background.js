'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.pageAction.show(tabId);
});

var copyToClipboard = function (text) {
    var copyDiv = document.createElement('textarea');
    copyDiv.id = 'copydiv';

    document.body.appendChild(copyDiv);
    copyDiv.textContent = text;
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand('copy');
    document.body.removeChild(copyDiv);
};

function createNotification(msg){
    var opt = {type: "basic",title: "__MSG_appName__", message: msg}
    chrome.notifications.create("notificationName",opt,function(){
      console.log('notifications fired');
    });

    //include this line if you want to clear the notification after 5 seconds
    setTimeout(function(){chrome.notifications.clear("notificationName",function(){});},5000);
}

// optional options w/defaults
var options = {
    link_list:  false,    // render links as references, create link list as appendix
    h1_setext:  true,     // underline h1 headers
    h2_setext:  true,     // underline h2 headers
    h_atx_suf:  false,    // header suffixes (###)
    gfm_code:   false,    // gfm code blocks (```)
    li_bullet:  "*",      // list item bullet style
    hr_char:    "-",      // hr style
    indnt_str:  "    ",   // indentation string
    bold_char:  "*",      // char used for strong
    emph_char:  "_",      // char used for em
    gfm_del:    true,     // ~~strikeout~~ for <del>strikeout</del>
    gfm_tbls:   true,     // markdown-extra tables
    tbl_edges:  false,    // show side edges on tables
    hash_lnks:  false,    // anchors w/hash hrefs as links
    br_only:    false,    // avoid using "  " as line break indicator
};

function loadReMarkedOptions(options) {
  // localStorage
  var newOptions = {};
  Object.keys(options).forEach(function(v) {
    newOptions[v] = localStorage[v] || options[v];
  });
  
  console.log('Using new options', newOptions);
  return newOptions;
}

var reMarker = new reMarked(loadReMarkedOptions(options));

var markdownConverter = function(html) {
  return reMarker.render(html);
};

function convertTo(format) {
  console.log('Convert selected content into format ' + format);
  var converter = markdownConverter;
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectionInfo' }, function (response) {
        console.log('got response from contentscript', response);
        
        if (!response || response.error) {
          console.error('getSelectionInfo return error', response && response.error);
        } else {
          // 处理获取的选取
          var markdownText = converter(response.selection);
          // 将结果保存到剪切板
          if (markdownText) {
            copyToClipboard(markdownText);
            createNotification('Convert to markdown success, already in clipboard.');
          } else {
            createNotification('Convert to markdown error');
          }
        }
      });
  });
}


chrome.contextMenus.create({
  "title": chrome.i18n.getMessage('CopyAsMarkdown'), 
  "contexts":["selection"], 
  "onclick": function (info, tab) {
    convertTo('md');
  }
});


chrome.commands.onCommand.addListener(function (command) {
    console.log('Received Command:' + command);

    if (command !== 'convertSelectedToMarkdown') {
        return;
    }
    
    convertTo('md');
});