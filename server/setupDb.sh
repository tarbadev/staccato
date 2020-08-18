#!/usr/bin/env bash

set -e

mysql_user=staccato
mysql_password=staccato
mysql_db=staccato
mysql_db_test=${mysql_db}_test

echo 'Remove existing databases'
mysql -uroot -e "DROP DATABASE IF EXISTS $mysql_db;"
mysql -uroot -e "DROP DATABASE IF EXISTS $mysql_db_test;"
mysql -uroot -e "DROP USER IF EXISTS '$mysql_user'@'localhost';"

echo "Create user '$mysql_user'"
mysql -uroot -e "CREATE USER '$mysql_user'@'localhost' IDENTIFIED WITH mysql_native_password BY '$mysql_password'";

echo "Create database $mysql_db and grant access to $mysql_user"
mysql -uroot -e "CREATE DATABASE $mysql_db";
mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO '$mysql_user'@'localhost'";

echo "Create database $mysql_db_test and grant access to $mysql_user"
mysql -uroot -e "CREATE DATABASE $mysql_db_test";
mysql -uroot -e "GRANT ALL PRIVILEGES ON $mysql_db_test.* TO '$mysql_user'@'localhost'";