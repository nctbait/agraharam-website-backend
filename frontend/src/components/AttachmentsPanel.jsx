// components/AttachmentsPanel.jsx
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/authAxios';

// helper: force download via XHR blob (works with auth)
async function downloadAttachmentById(id, filename = 'file') {
  const res = await api.instance.get(`/api/attachments/${id}?download=true`, {
    responseType: 'blob',
  });
  const blob = new Blob([res.data]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function AttachmentsPanel({ ownerType, ownerId, canEdit, accept }) {
  const [items, setItems] = useState([]);
  const fileRef = useRef();

  const load = async () => {
    const res = await api.get('/api/attachments', { params: { ownerType, ownerId }});
    setItems(res || []);
  };
  useEffect(()=>{ if(ownerType && ownerId) load(); }, [ownerType, ownerId]);

  const upload = async (file) => {
    const form = new FormData();
    form.append('ownerType', ownerType);
    form.append('ownerId', ownerId);
    form.append('file', file);
    await api.post('/api/attachments', form, { headers: { 'Content-Type': 'multipart/form-data' }});
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this attachment?')) return;
    await api.delete(`/api/attachments/${id}`);
    await load();
  };

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Attachments</h3>
        {canEdit && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={accept || ".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif"}
              className="hidden"
              onChange={e => e.target.files[0] && upload(e.target.files[0])}
            />
            <button onClick={()=>fileRef.current.click()} className="rounded-lg h-9 px-3 bg-[#f1f2f4] font-bold">Upload</button>
          </>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No files yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(a => (
            <li key={a.id} className="flex items-center justify-between">
              {/* Download button instead of <a href> to avoid blank pane */}
              <button
                onClick={() => downloadAttachmentById(a.id, a.filename)}
                className="text-blue-600 hover:underline text-left"
                title={a.filename}
              >
                {a.filename} <span className="text-gray-500 text-xs">({(a.size/1024).toFixed(1)} KB)</span>
              </button>
              {canEdit && (
                <button onClick={()=>remove(a.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
