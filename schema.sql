CREATE USER IF NOT EXISTS 'blog_dubon'@'%' IDENTIFIED BY 'dubon';
GRANT ALL PRIVILEGES ON blog_dubon.* TO 'blog_dubon'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE blog_dubon;

CREATE TABLE IF NOT EXISTS blog_helldivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    planet VARCHAR(255) NOT NULL,
    enemy VARCHAR(255) NOT NULL,
    urgency VARCHAR(255) NOT NULL

);
