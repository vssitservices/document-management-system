const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../src/app');
const { STORAGE_DIR } = require('../src/repositories/documents.repository');

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

function limparStorage() {
  fs
    .readdirSync(STORAGE_DIR)
    .filter((nome) => nome !== '.gitkeep')
    .forEach((nome) => fs.unlinkSync(path.join(STORAGE_DIR, nome)));
}

test('POST /upload sem arquivo retorna 400', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/upload`, { method: 'POST' });
    assert.strictEqual(response.status, 400);
  } finally {
    server.close();
  }
});

test('GET /documents retorna lista vazia quando não há documentos enviados', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(response.status, 200);
    const documentos = await response.json();
    assert.deepStrictEqual(documentos, []);
  } finally {
    server.close();
  }
});

test('fluxo completo: upload, listagem e download', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteudo de teste']), 'arquivo-teste.txt');

    const uploadResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });
    assert.strictEqual(uploadResponse.status, 201);
    const metadata = await uploadResponse.json();
    assert.ok(metadata.id, 'o id deve estar presente');
    assert.strictEqual(metadata.originalName, 'arquivo-teste.txt');
    assert.strictEqual(metadata.owner, 'default-user');
    assert.strictEqual(metadata.storedFileName, undefined, 'detalhe interno não deve vazar na API');

    const listResponse = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(listResponse.status, 200);
    const documentos = await listResponse.json();
    assert.ok(documentos.some((documento) => documento.id === metadata.id));

    const downloadResponse = await fetch(`${baseUrl}/documents/${metadata.id}/download`);
    assert.strictEqual(downloadResponse.status, 200);
    const texto = await downloadResponse.text();
    assert.strictEqual(texto, 'conteudo de teste');
  } finally {
    server.close();
    limparStorage();
  }
});

test('GET /documents/:id/download com id inexistente retorna 404', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const response = await fetch(`${baseUrl}/documents/id-inexistente/download`);
    assert.strictEqual(response.status, 404);
  } finally {
    server.close();
  }
});

test('upload de múltiplos documentos aparecem na listagem e podem ser baixados individualmente', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const primeiroFormData = new FormData();
    primeiroFormData.append('file', new Blob(['conteudo um']), 'documento-um.txt');
    const primeiroUpload = await fetch(`${baseUrl}/upload`, { method: 'POST', body: primeiroFormData });
    assert.strictEqual(primeiroUpload.status, 201);
    const primeiroMetadata = await primeiroUpload.json();

    const segundoFormData = new FormData();
    segundoFormData.append('file', new Blob(['conteudo dois']), 'documento-dois.txt');
    const segundoUpload = await fetch(`${baseUrl}/upload`, { method: 'POST', body: segundoFormData });
    assert.strictEqual(segundoUpload.status, 201);
    const segundoMetadata = await segundoUpload.json();

    const listResponse = await fetch(`${baseUrl}/documents`);
    assert.strictEqual(listResponse.status, 200);
    const documentos = await listResponse.json();
    assert.ok(documentos.some((documento) => documento.id === primeiroMetadata.id));
    assert.ok(documentos.some((documento) => documento.id === segundoMetadata.id));

    const primeiroDownload = await fetch(`${baseUrl}/documents/${primeiroMetadata.id}/download`);
    assert.strictEqual(primeiroDownload.status, 200);
    assert.strictEqual(await primeiroDownload.text(), 'conteudo um');

    const segundoDownload = await fetch(`${baseUrl}/documents/${segundoMetadata.id}/download`);
    assert.strictEqual(segundoDownload.status, 200);
    assert.strictEqual(await segundoDownload.text(), 'conteudo dois');
  } finally {
    server.close();
    limparStorage();
  }
});

test('GET /documents/:id/download expõe o nome original do arquivo no cabeçalho de resposta', async () => {
  const { server, baseUrl } = await startServer();
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['dados do relatório']), 'relatorio-final.pdf');
    const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: formData });
    const metadata = await uploadResponse.json();

    const downloadResponse = await fetch(`${baseUrl}/documents/${metadata.id}/download`);
    assert.strictEqual(downloadResponse.status, 200);
    assert.match(downloadResponse.headers.get('content-disposition') || '', /relatorio-final\.pdf/);
  } finally {
    server.close();
    limparStorage();
  }
});
