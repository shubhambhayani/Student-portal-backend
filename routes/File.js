const express = require('express');
const router = express.Router();
const dbConfig = require('../dbConfig'); 
const Fetchuser=require('../routes/middleware/Fetchuser');
const multer = require('multer');
const ROLES=require('./middleware/constants')


const fs =require('fs')
const upload = multer({ dest: 'uploads/' });

router.post('/upload', Fetchuser(ROLES.ADMIN), upload.single('document'), async (req, res) => {
      const description = req.body.description;
      const file = req.file;
    
      if (!file) {
        return res.status(400).json({ message: 'Please Select Document...!' });
      }
    
      const allowedExtensions = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        txt:'plain',
        rtf:'rtf'
      };
    
      const extension = file.mimetype.split('/')[1];
    
      if (!allowedExtensions[extension]) {
        return res.status(400).json({ message: 'Invalid Document Format...!' });
      }
    
      const current_time = Date.now();
    
      try {
        const newFilePath = `uploads/${current_time}`;
        fs.renameSync(file.path, newFilePath);
    
        const query =
          'INSERT INTO tbl_documents (original_name, temp_name, type, description) VALUES (?, ?, ?, ?)';
        await dbConfig.query(query, [newFilePath,file.originalname, extension, description]);
    
        return res.status(200).json({ message: 'Document Successfully Inserted...!' });
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    router.get('/getDocuments', async (req, res) => {
          try {
            const query = 'SELECT * FROM tbl_documents';
            const [rows] = await dbConfig.query(query);
          
            if (rows.length > 0) {
              res.status(200).json({ data: rows, message: 'Data Get Successfully...!' });
            } else {
              res.status(404).json({ message: 'No Data Found...!' });
            }
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
          }
        });
      
module.exports = router;