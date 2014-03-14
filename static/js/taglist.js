var underscore = require('ep_etherpad-lite/static/js/underscore');


$('#taglistButton').click(function(){
  $('#taglist').toggle();
});

/*
if the plugin slows down the performace one could use
taglist.update = underscore.debounce(taglist.update, 500)
and thus execute the operations only, if half a second has passed after the last call (=editEvent) of the function.
(Quote underscore docs "debounce_.debounce … Creates and returns a new debounced version of the passed function which will postpone its execution until after wait milliseconds have elapsed since the last time it was invoked.")
*/

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


	// get HTML
	displayTaglist: function(){
		if($('#options-taglist').is(':checked')) {
			$('#taglistItems').html("");  //clear currently shown list
			var $domElements = taglist.createDomTree(taglist.createTaglist());
			$("#taglistItems").append($domElements);
		}
	},

	update: function(hook_name, args, cb){
		taglist.displayTaglist();
	},

	createTaglist:function(){
		var hits=[]; //hits save as [{domElement,

		$('iframe[name="ace_outer"]')
		.contents()
		.find('iframe')
		.contents()
		.find("#innerdocbody")
		.children("div")
		.each(function(index,domElement){ //get all dom nodes of interest. For each do...
			var stringMatches =  $(domElement).text().match(/(#\w+)+/g) || []; //finds all (/g = greedy regex) matches in the inner text of the current DOM element //TODO: move regex to config object
			underscore.each(stringMatches,function(stringMatch, index, list){
			hits.push({
				relatedDomElement:domElement,
				match:stringMatch.match(/#\w+/g) //splits the hashtag into its elements, so #foo#bar becomes ["foo","bar"] //TODO: move regex to config object.
				});
			});
		});



		//now that we got all our hits in an [{domEleme,[hash1, hash2]}, ] structure…
		//var sortedList = underscore.sortBy(hits,function(objects){return objects.match.join("");});//sort all entries in the hits array alphabetically

		var ordered = underscore.groupBy(hits,function(item){
			return item.match[0];
		}); //input: testarray=[["a","s"],["a","p"],["a","d"],["b","s"],["b","p"],["c","d"]], outputs {a:[/*all arrays with first element being an a*/], b:[/*all arrays with first element being an b*/]… etc.}


		underscore.each(ordered,
		function(keyvalues,key, list){

			list[key] = underscore.groupBy(keyvalues, //the value passed per item in _.each is not a reference to the original item (afaic), thus the list[key]…
				function(item){
					return item.match[1] || " "; //if item is not an array it is a plain text. it would get in the group "undefined", since its element 1 is undefined. but if the Element in front of || is undefined, the 2nd one is returned, the elements get into the group titeled with noting aka a blank " ".
			});
		});

		return ordered;

	},

	createDomTree:function(structure){
		//gets: Structure is a key-value tree in the way it is returned by _.groupBy;
		//Structure may be deeply nested, so it could be {"a":{"b":"c":[...]}}}.
		//Either a key holds a object with more keys or an array with values
		// from the highest to the loewest level: ["main","sub","subsub"]
		//
		//returns:
		//a jquery object holding an DOM-element structure of nested lists.
		//

		var $list = $("<ul/>");
		underscore.each(structure,function(element, key, list){
			if(underscore.isNumber(key)){ //if the strucutre each is applied on is an array, the key will be numeric. If it is an array, we are one the lowest level, thus we render the "li" items
				$("<li/>",
					{text:element.match.join("#"), "class":"taglistItem"}).
						on("click",function(){
							$('iframe[name="ace_outer"]').contents().find("#outerdocbody").scrollTo(element.relatedDomElement);
					}).appendTo($list);
			}else if(underscore.isString(key)){//if the structure each is applied on, is an array, the key will be numeric. If it is an object it contains either other objects or arrays, so we append an additional list.
				$("<li/>",{text:key}).append(taglist.createDomTree(element)).appendTo($list); //Recursion FTW (my brain: WTF?!)
			}
		});
		return $list;
	},

	/*
	scroll: function(newY){
		//seemingly the included scrollto library is not needed; I find it nowhere referenced.
		var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
		var $outerdocHTML = $outerdoc.parent();
		$outerdoc.animate({scrollTop: newY});
		$outerdocHTML.animate({scrollTop: newY}); // needed for FF
	},
	*/
	graspMousedown:function(event){
		var initXMouse=event.pageX;
		var initWidthSidebar = parseInt($('#taglist').css("width")); //sidebar width as int.
		var initRightEditor = parseInt($('#editorcontainer').css("right"));//editor container right position as int.

		$(document).on(
			"mousemove.sidebarGrasp",
			{
			"initXMouse":initXMouse,//initXMouse,
			"initWidthSidebar":initWidthSidebar,
			"initRightEditor":initRightEditor
			},
			taglist.graspMousemove
		).on("mouseup.sidebarGrasp",taglist.graspMouseup);

		$('iframe[name="ace_outer"]').contents().find('#outerdocbody').find('iframe[name="ace_inner"]').contents().on(
			"mousemove.sidebarGrasp",
			{
			"initXMouse":initXMouse,//initXMouse,
			"initWidthSidebar":initWidthSidebar,
			"initRightEditor":initRightEditor
			},
			taglist.graspMousemove
		).on("mouseup.sidebarGrasp",taglist.graspMouseup);
	},
	graspMousemove:function(event){
		if(event.buttons === 0){ //if no button is pressed we missed the mouseup. We do it now.
			taglist.graspMouseup();
		}
		var diffX = event.data.initXMouse - event.pageX;
		$('#taglist').css("width",(event.data.initWidthSidebar + diffX)+"px");
		$('#editorcontainer').css("right",(event.data.initRightEditor+diffX)+"px");
	},
	graspMouseup:function(event){
		$(document).off("mousemove.sidebarGrasp");
		$(document).off("mouseup.sidebarGrasp");
		$('iframe[name="ace_outer"]').contents().find('#outerdocbody').find('iframe[name="ace_inner"]').contents().off("mousemove.sidebarGrasp");
		$('iframe[name="ace_outer"]').contents().find('#outerdocbody').find('iframe[name="ace_inner"]').contents().off("mouseup.sidebarGrasp");
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


