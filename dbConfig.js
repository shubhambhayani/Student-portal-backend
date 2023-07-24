const mysql = require('mysql2/promise');

const dbConfig = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sudentdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = dbConfig;