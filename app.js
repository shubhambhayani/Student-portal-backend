const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const dbConfig = require('./dbConfig'); // Replace './dbConfig' with the correct path to your database configuration file

app.use(bodyParser.json());

// Test the database connection
dbConfig
  .getConnection()
  .then((connection) => {
    console.log('Database pool is connected!');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const userRoutes = require('./routes/File');
app.use('/api/users', userRoutes);

const Register=require('./routes/Register');
app.use('/api/auth',Register)

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});