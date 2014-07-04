#include <stdio.h>
#include <stdlib.h>
#include <mysql/mysql.h>

int main() {
    MYSQL *conn;
    MYSQL_RES *res;
    MYSQL_ROW row;

    char *server = "localhost";
    char *user = "root";
    char *password = "easylife";
    char *database = "mysql";

    conn = mysql_init(NULL);

    /* Connect to database */
    if(!mysql_real_connect(conn, server, user, password, database, 0, NULL,0)) {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }

    /* Send SQL query */
    if(mysql_query(conn, "show tables")) {
        fprintf(stderr, "%s\n", mysql_error(conn));
        exit(1);
    }

    res = mysql_use_result(conn);
    /* Output table name */
    printf("MySQL Table in mysql database: \n");
    while((row = mysql_fetch_row(res)) != NULL) {
        printf("%s\n", row[0]);
    }

    /* Close connection */
    mysql_free_result(res);
    mysql_close(conn);
}
