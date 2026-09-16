// Media Size Reducer for TheSimpleTools — shrink Video & Image to 25 MB portable target
// 100% client-side. Strategy: keep maximum originality — reduce quality first,
// downscale dimensions only as a last resort, binary-search the best fit.

export function renderMediaReducer(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="reducer-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
        </div>
        <div class="dropzone-title">Drag & Drop Video or Image, or <span style="color:var(--crimson);text-decoration:underline;">Browse</span></div>
        <div class="dropzone-desc">MP4 • WEBM • MOV • MKV • PNG • JPEG • WEBP → shrinks to <strong>25 MB</strong> portable file • original quality preserved</div>
        <input type="file" id="reducer-file-input" accept="video/*,image/*" style="display:none;" />
      </div>

      <div style="background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.25); border-radius:var(--radius-md); padding:0.8rem 1.1rem; margin-top:1rem; font-size:0.82rem; color:#bbf7d0; line-height:1.5;">
        <strong style="color:#86efac;">How it preserves originality:</strong> quality is lowered first (highest bitrate / JPEG quality that still fits 25&nbsp;MB wins). Resolution is reduced only if quality reduction alone cannot fit. Nothing is ever uploaded.
      </div>

      <div id="reducer-editor" style="display:none; margin-top:1.5rem;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
          <div style="background:rgba(20,20,30,0.7); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:0.9rem; text-align:center;">
            <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Original</div>
            <div id="reducer-orig-preview"></div>
            <div id="reducer-orig-info" style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem;">-</div>
          </div>
          <div style="background:rgba(20,20,30,0.7); border:1px solid rgba(34,197,94,0.3); border-radius:var(--radius-md); padding:0.9rem; text-align:center;">
            <div style="font-size:0.78rem; color:#86efac; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">≤ 25 MB Result</div>
            <div id="reducer-result-preview"></div>
            <div id="reducer-result-info" style="font-size:0.8rem; color:#86efac; margin-top:0.5rem;">Drop a file to begin</div>
          </div>
        </div>

        <div style="background:rgba(20,20,32,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.25rem;">
          <h4 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">🎯 Size Target (portable standard)</h4>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:0.75rem;" id="reducer-target-grid">
            <button class="btn btn-outline btn-sm reducer-target-btn" data-mb="8" style="padding:0.8rem;"><div style="font-weight:700; color:#38bdf8;">8 MB</div><div style="font-size:0.75rem; color:var(--text-muted);">Discord / chat</div></button>
            <button class="btn btn-outline btn-sm reducer-target-btn" data-mb="16" style="padding:0.8rem;"><div style="font-weight:700; color:#c084fc;">16 MB</div><div style="font-size:0.75rem; color:var(--text-muted);">Email attach</div></button>
            <button class="btn btn-outline btn-sm reducer-target-btn active" data-mb="25" style="padding:0.8rem;"><div style="font-weight:700; color:#86efac;">25 MB ★</div><div style="font-size:0.75rem; color:var(--text-muted);">Standard portable</div></button>
            <button class="btn btn-outline btn-sm reducer-target-btn" data-mb="50" style="padding:0.8rem;"><div style="font-weight:700; color:#fbbf24;">50 MB</div><div style="font-size:0.75rem; color:var(--text-muted);">High quality</div></button>
          </div>

          <div class="tool-controls-row" style="margin-top:1rem; margin-bottom:0;">
            <div class="control-item">
              <label class="control-label">Image output format</label>
              <select class="control-select" id="reducer-img-format">
                <option value="auto">Auto (smartest fit)</option>
                <option value="image/webp">WEBP (smallest, modern)</option>
                <option value="image/jpeg">JPEG (universal photo)</option>
                <option value="image/png">PNG (lossless, if fits)</option>
              </select>
            </div>
            <div class="control-item">
              <label class="control-label">Video output</label>
              <select class="control-select" id="reducer-vid-format">
                <option value="video/webm">WebM (best compression)</option>
                <option value="video/mp4">MP4 (max compatible)</option>
              </select>
            </div>
            <div class="control-item">
              <label class="control-label">Fidelity priority</label>
              <select class="control-select" id="reducer-mode">
                <option value="balanced">Balanced (recommended)</option>
                <option value="quality">Max quality (slower, more passes)</option>
                <option value="fast">Fast (fewer passes)</option>
              </select>
            </div>
          </div>
        </div>

        <div id="reducer-progress-wrap" style="display:none; margin-bottom:1.25rem; background:rgba(20,20,30,0.7); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <span style="font-size:0.85rem; color:#fff; font-weight:600;" id="reducer-progress-title">Shrinking…</span>
            <span id="reducer-progress-pct" style="font-size:0.85rem; color:#86efac; font-weight:700;">0%</span>
          </div>
          <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
            <div id="reducer-progress-bar" style="width:0%; height:100%; background:linear-gradient(90deg, #22c55e, #38bdf8); border-radius:3px; transition:width 0.3s ease;"></div>
          </div>
          <div id="reducer-progress-msg" style="font-size:0.78rem; color:var(--text-muted); margin-top:0.4rem;">Analyzing…</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(20,20,30,0.6); padding:1rem 1.25rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.06);">
          <div>
            <div style="font-size:0.85rem; color:var(--text-muted);">Original: <span id="reducer-orig-size" style="color:#fff; font-weight:600;">-</span> <span id="reducer-orig-dims" style="color:#fff; font-weight:600;"></span></div>
            <div id="reducer-verdict" style="font-size:0.85rem; color:#c084fc; margin-top:0.2rem;">Drop a video or image to analyze</div>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" id="reducer-reset-btn">↺ Reset</button>
            <button class="btn btn-primary" id="reducer-process-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
              Shrink to target & Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  let targetMB = 25;
  let currentFile = null;
  let currentKind = null; // 'image' | 'video'
  let currentImg = null;
  let currentVideoURL = null;
  let currentVideoMeta = null;
  let lastResultBlob = null;
  let lastResultName = '';

  const dropzone = container.querySelector('#reducer-dropzone');
  const fileInput = container.querySelector('#reducer-file-input');
  const editor = container.querySelector('#reducer-editor');
  const origPreview = container.querySelector('#reducer-orig-preview');
  const resultPreview = container.querySelector('#reducer-result-preview');
  const origInfo = container.querySelector('#reducer-orig-info');
  const resultInfo = container.querySelector('#reducer-result-info');
  const origSizeEl = container.querySelector('#reducer-orig-size');
  const origDimsEl = container.querySelector('#reducer-orig-dims');
  const verdictEl = container.querySelector('#reducer-verdict');
  const processBtn = container.querySelector('#reducer-process-btn');
  const resetBtn = container.querySelector('#reducer-reset-btn');
  const progressWrap = container.querySelector('#reducer-progress-wrap');
  const progressTitle = container.querySelector('#reducer-progress-title');
  const progressBar = container.querySelector('#reducer-progress-bar');
  const progressPct = container.querySelector('#reducer-progress-pct');
  const progressMsg = container.querySelector('#reducer-progress-msg');
  const imgFormatSel = container.querySelector('#reducer-img-format');
  const vidFormatSel = container.querySelector('#reducer-vid-format');
  const modeSel = container.querySelector('#reducer-mode');

  container.querySelectorAll('.reducer-target-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.reducer-target-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      targetMB = parseFloat(btn.dataset.mb);
      updateVerdict();
      if (window.showToast) window.showToast(`Target set to ${targetMB} MB`);
    });
  });

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault(); dropzone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  resetBtn.addEventListener('click', () => {
    lastResultBlob = null;
    resultPreview.innerHTML = '';
    resultInfo.textContent = 'Drop a file to begin';
    updateVerdict();
  });
  processBtn.addEventListener('click', onProcess);

  function handleFile(file) {
    currentFile = file;
    lastResultBlob = null;
    resultPreview.innerHTML = '';
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      if (window.showToast) window.showToast('Please drop a video or image file.');
      return;
    }
    editor.style.display = 'block';
    editor.scrollIntoView({ behavior: 'smooth' });
    if (isImage) loadImageFile(file);
    else loadVideoFile(file);
  }

  function loadImageFile(file) {
    currentKind = 'image';
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      currentImg = img;
      origPreview.innerHTML = `<img src="${url}" alt="Original" style="max-width:100%; max-height:220px; border-radius:8px;" />`;
      origInfo.textContent = `${img.width} × ${img.height} px • ${file.type || 'image'} • ${formatBytes(file.size)}`;
      origSizeEl.textContent = formatBytes(file.size);
      origDimsEl.textContent = `• ${img.width} × ${img.height} px`;
      resultInfo.textContent = 'Ready — click Shrink to target';
      updateVerdict();
    };
    img.src = url;
  }

  function loadVideoFile(file) {
    currentKind = 'video';
    if (currentVideoURL) URL.revokeObjectURL(currentVideoURL);
    currentVideoURL = URL.createObjectURL(file);
    origPreview.innerHTML = `<video src="${currentVideoURL}" controls muted playsinline style="max-width:100%; max-height:220px; border-radius:8px; background:#000;"></video>`;
    const probe = document.createElement('video');
    probe.muted = true;
    probe.preload = 'metadata';
    probe.src = currentVideoURL;
    probe.onloadedmetadata = () => {
      currentVideoMeta = { w: probe.videoWidth, h: probe.videoHeight, duration: probe.duration || 0 };
      origInfo.textContent = `${probe.videoWidth} × ${probe.videoHeight} px • ${currentVideoMeta.duration.toFixed(1)}s • ${formatBytes(file.size)}`;
      origSizeEl.textContent = formatBytes(file.size);
      origDimsEl.textContent = `• ${probe.videoWidth}×${probe.videoHeight} • ${currentVideoMeta.duration.toFixed(1)}s`;
      resultInfo.textContent = 'Ready — click Shrink to target';
      updateVerdict();
    };
  }

  function updateVerdict() {
    if (!currentFile) return;
    const targetBytes = targetMB * 1024 * 1024;
    if (currentFile.size <= targetBytes) {
      verdictEl.textContent = `✓ Already under ${targetMB} MB — shrinking will re-optimize without quality loss where possible.`;
      verdictEl.style.color = '#86efac';
    } else {
      const ratio = (currentFile.size / targetBytes).toFixed(1);
      verdictEl.textContent = `Needs ${ratio}× reduction to reach ${targetMB} MB — max-fidelity fit will be computed.`;
      verdictEl.style.color = '#fbbf24';
    }
  }

  function setProgress(pct, msg, title) {
    progressWrap.style.display = 'block';
    progressBar.style.width = pct + '%';
    progressPct.textContent = Math.round(pct) + '%';
    if (msg) progressMsg.textContent = msg;
    if (title) progressTitle.textContent = title;
  }

  async function onProcess() {
    if (!currentFile) return;
    processBtn.disabled = true;
    try {
      if (currentKind === 'image') await shrinkImage();
      else await shrinkVideo();
    } catch (err) {
      console.error(err);
      setProgress(0, 'Failed: ' + (err.message || err), 'Error');
      if (window.showToast) window.showToast('Shrink failed: ' + (err.message || err));
    } finally {
      processBtn.disabled = false;
    }
  }

  // ---------- IMAGE PATH ----------
  function drawImageToCanvas(img, w, h, format) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    const ctx = c.getContext('2d');
    if (format === 'image/jpeg') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  function canvasToBlob(canvas, format, quality) {
    return new Promise((res, rej) => {
      canvas.toBlob((b) => b ? res(b) : rej(new Error('Encode failed')), format, quality);
    });
  }

  async function shrinkImage() {
    const targetBytes = targetMB * 1024 * 1024;
    const mode = modeSel.value;
    const maxPasses = mode === 'fast' ? 6 : mode === 'quality' ? 14 : 10;
    setProgress(5, 'Analyzing image…', 'Shrinking image…');

    // Already fits? still re-encode at high quality to normalize, but keep original if smaller
    const pref = imgFormatSel.value;
    const candidates = pref === 'auto'
      ? ['image/webp', 'image/jpeg', 'image/png']
      : [pref];

    let best = null;

    // Pass 1: try lossless / high-quality at FULL resolution first (originality first)
    for (const fmt of candidates) {
      if (fmt === 'image/png') {
        const c = drawImageToCanvas(currentImg, currentImg.width, currentImg.height, fmt);
        const blob = await canvasToBlob(c, fmt);
        setProgress(20, `Trying PNG at full resolution: ${formatBytes(blob.size)}…`);
        if (blob.size <= targetBytes && (!best || blob.size > best.blob.size)) {
          // PNG fits — keep it only if it is the largest fitting (max fidelity); continue searching
          best = { blob, w: c.width, h: c.height, format: fmt, quality: 1, scale: 1 };
        }
        if (best && pref !== 'auto') break;
      }
    }

    // Pass 2: binary-search quality at full resolution for lossy formats
    const lossy = candidates.filter(f => f !== 'image/png');
    for (const fmt of lossy) {
      let lo = 0.35, hi = 0.95, localBest = best;
      for (let i = 0; i < maxPasses; i++) {
        const q = (lo + hi) / 2;
        const c = drawImageToCanvas(currentImg, currentImg.width, currentImg.height, fmt);
        const blob = await canvasToBlob(c, fmt, q);
        setProgress(20 + (i / maxPasses) * 40, `${fmt.split('/')[1].toUpperCase()} q=${Math.round(q * 100)} → ${formatBytes(blob.size)}…`);
        await tick();
        if (blob.size <= targetBytes) {
          localBest = { blob, w: c.width, h: c.height, format: fmt, quality: q, scale: 1 };
          lo = q; // try higher quality
        } else {
          hi = q;
        }
        if (hi - lo < 0.02) break;
      }
      if (localBest && (!best || localBest.blob.size > best.blob.size)) best = localBest;
      if (best && best.scale === 1 && best.blob.size > targetBytes * 0.85) break; // great fit already
    }

    // Pass 3: only if nothing fits at full res — step down scale minimally (0.9, 0.8, … 0.3)
    if (!best) {
      const scales = mode === 'fast' ? [0.85, 0.7, 0.5, 0.35] : [0.92, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35];
      const fmt = lossy[0] || 'image/webp';
      outer: for (const s of scales) {
        const w = currentImg.width * s, h = currentImg.height * s;
        let lo = 0.5, hi = 0.92;
        for (let i = 0; i < 5; i++) {
          const q = (lo + hi) / 2;
          const c = drawImageToCanvas(currentImg, w, h, fmt);
          const blob = await canvasToBlob(c, fmt, q);
          setProgress(60 + s * 10, `Scale ${Math.round(s * 100)}% q=${Math.round(q * 100)} → ${formatBytes(blob.size)}…`);
          await tick();
          if (blob.size <= targetBytes) {
            best = { blob, w: c.width, h: c.height, format: fmt, quality: q, scale: s };
            break outer; // first (largest) scale that fits wins → max originality
          } else hi = q;
          if (hi - lo < 0.03) break;
        }
      }
    }

    if (!best) throw new Error('Could not fit under target even at minimum scale. Try a larger target.');

    finishImageResult(best, targetBytes);
  }

  function finishImageResult(best, targetBytes) {
    lastResultBlob = best.blob;
    const ext = best.format === 'image/webp' ? 'webp' : best.format === 'image/png' ? 'png' : 'jpg';
    const base = (currentFile.name || 'image').replace(/\.[^/.]+$/, '');
    lastResultName = `${base}-${targetMB}mb-${best.w}x${best.h}.${ext}`;
    const url = URL.createObjectURL(best.blob);
    resultPreview.innerHTML = `<img src="${url}" alt="Result" style="max-width:100%; max-height:220px; border-radius:8px;" />`;
    const saved = currentFile.size - best.blob.size;
    const pct = currentFile.size ? Math.max(0, Math.round((saved / currentFile.size) * 100)) : 0;
    resultInfo.textContent = `${best.w} × ${best.h} px • ${formatBytes(best.blob.size)} • ${best.format.split('/')[1].toUpperCase()} q=${Math.round(best.quality * 100)}${best.scale < 1 ? ` • scale ${Math.round(best.scale * 100)}%` : ' • full resolution kept'}`;
    verdictEl.textContent = `✓ ${formatBytes(best.blob.size)} / ${targetMB} MB — saved ${formatBytes(Math.max(0, saved))} (${pct}%)${best.scale === 1 ? ' • resolution untouched' : ''}`;
    verdictEl.style.color = '#86efac';
    setProgress(100, `Done — ${formatBytes(best.blob.size)} fits in ${targetMB} MB.`, 'Done ✓');
    downloadBlob(best.blob, lastResultName);
    if (window.showToast) window.showToast(`Shrunk to ${formatBytes(best.blob.size)} (${pct}% smaller)`);
    setTimeout(() => { progressWrap.style.display = 'none'; }, 2500);
  }

  // ---------- VIDEO PATH ----------
  // Re-encode via video.captureStream() (keeps audio in Chromium) else canvas fallback.
  async function shrinkVideo() {
    const targetBytes = targetMB * 1024 * 1024;
    if (!currentVideoMeta || !currentVideoMeta.duration) throw new Error('Video metadata not ready — wait a second and retry.');
    if (currentFile.size <= targetBytes) {
      // Already portable: offer direct download, no quality loss at all
      setProgress(100, 'Already under target — no re-encode needed.', 'Already portable ✓');
      resultPreview.innerHTML = `<video src="${currentVideoURL}" controls muted playsinline style="max-width:100%; max-height:220px; border-radius:8px; background:#000;"></video>`;
      resultInfo.textContent = `${formatBytes(currentFile.size)} — already ≤ ${targetMB} MB, original kept 100%`;
      verdictEl.textContent = `✓ Already portable (${formatBytes(currentFile.size)} ≤ ${targetMB} MB). Downloaded original untouched.`;
      verdictEl.style.color = '#86efac';
      downloadBlob(currentFile, currentFile.name || `video-${targetMB}mb`);
      setTimeout(() => { progressWrap.style.display = 'none'; }, 2500);
      return;
    }

    const duration = currentVideoMeta.duration;
    // usable bytes minus container overhead safety margin
    const usableBytes = targetBytes * 0.94;
    const targetTotalBps = Math.floor((usableBytes * 8) / duration);
    const mode = modeSel.value;
    const mimePref = vidFormatSel.value;
    const mimeCandidates = mimePref === 'video/mp4'
      ? ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    const mime = mimeCandidates.find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
    if (!mime) throw new Error('This browser cannot re-encode video (MediaRecorder unsupported).');

    const scales = mode === 'fast' ? [1, 0.7, 0.5] : mode === 'quality' ? [1, 0.9, 0.8, 0.7, 0.6, 0.5] : [1, 0.85, 0.7, 0.55];
    let attempt = 0;

    for (const scale of scales) {
      attempt++;
      // Bitrate ladder: try full target first (max fidelity), then 80%, 60%
      const bpsLadder = [targetTotalBps, Math.floor(targetTotalBps * 0.8), Math.floor(targetTotalBps * 0.6)];
      for (const bps of bpsLadder) {
        const w = Math.round((currentVideoMeta.w * scale) / 2) * 2;
        const h = Math.round((currentVideoMeta.h * scale) / 2) * 2;
        setProgress(5 + (attempt / (scales.length + 1)) * 70, `Pass ${attempt}: ${w}×${h} @ ${formatBitrate(bps)}…`, 'Re-encoding video…');
        try {
          const blob = await reencodeVideo(currentVideoURL, w, h, mime, Math.max(200000, bps));
          setProgress(85, `Pass ${attempt} produced ${formatBytes(blob.size)} (target ≤ ${formatBytes(targetBytes)})…`);
          if (blob.size <= targetBytes) {
            return finishVideoResult(blob, mime, w, h, scale === 1);
          }
        } catch (e) {
          console.warn('Re-encode pass failed:', e);
          setProgress(30, `Pass ${attempt} failed, trying smaller…`);
        }
      }
    }
    throw new Error('Could not fit video under target with in-browser encoder. Try 50 MB target or a shorter clip.');
  }

  function reencodeVideo(srcURL, outW, outH, mime, videoBitsPerSecond) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';
      video.src = srcURL;
      const cleanup = () => { try { video.pause(); } catch (_) {} };

      video.onloadedmetadata = async () => {
        try {
          video.currentTime = 0;
          await video.play().catch(() => {});
          // Prefer element captureStream (keeps audio track where supported)
          let stream = null;
          if (typeof video.captureStream === 'function') stream = video.captureStream();
          else if (typeof video.mozCaptureStream === 'function') stream = video.mozCaptureStream();
          if (!stream) throw new Error('captureStream unavailable');

          // If downscaling, route through canvas for resolution control; else use raw stream
          let recStream = stream;
          let rafId = 0;
          let canvas = null;
          const needsScale = outW !== video.videoWidth || outH !== video.videoHeight;
          if (needsScale) {
            canvas = document.createElement('canvas');
            canvas.width = outW; canvas.height = outH;
            const ctx = canvas.getContext('2d');
            const draw = () => {
              try { ctx.drawImage(video, 0, 0, outW, outH); } catch (_) {}
              rafId = requestAnimationFrame(draw);
            };
            draw();
            const canvasStream = canvas.captureStream(30);
            // keep audio tracks from original stream
            stream.getAudioTracks().forEach(t => canvasStream.addTrack(t));
            recStream = canvasStream;
          }

          const chunks = [];
          const rec = new MediaRecorder(recStream, { mimeType: mime, videoBitsPerSecond });
          rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
          rec.onerror = (e) => { cancelAnimationFrame(rafId); cleanup(); reject(e.error || new Error('Recorder error')); };
          rec.onstop = () => {
            cancelAnimationFrame(rafId); cleanup();
            resolve(new Blob(chunks, { type: mime.split(';')[0] }));
          };
          video.currentTime = 0;
          await video.play().catch(() => {});
          rec.start(500);
          video.onended = () => { try { rec.stop(); } catch (_) {} };
          // Safety timeout: duration + 15s
          const timeout = setTimeout(() => { try { rec.stop(); } catch (_) {} }, ((video.duration || 10) + 15) * 1000);
          const origStop = rec.onstop;
          rec.onstop = (ev) => { clearTimeout(timeout); origStop(ev); };
        } catch (err) { cleanup(); reject(err); }
      };
      video.onerror = () => reject(new Error('Could not decode this video in-browser.'));
    });
  }

  function finishVideoResult(blob, mime, w, h, keptRes) {
    lastResultBlob = blob;
    const ext = mime.includes('mp4') ? 'mp4' : 'webm';
    const base = (currentFile.name || 'video').replace(/\.[^/.]+$/, '');
    lastResultName = `${base}-${targetMB}mb-${w}x${h}.${ext}`;
    const url = URL.createObjectURL(blob);
    resultPreview.innerHTML = `<video src="${url}" controls muted playsinline style="max-width:100%; max-height:220px; border-radius:8px; background:#000;"></video>`;
    const saved = currentFile.size - blob.size;
    const pct = Math.max(0, Math.round((saved / currentFile.size) * 100));
    resultInfo.textContent = `${w} × ${h} px • ${formatBytes(blob.size)} • ${ext.toUpperCase()}${keptRes ? ' • resolution untouched' : ''}`;
    verdictEl.textContent = `✓ ${formatBytes(blob.size)} / ${targetMB} MB — saved ${pct}%${keptRes ? ' • original resolution kept' : ' • resolution reduced only to fit'}`;
    verdictEl.style.color = '#86efac';
    setProgress(100, `Done — ${formatBytes(blob.size)} fits in ${targetMB} MB.`, 'Done ✓');
    downloadBlob(blob, lastResultName);
    if (window.showToast) window.showToast(`Video shrunk to ${formatBytes(blob.size)}`);
    setTimeout(() => { progressWrap.style.display = 'none'; }, 2500);
  }

  function downloadBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  }

  function tick() { return new Promise(r => setTimeout(r, 30)); }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatBitrate(bps) {
    if (bps >= 1000000) return (bps / 1000000).toFixed(1) + ' Mbps';
    return Math.round(bps / 1000) + ' kbps';
  }
}
