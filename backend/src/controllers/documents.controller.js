const documentsService = require('../services/documents.service');

async function upload(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo foi enviado.' });
  }
  try {
    const metadata = await documentsService.registerUpload(req.file);
    return res.status(201).json(metadata);
  } catch (error) {
    return next(error);
  }
}

function list(req, res, next) {
  try {
    return res.json(documentsService.listDocuments());
  } catch (error) {
    return next(error);
  }
}

function download(req, res, next) {
  const arquivo = documentsService.getDownloadFilePath(req.params.id);
  if (!arquivo) {
    return res.status(404).json({ erro: 'Documento não encontrado.' });
  }
  return res.download(arquivo.filePath, arquivo.originalName, (err) => {
    if (!err) {
      return;
    }
    if (res.headersSent) {
      return next(err);
    }
    res.status(404).json({ erro: 'Arquivo do documento não encontrado no armazenamento.' });
  });
}

module.exports = {
  upload,
  list,
  download,
};
