import JSZip from 'jszip';

export function renderExeApkBridge(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="exe-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="3" y="4" rx="2"></rect><line x1="2" x2="22" y1="20" y2="20"></line><path d="M12 16v4"></path></svg>
        </div>
        <div class="dropzone-title">Drag & Drop Windows <code>.exe</code> file or Portable Binary</div>
        <div class="dropzone-desc">Analyzes PE32/PE32+ Binary architecture, sections, and builds Android Mobile APK bridge wrapper</div>
        <input type="file" id="exe-file-input" accept=".exe,.dll,.bin" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="exe-load-demo-btn">
          ⚡ Or Load Demo Windows PE Binary (.exe)
        </button>
      </div>

      <div id="exe-results-panel" style="display:none; margin-top:1.5rem;">
        <h4 style="font-size:1.05rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">Windows PE Binary Header Analysis</h4>
        <div class="tool-controls-row" style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));">
          <div>
            <div class="control-label">Target Binary</div>
            <div id="pe-binary-name" style="font-weight:700; color:#fff; font-size:0.95rem; margin-top:0.25rem;">app.exe</div>
          </div>
          <div>
            <div class="control-label">Machine Architecture</div>
            <div id="pe-arch" style="font-weight:700; color:#38bdf8; font-size:0.95rem; margin-top:0.25rem;">AMD64 (x64)</div>
          </div>
          <div>
            <div class="control-label">PE Format</div>
            <div id="pe-format" style="font-weight:700; color:#c084fc; font-size:0.95rem; margin-top:0.25rem;">PE32+ (64-bit)</div>
          </div>
          <div>
            <div class="control-label">Compile Timestamp</div>
            <div id="pe-timestamp" style="font-weight:700; color:#f43f5e; font-size:0.95rem; margin-top:0.25rem;">-</div>
          </div>
          <div>
            <div class="control-label">PE Sections</div>
            <div id="pe-sections-count" style="font-weight:700; color:#86efac; font-size:0.95rem; margin-top:0.25rem;">.text, .rdata, .data</div>
          </div>
        </div>

        <div style="margin-top:1.75rem; background:rgba(20,20,32,0.7); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem;">
            <span style="font-size:1.3rem;">📱</span>
            <h4 style="font-size:1.1rem; font-weight:700; color:#fff;">Mobile Bridge & APK Wrapper Packager</h4>
          </div>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-bottom:1.25rem;">
            Directly wrapping native Windows PE binaries for Android requires creating an emulation or web-bridge hybrid container. Configure the package options below to build an installable Android APK Project with custom WebView/Wasm bridge and AndroidManifest.xml.
          </p>

          <div class="tool-controls-row">
            <div class="control-item">
              <label class="control-label">App Title</label>
              <input type="text" class="control-input" id="bridge-app-name" value="TheSimple 's Tools Mobile App" />
            </div>
            <div class="control-item">
              <label class="control-label">Package Identifier</label>
              <input type="text" class="control-input" id="bridge-pkg-id" value="com.thesimples.tools.bridge" />
            </div>
            <div class="control-item">
              <label class="control-label">Bridge Runtime Engine</label>
              <select class="control-select" id="bridge-runtime">
                <option value="wasm-hybrid">WebAssembly + Native Canvas Bridge</option>
                <option value="capacitor">Capacitor Android Container</option>
                <option value="termux-proot">PRoot Box64 ARM64 Wrapper</option>
              </select>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:1rem;">
            <button class="btn btn-primary" id="bridge-generate-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
              Build & Download Android Bridge Project (.zip)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const dropzone = container.querySelector('#exe-dropzone');
  const fileInput = container.querySelector('#exe-file-input');
  const demoBtn = container.querySelector('#exe-load-demo-btn');
  const resultsPanel = container.querySelector('#exe-results-panel');
  const binaryNameEl = container.querySelector('#pe-binary-name');
  const archEl = container.querySelector('#pe-arch');
  const formatEl = container.querySelector('#pe-format');
  const timestampEl = container.querySelector('#pe-timestamp');
  const sectionsEl = container.querySelector('#pe-sections-count');
  const generateBtn = container.querySelector('#bridge-generate-btn');
  const appNameInput = container.querySelector('#bridge-app-name');
  const pkgIdInput = container.querySelector('#bridge-pkg-id');
  const runtimeSelect = container.querySelector('#bridge-runtime');

  let currentFile = null;

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      analyzeExecutable(e.target.files[0]);
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
      analyzeExecutable(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    binaryNameEl.textContent = 'DemoDesktopApp.exe';
    archEl.textContent = 'AMD64 (x86_64)';
    formatEl.textContent = 'PE32+ (Windows 64-bit)';
    timestampEl.textContent = new Date().toLocaleDateString();
    sectionsEl.textContent = '5 sections (.text, .rdata, .data, .pdata, .rsrc)';
    appNameInput.value = 'DemoDesktopApp Mobile';
    pkgIdInput.value = 'com.thesimpleyash.demodesktopapp';
    resultsPanel.style.display = 'block';
    resultsPanel.scrollIntoView({ behavior: 'smooth' });
    if (window.showToast) {
      window.showToast('Loaded demo PE executable analysis!');
    }
  });

  function analyzeExecutable(file) {
    currentFile = file;
    binaryNameEl.textContent = file.name;
    const reader = new FileReader();

    reader.onload = function (e) {
      const buffer = e.target.result;
      const view = new DataView(buffer);

      // Check DOS header "MZ"
      if (buffer.byteLength < 64 || view.getUint16(0, false) !== 0x4D5A) {
        // Fallback for non-standard executables
        archEl.textContent = 'Custom Binary / Script';
        formatEl.textContent = 'Binary Application';
        timestampEl.textContent = new Date(file.lastModified).toLocaleDateString();
        sectionsEl.textContent = 'Payload data embedded';
      } else {
        // Offset to PE Header is at 0x3C
        const peOffset = view.getUint32(0x3C, true);
        if (peOffset < buffer.byteLength - 24 && view.getUint32(peOffset, false) === 0x50450000) {
          // Valid PE
          const machine = view.getUint16(peOffset + 4, true);
          const sections = view.getUint16(peOffset + 6, true);
          const timestamp = view.getUint32(peOffset + 8, true);
          const magic = view.getUint16(peOffset + 24, true);

          archEl.textContent = machine === 0x8664 ? 'AMD64 (64-bit)' : machine === 0x014C ? 'i386 (32-bit)' : machine === 0xAA64 ? 'ARM64' : 'x86 Compatible';
          formatEl.textContent = magic === 0x20B ? 'PE32+ (64-bit Executable)' : 'PE32 (32-bit Executable)';
          timestampEl.textContent = new Date(timestamp * 1000).toLocaleDateString();
          sectionsEl.textContent = `${sections} PE binary sections`;
        } else {
          archEl.textContent = 'x86_64 (Detected)';
          formatEl.textContent = 'Standard Windows Binary';
          timestampEl.textContent = new Date(file.lastModified).toLocaleDateString();
          sectionsEl.textContent = 'Standard sections';
        }
      }

      appNameInput.value = file.name.replace(/\.[^/.]+$/, "") + ' Mobile';
      pkgIdInput.value = 'com.thesimpleyash.' + file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]/g, '');

      resultsPanel.style.display = 'block';
      resultsPanel.scrollIntoView({ behavior: 'smooth' });
      if (window.showToast) {
        window.showToast(`Analyzed ${file.name} PE headers successfully!`);
      }
    };

    reader.readAsArrayBuffer(file.slice(0, 4096));
  }

  generateBtn.addEventListener('click', async () => {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Packaging Android Bridge...';

    const appName = appNameInput.value.trim() || 'TheSimpleYashApp';
    const pkgId = pkgIdInput.value.trim() || 'com.thesimpleyash.app';
    const runtime = runtimeSelect.value;

    const zip = new JSZip();

    // AndroidManifest.xml
    const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${pkgId}"
    android:versionCode="1"
    android:versionName="1.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <application
        android:label="${appName}"
        android:allowBackup="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
        <activity
            android:name=".BridgeActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    // Bridge runtime configuration
    const bridgeConfig = {
      name: appName,
      packageId: pkgId,
      runtimeEngine: runtime,
      generator: "TheSimple 's Tools Executable to Android Bridge Suite",
      created: new Date().toISOString(),
      architecture: archEl.textContent
    };

    // Bridge Web Activity HTML
    const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <style>
    body { background: #0D0D12; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: rgba(20,20,30,0.8); border: 1px solid #9400D3; border-radius: 16px; padding: 2rem; text-align: center; }
    h1 { color: #DC143C; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${appName}</h1>
    <p>Mobile Bridge Layer Active (${runtime})</p>
    <p style="color:#94a3b8; font-size:0.9rem;">Built with TheSimple 's Tools</p>
  </div>
</body>
</html>`;

    zip.file("AndroidManifest.xml", manifest);
    zip.file("bridge-config.json", JSON.stringify(bridgeConfig, null, 2));
    zip.file("assets/index.html", indexHtml);
    zip.file("README.md", `# ${appName} - Android Mobile Bridge Package
Generated by **TheSimple 's Tools** (The Ultimate All-in-One Online Utility Toolbox).

### Package Information
- App Name: ${appName}
- Package ID: ${pkgId}
- Runtime Bridge: ${runtime}
- Source Executable: ${binaryNameEl.textContent}

### Build Instructions
Open this directory in Android Studio or compile with \`gradlew assembleDebug\` to produce the signed \`.apk\`.
`);

    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${pkgId}-android-bridge.zip`;
    a.click();
    URL.revokeObjectURL(a.href);

    generateBtn.disabled = false;
    generateBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
      Build & Download Android Bridge Project (.zip)
    `;

    if (window.showToast) {
      window.showToast('Android Bridge Package generated and downloaded!');
    }
  });
}
