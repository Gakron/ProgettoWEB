# Utilizza l'immagine di MySQL come base
FROM mysql:latest

# Imposta le variabili di ambiente del database (se necessario)
ENV MYSQL_HOST=localhost
ENV MYSQL_PORT=3305
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=ciaociao19
ENV MYSQL_DATABASE=progetto


# Copia il file SQL di esportazione del database nella cartella /docker-entrypoint-initdb.d
COPY /backup.sql /docker-entrypoint-initdb.d/