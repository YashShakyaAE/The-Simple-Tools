// Image Upscaler for TheSimpleTools
// Uses multi-pass Canvas upscaling with sharpening convolution for quality enhancement

export function renderImageUpscaler(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="upscale-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
        </div>
        <div class="dropzone-title">Drag & Drop your Image, or <span style="color:var(--crimson);text-decoration:underline;">Browse</span></div>
        <div class="dropzone-desc">240p • 480p • 1080p • 1440p → 4K Ultra HD • PNG, JPEG, WEBP, BMP • 100% client-side</div>
        <input type="file" id="upscale-file-input" accept="image/*" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="upscale-load-demo-btn">
          ✨ Or Load Sample Low-Res Demo Image
        </button>
      </div>

      <div id="upscale-editor-panel" style="display:none; margin-top:1.5rem;">
        <!-- Original vs Preview -->
        <div class="split-panels">
          <div class="split-panel">
            <div class="split-panel-label">Original</div>
            <img id="upscale-preview-original" class="image-preview-img" alt="Original" style="max-height:240px; border-radius:var(--radius-sm); image-rendering:pixelated;" />
            <div id="upscale-orig-info" class="split-panel-foot">-</div>
          </div>
          <div class="split-panel">
            <div class="split-panel-label ok">Upscaled Preview</div>
            <img id="upscale-preview-result" class="image-preview-img" alt="Upscaled" style="max-height:240px; border-radius:var(--radius-sm);" />
            <div id="upscale-result-info" class="split-panel-foot ok">Select a resolution below</div>
          </div>
        </div>

        <!-- Resolution Selector -->
        <div style="background:rgba(20,20,32,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.25rem;">
          <h4 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">🎯 Target Resolution</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem;" id="upscale-res-grid">
            <button class="btn btn-outline btn-sm upscale-res-btn" data-res="1920x1080" style="padding:0.9rem;">
              <div style="font-weight:700; font-size:1.05rem; color:#38bdf8;">1080p Full HD</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">1920 × 1080 px</div>
            </button>
            <button class="btn btn-outline btn-sm upscale-res-btn" data-res="2560x1440" style="padding:0.9rem;">
              <div style="font-weight:700; font-size:1.05rem; color:#c084fc;">1440p QHD</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">2560 × 1440 px</div>
            </button>
            <button class="btn btn-outline btn-sm upscale-res-btn active" data-res="3840x2160" style="padding:0.9rem;">
              <div style="font-weight:700; font-size:1.05rem; color:#f43f5e;">4K Ultra HD</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">3840 × 2160 px</div>
            </button>
            <button class="btn btn-outline btn-sm upscale-res-btn" data-res="custom" style="padding:0.9rem;">
              <div style="font-weight:700; font-size:1.05rem; color:#fbbf24;">Custom</div>
              <div style="font-size:0.78rem; color:var(--text-muted);">Enter manually</div>
            </button>
          </div>

          <div id="upscale-custom-dims" style="display:none; margin-top:1rem;">
            <div class="tool-controls-row" style="grid-template-columns: 1fr 1fr;">
              <div class="control-item">
                <label class="control-label">Width (px)</label>
                <input type="number" class="control-input" id="upscale-custom-w" placeholder="3840" />
              </div>
              <div class="control-item">
                <label class="control-label">Height (px)</label>
                <input type="number" class="control-input" id="upscale-custom-h" placeholder="2160" />
              </div>
            </div>
          </div>
        </div>

        <!-- Enhancement Options -->
        <div class="tool-controls-row" style="margin-bottom:1.25rem;">
          <div class="control-item">
            <label class="control-label">Sharpening (<span id="upscale-sharp-val">50</span>%)</label>
            <input type="range" id="upscale-sharpness" min="0" max="100" value="50" />
          </div>
          <div class="control-item">
            <label class="control-label">Output Format</label>
            <select class="control-select" id="upscale-format">
              <option value="image/png">PNG (Lossless Quality)</option>
              <option value="image/webp">WEBP (High Compression)</option>
              <option value="image/jpeg">JPEG (Standard Photo)</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Quality (<span id="upscale-quality-val">95</span>%)</label>
            <input type="range" id="upscale-quality" min="50" max="100" value="95" />
          </div>
          <div class="control-item">
            <label class="control-label">Aspect Ratio</label>
            <select class="control-select" id="upscale-aspect">
              <option value="fit">Fit (Maintain Ratio)</option>
              <option value="stretch">Stretch to Fill</option>
              <option value="crop">Center Crop</option>
            </select>
          </div>
        </div>

        <!-- Progress Bar -->
        <div id="upscale-progress-wrap" style="display:none; margin-bottom:1.25rem; background:rgba(20,20,30,0.7); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span style="font-size:0.85rem; color:#fff; font-weight:600;">Upscaling in progress…</span>
            <span id="upscale-progress-pct" style="font-size:0.85rem; color:#86efac; font-weight:700;">0%</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
            <div id="upscale-progress-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #DC143C, #9400D3); border-radius:3px; transition:width 0.3s ease;"></div>
          </div>
          <div id="upscale-progress-msg" style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem;">Initializing multi-pass upscaling engine…</div>
        </div>

        <!-- Action Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(20,20,30,0.6); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06);">
          <div>
            <div style="font-size:0.85rem; color:var(--text-muted);">Original: <span id="upscale-orig-size" style="color:#fff; font-weight:600;">-</span> | Dimensions: <span id="upscale-orig-dims" style="color:#fff; font-weight:600;">-</span></div>
            <div id="upscale-scale-factor" style="font-size:0.85rem; color:#c084fc; margin-top:0.2rem;">Select resolution to begin</div>
          </div>
          <button class="btn btn-primary" id="upscale-process-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
            Upscale & Download
          </button>
        </div>
      </div>
    </div>
  `;

  let currentImg = null;
  let originalFile = null;
  let targetW = 3840;
  let targetH = 2160;

  const dropzone = container.querySelector('#upscale-dropzone');
  const fileInput = container.querySelector('#upscale-file-input');
  const loadDemoBtn = container.querySelector('#upscale-load-demo-btn');
  const editorPanel = container.querySelector('#upscale-editor-panel');
  const previewOriginal = container.querySelector('#upscale-preview-original');
  const previewResult = container.querySelector('#upscale-preview-result');
  const origInfo = container.querySelector('#upscale-orig-info');
  const resultInfo = container.querySelector('#upscale-result-info');
  const resButtons = container.querySelectorAll('.upscale-res-btn');
  const customDims = container.querySelector('#upscale-custom-dims');
  const customW = container.querySelector('#upscale-custom-w');
  const customH = container.querySelector('#upscale-custom-h');
  const sharpInput = container.querySelector('#upscale-sharpness');
  const sharpVal = container.querySelector('#upscale-sharp-val');
  const formatSelect = container.querySelector('#upscale-format');
  const qualityInput = container.querySelector('#upscale-quality');
  const qualityVal = container.querySelector('#upscale-quality-val');
  const aspectSelect = container.querySelector('#upscale-aspect');
  const origSizeEl = container.querySelector('#upscale-orig-size');
  const origDimsEl = container.querySelector('#upscale-orig-dims');
  const scaleFactorEl = container.querySelector('#upscale-scale-factor');
  const processBtn = container.querySelector('#upscale-process-btn');
  const progressWrap = container.querySelector('#upscale-progress-wrap');
  const progressBar = container.querySelector('#upscale-progress-bar');
  const progressPct = container.querySelector('#upscale-progress-pct');
  const progressMsg = container.querySelector('#upscale-progress-msg');

  // Dropzone events
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  });
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  // Slider value displays
  sharpInput.addEventListener('input', () => { sharpVal.textContent = sharpInput.value; });
  qualityInput.addEventListener('input', () => { qualityVal.textContent = qualityInput.value; });

  // Resolution selector
  resButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      resButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const res = btn.getAttribute('data-res');
      if (res === 'custom') {
        customDims.style.display = 'block';
      } else {
        customDims.style.display = 'none';
        const [w, h] = res.split('x').map(Number);
        targetW = w;
        targetH = h;
      }
      updateScaleFactor();
    });
  });

  customW.addEventListener('input', () => {
    targetW = parseInt(customW.value, 10) || 3840;
    if (currentImg && customW.value) {
      const ratio = currentImg.height / currentImg.width;
      customH.value = Math.round(targetW * ratio);
      targetH = parseInt(customH.value, 10);
    }
    updateScaleFactor();
  });

  // Demo image
  loadDemoBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 320, 240);
    grad.addColorStop(0, '#0D0D12');
    grad.addColorStop(0.5, '#2D0A31');
    grad.addColorStop(1, '#1A0B2E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 240);

    ctx.shadowBlur = 30;
    ctx.shadowColor = '#DC143C';
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.arc(100, 120, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = '#9400D3';
    ctx.fillStyle = '#9400D3';
    ctx.beginPath();
    ctx.arc(220, 120, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Schibsted Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('240p Low-Res', 160, 125);
    ctx.font = '14px Schibsted Grotesk, sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('Ready for 4K Upscale', 160, 150);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'demo-240p.png', { type: 'image/png' });
      handleFile(file);
    }, 'image/png');
  });

  function handleFile(file) {
    originalFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImg = img;
        previewOriginal.src = event.target.result;
        const tier = getResolutionTier(img.width, img.height);
        origInfo.textContent = `${img.width} × ${img.height} px (${tier}) • ${formatBytes(file.size)}`;
        origSizeEl.textContent = formatBytes(file.size);
        origDimsEl.textContent = `${img.width} × ${img.height} px (${tier})`;
        resultInfo.textContent = 'Select resolution & click Upscale';
        previewResult.src = '';
        editorPanel.style.display = 'block';
        editorPanel.scrollIntoView({ behavior: 'smooth' });
        updateScaleFactor();
        if (window.showToast) window.showToast(`Detected source: ${tier} — ready to upscale to 4K`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function getResolutionTier(w, h) {
    const max = Math.max(w, h);
    const min = Math.min(w, h);
    // Classify by height-ish (landscape) or max edge for portrait
    const edge = min <= 480 ? min : max;
    if (min <= 280 || max <= 500) return '240p-class low-res';
    if (min <= 560 || max <= 900) return '480p-class SD';
    if (min <= 800 || max <= 1400) return '720p-class HD';
    if (min <= 1200 || max <= 2100) return '1080p Full HD';
    if (min <= 1600 || max <= 2800) return '1440p QHD';
    if (edge > 2800 || max >= 3400) return '4K-class already';
    return `${w}×${h}`;
  }

  function updateScaleFactor() {
    if (!currentImg) return;
    const factor = Math.max(targetW / currentImg.width, targetH / currentImg.height).toFixed(1);
    scaleFactorEl.textContent = `Upscale factor: ${factor}× → ${targetW} × ${targetH} px`;
  }

  // Multi-pass upscaling with sharpening
  processBtn.addEventListener('click', async () => {
    if (!currentImg) return;

    const aspect = aspectSelect.value;
    const sharpness = parseInt(sharpInput.value, 10) / 100;
    const quality = parseInt(qualityInput.value, 10) / 100;
    const format = formatSelect.value;

    // Calculate final dimensions based on aspect mode
    let finalW = targetW;
    let finalH = targetH;

    if (aspect === 'fit') {
      const ratio = Math.min(targetW / currentImg.width, targetH / currentImg.height);
      finalW = Math.round(currentImg.width * ratio);
      finalH = Math.round(currentImg.height * ratio);
    }

    // Show progress
    progressWrap.style.display = 'block';
    processBtn.disabled = true;
    progressBar.style.width = '0%';
    progressPct.textContent = '0%';

    // Multi-pass upscaling (step up by 2x at a time for better quality)
    const passes = [];
    let pw = currentImg.width;
    let ph = currentImg.height;
    while (pw < finalW || ph < finalH) {
      pw = Math.min(pw * 2, finalW);
      ph = Math.min(ph * 2, finalH);
      passes.push({ w: pw, h: ph });
    }
    if (passes.length === 0) {
      passes.push({ w: finalW, h: finalH });
    }

    let sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = currentImg.width;
    sourceCanvas.height = currentImg.height;
    let sourceCtx = sourceCanvas.getContext('2d');

    if (aspect === 'crop') {
      // Center-crop the source to match target aspect ratio
      const targetAspect = targetW / targetH;
      const srcAspect = currentImg.width / currentImg.height;
      let sx = 0, sy = 0, sw = currentImg.width, sh = currentImg.height;
      if (srcAspect > targetAspect) {
        sw = currentImg.height * targetAspect;
        sx = (currentImg.width - sw) / 2;
      } else {
        sh = currentImg.width / targetAspect;
        sy = (currentImg.height - sh) / 2;
      }
      sourceCanvas.width = currentImg.width;
      sourceCanvas.height = currentImg.height;
      sourceCtx.drawImage(currentImg, sx, sy, sw, sh, 0, 0, sourceCanvas.width, sourceCanvas.height);
      // Update passes for crop final dims
      finalW = targetW;
      finalH = targetH;
    } else {
      sourceCtx.drawImage(currentImg, 0, 0);
    }

    progressMsg.textContent = `Running ${passes.length}-pass progressive upscale…`;

    for (let i = 0; i < passes.length; i++) {
      const pass = passes[i];
      const progress = Math.round(((i + 1) / (passes.length + 1)) * 80);

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          const nextCanvas = document.createElement('canvas');
          nextCanvas.width = pass.w;
          nextCanvas.height = pass.h;
          const nextCtx = nextCanvas.getContext('2d');
          nextCtx.imageSmoothingEnabled = true;
          nextCtx.imageSmoothingQuality = 'high';
          nextCtx.drawImage(sourceCanvas, 0, 0, pass.w, pass.h);

          sourceCanvas = nextCanvas;
          sourceCtx = nextCtx;

          progressBar.style.width = progress + '%';
          progressPct.textContent = progress + '%';
          progressMsg.textContent = `Pass ${i + 1}/${passes.length}: Scaled to ${pass.w} × ${pass.h}`;
          resolve();
        });
      });

      // Small delay for UI update
      await new Promise(r => setTimeout(r, 80));
    }

    // Apply sharpening convolution if enabled
    if (sharpness > 0) {
      progressMsg.textContent = 'Applying sharpening filter…';
      progressBar.style.width = '85%';
      progressPct.textContent = '85%';

      await new Promise(r => setTimeout(r, 50));

      const w = sourceCanvas.width;
      const h = sourceCanvas.height;
      const imageData = sourceCtx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const copy = new Uint8ClampedArray(data);

      // Unsharp mask kernel scaled by sharpness
      const amount = sharpness * 1.5;
      const kernel = [
        0, -amount, 0,
        -amount, 1 + 4 * amount, -amount,
        0, -amount, 0
      ];

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let val = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                val += copy[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            data[(y * w + x) * 4 + c] = Math.max(0, Math.min(255, val));
          }
        }
      }

      sourceCtx.putImageData(imageData, 0, 0);
    }

    progressBar.style.width = '95%';
    progressPct.textContent = '95%';
    progressMsg.textContent = 'Encoding final image…';

    await new Promise(r => setTimeout(r, 100));

    // Generate result
    sourceCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      previewResult.src = url;
      resultInfo.textContent = `${sourceCanvas.width} × ${sourceCanvas.height} px • ${formatBytes(blob.size)}`;

      progressBar.style.width = '100%';
      progressPct.textContent = '100%';
      progressMsg.textContent = `Done! Upscaled to ${sourceCanvas.width} × ${sourceCanvas.height}`;

      // Auto download
      const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
      const baseName = originalFile ? originalFile.name.replace(/\.[^/.]+$/, '') : 'upscaled';
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-${sourceCanvas.width}x${sourceCanvas.height}-upscaled.${ext}`;
      a.click();

      processBtn.disabled = false;
      if (window.showToast) {
        window.showToast(`Upscaled to ${sourceCanvas.width}×${sourceCanvas.height} (${formatBytes(blob.size)})`);
      }

      setTimeout(() => { progressWrap.style.display = 'none'; }, 2000);
    }, format, quality);
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
