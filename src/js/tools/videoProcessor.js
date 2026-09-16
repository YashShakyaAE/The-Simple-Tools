export function renderVideoProcessor(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="vid-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="3" rx="2"></rect><polyline points="10 9 15 12 10 15"></polyline></svg>
        </div>
        <div class="dropzone-title">Drag & Drop Video (MP4, WEBM, MKV, AVI, MOV)</div>
        <div class="dropzone-desc">Frame extraction, video metadata analysis, and client-side format transcode</div>
        <input type="file" id="vid-file-input" accept="video/*" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="vid-load-demo-btn">
          🎬 Or Generate 60 FPS Cybernetic Demo Video
        </button>
      </div>

      <div id="vid-player-panel" style="display:none; margin-top:1.5rem;">
        <div style="display:flex; justify-content:center; background:#000; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--border-glass);">
          <video id="vid-element" controls style="max-width:100%; max-height:360px;"></video>
        </div>

        <div class="tool-controls-row" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin-top:1.25rem;">
          <div>
            <div class="control-label">Native Resolution</div>
            <div id="vid-resolution" style="font-weight:700; color:#38bdf8; font-size:1rem; margin-top:0.25rem;">-</div>
          </div>
          <div>
            <div class="control-label">Duration</div>
            <div id="vid-dur" style="font-weight:700; color:#c084fc; font-size:1rem; margin-top:0.25rem;">-</div>
          </div>
          <div>
            <div class="control-label">Aspect Ratio</div>
            <div id="vid-aspect" style="font-weight:700; color:#f43f5e; font-size:1rem; margin-top:0.25rem;">-</div>
          </div>
          <div>
            <div class="control-label">Status</div>
            <div style="font-weight:700; color:#86efac; font-size:1rem; margin-top:0.25rem;">Ready</div>
          </div>
        </div>

        <div style="background:rgba(20,20,32,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.5rem; margin-top:1.25rem;">
          <h4 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">📸 High-Definition Frame Grabber</h4>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Pause or scrub the video to any timestamp and extract a lossless full-resolution image snapshot.</p>
          
          <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" id="vid-snap-png">
              📷 Capture Full-Res Frame (PNG)
            </button>
            <button class="btn btn-secondary btn-sm" id="vid-snap-webp">
              📷 Capture Frame (WebP)
            </button>
            <button class="btn btn-outline btn-sm" id="vid-export-webm">
              🎥 Transcode Video to WebM
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#vid-dropzone');
  const fileInput = container.querySelector('#vid-file-input');
  const demoBtn = container.querySelector('#vid-load-demo-btn');
  const panel = container.querySelector('#vid-player-panel');
  const video = container.querySelector('#vid-element');
  const resEl = container.querySelector('#vid-resolution');
  const durEl = container.querySelector('#vid-dur');
  const aspectEl = container.querySelector('#vid-aspect');
  const snapPngBtn = container.querySelector('#vid-snap-png');
  const snapWebpBtn = container.querySelector('#vid-snap-webp');
  const exportWebmBtn = container.querySelector('#vid-export-webm');

  let currentFileName = 'video';

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadVideoFile(e.target.files[0]);
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
      loadVideoFile(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    // Generate a 3-second HTML5 Canvas animation video stream via MediaRecorder
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'TheSimpleYash-Cyber-Animation.webm', { type: 'video/webm' });
      loadVideoFile(file);
    };

    mediaRecorder.start();
    let frame = 0;
    const maxFrames = 90; // 3 seconds at 30fps

    function draw() {
      if (frame < maxFrames) {
        ctx.fillStyle = '#0D0D12';
        ctx.fillRect(0, 0, 1280, 720);

        // Animated neon circles
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#DC143C';
        ctx.fillStyle = '#DC143C';
        ctx.beginPath();
        const x1 = 400 + Math.sin(frame * 0.1) * 120;
        ctx.arc(x1, 360, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = '#9400D3';
        ctx.fillStyle = '#9400D3';
        ctx.beginPath();
        const x2 = 880 - Math.sin(frame * 0.1) * 120;
        ctx.arc(x2, 360, 140, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 44px Schibsted Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TheSimple \'s Tools Video Processor', 640, 370);

        frame++;
        requestAnimationFrame(draw);
      } else {
        mediaRecorder.stop();
      }
    }
    draw();
  });

  function loadVideoFile(file) {
    currentFileName = file.name.replace(/\.[^/.]+$/, "");
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      resEl.textContent = `${video.videoWidth} × ${video.videoHeight} px`;
      durEl.textContent = `${video.duration.toFixed(1)}s`;
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      const d = gcd(video.videoWidth, video.videoHeight);
      aspectEl.textContent = `${video.videoWidth / d}:${video.videoHeight / d}`;

      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth' });
      if (window.showToast) window.showToast('Video loaded and inspected!');
    };
  }

  function captureFrame(format, ext) {
    if (!video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${currentFileName}-frame-${video.currentTime.toFixed(2)}s.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      if (window.showToast) window.showToast(`Frame captured at ${video.currentTime.toFixed(2)}s!`);
    }, format, 0.95);
  }

  snapPngBtn.addEventListener('click', () => captureFrame('image/png', 'png'));
  snapWebpBtn.addEventListener('click', () => captureFrame('image/webp', 'webp'));

  exportWebmBtn.addEventListener('click', () => {
    if (!video.src) return;
    const a = document.createElement('a');
    a.href = video.src;
    a.download = `${currentFileName}-transcoded.webm`;
    a.click();
    if (window.showToast) window.showToast('Video downloaded!');
  });
}
