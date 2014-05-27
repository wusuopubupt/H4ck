/*
 *
 * @file    :  popup.js
 * @author  :  d4sh wang
 * @mail    :  d4shman@gmail.com
 * @version :  0.9
 * @date	:  2013-05-16
 *
 */
var url = "";

// trim the spaces
String.prototype.trim = function() {
	var re = /(^\s*)|(\s*)$/g;
	return this.replace(re, "");
}

// get element by id
function $(s) {
	return document.getElementById(s);
}

// set cookie
function set_cookie(cookie){
	fragment = url.split('/');
	url = fragment[0] + '//' + fragment[2];
	
	// init chrome.cookies 
	// reference : http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/cookies/manager.js
	if (!chrome.cookies) {
		chrome.cookies = chrome.experimental.cookies;
	}
	
	//alert("set cookie:" + cookie);
	ck = cookie.split(';');
	for(i in ck){
		c = ck[i].trim();
		if(!c) continue;
		k = c.split('=')[0].trim();
		v = c.split('=')[1].trim();
		
		//reference : https://developer.chrome.com/extensions/cookies#method-set
		chrome.cookies.set({
			'url': url,
			'name': k,
			'value': v,
		});
	}
}

// get cookie
function get_cookie() {
	var cookie_str = "";
	chrome.cookies.getAll({'url':url}, function(cookie) {
		for(i in cookie) {
			name = cookie[i].name;
			value = cookie[i].value;
			cookie_str += (name + "=" + value + ";\n");
		}
		//alert(cookie_str);
		$('cookie').value = cookie_str;
	})
}

function onload() {
	get_cookie();
	
	$('submit').addEventListener('click', function () {
		set_cookie($('cookie').value);
	});
}

document.addEventListener('DOMContentLoaded', function() {
	if(url == "") {
		chrome.tabs.getSelected(null,function(tab) {
			url = tab.url;
			//alert("DOMContentLoaded url: " + url); 异步事件，把onload函数放在回调函数里，url才能取得到
			onload();
		});
	}
});
