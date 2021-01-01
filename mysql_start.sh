echo off

supervisorctl stop mysqlServer
rm -rf /var/lib/mysql
mysqld --skip-grant-tables -u root &

supervisorctl start mysqlServer

mysql -u "root" "-proot" < "all.sql"