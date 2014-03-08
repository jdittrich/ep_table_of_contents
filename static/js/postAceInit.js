exports.postAceInit = function(){
var $ = require('ep_etherpad-lite/static/js/rjquery').$; //it rjquery is a bridge in order to make jquery require-able
$("#taglist").css("height","calc(100% - "+$("#editbar").height()+"px"+")"); //the fixed position of the taglist-sidebar is calculated for the viewport height. The editbar reduces the effective height that can be used, thus we need to reduce the height by that amount. Why the computed value of "top" for the element is the viewports height already (and not 0) I dont know.

  
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
