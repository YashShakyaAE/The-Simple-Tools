export function renderVectorSuite(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="vec-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </div>
        <div class="dropzone-title">Drag & Drop SVG Vector Graphics or paste SVG code</div>
        <div class="dropzone-desc">Ultra HD 4K Rasterizer, SVG optimizer, and SVG to WebP/PNG converter</div>
        <input type="file" id="vec-file-input" accept=".svg,image/svg+xml" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="vec-load-demo-btn">
          ✨ Load TheSimpleTools Vector Monogram Demo
        </button>
      </div>

      <div id="vec-editor-panel" style="display:none; margin-top:1.5rem;">
        <div class="dual-editor-grid">
          <div class="editor-box">
            <div class="editor-header">
              <span>SVG Source Code</span>
              <button class="btn-copy-subtle" id="vec-copy-svg">Copy</button>
            </div>
            <textarea class="editor-textarea" id="vec-svg-code" style="height:280px;" placeholder="<svg ...>...</svg>"></textarea>
          </div>
          <div class="editor-box" style="display:flex; flex-direction:column;">
            <div class="editor-header">
              <span>Live Vector Preview</span>
              <span id="vec-native-dims" style="color:var(--neon-cyan);">512 × 512 px</span>
            </div>
            <div class="image-preview-wrapper" style="flex:1; margin:0; border:none; border-radius:0;">
              <div id="vec-svg-render-container" style="max-width:100%; max-height:220px; display:flex; align-items:center; justify-content:center;"></div>
            </div>
          </div>
        </div>

        <div class="tool-controls-row">
          <div class="control-item">
            <label class="control-label">Raster Export Scale</label>
            <select class="control-select" id="vec-scale">
              <option value="1">1x Standard Resolution</option>
              <option value="2" selected>2x High-DPI (Retina)</option>
              <option value="4">4x Ultra HD (4K Master)</option>
              <option value="8">8x Print Master (Super-Res)</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Target Format</label>
            <select class="control-select" id="vec-format">
              <option value="image/png">PNG (Lossless Alpha Transparency)</option>
              <option value="image/webp">WEBP (Compact Vector Raster)</option>
              <option value="image/jpeg">JPEG (Solid Background)</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Export Resolution</label>
            <div id="vec-export-res-label" style="font-weight:700; color:#c084fc; font-size:0.95rem; margin-top:0.4rem;">1024 × 1024 px</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
          <button class="btn btn-secondary" id="vec-optimize-btn">
            ⚡ Optimize & Minify SVG Code
          </button>
          <button class="btn btn-primary" id="vec-rasterize-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Rasterize & Download
          </button>
        </div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#vec-dropzone');
  const fileInput = container.querySelector('#vec-file-input');
  const demoBtn = container.querySelector('#vec-load-demo-btn');
  const panel = container.querySelector('#vec-editor-panel');
  const svgCodeArea = container.querySelector('#vec-svg-code');
  const svgRenderContainer = container.querySelector('#vec-svg-render-container');
  const nativeDimsEl = container.querySelector('#vec-native-dims');
  const scaleSelect = container.querySelector('#vec-scale');
  const formatSelect = container.querySelector('#vec-format');
  const exportResLabel = container.querySelector('#vec-export-res-label');
  const optimizeBtn = container.querySelector('#vec-optimize-btn');
  const rasterizeBtn = container.querySelector('#vec-rasterize-btn');
  const copyBtn = container.querySelector('#vec-copy-svg');

  let baseWidth = 512;
  let baseHeight = 512;

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadSvgFile(e.target.files[0]);
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
      loadSvgFile(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    const demoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DC143C" />
      <stop offset="50%" stop-color="#8A2BE2" />
      <stop offset="100%" stop-color="#9400D3" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="100" fill="#0D0D12" stroke="#9400D3" stroke-width="4"/>
  <circle cx="256" cy="256" r="170" fill="none" stroke="url(#primaryGrad)" stroke-width="14" filter="url(#neonGlow)"/>
  <path d="M190 170 L322 170 L256 342 Z" fill="url(#primaryGrad)" filter="url(#neonGlow)"/>
  <circle cx="256" cy="235" r="32" fill="#0D0D12"/>
</svg>`;
    setSvgContent(demoSvg);
  });

  function loadSvgFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSvgContent(e.target.result);
    };
    reader.readAsText(file);
  }

  function setSvgContent(svgStr) {
    svgCodeArea.value = svgStr;
    updatePreview(svgStr);
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });
    if (window.showToast) window.showToast('SVG Loaded & Rendered!');
  }

  function updatePreview(svgStr) {
    svgRenderContainer.innerHTML = svgStr;
    const svgEl = svgRenderContainer.querySelector('svg');
    if (svgEl) {
      baseWidth = svgEl.viewBox?.baseVal?.width || parseInt(svgEl.getAttribute('width')) || 512;
      baseHeight = svgEl.viewBox?.baseVal?.height || parseInt(svgEl.getAttribute('height')) || 512;
      nativeDimsEl.textContent = `${baseWidth} × ${baseHeight} px`;
      updateExportLabel();
    }
  }

  function updateExportLabel() {
    const scale = parseInt(scaleSelect.value, 10);
    exportResLabel.textContent = `${baseWidth * scale} × ${baseHeight * scale} px`;
  }

  scaleSelect.addEventListener('change', updateExportLabel);
  svgCodeArea.addEventListener('input', () => {
    updatePreview(svgCodeArea.value);
  });

  optimizeBtn.addEventListener('click', () => {
    const optimized = svgCodeArea.value
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    svgCodeArea.value = optimized;
    updatePreview(optimized);
    if (window.showToast) window.showToast('SVG optimized and minified!');
  });

  copyBtn.addEventListener('click', () => {
    if (svgCodeArea.value) {
      navigator.clipboard.writeText(svgCodeArea.value);
      if (window.showToast) window.showToast('SVG copied to clipboard!');
    }
  });

  rasterizeBtn.addEventListener('click', () => {
    const svgEl = svgRenderContainer.querySelector('svg');
    if (!svgEl) return;

    const scale = parseInt(scaleSelect.value, 10);
    const targetW = baseWidth * scale;
    const targetH = baseHeight * scale;
    const format = formatSelect.value;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';

    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgEl)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#0D0D12';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `vector-export-${targetW}x${targetH}.${ext}`;
        a.click();
        URL.revokeObjectURL(a.href);
        if (window.showToast) window.showToast(`Rasterized to ${targetW}x${targetH} ${ext.toUpperCase()}!`);
      }, format, 0.95);
    };
    img.src = url;
  });
}
