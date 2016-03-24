1. 运行命令直至成功
repeat() {while :; do $@ && return; sleep 30; done}
eg: repeat wget -c "http://www.example.com/file.tar.gz"
