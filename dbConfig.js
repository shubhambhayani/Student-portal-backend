const mysql = require('mysql2/promise');

const dbConfig = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database: process.env.DB,
  waitForConnections:process.env.DB_WAIT_FOR_CONNECTIONS,
  connectionLimit:process.env.DB_CONNECTION_LIMITS ,
  queueLimit:process.env.DB_QUEUE_LIMIT,
});

module.exports = dbConfig;