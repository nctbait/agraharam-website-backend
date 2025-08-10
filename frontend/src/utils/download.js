// utils/download.js
export function downloadBlobResponse(res, fallback = 'report.csv') {
    // Try to infer filename from Content-Disposition
    const cd = res.headers?.['content-disposition'] || '';
    const match = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(cd);
    const filename = decodeURIComponent(match?.[1] || match?.[2] || fallback);
  
    // If backend accidentally sent JSON, show it instead of downloading garbage
    const ct = (res.headers?.['content-type'] || '').toLowerCase();
    if (ct.includes('application/json')) {
      // Convert blob -> text -> JSON for readable error
      return res.data.text().then(txt => {
        try {
          const obj = JSON.parse(txt);
          alert(obj.message || obj.error || 'Received JSON instead of a file.');
        } catch {
          alert(txt || 'Received JSON/text instead of a file.');
        }
      });
    }
  
    // Ensure we have a Blob
    const blob = res.data instanceof Blob
      ? res.data
      : new Blob([res.data], { type: ct || 'text/csv;charset=utf-8' });
  
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  