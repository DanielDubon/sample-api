# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_DATABASE=blog_dubon
ENV MYSQL_ROOT_PASSWORD=dubon
# Optionally, define the default user and password (if needed)
# ENV MYSQL_USER=blog_usersds
# ENV MYSQL_PASSWORD=blog_password

# Add your schema SQL script to the docker-entrypoint-initdb.d directory
COPY schema.sql /docker-entrypoint-initdb.d/

# When the container starts, MySQL will automatically execute
# scripts in /docker-entrypoint-initdb.d/ to initialize the database

EXPOSE 3306
