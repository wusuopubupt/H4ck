#include <stdio.h>
#include <time.h>

void write_log(char *log_str) {
    FILE *file;
    file = fopen("/var/log/voyage/gearman_c_worker.log","a+");

    char time_buff[20];
    struct tm *sTm;
    time_t now  = time(0);
    sTm = gmtime(&now);
    strftime(time_buff, sizeof(time_buff), "%Y-%m-%d %H:%M:%S", sTm);


    fprintf(file,"%s %s\n",time_buff, log_str); /*writes*/
    fclose(file);
}

int main() {
    char *log = "hello, world!";

    write_log(log);
    return 0;
}
