import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [erro, setErro] = useState(null);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0] ?? null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setErro(null);
    try {
      await uploadDocument(selectedFile);
      setSelectedFile(null);
      event.target.reset();
      onUploaded?.();
    } catch (error) {
      setErro('Não foi possível enviar o documento. Tente novamente.');
    } finally {
      setIsUploading(false);
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
