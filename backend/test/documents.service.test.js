const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const documentsService = require('../src/services/documents.service');
const documentsRepository = require('../src/repositories/documents.repository');

const originalSave = documentsRepository.save;
const originalFindAll = documentsRepository.findAll;
const originalFindById = documentsRepository.findById;
const originalSaveFile = documentsRepository.saveFile;
const originalGetFilePath = documentsRepository.getFilePath;

afterEach(() => {
  documentsRepository.save = originalSave;
  documentsRepository.findAll = originalFindAll;
  documentsRepository.findById = originalFindById;
  documentsRepository.saveFile = originalSaveFile;
  documentsRepository.getFilePath = originalGetFilePath;
});

test('registerUpload grava o arquivo, salva o documento completo e retorna apenas os metadados públicos', async () => {
  let savedDocument;
  let savedFileName;
  let savedBuffer;
  documentsRepository.save = (document) => {
    savedDocument = document;
    return document;
  };
  documentsRepository.saveFile = async (fileName, buffer) => {
    savedFileName = fileName;
    savedBuffer = buffer;
  };

  const buffer = Buffer.from('conteudo do arquivo');
  const metadata = await documentsService.registerUpload({
    originalname: 'contrato.pdf',
    size: 2048,
    buffer,
  });

  assert.strictEqual(savedBuffer, buffer);
  assert.match(savedFileName, /^[0-9a-f-]{36}\.pdf$/, 'o nome do arquivo em disco deve usar um uuid gerado pelo service');
  assert.deepStrictEqual(metadata, {
    id: savedDocument.id,
    originalName: 'contrato.pdf',
    size: 2048,
    uploadedAt: savedDocument.uploadedAt,
    owner: 'default-user',
  });
  assert.deepStrictEqual(savedDocument, {
    id: savedDocument.id,
    originalName: 'contrato.pdf',
    size: 2048,
    uploadedAt: savedDocument.uploadedAt,
    owner: 'default-user',
    storedFileName: savedFileName,
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

test('getDownloadFilePath resolve o caminho do arquivo a partir do repositório', () => {
  const storedDocument = {
    id: 'doc-1',
    originalName: 'primeiro.pdf',
    size: 100,
    uploadedAt: '2026-01-01T00:00:00.000Z',
    owner: 'default-user',
    storedFileName: 'doc-1.pdf',
  };
  let receivedId;
  let receivedFileName;
  documentsRepository.findById = (id) => {
    receivedId = id;
    return storedDocument;
  };
  documentsRepository.getFilePath = (fileName) => {
    receivedFileName = fileName;
    return `/storage/${fileName}`;
  };

  const result = documentsService.getDownloadFilePath('doc-1');

  assert.strictEqual(receivedId, 'doc-1');
  assert.strictEqual(receivedFileName, 'doc-1.pdf');
  assert.deepStrictEqual(result, { filePath: '/storage/doc-1.pdf', originalName: 'primeiro.pdf' });
});

test('getDownloadFilePath retorna null quando o documento não existe', () => {
  documentsRepository.findById = () => undefined;

  const result = documentsService.getDownloadFilePath('inexistente');

  assert.strictEqual(result, null);
});
