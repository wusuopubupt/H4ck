//dbFM_lyrics伪类
function dbFM_lyrics(debug_mode) {
	this.debug_mode = debug_mode == undefined ? false : debug_mode;
	this.version = '1.1';
	this.name = '豆瓣歌词';
	this.visible = true;
	
	this.ajax_flag = 1; // request count
	this.app_sid = window.setInterval(this.start, 5000);
	this.tmp_song_id = '';
	
	this.panel_title = this.draw_title();
	this.panel_lyrics = this.draw_lyrics();
}

//拓展原型，为已有的类添加draw_title方法,动态添加div元素
dbFM_lyrics.prototype.draw_title = function () {
	var div_title = document.createElement('div');
	document.body.appendChild(div_title);
	div_title.style.width = '464px';
	div_title.style.height = '20px';
	div_title.style.backgroundColor = '#FFFFFF';
	div_title.style.zIndex = "42";
	div_title.style.position = 'absolute';
	div_title.style.left = '50%';
	div_title.style.top = '340px';
	div_title.style.display = 'block';
	div_title.innerHTML = '<span style="float:left; padding-left:5px; color:#999999">'+ this.name +'</span><span style="clear:both"></span>';

	return div_title;
}

dbFM_lyrics.prototype.draw_lyrics = function () {
	var div_lyrics = document.createElement('div');
	document.body.appendChild(div_lyrics);
	div_lyrics.style.width = '464px';
	div_lyrics.style.height = '146px';
	div_lyrics.style.backgroundColor = '#C5DEFC';
	div_lyrics.style.zIndex = "42";
	div_lyrics.style.position = 'absolute';
	div_lyrics.style.left = '50%';
	div_lyrics.style.top = '360px';
	div_lyrics.style.overflowX = 'hidden';
	div_lyrics.style.overflowY = 'scroll';
	div_lyrics.style.display = this.visible ? 'block' : 'none';

	return div_lyrics;
}

//AJAX Request
dbFM_lyrics.prototype.ajax_get = function(url) {
	var XHR = new XMLHttpRequest();
	var obj = this;

	XHR.onreadystatechange = function() {
		if (XHR.readyState == 4) {
			if (XHR.status == 200) {
				obj.deal_response(XHR.responseText);
			} else {
				obj.print_lyrics('获取歌词失败');
			}
		} else {
			obj.print_lyrics('歌词搜索中');
		}
	}
	
	XHR.open('GET', url, true);
	XHR.send();
}

dbFM_lyrics.prototype.deal_response = function(data) {
	if (this.ajax_flag == 1) {
		eval('var resp = ' + data);
		if (resp.count > 0) {
			this.ajax_get(resp.result[0].lrc);
			this.ajax_flag++;
		} else {
			this.print_lyrics('没有找到歌词');
		}
	} else {
		this.print_lyrics(this.format(data));
		this.ajax_flag = 1;
	}
}

dbFM_lyrics.prototype.format = function(text) {
	//var s = text.replace(/\[\d{2}:\d{2}.\d{2}\]/g, '');
	var s = text.replace(/\[(.*)\]/g, '').trim();
	return s.replace(/\n/g, '\n<br />');
}

dbFM_lyrics.prototype.print_lyrics = function(text) {
	this.panel_lyrics.innerHTML = text;
}

dbFM_lyrics.prototype.geci_entry_url = function(song, artist) {
	if (song == undefined || song == null || song == '') return '';
	//这是歌词迷的(http://api.geci.me/en/latest)API
	var url = 'http://geci.me/api/lyric/' + song;
	if (!(artist == undefined || artist == null || artist == '')) {
		url += '/' + artist;
	}
	this.debug(url);
	return url;
}

dbFM_lyrics.prototype.request_geci = function() {
	eval('var stored_song = ' + localStorage['bubbler_song_info']);
	this.debug('the song in localStorage:' + stored_song.artist + ' ' + stored_song.song_name);
	if (this.tmp_song_id != stored_song.id) {
		this.debug(this.tmp_song_id + ' <> ' + stored_song.id);
		var url = this.geci_entry_url(stored_song.song_name, stored_song.artist);
		this.tmp_song_id = stored_song.id;
		this.ajax_get(url);
	}
}

dbFM_lyrics.prototype.debug = function(str) {
	if (this.debug_mode)  console.debug(str);
}

var  fml = new dbFM_lyrics(true);
var app_sid = window.setInterval(function() { fml.request_geci(); }, 1000);
//fml.ajax_get('http://geci.me/api/lyric/海阔天空');
