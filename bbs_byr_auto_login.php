<?php
/**
 * @author : wusuopubupt
 * @date : 2013-10-29
 * @reference : http://v.youku.com/v_show/id_XMjg5ODQ1MzA0.html
 * bbs.byr.cn auto login script
 * 
 * */
$url = "http://bbs.byr.cn/wForum/logon.php";
$field_data = "id=yourid&passwd=yourpasswordCookieDate=2";

// first time curl request,get cookie
$ch = curl_init ($url);
$cookie_jar = tempnam (".", "cookie");

curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_COOKIEJAR, $cookie_jar); // save cookie
curl_setopt ($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.81 Safari/537.36" );
curl_setopt ($ch, CURLOPT_POST, 1);
curl_setopt ($ch, CURLOPT_POSTFIELDS, $field_data);
curl_exec ($h);
curl_close ();

// second time curl request, use formar getted cookie
$url = "http://bbs.byr.cn/wForum/index.php";
$ch = curl_init ($url);
curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_COOKIEFILE, $cookie_jar); // use cookie
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 0);
curl_exec ($ch);
curl_close ($ch);

?>
