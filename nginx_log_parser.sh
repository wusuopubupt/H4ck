#!/bin/bash
# nginx log parser

set +x



# 1) log format:

#    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
#            '$status $body_bytes_sent "$http_referer" "$http_cookie" "$http_user_agent" '
#            '$request_time $http_x_bd_logid $http_x_bd_routerip $server_addr $upstream_addr $host '
#            '"$http_x_forwarded_for" $tracecode $phpvm $http_ssl_header';
#

# 2) log demo:

# 172.22.75.52 - - [18/Dec/2015:18:01:36 +0800] "GET /webroot/path?a=b HTTP/1.1" 200 0 "-" "__bdvnidxset=0,0,0,0,1; BAIDUID=BF1F8CD3BA73501BBBF38F457B3FCC20:FG=1; BIDUPSID=BF1F8CD3BA73 501BBBF38F457B3FCC20; PSTM=1446314273; __bdvnindex=1; H_PS_PSSID=17519_1447_18280_18156_17946_10212_18500_17000_17072_15567_11974_10632; BDV_TRACE=1450427579490:; bdv_right_ad_poster=1""Mo zilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36" 0.182 - - 10.99.36.22 127.0.0.1:8096 www.mathandcs.com "-" 0096522 5090371483402121818 hhvm -

# 3) awk columes:

#1 172.22.75.52 - - [18/Dec/2015:17:50:58 +0800] 
#2 GET /yingyin/sportindex?a=bx HTTP/1.1
#3  200 9 
#4 -
#5  
#6 __bdvnidxset=0,0,0,0,1; BAIDUID=BF1F8CD3BA73501BBBF38F457B3FCC20:FG=1; BIDUPSID=BF1F8CD3BA73501BBBF38F457B3FCC20; PSTM=1446314273; __bdvnindex=1; H_PS_PSSID=17519_1447_18280_18156_17946_1
#0212_18500_17000_17072_15567_11974_10632; BDV_TRACE=1450427579490:; bdv_right_ad_poster=1
#7  
#8 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36
#9  0.016 - - 10.99.36.22 127.0.0.1:8096 www.mathandcs.com
#10 -

awk '
BEGIN {
    FS="\""
}
{
    #for(i=1;i<NF;i++) {
    #    print i, $i 
    #}
    split($1, a, " ")
    ip=a[1]
    datetime=substr(a[4],2)
    request=$2 
    referer=$4
    cookie=$6
    useragent=$8
    split($3, c, " ")
    code=c[1]
    size=c[2]
    n=split(request, detail, " ")
    method=detail[1]
    url=""
    for(i=2; i<n; i++) {
        url=(url" "detail[i]) 
    }
    url=substr(url, 2)
    protocol=detail[n]
    split($10, others, " ")
    ssl_header=others[3]
    
    printf "%s\001%s\001%s\001%s\001%s\001%s\001%s\001%s\001%s\n", ip, datetime, method, code, protocol, url, referer, cookie, useragent
}
END {
    printf "%s\001%s\001%s\001%s\001%s\001%s\001%s\001%s\001%s\n", ip, datetime, method, code, protocol, url, referer, cookie, useragent
}'
