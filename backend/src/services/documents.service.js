const path = require('node:path');
const documentsRepository = require('../repositories/documents.repository');

// Owner fixo/padrão nesta fase: não há autenticação de usuários.
const DEFAULT_OWNER = process.env.DEFAULT_OWNER || 'default-user';

function toPublicMetadata(document) {
  const { id, originalName, size, uploadedAt, owner } = document;
  return { id, originalName, size, uploadedAt, owner };
}

function registerUpload(file) {
  // O multer já gerou um nome único (UUID) para o arquivo em disco.
  const id = path.parse(file.filename).name;
  const document = {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: DEFAULT_OWNER,
    storedFileName: file.filename,
  };
  documentsRepository.save(document);
  return toPublicMetadata(document);
}

function listDocuments() {
  return documentsRepository.findAll().map(toPublicMetadata);
}

function getDocumentForDownload(id) {
  return documentsRepository.findById(id);
}

module.exports = {
  registerUpload,
  listDocuments,
  getDocumentForDownload,
};
