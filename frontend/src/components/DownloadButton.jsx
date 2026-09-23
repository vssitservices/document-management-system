import { downloadDocument } from '../services/documentsApi';
import { useAsyncAction } from '../hooks/useAsyncAction';

export default function DownloadButton({ documentId, originalName }) {
  const { execute: baixarDocumento, isLoading: isDownloading } = useAsyncAction(downloadDocument);

  async function handleClick() {
    try {
      await baixarDocumento(documentId, originalName);
    } catch (error) {
      window.alert('Não foi possível baixar o documento.');
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isDownloading}>
      {isDownloading ? 'Baixando...' : 'Baixar'}
    </button>
  );
}
