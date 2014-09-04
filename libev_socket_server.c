/*
 * @author  : wusuopubupt
 * @date    : 2014-09-04
 * @desc	: tiny socket server implemented by libev
 * 			  to use this, you should install libev at first.
 *
 * 			  server: just run the program
 * 			  client: telnet localhost 8080
 *
 * @refer	: 1). http://pod.tst.eu/http://cvs.schmorp.de/libev/ev.pod
 * 			  2). http://blog.csdn.net/lengzijian/article/details/8315133
 *
 */
#include <ev.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <unistd.h>

#define PORT 8080
#define BUFFER_SIZE 1024
#define MAX_CONNECTIONS 10

struct ev_io *libevlist[MAX_CONNECTIONS] = {NULL};

void socket_accept_callback(struct ev_loop *loop, struct ev_io *watcher, int revents);
void socket_read_callback(struct ev_loop *loop, struct ev_io *watcher, int revents);
/*
 	Server 					Client


	socket					socket
	  |						  |
	  v						  v
	bind					connect
  	  |						  |
	  v						  v
	listen					write
  	  |						  |
	  v						  v
	accept					read
	  |						  |
	  v						  v
	read					close
  	  |
	  v
	write
  	  |
  	  v
	close
*/

int main() {
	struct ev_loop *loop = ev_default_loop(0);

	/* socket start */
	int sd;
	struct sockaddr_in addr;
	int addr_len = sizeof(addr);

	struct ev_io *socket_watcher = (struct ev_io*)malloc(sizeof(struct ev_io));
	struct ev_timer *timeout_watcher = (struct ev_timer*)malloc(sizeof(struct ev_timer));

	// socket
	sd = socket(PF_INET, SOCK_STREAM, 0);
	if (sd < 0) {
		printf("socket error\n");
		return -1;
	}
	bzero(&addr, sizeof(addr));
	addr.sin_family = AF_INET;
	addr.sin_port = htons(PORT);
	addr.sin_addr.s_addr = INADDR_ANY;

	// bind
	if (bind(sd, (struct sockaddr*) &addr, sizeof(addr)) != 0) {
		printf("bind error\n");
		return -1;
	}
	// listen
	if (listen(sd, SOMAXCONN) < 0) {
		printf("listen error\n");
		return -1;
	}
	// set sd reuseful
	int bReuseaddr = 1;
	if (setsockopt(sd, SOL_SOCKET, SO_REUSEADDR, (const char*) &bReuseaddr, sizeof(bReuseaddr)) != 0) {
		printf("setsockopt error in reuseaddr[%d]\n", sd);
		return -1;
	}
	/* socket end */

	ev_io_init(socket_watcher, socket_accept_callback, sd, EV_READ);
	ev_io_start(loop, socket_watcher);

	while(1) {
		ev_run(loop, 0);
	}

	return 1;
}

void socket_accept_callback(struct ev_loop *loop, struct ev_io *watcher, int revents) {
	printf("I am: %d\n", getpid());

	struct sockaddr_in client_addr;
	socklen_t client_len = sizeof(client_addr);
	int client_sd;

	// ev_io watcher for client
	struct ev_io *client_watcher = (struct ev_io*) malloc(sizeof(struct ev_io));

	if (client_watcher == NULL) {
		printf("malloc error in accept_cb\n");
		return;
	}

	if (EV_ERROR & revents) {
		printf("error event in accept\n");
		return;
	}

	// socket accept: get file description
	client_sd = accept(watcher->fd, (struct sockaddr*) &client_addr, &client_len);
	if (client_sd < 0) {
		printf("accept error\n");
		return;
	}
	// too much connections
	if (client_sd > MAX_CONNECTIONS) {
		printf("fd too large[%d]\n", client_sd);
		close(client_sd);
		return;
	}

	if (libevlist[client_sd] != NULL) {
		printf("client_sd not NULL fd is [%d]\n", client_sd);
		return;
	}

	printf("client connected\n");

	// listen new client
	ev_io_init(client_watcher, socket_read_callback, client_sd, EV_READ);
	ev_io_start(loop, client_watcher);

	libevlist[client_sd] = client_watcher;
}

void socket_read_callback(struct ev_loop *loop, struct ev_io *watcher, int revents) {
	char buffer[BUFFER_SIZE];
	ssize_t read;

	if (EV_ERROR & revents) {
		printf("error event in read\n");
		return;
	}
	// socket recv
	read = recv(watcher->fd, buffer, BUFFER_SIZE, 0); // read stream to buffer
	if (read < 0) {
		printf("read error\n");
		return;
	}

	if (read == 0) {
		printf("client disconnected.\n");

		if (libevlist[watcher->fd] == NULL) {
			printf("the fd already freed[%d]\n", watcher->fd);
		}
		else {
			close(watcher->fd);
			ev_io_stop(loop, libevlist[watcher->fd]);
			free(libevlist[watcher->fd]);
			libevlist[watcher->fd] = NULL;
		}
		return;
	}
	else {
		printf("receive message:%s\n", buffer);
	}

	// socket send to client
	send(watcher->fd, buffer, read, 0);
	bzero(buffer, read);
}

