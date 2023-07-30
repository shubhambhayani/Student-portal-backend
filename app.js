require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const dbConfig = require('./dbConfig');
 
app.use(cors());
app.use(bodyParser.json());


dbConfig
  .getConnection()
  .then((connection) => {
    console.log('Database pool is connected👍');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

const userRoutes = require('./routes/File');
app.use('/api/users', userRoutes);

const Register=require('./routes/Register');
app.use('/api/auth',Register)

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

app.get('/',(req,res)=>{
    res.status(200).send("Server Running👍")
})
});