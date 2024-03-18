import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'dubon',
  database: 'blog_dubon',
  password: 'dubon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
