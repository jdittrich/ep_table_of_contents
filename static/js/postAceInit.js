exports.postAceInit = function(){


  /* on click */
  
  //  "#options-taglist" is simply the id/selector of the input with the checkbox determining if taglist is toggled or not. 
  $('#options-taglist').on('click', function() {
    if($('#options-taglist').is(':checked')) {
      taglist.enable(); // enables line tocping
   } else {
      $('#options-taglist').attr('checked',false);
      taglist.disable(); // disables line tocping
    }
  });
  if($('#options-taglist').is(':checked')) {
    taglist.enable();
  } else {
    taglist.disable();
  }

  var urlContainstocTrue = (taglist.getParam("taglist") == "true"); // if the url param is set
   if(urlContainstocTrue){
    $('#options-taglist').attr('checked','checked'); //#options-taglist is simply the id of the input with the checkbox
    taglist.enable();
  }else if (taglist.getParam("taglist") == "false"){
    $('#options-taglist').attr('checked',false);
    taglist.disable();
  }
}
