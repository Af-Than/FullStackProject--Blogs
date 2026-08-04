const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

const dbPool = pool.promise();

dbPool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to Aiven MySQL database via DATABASE_URL!');
    connection.release();
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

module.exports = dbPool;