const path = require('node:path');

// Diretório local onde os arquivos enviados são gravados (multer diskStorage).
const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

// Metadados em memória nesta fase inicial (sem banco de dados).
const documents = new Map();

function save(document) {
  documents.set(document.id, document);
  return document;
}

function findAll() {
  return Array.from(documents.values());
}

function findById(id) {
  return documents.get(id);
}

module.exports = {
  STORAGE_DIR,
  save,
  findAll,
  findById,
};
