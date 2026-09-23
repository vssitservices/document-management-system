const API_BASE = '/api';

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar o documento.');
  }

  return response.json();
}

export async function listDocuments() {
  const response = await fetch(`${API_BASE}/documents`);

  if (!response.ok) {
    throw new Error('Falha ao listar os documentos.');
  }

  return response.json();
}

function extractFileName(contentDisposition, fallbackName) {
  if (!contentDisposition) {
    return fallbackName;
  }
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1]);
  }
  const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return asciiMatch ? asciiMatch[1] : fallbackName;
}

export async function downloadDocument(id, fallbackName) {
  const response = await fetch(`${API_BASE}/documents/${id}/download`);

  if (!response.ok) {
    throw new Error('Falha ao baixar o documento.');
  }

  const blob = await response.blob();
  const fileName = extractFileName(response.headers.get('Content-Disposition'), fallbackName);

  // Dispara o download no navegador a partir do blob obtido via fetch.
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
