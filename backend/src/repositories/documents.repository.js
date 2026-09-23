const fs = require('node:fs/promises');
const path = require('node:path');

// Diretório local onde os arquivos enviados são gravados.
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

function getFilePath(fileName) {
  return path.join(STORAGE_DIR, fileName);
}

async function saveFile(fileName, buffer) {
  await fs.writeFile(getFilePath(fileName), buffer);
}

module.exports = {
  STORAGE_DIR,
  save,
  findAll,
  findById,
  getFilePath,
  saveFile,
};
