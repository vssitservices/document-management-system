const crypto = require('node:crypto');
const path = require('node:path');
const documentsRepository = require('../repositories/documents.repository');

// Owner fixo/padrão nesta fase: não há autenticação de usuários.
const DEFAULT_OWNER = process.env.DEFAULT_OWNER || 'default-user';

function toPublicMetadata(document) {
  const { id, originalName, size, uploadedAt, owner } = document;
  return { id, originalName, size, uploadedAt, owner };
}

async function registerUpload(file) {
  // O id do documento é a identidade de negócio; é o service quem decide o
  // nome do arquivo em disco, e não a configuração de infraestrutura do multer.
  const id = crypto.randomUUID();
  const storedFileName = `${id}${path.extname(file.originalname)}`;

  await documentsRepository.saveFile(storedFileName, file.buffer);

  const document = {
    id,
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: DEFAULT_OWNER,
    storedFileName,
  };
  documentsRepository.save(document);
  return toPublicMetadata(document);
}

function listDocuments() {
  return documentsRepository.findAll().map(toPublicMetadata);
}

function getDownloadFilePath(id) {
  const document = documentsRepository.findById(id);
  if (!document) {
    return null;
  }
  return {
    filePath: documentsRepository.getFilePath(document.storedFileName),
    originalName: document.originalName,
  };
}

module.exports = {
  registerUpload,
  listDocuments,
  getDownloadFilePath,
};
