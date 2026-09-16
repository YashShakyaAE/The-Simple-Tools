import JSZip from 'jszip';

export function renderBatchSuite(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="batch-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
        </div>
        <div class="dropzone-title">Drag & Drop multiple files or entire folder here</div>
        <div class="dropzone-desc">Batch image conversion, mass checksum generator, and instant ZIP bundle packaging</div>
        <input type="file" id="batch-file-input" multiple style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="batch-load-demo-btn">
          📦 Generate Sample Batch File Queue
        </button>
      </div>

      <div id="batch-panel" style="display:none; margin-top:1.5rem;">
        <div class="tool-controls-row">
          <div class="control-item">
            <label class="control-label">Batch Operation</label>
            <select class="control-select" id="batch-operation">
              <option value="image-webp">Convert Images to WebP (Lossy 90%)</option>
              <option value="image-png">Convert Images to PNG (Lossless)</option>
              <option value="checksum">Compute SHA-256 Checksums List</option>
              <option value="zip-only">Bundle Directly into ZIP Archive</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Queue Summary</label>
            <div id="batch-queue-summary" style="font-weight:700; color:#fff; font-size:0.95rem; margin-top:0.4rem;">0 files (0 MB)</div>
          </div>
          <div class="control-item" style="justify-content:flex-end;">
            <button class="btn btn-primary" id="batch-process-btn">
              ⚡ Process & Download ZIP
            </button>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:1.25rem 0 0.5rem;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-secondary);">Batch Processing Queue</h4>
          <button class="btn btn-outline btn-sm" id="batch-clear-btn" style="color:var(--text-dim); border:none;">Clear All</button>
        </div>

        <div class="batch-queue" id="batch-items-list"></div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#batch-dropzone');
  const fileInput = container.querySelector('#batch-file-input');
  const demoBtn = container.querySelector('#batch-load-demo-btn');
  const panel = container.querySelector('#batch-panel');
  const itemsList = container.querySelector('#batch-items-list');
  const summaryEl = container.querySelector('#batch-queue-summary');
  const processBtn = container.querySelector('#batch-process-btn');
  const clearBtn = container.querySelector('#batch-clear-btn');
  const opSelect = container.querySelector('#batch-operation');

  let fileQueue = [];

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(Array.from(e.target.files));
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(Array.from(e.dataTransfer.files));
    }
  });

  demoBtn.addEventListener('click', () => {
    const demoFiles = [];
    for (let i = 1; i <= 3; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = i === 1 ? '#F43F5E' : i === 2 ? '#A855F7' : '#C084FC';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Batch Sample Image ${i}`, 200, 150);

      canvas.toBlob((b) => {
        demoFiles.push(new File([b], `sample-graphic-${i}.png`, { type: 'image/png' }));
        if (demoFiles.length === 3) {
          addFilesToQueue(demoFiles);
        }
      });
    }
  });

  function addFilesToQueue(files) {
    fileQueue = fileQueue.concat(files);
    renderQueue();
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });
  }

  function renderQueue() {
    itemsList.innerHTML = '';
    let totalBytes = 0;

    fileQueue.forEach((file, index) => {
      totalBytes += file.size;
      const item = document.createElement('div');
      item.className = 'batch-queue-item';
      item.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span>📄</span>
          <span style="font-weight:600; color:#cbd5e1;">${file.name}</span>
          <span style="color:var(--text-dim); font-size:0.75rem;">(${formatBytes(file.size)})</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="batch-status-badge batch-status-ready" id="batch-item-status-${index}">Queued</span>
          <button style="color:#ef4444; cursor:pointer;" data-del-idx="${index}">✕</button>
        </div>
      `;
      itemsList.appendChild(item);
    });

    summaryEl.textContent = `${fileQueue.length} files (${formatBytes(totalBytes)})`;

    itemsList.querySelectorAll('[data-del-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.delIdx, 10);
        fileQueue.splice(idx, 1);
        renderQueue();
      });
    });
  }

  clearBtn.addEventListener('click', () => {
    fileQueue = [];
    renderQueue();
    panel.style.display = 'none';
  });

  processBtn.addEventListener('click', async () => {
    if (fileQueue.length === 0) return;
    processBtn.disabled = true;
    processBtn.textContent = 'Processing Batch Queue...';

    const op = opSelect.value;
    const zip = new JSZip();

    try {
      if (op === 'checksum') {
        const checksumLines = [];
        for (let i = 0; i < fileQueue.length; i++) {
          const file = fileQueue[i];
          const badge = container.querySelector(`#batch-item-status-${i}`);
          if (badge) { badge.textContent = 'Hashing...'; badge.className = 'batch-status-badge batch-status-ready'; }

          const buf = await file.arrayBuffer();
          const hashBuf = await crypto.subtle.digest('SHA-256', buf);
          const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

          checksumLines.push(`${hashHex}  ${file.name}`);
          if (badge) { badge.textContent = 'Done'; badge.className = 'batch-status-badge batch-status-done'; }
        }
        zip.file('checksums-sha256.txt', checksumLines.join('\n'));
      } else if (op === 'image-webp' || op === 'image-png') {
        const format = op === 'image-webp' ? 'image/webp' : 'image/png';
        const ext = op === 'image-webp' ? 'webp' : 'png';

        for (let i = 0; i < fileQueue.length; i++) {
          const file = fileQueue[i];
          const badge = container.querySelector(`#batch-item-status-${i}`);
          if (badge) { badge.textContent = 'Converting...'; }

          if (file.type.startsWith('image/')) {
            const blob = await convertImageBlob(file, format);
            const newName = file.name.replace(/\.[^/.]+$/, "") + '.' + ext;
            zip.file(newName, blob);
          } else {
            zip.file(file.name, file);
          }
          if (badge) { badge.textContent = 'Done'; badge.className = 'batch-status-badge batch-status-done'; }
        }
      } else {
        // Zip only
        fileQueue.forEach(f => zip.file(f.name, f));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `TheSimpleYash-Batch-Bundle.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      processBtn.disabled = false;
      processBtn.textContent = '⚡ Process & Download ZIP';
      if (window.showToast) window.showToast(`Batch processed! Downloaded ZIP (${formatBytes(zipBlob.size)})`);
    } catch (err) {
      if (window.showToast) window.showToast('Batch processing error: ' + err.message);
      processBtn.disabled = false;
      processBtn.textContent = '⚡ Process & Download ZIP';
    }
  });

  function convertImageBlob(file, format) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => resolve(b), format, 0.9);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
