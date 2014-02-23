$('#taglistButton').click(function(){
  $('#taglist').toggle();
});

var taglist = {

  enable: function(){ //show TOC
    $('#taglist').show().css("width", "180px");
    $('#editorcontainer').css("right", "200px");
    $('#editorcontainer').css("width", "auto");
    this.update()
  },

  disable: function(){ //hide TOC
    $('#taglist').hide();
    $('#editorcontainer').css("width", "100%");

  },

  // Find Tags
  findTags: function(){
    var toc = {};
    var count = 0;
    var hs = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div").children("h1, h2, h3, h4, h5, h6");;
    $(hs).each(function(){ //for each relevant dom element
      var tag = this.nodeName.toLowerCase();
      var newY = $(this).context.offsetTop + "px";
      var linkText = $(this).text(); // get the text for the link
      var focusId = $(this).parent()[0].id; // get the id of the link
      toc[count] = {
        tag : tag,
        y : newY,
        text : linkText,
        focusId : focusId
      }
      count++;
    }); //each end

    $.each(toc, function(h, v){ // for each item we want to display
      var TOCString = "<a title='"+v.text+"' class='taglistItem taglist"+v.tag+"' data-class='taglist"+v.tag+"' onClick=\"taglist.scroll('"+v.y+"');\" data-offset='"+v.y+"'>"+v.text+"</a>";
      $('#taglistItems').append(TOCString); //display it. TODO: Doing this iteratively, is probably inefficient.
    });

  },


  // get HTML
  getPadHTML: function(){
    if($('#options-taglist').is(':checked')) {
      $('#taglistItems').html("");  //clear currently shown list
      taglist.findTags(); //get tags and insert them
    }
  },

  update: function(){
    taglist.getPadHTML();
  },

  scroll: function(newY){
   //seemingly the included scrollto library is not needed; I find it nowhere referenced.
    var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
    var $outerdocHTML = $outerdoc.parent();
    $outerdoc.animate({scrollTop: newY});
    $outerdocHTML.animate({scrollTop: newY}); // needed for FF
  },
  getParam: function(sname)
  {	/*
  	for getting URL parameters
  	sname is the requested key
	returned is the keys value

	so if you have http://www.someurl.end?foo=bar
	it will return "bar" if you give it "foo"
  	*/
    var params = location.search.substr(location.search.indexOf("?")+1); //"?" devides the actual URL from the parameters
    var sval = "";
    params = params.split("&"); //"&" devides the kex/value pairs

    for (var i=0; i<params.length; i++)// split param and value into individual pieces
    {
      temp = params[i].split("=");
      if ( [temp[0]] == sname ) { sval = temp[1]; }
    }
    return sval;
  }
};


