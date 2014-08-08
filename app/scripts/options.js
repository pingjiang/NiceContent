'use strict';

// optional options w/defaults
var remarked_options = {
    link_list:  false,    // render links as references, create link list as appendix
    h1_setext:  true,     // underline h1 headers
    h2_setext:  true,     // underline h2 headers
    h_atx_suf:  false,    // header suffixes (###)
    gfm_code:   false,    // gfm code blocks (```)
    gfm_tbls:   true,     // markdown-extra tables
    tbl_edges:  false,    // show side edges on tables
};

jQuery(document).ready(function($) {
  $.each(remarked_options, function(i, v) {
    var val = localStorage[i] || v;
    if (typeof val == "boolean") {
      val = val ? "true" : "false";
    }
    
    $('#' + i).val(val);
  });
  
  $('#resetMarkdownOptions').click(function() {
    $.each(remarked_options, function(i, v) {
      localStorage[i] = v;
      var val = v;
      if (typeof val == "boolean") {
        val = val ? "true" : "false";
      }
    
      $('#' + i).val(val);
      
      $('#form-msg').text('Reset options success');
    });
  });
  
  $('#saveMarkdownOptions').click(function() {
    $.each(remarked_options, function(i, v) {
      var val = $('#' + i).val();
      localStorage[i] = val || v;
      
      $('#form-msg').text('Save options success');
    });
  });
});