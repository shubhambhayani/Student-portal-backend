const dbConfig = require('../dbConfig'); 
const User = {};

User.findOne = async (email) => {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows, fields] = await dbConfig.execute(query, [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  User.create = async (name, email, password) => {
    try {
      const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      const values = [name, email, password];
      const [result] = await dbConfig.execute(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  };

  module.exports = User;

