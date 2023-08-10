FROM mysql:latest

ENV MYSQL_HOST=localhost
ENV MYSQL_PORT=3305
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=ciaociao19
ENV MYSQL_DATABASE=progetto


COPY /backup.sql /docker-entrypoint-initdb.d/