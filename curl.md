2014-12-16 20:34 百度
===========
CURL命令总结

1. 下载
	curl -o [文件名] www.baidu.com
	
2. 显示 HTTP request头信息
	curl -i www.baidu.com
	
	显示 HTTP response头信息
	curl -I www.baidu.com
	
3. 显示详细通信过程
	curl -v www.baidu.com
	
4. 发送表单信息
	4.1)、 GET方法：
	curl example.com/add?a=1&b=2
	4.2)、 POST方法：
	curl --data "a=1&b=2" www.test.com/add
	
5. HTTP Referer:
	curl --referer http://www.hao123.com http://www.baidu.com

6. User Agent:
	curl --user-agent "[User Agent]" www.baidu.com
	
7. Cookie:
	curl --cookie "user=wusuopubupt" www.csdn.net
	
8. HTTP Header:
	curl --header "Connection:keep-alive" www.csdn.net
	
	
	
