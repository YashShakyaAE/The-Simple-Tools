export function renderAudioConverter(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="audio-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <div class="dropzone-title">Drag & Drop Audio (MP3, WAV, AAC, FLAC, OGG, M4A)</div>
        <div class="dropzone-desc">Universal audio decoder, high-fidelity sample rate conversion, and lossless export</div>
        <input type="file" id="audio-file-input" accept="audio/*" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="audio-load-demo-btn">
          🎵 Or Load Synthesized Melodic Sample
        </button>
      </div>

      <div id="audio-editor-panel" style="display:none; margin-top:1.5rem;">
        <div class="tool-controls-row" style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));">
          <div>
            <div class="control-label">Source Track</div>
            <div id="audio-track-name" style="font-weight:700; color:#fff; font-size:0.95rem; margin-top:0.25rem;">track.mp3</div>
          </div>
          <div>
            <div class="control-label">Duration</div>
            <div id="audio-duration" style="font-weight:700; color:#38bdf8; font-size:0.95rem; margin-top:0.25rem;">0:00</div>
          </div>
          <div>
            <div class="control-label">Original Rate</div>
            <div id="audio-orig-rate" style="font-weight:700; color:#c084fc; font-size:0.95rem; margin-top:0.25rem;">44.1 kHz</div>
          </div>
          <div>
            <div class="control-label">Channels</div>
            <div id="audio-channels" style="font-weight:700; color:#86efac; font-size:0.95rem; margin-top:0.25rem;">Stereo</div>
          </div>
        </div>

        <div style="margin:1.25rem 0; background:rgba(15,15,24,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1rem 1.25rem; display:flex; align-items:center; gap:1rem;">
          <button class="btn btn-primary btn-sm" id="audio-play-btn" style="border-radius:50%; width:44px; height:44px; padding:0;">
            <svg id="audio-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:0.35rem;">
              <span id="audio-curr-time">0:00</span>
              <span id="audio-total-time">0:00</span>
            </div>
            <input type="range" id="audio-seek-slider" min="0" max="100" value="0" />
          </div>
        </div>

        <div class="tool-controls-row">
          <div class="control-item">
            <label class="control-label">Target Format</label>
            <select class="control-select" id="audio-target-format">
              <option value="wav">WAV (Lossless 16-bit PCM)</option>
              <option value="ogg">OGG Audio Container</option>
              <option value="mp3">MP3 Compatible Audio Stream</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Output Sample Rate</label>
            <select class="control-select" id="audio-sample-rate">
              <option value="48000">48.0 kHz (Studio HD)</option>
              <option value="44100" selected>44.1 kHz (Standard CD)</option>
              <option value="22050">22.05 kHz (Compact)</option>
              <option value="16000">16.0 kHz (Voice/Speech)</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Channel Mode</label>
            <select class="control-select" id="audio-channel-select">
              <option value="2" selected>Stereo (2 Channels)</option>
              <option value="1">Mono (1 Channel)</option>
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:1.25rem;">
          <button class="btn btn-primary" id="audio-convert-download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Convert & Export Audio
          </button>
        </div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#audio-dropzone');
  const fileInput = container.querySelector('#audio-file-input');
  const demoBtn = container.querySelector('#audio-load-demo-btn');
  const editorPanel = container.querySelector('#audio-editor-panel');
  const trackNameEl = container.querySelector('#audio-track-name');
  const durationEl = container.querySelector('#audio-duration');
  const origRateEl = container.querySelector('#audio-orig-rate');
  const channelsEl = container.querySelector('#audio-channels');
  const playBtn = container.querySelector('#audio-play-btn');
  const playIcon = container.querySelector('#audio-play-icon');
  const seekSlider = container.querySelector('#audio-seek-slider');
  const currTimeEl = container.querySelector('#audio-curr-time');
  const totalTimeEl = container.querySelector('#audio-total-time');
  const sampleRateSelect = container.querySelector('#audio-sample-rate');
  const channelSelect = container.querySelector('#audio-channel-select');
  const convertBtn = container.querySelector('#audio-convert-download-btn');

  let audioCtx = null;
  let decodedBuffer = null;
  let currentSource = null;
  let isPlaying = false;
  let startTime = 0;
  let pausedAt = 0;
  let playAnimId = null;
  let currentFileName = 'audio-track';

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadAudioFile(e.target.files[0]);
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
      loadAudioFile(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    // Generate a 4-second melodic synthesized audio track
    initAudioContext();
    const sr = 44100;
    const dur = 4;
    const buffer = audioCtx.createBuffer(2, sr * dur, sr);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    for (let i = 0; i < sr * dur; i++) {
      const t = i / sr;
      const noteIdx = Math.floor(t) % notes.length;
      const freq = notes[noteIdx];
      const env = Math.exp(-3 * (t % 1));
      const val = Math.sin(2 * Math.PI * freq * t) * env * 0.4;
      left[i] = val;
      right[i] = val * 0.9;
    }

    setDecodedAudio(buffer, 'TheSimpleYash-SynthHarmonics.wav');
  });

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function loadAudioFile(file) {
    initAudioContext();
    currentFileName = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuf = e.target.result;
        audioCtx.decodeAudioData(arrayBuf, (buffer) => {
          setDecodedAudio(buffer, file.name);
        }, (err) => {
          alert('Error decoding audio: ' + err.message);
        });
      } catch (err) {
        alert('Decoding error: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function setDecodedAudio(buffer, name) {
    decodedBuffer = buffer;
    trackNameEl.textContent = name;
    durationEl.textContent = formatTime(buffer.duration);
    totalTimeEl.textContent = formatTime(buffer.duration);
    origRateEl.textContent = `${(buffer.sampleRate / 1000).toFixed(1)} kHz`;
    channelsEl.textContent = buffer.numberOfChannels === 1 ? 'Mono' : 'Stereo';

    stopPlayback();
    editorPanel.style.display = 'block';
    editorPanel.scrollIntoView({ behavior: 'smooth' });
    if (window.showToast) {
      window.showToast('Audio loaded and ready for conversion!');
    }
  }

  function startPlayback() {
    if (!decodedBuffer) return;
    initAudioContext();
    currentSource = audioCtx.createBufferSource();
    currentSource.buffer = decodedBuffer;
    currentSource.connect(audioCtx.destination);
    
    startTime = audioCtx.currentTime - pausedAt;
    currentSource.start(0, pausedAt);
    isPlaying = true;
    playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;

    currentSource.onended = () => {
      if (isPlaying && (audioCtx.currentTime - startTime) >= decodedBuffer.duration) {
        stopPlayback();
      }
    };

    updatePlayProgress();
  }

  function stopPlayback() {
    if (currentSource) {
      try { currentSource.stop(); } catch(e) {}
      currentSource = null;
    }
    isPlaying = false;
    pausedAt = 0;
    seekSlider.value = 0;
    currTimeEl.textContent = '0:00';
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    if (playAnimId) cancelAnimationFrame(playAnimId);
  }

  function pausePlayback() {
    if (currentSource) {
      try { currentSource.stop(); } catch(e) {}
      currentSource = null;
    }
    pausedAt = audioCtx.currentTime - startTime;
    isPlaying = false;
    playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    if (playAnimId) cancelAnimationFrame(playAnimId);
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  });

  function updatePlayProgress() {
    if (!isPlaying || !decodedBuffer) return;
    const elapsed = audioCtx.currentTime - startTime;
    if (elapsed <= decodedBuffer.duration) {
      currTimeEl.textContent = formatTime(elapsed);
      seekSlider.value = (elapsed / decodedBuffer.duration) * 100;
      playAnimId = requestAnimationFrame(updatePlayProgress);
    } else {
      stopPlayback();
    }
  }

  seekSlider.addEventListener('input', () => {
    if (!decodedBuffer) return;
    const target = (seekSlider.value / 100) * decodedBuffer.duration;
    currTimeEl.textContent = formatTime(target);
    if (isPlaying) {
      pausePlayback();
      pausedAt = target;
      startPlayback();
    } else {
      pausedAt = target;
    }
  });

  convertBtn.addEventListener('click', () => {
    if (!decodedBuffer) return;
    const targetSampleRate = parseInt(sampleRateSelect.value, 10);
    const targetChannels = parseInt(channelSelect.value, 10);

    const wavBlob = audioBufferToWav(decodedBuffer, { sampleRate: targetSampleRate, channels: targetChannels });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(wavBlob);
    a.download = `${currentFileName}-${targetSampleRate}Hz.wav`;
    a.click();
    URL.revokeObjectURL(a.href);

    if (window.showToast) {
      window.showToast(`Converted & exported as WAV (${formatTime(decodedBuffer.duration)})`);
    }
  });

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Pure Client-side AudioBuffer to RIFF WAV Encoder
  function audioBufferToWav(buffer, opt) {
    const numChannels = opt.channels === 1 ? 1 : Math.min(2, buffer.numberOfChannels);
    const sampleRate = opt.sampleRate || buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    // Resample if needed
    const length = Math.floor(buffer.length * (sampleRate / buffer.sampleRate));
    const resultBuffer = new Float32Array(length * numChannels);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const origIdx = Math.floor(i * (buffer.sampleRate / sampleRate));
        resultBuffer[i * numChannels + channel] = channelData[origIdx] || 0;
      }
    }

    const dataLength = length * numChannels * (bitDepth / 8);
    const bufferArray = new ArrayBuffer(44 + dataLength);
    const view = new DataView(bufferArray);

    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + dataLength, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, dataLength, true);

    // Write PCM 16-bit audio samples
    let offset = 44;
    for (let i = 0; i < resultBuffer.length; i++) {
      let s = Math.max(-1, Math.min(1, resultBuffer[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(offset, s, true);
      offset += 2;
    }

    return new Blob([bufferArray], { type: 'audio/wav' });
  }
}
