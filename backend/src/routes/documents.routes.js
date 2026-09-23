const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');
const { STORAGE_DIR } = require('../repositories/documents.repository');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${extensao}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ erro: 'Falha ao processar o upload do arquivo.' });
    }
    return next();
  });
}, documentsController.upload);

router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
