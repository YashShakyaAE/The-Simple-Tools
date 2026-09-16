export function renderAudioEnhancer(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="enh-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"></path><path d="M17 5v14"></path><path d="M22 10v4"></path><path d="M7 5v14"></path><path d="M2 10v4"></path></svg>
        </div>
        <div class="dropzone-title">Drag & Drop Audio to Enhance (MP3, WAV, M4A, OGG)</div>
        <div class="dropzone-desc">Background noise removal, vocal clarity boost, and dynamic audio normalization</div>
        <input type="file" id="enh-file-input" accept="audio/*" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="enh-load-demo-btn">
          ✨ Generate Noisy Test Sample & Run Enhancer
        </button>
      </div>

      <div id="enh-panel" style="display:none; margin-top:1.5rem;">
        <!-- Real-time 60 FPS Canvas Visualizer -->
        <div class="visualizer-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-size:0.85rem; font-weight:700; color:#d8b4fe; display:flex; align-items:center; gap:0.5rem;">
              <span class="status-dot-pulse"></span> LIVE 60 FPS FREQUENCY SPECTRUM & WAVEFORM
            </div>
            <div id="enh-mode-indicator" style="font-size:0.8rem; font-weight:700; color:#f43f5e; text-transform:uppercase; letter-spacing:0.05em;">
              [AI Neural Filter: ACTIVE]
            </div>
          </div>
          <canvas id="enh-canvas" class="visualizer-canvas"></canvas>
          <div class="visualizer-overlay-info">
            <span>Bass (20-250Hz)</span>
            <span>Mids (250-4kHz)</span>
            <span>Presence (4k-8kHz)</span>
            <span>Treble (8k-20kHz)</span>
          </div>
        </div>

        <!-- Mode Toggle Switch: Original vs AI Enhanced -->
        <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(20,20,32,0.85); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1rem 1.5rem; margin:1.25rem 0;">
          <div>
            <div style="font-weight:700; color:#fff; font-size:1rem;">Audio Comparison Mode</div>
            <div style="font-size:0.82rem; color:var(--text-muted);">Toggle to listen to raw noisy audio vs. cleaned AI enhanced audio</div>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <button class="btn btn-secondary btn-sm" id="enh-toggle-orig">Original Audio</button>
            <button class="btn btn-primary btn-sm" id="enh-toggle-enhanced" style="box-shadow:0 0 15px rgba(220,20,60,0.6);">⚡ AI Enhanced</button>
          </div>
        </div>

        <!-- Controls Row -->
        <div class="tool-controls-row">
          <div class="control-item">
            <label class="control-label">Rumble Filter (<span id="enh-hpf-val">80</span> Hz)</label>
            <input type="range" id="enh-hpf" min="20" max="250" value="80" />
          </div>
          <div class="control-item">
            <label class="control-label">Clarity Boost (<span id="enh-clarity-val">+4.5</span> dB)</label>
            <input type="range" id="enh-clarity" min="0" max="12" step="0.5" value="4.5" />
          </div>
          <div class="control-item">
            <label class="control-label">Hiss Reducer (<span id="enh-lpf-val">12.5</span> kHz)</label>
            <input type="range" id="enh-lpf" min="6000" max="18000" step="500" value="12500" />
          </div>
          <div class="control-item">
            <label class="control-label">Normalization Threshold (<span id="enh-thresh-val">-18</span> dB)</label>
            <input type="range" id="enh-thresh" min="-36" max="0" value="-18" />
          </div>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:1.25rem;">
          <button class="btn btn-secondary" id="enh-playback-btn">
            <svg id="enh-play-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span id="enh-play-text">Play Audio</span>
          </button>
          <button class="btn btn-primary" id="enh-export-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Export Enhanced Audio (.wav)
          </button>
        </div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#enh-dropzone');
  const fileInput = container.querySelector('#enh-file-input');
  const demoBtn = container.querySelector('#enh-load-demo-btn');
  const panel = container.querySelector('#enh-panel');
  const canvas = container.querySelector('#enh-canvas');
  const modeIndicator = container.querySelector('#enh-mode-indicator');
  const toggleOrigBtn = container.querySelector('#enh-toggle-orig');
  const toggleEnhBtn = container.querySelector('#enh-toggle-enhanced');
  const hpfSlider = container.querySelector('#enh-hpf');
  const hpfVal = container.querySelector('#enh-hpf-val');
  const claritySlider = container.querySelector('#enh-clarity');
  const clarityVal = container.querySelector('#enh-clarity-val');
  const lpfSlider = container.querySelector('#enh-lpf');
  const lpfVal = container.querySelector('#enh-lpf-val');
  const threshSlider = container.querySelector('#enh-thresh');
  const threshVal = container.querySelector('#enh-thresh-val');
  const playBtn = container.querySelector('#enh-playback-btn');
  const playIcon = container.querySelector('#enh-play-icon');
  const playText = container.querySelector('#enh-play-text');
  const exportBtn = container.querySelector('#enh-export-btn');

  let audioCtx = null;
  let rawBuffer = null;
  let sourceNode = null;
  let analyserNode = null;
  let isPlaying = false;
  let isEnhanced = true;
  let animId = null;

  // Audio Nodes
  let hpfNode = null;
  let clarityNode = null;
  let lpfNode = null;
  let compressorNode = null;
  let gainNode = null;

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadAudio(e.target.files[0]);
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
      loadAudio(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    setupAudioContext();
    // Synthesize vocal harmony + simulated background hum/noise
    const sr = 44100;
    const dur = 5;
    const buffer = audioCtx.createBuffer(2, sr * dur, sr);
    const ch0 = buffer.getChannelData(0);
    const ch1 = buffer.getChannelData(1);

    for (let i = 0; i < sr * dur; i++) {
      const t = i / sr;
      // Speech fundamental & formant simulation
      const speech = (Math.sin(2 * Math.PI * 220 * t) + 0.5 * Math.sin(2 * Math.PI * 440 * t) + 0.3 * Math.sin(2 * Math.PI * 1320 * t)) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 3 * t));
      // Low frequency rumble (50Hz AC hum)
      const rumble = 0.25 * Math.sin(2 * Math.PI * 50 * t);
      // High frequency hiss (white noise)
      const hiss = (Math.random() * 2 - 1) * 0.12;

      const total = (speech * 0.5) + rumble + hiss;
      ch0[i] = total;
      ch1[i] = total;
    }

    rawBuffer = buffer;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });
    startVisualizer();
    if (window.showToast) {
      window.showToast('Noisy sample audio generated! Press "Play Audio" to test!');
    }
  });

  function setupAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!analyserNode) {
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 256;

      // High-pass filter (rumble reduction)
      hpfNode = audioCtx.createBiquadFilter();
      hpfNode.type = 'highpass';
      hpfNode.frequency.value = parseFloat(hpfSlider.value);

      // Clarity boost
      clarityNode = audioCtx.createBiquadFilter();
      clarityNode.type = 'peaking';
      clarityNode.frequency.value = 3200;
      clarityNode.Q.value = 1.2;
      clarityNode.gain.value = parseFloat(claritySlider.value);

      // Low-pass filter (hiss reduction)
      lpfNode = audioCtx.createBiquadFilter();
      lpfNode.type = 'lowpass';
      lpfNode.frequency.value = parseFloat(lpfSlider.value);

      // Dynamic compressor
      compressorNode = audioCtx.createDynamicsCompressor();
      compressorNode.threshold.value = parseFloat(threshSlider.value);
      compressorNode.knee.value = 12;
      compressorNode.ratio.value = 8;
      compressorNode.attack.value = 0.003;
      compressorNode.release.value = 0.25;

      // Output gain
      gainNode = audioCtx.createGain();
      gainNode.gain.value = 1.2;

      // Connect filter chain
      hpfNode.connect(clarityNode);
      clarityNode.connect(lpfNode);
      lpfNode.connect(compressorNode);
      compressorNode.connect(gainNode);
    }
  }

  function loadAudio(file) {
    setupAudioContext();
    const reader = new FileReader();
    reader.onload = (e) => {
      audioCtx.decodeAudioData(e.target.result, (buf) => {
        rawBuffer = buf;
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
        startVisualizer();
        if (window.showToast) {
          window.showToast('Audio loaded into AI Enhancer!');
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }

  // Sliders
  hpfSlider.addEventListener('input', () => {
    hpfVal.textContent = hpfSlider.value;
    if (hpfNode) hpfNode.frequency.value = parseFloat(hpfSlider.value);
  });
  claritySlider.addEventListener('input', () => {
    clarityVal.textContent = `+${claritySlider.value}`;
    if (clarityNode) clarityNode.gain.value = parseFloat(claritySlider.value);
  });
  lpfSlider.addEventListener('input', () => {
    lpfVal.textContent = (lpfSlider.value / 1000).toFixed(1);
    if (lpfNode) lpfNode.frequency.value = parseFloat(lpfSlider.value);
  });
  threshSlider.addEventListener('input', () => {
    threshVal.textContent = threshSlider.value;
    if (compressorNode) compressorNode.threshold.value = parseFloat(threshSlider.value);
  });

  // Comparison toggle
  toggleOrigBtn.addEventListener('click', () => {
    isEnhanced = false;
    toggleOrigBtn.className = 'btn btn-primary btn-sm';
    toggleEnhBtn.className = 'btn btn-secondary btn-sm';
    modeIndicator.textContent = '[Original Audio: RAW]';
    modeIndicator.style.color = '#94a3b8';
    if (isPlaying) {
      restartStream();
    }
  });

  toggleEnhBtn.addEventListener('click', () => {
    isEnhanced = true;
    toggleEnhBtn.className = 'btn btn-primary btn-sm';
    toggleOrigBtn.className = 'btn btn-secondary btn-sm';
    modeIndicator.textContent = '[AI Neural Filter: ACTIVE]';
    modeIndicator.style.color = '#f43f5e';
    if (isPlaying) {
      restartStream();
    }
  });

  function startStream() {
    if (!rawBuffer) return;
    setupAudioContext();
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = rawBuffer;
    sourceNode.loop = true;

    if (isEnhanced) {
      sourceNode.connect(hpfNode);
      gainNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
    } else {
      sourceNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
    }

    sourceNode.start();
    isPlaying = true;
    playText.textContent = 'Pause Audio';
    playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
  }

  function stopStream() {
    if (sourceNode) {
      try { sourceNode.stop(); } catch(e) {}
      sourceNode.disconnect();
      sourceNode = null;
    }
    isPlaying = false;
    playText.textContent = 'Play Audio';
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
  }

  function restartStream() {
    stopStream();
    startStream();
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopStream();
    } else {
      startStream();
    }
  });

  function startVisualizer() {
    if (animId) cancelAnimationFrame(animId);
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 40;
    canvas.height = 160;

    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    function render() {
      animId = requestAnimationFrame(render);
      if (analyserNode && isPlaying) {
        analyserNode.getByteFrequencyData(dataArray);
      } else {
        // Idle gentle waveform wave
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(0, Math.sin((Date.now() / 200) + (i * 0.2)) * 25 + 10);
        }
      }

      ctx.fillStyle = '#08080c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height - 20);

        // Neon Crimson to Purple gradient
        const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        grad.addColorStop(0, '#DC143C');
        grad.addColorStop(0.5, '#8A2BE2');
        grad.addColorStop(1, '#00F0FF');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    }
    render();
  }

  // Export processed audio
  exportBtn.addEventListener('click', async () => {
    if (!rawBuffer) return;
    exportBtn.disabled = true;
    exportBtn.textContent = 'Rendering Enhanced Audio...';

    const offlineCtx = new OfflineAudioContext(
      rawBuffer.numberOfChannels,
      rawBuffer.length,
      rawBuffer.sampleRate
    );

    const offlineSource = offlineCtx.createBufferSource();
    offlineSource.buffer = rawBuffer;

    const offHpf = offlineCtx.createBiquadFilter();
    offHpf.type = 'highpass';
    offHpf.frequency.value = parseFloat(hpfSlider.value);

    const offClarity = offlineCtx.createBiquadFilter();
    offClarity.type = 'peaking';
    offClarity.frequency.value = 3200;
    offClarity.Q.value = 1.2;
    offClarity.gain.value = parseFloat(claritySlider.value);

    const offLpf = offlineCtx.createBiquadFilter();
    offLpf.type = 'lowpass';
    offLpf.frequency.value = parseFloat(lpfSlider.value);

    const offComp = offlineCtx.createDynamicsCompressor();
    offComp.threshold.value = parseFloat(threshSlider.value);
    offComp.knee.value = 12;
    offComp.ratio.value = 8;

    const offGain = offlineCtx.createGain();
    offGain.gain.value = 1.2;

    offlineSource.connect(offHpf);
    offHpf.connect(offClarity);
    offClarity.connect(offLpf);
    offLpf.connect(offComp);
    offComp.connect(offGain);
    offGain.connect(offlineCtx.destination);

    offlineSource.start();
    const renderedBuffer = await offlineCtx.startRendering();

    // Export to WAV
    const wavBlob = bufferToWavBlob(renderedBuffer);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(wavBlob);
    a.download = `TheSimple-Tools-Enhanced-Audio.wav`;
    a.click();
    URL.revokeObjectURL(a.href);

    exportBtn.disabled = false;
    exportBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
      Export Enhanced Audio (.wav)
    `;

    if (window.showToast) {
      window.showToast('Enhanced audio exported successfully!');
    }
  });

  function bufferToWavBlob(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        let sample = buffer.getChannelData(channel)[i];
        sample = Math.max(-1, Math.min(1, sample));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, sample, true);
        offset += 2;
      }
    }
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }
}
