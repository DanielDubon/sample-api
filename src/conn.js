import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'blog_dubon',
  database: 'blog_db',
  password: 'dubon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
