import DownloadButton from './DownloadButton';

function formatSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export default function DocumentList({ documents }) {
  if (documents.length === 0) {
    return <p>Nenhum documento enviado ainda.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tamanho</th>
          <th>Enviado em</th>
          <th>Owner</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {documents.map((documento) => (
          <tr key={documento.id}>
            <td>{documento.originalName}</td>
            <td>{formatSize(documento.size)}</td>
            <td>{new Date(documento.uploadedAt).toLocaleString('pt-BR')}</td>
            <td>{documento.owner}</td>
            <td>
              <DownloadButton documentId={documento.id} originalName={documento.originalName} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
