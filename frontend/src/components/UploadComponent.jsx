import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';
import { useAsyncAction } from '../hooks/useAsyncAction';

export default function UploadComponent({ onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    execute: enviarDocumento,
    isLoading: isUploading,
    erro,
  } = useAsyncAction(uploadDocument, 'Não foi possível enviar o documento. Tente novamente.');

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] ?? null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    try {
      await enviarDocumento(selectedFile);
      setSelectedFile(null);
      event.target.reset();
      onUploaded?.();
    } catch (error) {
      // erro já é exposto via estado `erro` do hook
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <button type="submit" disabled={!selectedFile || isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar documento'}
      </button>
      {erro && <p role="alert">{erro}</p>}
    </form>
  );
}
