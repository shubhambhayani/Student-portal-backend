const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult,} = require('express-validator');
const JWT_SECRET = 'shubham@bhayani';
const User = require('../model/User.js');
const dbConfig = require('../dbConfig.js');

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('phonenumber','Enter a Phone Number').isInt(),
  body('phonenumber','Enter a Valid Number').isLength({max:10, min:10}),
  body('password', 'Enter a 8 characters').isLength({ min: 8 }),
  body('password','Entera a Strong password').isStrongPassword(),
], async (req, res) => {
  let success = false;
  let exists = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    // Check if the email already exists
    const [rows] = await dbConfig.execute('SELECT * FROM users WHERE email = ?', [req.body.email]);
    const user = rows[0];
    if (user) {
      exists = true;
      return res.status(400).json({ exists, error: 'Email already exists'});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create the user
    const [result] = await dbConfig.execute('INSERT INTO users (name,email,phonenumber,password) VALUES (?,?,?,?)', [
      req.body.name,
      req.body.email,
      req.body.phonenumber,
      secPass,
    ]);
    const userId = result.insertId;

    const data = {
      user: {
        id: userId,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken: authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Some error occurred');
  }
});

  const validateCredentials = async (req, res, next) => {
    const {credentials,password } = req.body;
    if (!credentials || !password) {
      return res.status(400).json({ error: 'Please provide email/phonenumber and password.' });
    }
    next();
    };

    router.post('/login', validateCredentials, async (req, res) => {
      const { credentials, password } = req.body;

      try {
        const connection = await dbConfig.getConnection();
        let user;
    
        if (/^\d+$/.test(credentials)) {
          const [rows] = await connection.execute('SELECT * FROM users WHERE phoneNumber = ?', [credentials]);
          user = rows[0];
        } else {
          const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [credentials]);
          user = rows[0];
        }
        connection.release();
    
      if (!user) {
        return res.status(400).json({ error: 'Please enter a valid email/phone number or password.' });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: 'Please enter a valid email/phone number or password.' });
      }
      const data = { user: { id: user.id } };
      const authtoken = jwt.sign(data, JWT_SECRET);
  
      res.json({ success: true, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal server error.');
    }
  });

  module.exports = router;