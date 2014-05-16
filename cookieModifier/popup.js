/*
 *
 * @file    :  popup.js
 * @author  :  d4sh wang
 * @mail    :  d4shman@gmail.com
 * @version :  0.9
 *
 */
 
// trim the spaces
String.prototype.trim = function() {
	var re = /(^\s*)|(\s*)$/g;
	return this.replace(re, "");
}

// get element by id
function $(s) {
	return document.getElementById(s);
}

//get current selected url
//reference : http://stackoverflow.com/questions/1979583/how-can-i-get-the-url-for-a-google-chrome-tab
var url;
chrome.tabs.getSelected(null,function(tab) {
    url = tab.url;
});

// set cookie
function set_cookie(cookie){
	fragment = url.split('/');
	/*eg:
	 *var url = http://stackoverflow.com/questions/1034621.html
	 *var arr = url.split('/')
	 *console.log(arr)
	 *["http:", "", "stackoverflow.com", "questions", "1034621.html"]
	 */
	
	url = fragment[0] + '//' + fragment[2];
	
	/*
	ck = cookie.split(';');
	for(i in ck){
		c = ck[i].trim();
		if(!c) continue;
		k = c.split('=')[0].trim();
		v = c.split('=')[1].trim();
		
		chrome.cookies.set({
			'url': url,
			'name': k,
			'value': v,
		});
	}*/
	
	name   = cookie.split('=')[0].trim();
	value = cookie.split('=')[1].trim();
	
	// init chrome.cookies 
	// reference : http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/cookies/manager.js
	if (!chrome.cookies) {
		chrome.cookies = chrome.experimental.cookies;
	}
	
	alert(url);
	alert(name);
	alert(value);
	
	//reference : https://developer.chrome.com/extensions/cookies#method-set
	chrome.cookies.set({
		'url' : url,
		'name' : name,
		'value': value
	}, function() {
		alert("succeed!" + document.cookie);
	})
}

function onload() {
	$('submit').addEventListener('click', function () {
		set_cookie($('cookie').value);
	});
}

document.addEventListener('DOMContentLoaded', function() {
	onload();
});