$('#taglistButton').click(function(){
  $('#taglist').toggle();
});

var taglist = {

	enable: function(){ //show TOC
		$('#taglist').show().css("width", "180px");
		$('#editorcontainer').css("right", "200px");
		$('#editorcontainer').css("width", "auto");
		this.update();
	},

	disable: function(){ //hide TOC
		$('#taglist').hide();
		$('#editorcontainer').css("width", "100%");
	},

	
	
	/* depreciated was code form the TOC-plugin
	// Find Tags
	
	findTags: function(){
		var toc = {};
		var count = 0;
		var hs = $('iframe[name="ace_outer"]').
			contents().
			find('iframe').
			contents().
			find("#innerdocbody").
			children("div").
			children("h1, h2, h3, h4, h5, h6");
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
	*/
	
	/* depreciated was code form the TOC-plugin
	$.each(toc, function(h, v){ // for each item we want to display
		var TOCString = "<a title='"+v.text+"' class='taglistItem taglist"+v.tag+"' data-class='taglist"+v.tag+"' onClick=\"taglist.scroll('"+v.y+"');\" data-offset='"+v.y+"'>"+v.text+"</a>";
		$('#taglistItems').append(TOCString); //display it. TODO: Doing this iteratively, is probably inefficient.
	});

	},*/


	// get HTML
	displayTaglist: function(){
		if($('#options-taglist').is(':checked')) {
			$('#taglistItems').html("");  //clear currently shown list
			taglist.renderTaglist(taglist.createTaglist());
		}
	},

	update: function(){
		taglist.displayTaglist();
	},

	createTaglist:function(){
		/*
		gets: nothing
		returns: a key-value(Strings)structure like {a:[arrays], b:[arrays]… etc.}. Currenty depth of 1, later hopefully more <- TODO
		does: get text from document search for a regex and gather all text+sourrounding dom element in the return value. 
		*/
		
		var hits=[]; //hits save as [{domElement,

		$('iframe[name="ace_outer"]')
		.contents()
		.find('iframe')
		.contents()
		.find("#innerdocbody")
		.children("div")
		.each(function(index,domElement){ //get all dom nodes of interest. For each do...
	
			//finds all (/g = greedy regex) matches in the inner text of the current DOM element //TODO: move regex to config object
			var stringMatches =  $(domElement).text().match(/(#\w+)+/g) || []; 
			underscore.each(stringMatches,function(stringMatch, index, list){
			hits.push({
				relatedDomElement:domElement,
				match:stringMatch.match(/#\w+/g) //splits the hashtag into its elements, so #foo#bar becomes ["foo","bar"] //TODO: move regex to config object.
				});
			});
		});

		//now that we got all our hits in an [{domEleme,[hash1, hash2]}, ] structure…
		var sortedList = underscore.sortBy(hits,function(objects){return objects.match.join("");});//sort all entries in the hits array alphabetically. The sub-tag-Array-Items are joined for that.
		var groupedTree = underscore.groupBy(sortedList,function(objects){
			return objects.match[0];
			}); //input: testarray=[["a","s"],["a","p"],["a","d"],["b","s"],["b","p"],["c","d"]], outputs {a:[/*all arrays with first element being an a*/], b:[/*all arrays with first element being an b*/]… etc.}
		return groupedTree;
	},
	
	
	renderTaglist:function(groupedTree){
		/*
		gets: a key-value(Strings)structure like {a:[arrays], b:[arrays]… etc.}. Currenty depth of 1, later hopefully more <- TODO
		returns: undefined
		does: create DOM-Elements for displaying a scroll-on-click overview of all tags in the document
		*/
		var taggroupsArray=[];
		$.each(groupedTree, function(key,matches){ 
			var groupHeading = $("<h2/>",{'class':"ep_taglist_Heading",'text':key}); 
			var groupMatchesContainer = $("<ul/>",{'class':"ep_taglist_groupMatchesContainer"});
			$.each(matches,function(index,value){
				var listItem=$("<li/>",{class:"ep_taglist_groupEntry", text:value.match.join("")}).on("click",function(){
					$('iframe[name="ace_outer"]').contents().find("#outerdocbody").scrollTo(value.relatedDomElement);
					}).appendTo(groupMatchesContainer);
				});//END each
			taggroupsArray.push(groupHeading, groupMatchesContainer);
			$('#taglistItems').append(taggroupsArray);
		});//END each
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
	},
	
	keyEvent: function(arg1, arg2, arg3, arg4, arg5){
		"thisisastring"
	}
};


