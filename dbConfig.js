const mysql = require('mysql2/promise');

const dbConfig = mysql.createPool({
  host: '103.251.19.59',
  user: 'root@localhost',
  password: '',
  database: 'sudentdb',
  waitForConnections: true,
  connectionLimit:10,
  queueLimit:0,
});

module.exports = dbConfig;