import { useEffect, useMemo, useState } from 'react';
import UploadBox from '../components/UploadBox';
import { deleteDocument, getDocuments, uploadDocument } from '../services/documents';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((first, second) => {
      return new Date(second.uploaded_at || 0) - new Date(first.uploaded_at || 0);
    });
  }, [documents]);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load documents.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setMessage('');
    setError('');

    try {
      const result = await uploadDocument(file);
      setMessage(result?.message || 'File uploaded successfully.');
      await loadDocuments();
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed.'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    setDeletingId(documentId);
    setMessage('');
    setError('');

    try {
      await deleteDocument(documentId);
      setMessage('Document deleted successfully.');
      setDocuments((current) => current.filter((doc) => doc.id !== documentId));
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete document.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="documents-page">
      <section className="documents-header">
        <div>
          <p className="eyebrow">Documents</p>
          <h1>Upload and verify your files</h1>
          <p className="header-copy">
            Send a file to the FastAPI backend, then confirm it appears in the document list.
          </p>
        </div>
        <button className="secondary-button" type="button" onClick={loadDocuments} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </section>

      <UploadBox onUpload={handleUpload} disabled={uploading} />

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="document-list" aria-live="polite">
        <div className="list-heading">
          <h2>Uploaded files</h2>
          <span>{sortedDocuments.length} total</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading documents...</p>
        ) : sortedDocuments.length === 0 ? (
          <p className="empty-state">No documents uploaded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="filename">{doc.filename}</td>
                    <td>
                      <span className={`status ${doc.status || 'unknown'}`}>
                        {doc.status || 'unknown'}
                      </span>
                    </td>
                    <td>{formatDate(doc.uploaded_at)}</td>
                    <td className="actions">
                      <button
                        className="danger-button"
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deletingId === doc.id}
                      >
                        {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) return 'Unknown';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.detail || error?.message || fallback;
}

export default Documents;
