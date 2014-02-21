var eejs = require('ep_etherpad-lite/node/eejs'),
express = require('ep_etherpad-lite/node_modules/express'),
settings = require('ep_etherpad-lite/node/utils/Settings');

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='../static/plugins/ep_taglist/static/css/taglist.css' rel='stylesheet'>";
  return cb();
}

exports.eejsBlock_dd_view = function (hook_name, args, cb) {
  args.content = args.content + "<li><a href='#' onClick='$(\"#options-taglist\").click();'>Table Of Contents WhereAmI-1 </a></li>"; /*what do I need this for, how is it called?*/
  return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_taglist/templates/taglist.ejs", {}, module);
  return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content += "<script src='../static/plugins/ep_taglist/static/js/taglist.js'></script>";
  return cb();
}

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  var checked_state = 'unchecked';
  if(settings.ep_toc){
    if (settings.ep_toc.disable_by_default === true){
      checked_state = 'unchecked';
    }else{
      checked_state = 'checked';
    }
  }
  args.content = args.content + eejs.require('ep_taglist/templates/taglist_entry.ejs', {checked : checked_state});
  return cb();
}

