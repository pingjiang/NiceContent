'use strict';

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * [adjustRange description]
 * @param  {[type]} range
 * @return {[type]}
 */
var adjustRange = function (range) {
    range = range.cloneRange();

    // Expand range to encompass complete element if element's text
    // is completely selected by the range
    var container = range.commonAncestorContainer;

    // 元素类型	节点类型
    // 元素element	1
    // 属性attr	2
    // 文本text	3
    // 注释comments	8
    // 文档document	9
    var parentElement = container.nodeType == 3 ?
        container.parentNode : container;

    if (parentElement.textContent == range.toString()) {
        range.selectNode(parentElement);
    }

    return range;
};

/**
 * Simplify the url.
 *
 * @param  {[type]} url
 * @return {[type]}
 */
var simplifyUrl = function (url) {
    if (!url) {
        return;
    }

    url = url.replace(/&?utm_\w+(=[^&]+)/g, '');
    if (url.endsWith('/?')) {
        url = url.substring(0, url.length - 2);
    }else if (url.endsWith('?')) {
        url = url.substring(0, url.length - 1);
    }
    return url;
};

var simplifyTitle = function (title) {
    if (!title) {
        return;
    }

    return title.replace(/\s*\|.*/g, "");
};

/**
 * 获得选择的HTML。
 * <p> 支持多选。
 * @return {string} 选择的字符串。
 */
var getSelectionHtml = function () {
  var selection = window.getSelection || document.selection;
  if (!selection) {
    return 'selection is empty.';
  }
  var sel = selection(), range;
  console.log('got selection %s', sel);
  if (sel.type === 'Text') {
    return sel.createRange().htmlText;
  } else if (sel.type === 'Range') {
    if (!sel.rangeCount || sel.rangeCount === 0) {
      return '';
    }
    var container = document.createElement("div");
    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        range = adjustRange(sel.getRangeAt(i));
        container.appendChild(range.cloneContents());
    }

    // travel link to modify the relative url to absolute url.
    var links = container.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
        links[i].setAttribute("href", links[i].href);
    }

    // travel img to modify the relative url to absolute url.
    var imgs = container.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute("src", imgs[i].src);
    }

    return container.innerHTML;
  } else {
    return 'selection type ' + sel.type + ' is not supported yet.';
  }
};

chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
    if (request.action !== 'getSelectionInfo') {
        return;
    }

    var response = {
        url: window.location.href,
        title: document.title,
        selection: getSelectionHtml()
    };
    
    console.log('send response to background: ' + JSON.stringify(response));
    sendResponse(response);
});
