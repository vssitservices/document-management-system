const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const documentsService = require('../src/services/documents.service');
const documentsRepository = require('../src/repositories/documents.repository');

const originalSave = documentsRepository.save;
const originalFindAll = documentsRepository.findAll;
const originalFindById = documentsRepository.findById;

afterEach(() => {
  documentsRepository.save = originalSave;
  documentsRepository.findAll = originalFindAll;
  documentsRepository.findById = originalFindById;
});

test('registerUpload salva o documento completo e retorna apenas os metadados públicos', () => {
  let savedDocument;
  documentsRepository.save = (document) => {
    savedDocument = document;
    return document;
  };

  const metadata = documentsService.registerUpload({
    filename: '123e4567-e89b-12d3-a456-426614174000.pdf',
    originalname: 'contrato.pdf',
    size: 2048,
  });

  assert.deepStrictEqual(metadata, {
    id: '123e4567-e89b-12d3-a456-426614174000',
    originalName: 'contrato.pdf',
    size: 2048,
    uploadedAt: savedDocument.uploadedAt,
    owner: 'default-user',
  });
  assert.deepStrictEqual(savedDocument, {
    id: '123e4567-e89b-12d3-a456-426614174000',
    originalName: 'contrato.pdf',
    size: 2048,
    uploadedAt: savedDocument.uploadedAt,
    owner: 'default-user',
    storedFileName: '123e4567-e89b-12d3-a456-426614174000.pdf',
  });
});

test('listDocuments expõe apenas os metadados públicos dos documentos salvos', () => {
  documentsRepository.findAll = () => ([
    {
      id: 'doc-1',
      originalName: 'primeiro.pdf',
      size: 100,
      uploadedAt: '2026-01-01T00:00:00.000Z',
      owner: 'default-user',
      storedFileName: 'doc-1.pdf',
    },
    {
      id: 'doc-2',
      originalName: 'segundo.pdf',
      size: 200,
      uploadedAt: '2026-01-02T00:00:00.000Z',
      owner: 'default-user',
      storedFileName: 'doc-2.pdf',
    },
  ]);

  assert.deepStrictEqual(documentsService.listDocuments(), [
    {
      id: 'doc-1',
      originalName: 'primeiro.pdf',
      size: 100,
      uploadedAt: '2026-01-01T00:00:00.000Z',
      owner: 'default-user',
    },
    {
      id: 'doc-2',
      originalName: 'segundo.pdf',
      size: 200,
      uploadedAt: '2026-01-02T00:00:00.000Z',
      owner: 'default-user',
    },
  ]);
});

test('getDocumentForDownload delega a busca ao repositório', () => {
  const storedDocument = {
    id: 'doc-1',
    originalName: 'primeiro.pdf',
    size: 100,
    uploadedAt: '2026-01-01T00:00:00.000Z',
    owner: 'default-user',
    storedFileName: 'doc-1.pdf',
  };
  let receivedId;
  documentsRepository.findById = (id) => {
    receivedId = id;
    return storedDocument;
  };

  const result = documentsService.getDocumentForDownload('doc-1');

  assert.strictEqual(receivedId, 'doc-1');
  assert.strictEqual(result, storedDocument);
});
