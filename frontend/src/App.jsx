import { useCallback, useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';
import { listDocuments } from './services/documentsApi';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [erro, setErro] = useState(null);

  const carregarDocumentos = useCallback(async () => {
    try {
      const dados = await listDocuments();
      setDocuments(dados);
      setErro(null);
    } catch (error) {
      setErro('Não foi possível carregar a lista de documentos.');
    }
  }, []);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploaded={carregarDocumentos} />
      {erro && <p role="alert">{erro}</p>}
      <DocumentList documents={documents} />
    </main>
  );
}
