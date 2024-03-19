import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'blog_dubon',
  password: 'dubon',
  database: 'blog_dubon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
