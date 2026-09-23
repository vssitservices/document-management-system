const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');

// O arquivo fica em memória até o service decidir o nome definitivo e gravá-lo
// em disco; assim a rota não precisa conhecer detalhes de persistência.
const upload = multer({ storage: multer.memoryStorage() });

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
