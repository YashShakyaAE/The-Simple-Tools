export function renderImageConverter(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="img-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
        </div>
        <div class="dropzone-title">Drag & Drop your Image here, or <span style="color:var(--crimson);text-decoration:underline;">Browse</span></div>
        <div class="dropzone-desc">Supports PNG, JPEG, JPG, WEBP, GIF, BMP • 100% Client-side Processing</div>
        <input type="file" id="img-file-input" accept="image/*" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="img-load-demo-btn">
          ✨ Or Load Sample Demo Image
        </button>
      </div>

      <div id="img-editor-panel" style="display:none; margin-top:1.5rem;">
        <div class="image-preview-wrapper">
          <img id="img-preview-target" class="image-preview-img" alt="Preview" />
        </div>

        <div class="tool-controls-row">
          <div class="control-item">
            <label class="control-label">Target Format</label>
            <select class="control-select" id="img-target-format">
              <option value="image/webp">WEBP (Modern & High Compression)</option>
              <option value="image/png">PNG (Lossless Transparency)</option>
              <option value="image/jpeg">JPEG (Standard Photo)</option>
            </select>
          </div>

          <div class="control-item">
            <label class="control-label">Quality (<span id="img-quality-val">90</span>%)</label>
            <input type="range" id="img-quality" min="10" max="100" value="90" />
          </div>

          <div class="control-item">
            <label class="control-label">Resize Width (px)</label>
            <input type="number" class="control-input" id="img-resize-w" placeholder="Auto" />
          </div>

          <div class="control-item">
            <label class="control-label">Resize Height (px)</label>
            <input type="number" class="control-input" id="img-resize-h" placeholder="Auto" />
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(20,20,30,0.6); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06); margin-top:1.25rem;">
          <div>
            <div style="font-size:0.85rem; color:var(--text-muted);">Original: <span id="img-orig-size" style="color:#fff; font-weight:600;">-</span> | Dimensions: <span id="img-orig-dims" style="color:#fff; font-weight:600;">-</span></div>
            <div style="font-size:0.85rem; color:#86efac; margin-top:0.2rem;">Ready for instant conversion</div>
          </div>
          <button class="btn btn-primary" id="img-download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Convert & Download
          </button>
        </div>
      </div>
    </div>
  `;

  let currentImg = null;
  let originalFile = null;
  let originalWidth = 0;
  let originalHeight = 0;

  const dropzone = container.querySelector('#img-dropzone');
  const fileInput = container.querySelector('#img-file-input');
  const loadDemoBtn = container.querySelector('#img-load-demo-btn');
  const editorPanel = container.querySelector('#img-editor-panel');
  const previewTarget = container.querySelector('#img-preview-target');
  const qualityInput = container.querySelector('#img-quality');
  const qualityVal = container.querySelector('#img-quality-val');
  const formatSelect = container.querySelector('#img-target-format');
  const widthInput = container.querySelector('#img-resize-w');
  const heightInput = container.querySelector('#img-resize-h');
  const origSizeEl = container.querySelector('#img-orig-size');
  const origDimsEl = container.querySelector('#img-orig-dims');
  const downloadBtn = container.querySelector('#img-download-btn');

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  qualityInput.addEventListener('input', () => {
    qualityVal.textContent = qualityInput.value;
  });

  loadDemoBtn.addEventListener('click', () => {
    // Generate an aesthetic canvas demo graphic
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#0D0D12');
    grad.addColorStop(0.5, '#2D0A31');
    grad.addColorStop(1, '#1A0B2E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Glowing orbs
    ctx.shadowBlur = 60;
    ctx.shadowColor = '#F43F5E';
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(350, 400, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = '#C084FC';
    ctx.fillStyle = '#C084FC';
    ctx.beginPath();
    ctx.arc(800, 380, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px Schibsted Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TheSimple \'s Tools High-Res Showcase', 600, 420);
    ctx.font = '24px Schibsted Grotesk, sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('100% Client-Side Universal Image Converter', 600, 480);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'thesimpleyash-demo.png', { type: 'image/png' });
      handleImageFile(file);
    }, 'image/png');
  });

  function handleImageFile(file) {
    originalFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImg = img;
        originalWidth = img.width;
        originalHeight = img.height;
        previewTarget.src = event.target.result;
        origSizeEl.textContent = formatBytes(file.size);
        origDimsEl.textContent = `${img.width} × ${img.height} px`;
        widthInput.value = img.width;
        heightInput.value = img.height;
        editorPanel.style.display = 'block';
        editorPanel.scrollIntoView({ behavior: 'smooth' });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Maintain aspect ratio
  widthInput.addEventListener('input', () => {
    if (originalWidth && widthInput.value) {
      const ratio = originalHeight / originalWidth;
      heightInput.value = Math.round(widthInput.value * ratio);
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (!currentImg) return;
    const targetFormat = formatSelect.value;
    const quality = parseInt(qualityInput.value, 10) / 100;
    const targetW = parseInt(widthInput.value, 10) || currentImg.width;
    const targetH = parseInt(heightInput.value, 10) || currentImg.height;

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    // Fill white background for JPEGs
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(currentImg, 0, 0, targetW, targetH);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
      const baseName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, "") : "converted";
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${baseName}.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (window.showToast) {
        window.showToast(`Converted & downloaded as ${ext.toUpperCase()} (${formatBytes(blob.size)})`);
      }
    }, targetFormat, quality);
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
