import JSZip from 'jszip';

export function renderApkUtilities(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="dropzone" id="apk-dropzone">
        <div class="dropzone-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="18" x="5" y="3" rx="2"></rect><circle cx="12" cy="17" r="1"></circle></svg>
        </div>
        <div class="dropzone-title">Drag & Drop your Android <code>.apk</code> or <code>.aab</code> package here</div>
        <div class="dropzone-desc">Client-side APK decompilation inspection, DEX structure, and instant APK-to-ZIP conversion</div>
        <input type="file" id="apk-file-input" accept=".apk,.xapk,.aab,.zip" style="display:none;" />
      </div>

      <div style="display:flex; justify-content:center; margin-top:0.75rem;">
        <button class="btn btn-secondary btn-sm" id="apk-load-demo-btn">
          📦 Or Load Sample APK Package Demo
        </button>
      </div>

      <div id="apk-results-panel" style="display:none; margin-top:1.5rem;">
        <div class="tool-controls-row" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div>
            <div class="control-label">Package Name</div>
            <div id="apk-pkg-name" style="font-weight:700; color:#fff; font-size:1rem; margin-top:0.25rem;">com.thesimpleyash.toolbox</div>
          </div>
          <div>
            <div class="control-label">Total Files</div>
            <div id="apk-total-files" style="font-weight:700; color:#c084fc; font-size:1rem; margin-top:0.25rem;">0</div>
          </div>
          <div>
            <div class="control-label">Archive Size</div>
            <div id="apk-archive-size" style="font-weight:700; color:#f43f5e; font-size:1rem; margin-top:0.25rem;">0 MB</div>
          </div>
          <div>
            <div class="control-label">Status</div>
            <div style="font-weight:700; color:#86efac; font-size:1rem; margin-top:0.25rem;">Unpacked & Ready</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin:1.25rem 0 0.75rem;">
          <h4 style="font-size:1rem; font-weight:700; color:var(--text-secondary);">Package File Explorer</h4>
          <button class="btn btn-primary btn-sm" id="apk-export-zip-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Convert APK to ZIP (.zip)
          </button>
        </div>

        <div class="file-tree-container" id="apk-file-tree">
          <!-- Tree items will be injected here -->
        </div>

        <div id="apk-preview-box" style="display:none; margin-top:1rem; background:rgba(15,15,24,0.9); padding:1rem; border-radius:var(--radius-md); border:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:0.85rem; font-weight:700; color:#d8b4fe; margin-bottom:0.5rem;" id="apk-preview-filename">File Contents</div>
          <pre id="apk-preview-content" style="font-family:var(--font-mono); font-size:0.8rem; color:#cbd5e1; max-height:200px; overflow-y:auto; white-space:pre-wrap;"></pre>
        </div>
      </div>
    </div>
  `;

  let currentZip = null;
  let currentFileName = 'app-package';

  const dropzone = container.querySelector('#apk-dropzone');
  const fileInput = container.querySelector('#apk-file-input');
  const demoBtn = container.querySelector('#apk-load-demo-btn');
  const resultsPanel = container.querySelector('#apk-results-panel');
  const pkgNameEl = container.querySelector('#apk-pkg-name');
  const totalFilesEl = container.querySelector('#apk-total-files');
  const archiveSizeEl = container.querySelector('#apk-archive-size');
  const fileTreeEl = container.querySelector('#apk-file-tree');
  const exportZipBtn = container.querySelector('#apk-export-zip-btn');
  const previewBox = container.querySelector('#apk-preview-box');
  const previewFilename = container.querySelector('#apk-preview-filename');
  const previewContent = container.querySelector('#apk-preview-content');

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processApkFile(e.target.files[0]);
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
      processApkFile(e.dataTransfer.files[0]);
    }
  });

  demoBtn.addEventListener('click', () => {
    // Generate a sample APK structure using JSZip
    const demoZip = new JSZip();
    const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.thesimpleyash.toolbox"
    android:versionCode="100"
    android:versionName="1.0.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application
        android:label="TheSimpleYash Toolbox"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/Theme.SimpleYash.Dark">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

    demoZip.file('AndroidManifest.xml', manifestXml);
    demoZip.file('classes.dex', 'DEX_BINARY_DATA_THE_SIMPLE_YASH_BYTECODE_STREAM');
    demoZip.file('classes2.dex', 'DEX_BINARY_DATA_SECONDARY_LIBRARY_STREAM');
    demoZip.file('resources.arsc', 'ARSC_TABLE_RESOURCES_CONFIG_DATA');
    demoZip.file('res/values/strings.xml', `<resources>\n  <string name="app_name">TheSimpleTools</string>\n  <string name="tagline">The Ultimate All-in-One Online Utility Toolbox</string>\n</resources>`);
    demoZip.file('res/drawable/ic_launcher.xml', `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108">\n  <path android:fillColor="#F43F5E" android:pathData="M54,10 L94,54 L54,98 L14,54 Z"/>\n</vector>`);
    demoZip.file('assets/config.json', JSON.stringify({ app: "TheSimpleTools", version: "1.0.0", creator: "YashGamerShakya", email: "yashgamershakya@gmail.com" }, null, 2));
    demoZip.file('lib/arm64-v8a/libsimpleyash.so', 'ARM64_NATIVE_SO_BINARY');
    demoZip.file('META-INF/CERT.RSA', 'RSA_SECURITY_SIGNATURE_KEY');
    demoZip.file('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: TheSimple \'s Tools Packager');

    demoZip.generateAsync({ type: 'blob' }).then(blob => {
      const demoFile = new File([blob], 'TheSimple-Tools-v1.0.apk', { type: 'application/vnd.android.package-archive' });
      processApkFile(demoFile);
    });
  });

  async function processApkFile(file) {
    currentFileName = file.name.replace(/\.[^/.]+$/, "");
    pkgNameEl.textContent = currentFileName.toLowerCase().replace(/[^a-z0-9]/g, '.');
    archiveSizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    try {
      const zip = new JSZip();
      currentZip = await zip.loadAsync(file);

      const files = Object.keys(currentZip.files);
      totalFilesEl.textContent = files.length;

      fileTreeEl.innerHTML = '';
      files.forEach((filename) => {
        const fileObj = currentZip.files[filename];
        const isDir = fileObj.dir;
        const div = document.createElement('div');
        div.className = 'tree-item';
        div.style.cursor = isDir ? 'default' : 'pointer';

        const icon = isDir ? '📁' : filename.endsWith('.xml') ? '📄' : filename.endsWith('.dex') ? '⚙️' : filename.endsWith('.so') ? '🔧' : '📦';
        div.innerHTML = `
          <div class="tree-item-name">
            <span>${icon}</span>
            <span>${filename}</span>
          </div>
          <div class="tree-item-size">${isDir ? 'dir' : formatBytes(fileObj._data ? fileObj._data.uncompressedSize || 0 : 0)}</div>
        `;

        if (!isDir) {
          div.addEventListener('click', async () => {
            try {
              if (filename.endsWith('.xml') || filename.endsWith('.json') || filename.endsWith('.txt') || filename.endsWith('.MF')) {
                const text = await fileObj.async('string');
                previewFilename.textContent = `Viewing: ${filename}`;
                previewContent.textContent = text.slice(0, 3000) + (text.length > 3000 ? '\n... (truncated)' : '');
                previewBox.style.display = 'block';
              } else {
                previewFilename.textContent = `Binary File: ${filename}`;
                previewContent.textContent = `[Binary Android Bytecode / Resource - Size: ${formatBytes(fileObj._data ? fileObj._data.uncompressedSize : 0)}]`;
                previewBox.style.display = 'block';
              }
            } catch (err) {
              previewContent.textContent = 'Could not preview binary contents: ' + err.message;
              previewBox.style.display = 'block';
            }
          });
        }

        fileTreeEl.appendChild(div);
      });

      resultsPanel.style.display = 'block';
      resultsPanel.scrollIntoView({ behavior: 'smooth' });
      if (window.showToast) {
        window.showToast(`APK unpacked successfully: ${files.length} internal items found!`);
      }
    } catch (err) {
      if (window.showToast) window.showToast('Error parsing APK file: ' + err.message);
    }
  }

  exportZipBtn.addEventListener('click', async () => {
    if (!currentZip) return;
    exportZipBtn.disabled = true;
    exportZipBtn.textContent = 'Generating ZIP...';

    try {
      const content = await currentZip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${currentFileName}-converted.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      exportZipBtn.disabled = false;
      exportZipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
        Convert APK to ZIP (.zip)
      `;

      if (window.showToast) {
        window.showToast(`APK converted to ZIP successfully (${formatBytes(content.size)})!`);
      }
    } catch (err) {
      if (window.showToast) window.showToast('Error exporting ZIP: ' + err.message);
      exportZipBtn.disabled = false;
    }
  });

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
