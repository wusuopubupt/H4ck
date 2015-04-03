#i!/bin/env python
#-*- coding: UTF-8 -*-
import re
from Log import Log

class NginxLogParser:
    '''
    nginx log parser 	

    '''

    def __init__(self, regex_str, nginx_log):
        self.__regex_str = regex_str;
        self.__pattern = re.compile(regex_str)
        self.logger = Log()
        with open(nginx_log) as f:
            loglines = f.readlines()
        for logline in loglines:
            print logline
            print '\n'
            result = self.__pattern.search(logline)
            if result:
                regex_dict = result.groupdict();
                print 'Bingo!'
                print '\n'
            else:
                print 'None!'
                print '\n'

    def parse(self, line):
        line = logline
        result = self.__pattern.search(line)
        if result:
            print 'Bingo!'
            return result
        else:
            print 'None!'
            return None

    def do_parse(self, regex_search_result):
        regex_dict = regex_search_result.groupdict();
        schema = self.schema_parser.schema()
        columns = []
        for column in schema:
            try:
                key = column['name']
                # source_host 是从mapred中获取的，不是来自于日志
                if key == 'source_host':
                    continue

                if key in regex_dict:
                    column_value = regex_dict[key]
                    columns.append(column_value)
                # 只要HIVE表有个一个字段没在日志里就丢掉
                else:
                    self.logger.fatal('regex_dict has no key[%s]' %(key))
                    return None
            except KeyError,e:
                self.logger.fatal('Exception in log parser:%s' %(e))
                return None
        
        output_str = '\001'.join(columns)
        return output_str


if __name__ == '__main__':

    remote_addr = r"?P<remote_addr>[\d.]*"
    remote_user = r"?P<remote_user>\w*"
    day = r"?P<day>\d+"
    month = r"?P<month>\w+"
    year = r"?P<year>\d+"
    log_time = r"?P<time>\S+"
    method = r"?P<method>\S+"
    request = r"?P<request>\S+"
    http_protocol = r"?P<http_protocol>\S+"
    status = r"?P<status>\d+"
    body_bytes_sent = r"?P<body_bytes_sent>\d+"
    http_cookie = r"?P<http_cookie>[^\"]*"
    http_referer = r"?P<http_referer>[^\"]*"
    http_user_agent = r"?P<http_user_agent>[^\"]*"
    request_time = r"?P<request_time>\S+"
    http_x_bd_logid = r"?P<http_x_bd_logid>\w+"
    http_x_bd_routerip = r"?P<http_x_bd_routerip>\S+"
    server_addr = r"?P<server_addr>\S+"
    upstream_addr = r"?P<upstream_addr>\S+"
    host = r"?P<host>\S+"
    http_x_forwarded_for = r"?P<http_x_forwarded_for>\S+"
    tracecode = r"?P<tracecode>\S+"
    phpvm = r"?P<phpvm>\S+"
    http_ssl_header = r"?P<http_ssl_header>\S+"
    others = r"?P<others>.*?"

    '''
    nginx log parser 	

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
            '$status $body_bytes_sent "$http_referer" "$http_cookie" "$http_user_agent" '
            '$request_time $http_x_bd_logid $http_x_bd_routerip $server_addr $upstream_addr $host '
            '"$http_x_forwarded_for" $tracecode $phpvm $http_ssl_header';
    '''

    logline = '220.202.128.45 - - [23/Mar/2016:17:19:36 +0800] "GET /u.gif?pid=101&app=ad HTTP/1.0" 200 0 "-" "-" "Dalvik/1.6.0 (Linux; U; Android 4.2.2; vivo Y17W Build/JDQ39)" 0.003 1176607682 10.42.208.18 10.42.180.45 unix:/home/work/orp/var/hhvm.sock stat.v.baidu.com "220.202.128.45" 11766076820766781962032317 hhvm -'

    regex_str = r"(%s) - - \[(%s)/(%s)/(%s)\:(%s) [\S]+\] \"(%s) (%s) (%s)\" (%s) (%s) \"(%s)\" \"(%s)\" \"(%s)\" (%s) (%s) (%s) (%s) (%s) (%s) \"(%s)\" (%s)" % (remote_addr,  day, month, year, log_time, method, request, http_protocol, status, body_bytes_sent, http_referer, http_cookie, http_user_agent,request_time, http_x_bd_logid, http_x_bd_routerip, server_addr, upstream_addr, host, http_x_forwarded_for, others)

    nginx_log = '../data/nginx_access.log'

    parser = NginxLogParser(regex_str, nginx_log)

