exports.postAceInit = function(){


  /* on click */
  
  //  "#options-taglist" is simply the id/selector of the input with the checkbox determining if taglist is toggled or not. 
  $('#options-taglist').on('click', function() {
    if($('#options-taglist').is(':checked')) {
      tableOfContents.enable(); // enables line tocping
   } else {
      $('#options-taglist').attr('checked',false);
      tableOfContents.disable(); // disables line tocping
    }
  });
  if($('#options-taglist').is(':checked')) {
    tableOfContents.enable();
  } else {
    tableOfContents.disable();
  }

  var urlContainstocTrue = (tableOfContents.getParam("toc") == "true"); // if the url param is set
   if(urlContainstocTrue){
    $('#options-taglist').attr('checked','checked'); //#options-taglist is simply the id of the input with the checkbox
    tableOfContents.enable();
  }else if (tableOfContents.getParam("toc") == "false"){
    $('#options-taglist').attr('checked',false);
    tableOfContents.disable();
  }
}
