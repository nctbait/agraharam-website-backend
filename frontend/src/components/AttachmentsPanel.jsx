// components/AttachmentsPanel.jsx
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/authAxios';

export default function AttachmentsPanel({ ownerType, ownerId, canEdit }) {
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
            <input ref={fileRef} type="file" className="hidden" onChange={e => e.target.files[0] && upload(e.target.files[0])}/>
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
              <a href={`/api/attachments/${a.id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {a.filename} <span className="text-gray-500 text-xs">({(a.size/1024).toFixed(1)} KB)</span>
              </a>
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
