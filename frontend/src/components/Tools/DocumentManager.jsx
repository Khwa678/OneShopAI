import React, { useState, useEffect } from 'react';
import { Folder, Trash2, Eye, FileText, Download } from 'lucide-react';
import { getDocuments, deleteDocument } from '../../services/api';

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [search, setSearch] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await getDocuments();
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(id);
      fetchDocs();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const filteredDocs = documents.filter(d => 
    d.originalName.toLowerCase().includes(search.toLowerCase()) ||
    d.toolType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-card">
      <div className="card-header-bar">
        <div className="card-title">
          <Folder size={22} style={{ color: 'var(--primary-teal)' }} />
          <span>My Saved Documents & History</span>
        </div>
        <input
          type="text"
          placeholder="Search documents..."
          className="select-dropdown"
          style={{ width: '220px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <FileText size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>No uploaded documents found.</p>
          <p style={{ fontSize: '13px', marginTop: '4px', color: 'var(--text-muted)' }}>Upload a PDF, document, or image in any AI tool to track it here.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Document Name</th>
                <th style={{ padding: '12px 16px' }}>Tool Used</th>
                <th style={{ padding: '12px 16px' }}>Size</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    {doc.originalName}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="badge-tag">{doc.toolType}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {Math.round(doc.size / 1024)} KB
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        style={{ background: 'var(--border-color)', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary-teal)' }}
                        title="View Extracted Content"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
                        title="Delete Document"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Content Modal */}
      {selectedDoc && (
        <div className="modal-backdrop" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--primary-teal)' }}>
              {selectedDoc.originalName}
            </h3>
            <textarea
              className="custom-textarea"
              style={{ minHeight: '260px' }}
              readOnly
              value={selectedDoc.extractedText || 'No text extracted for this document file.'}
            />
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button className="btn-get-started" onClick={() => setSelectedDoc(null)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
