const path = require('node:path');
const documentsService = require('../services/documents.service');
const { STORAGE_DIR } = require('../repositories/documents.repository');

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo foi enviado.' });
  }
  const metadata = documentsService.registerUpload(req.file);
  return res.status(201).json(metadata);
}

function list(req, res) {
  return res.json(documentsService.listDocuments());
}

function download(req, res) {
  const documento = documentsService.getDocumentForDownload(req.params.id);
  if (!documento) {
    return res.status(404).json({ erro: 'Documento não encontrado.' });
  }
  const filePath = path.join(STORAGE_DIR, documento.storedFileName);
  return res.download(filePath, documento.originalName, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ erro: 'Arquivo do documento não encontrado no armazenamento.' });
    }
  });
}

module.exports = {
  upload,
  list,
  download,
};
