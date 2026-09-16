export function renderDevSuite(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="tool-tabs" id="dev-tabs">
        <button class="tool-tab-btn active" data-tab="json-xml">JSON ⇄ XML</button>
        <button class="tool-tab-btn" data-tab="base64">Base64 Encoder/Decoder</button>
        <button class="tool-tab-btn" data-tab="minifier">Code Minifier & Beautifier</button>
        <button class="tool-tab-btn" data-tab="strings">String & Case Converter</button>
        <button class="tool-tab-btn" data-tab="regex">Regex Tester</button>
      </div>

      <!-- JSON <-> XML Tab -->
      <div class="tab-content" id="tab-json-xml">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div style="font-size:0.85rem; color:var(--text-muted);">Bidirectional Data Transformer</div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-json-to-xml">JSON ➔ XML</button>
            <button class="btn btn-secondary btn-sm" id="btn-xml-to-json">XML ➔ JSON</button>
            <button class="btn btn-outline btn-sm" id="btn-sample-json">Load Sample</button>
          </div>
        </div>
        <div class="dual-editor-grid">
          <div class="editor-box">
            <div class="editor-header">
              <span>JSON Input / Output</span>
              <button class="btn-copy-subtle" id="copy-json">Copy</button>
            </div>
            <textarea class="editor-textarea" id="dev-json-area" placeholder='{\n  "name": "TheSimple &#39;s Tools",\n  "toolbox": true,\n  "tools": ["Audio", "Video", "APK"]\n}'></textarea>
          </div>
          <div class="editor-box">
            <div class="editor-header">
              <span>XML Input / Output</span>
              <button class="btn-copy-subtle" id="copy-xml">Copy</button>
            </div>
            <textarea class="editor-textarea" id="dev-xml-area" placeholder="<root>\n  <name>TheSimple &#39;s Tools</name>\n  <toolbox>true</toolbox>\n</root>"></textarea>
          </div>
        </div>
      </div>

      <!-- Base64 Tab -->
      <div class="tab-content" id="tab-base64" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div style="font-size:0.85rem; color:var(--text-muted);">Text & File Base64 Processing</div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-b64-encode">Encode to Base64</button>
            <button class="btn btn-secondary btn-sm" id="btn-b64-decode">Decode from Base64</button>
          </div>
        </div>
        <div class="dual-editor-grid">
          <div class="editor-box">
            <div class="editor-header">
              <span>Plain Text Input</span>
              <button class="btn-copy-subtle" id="copy-b64-plain">Copy</button>
            </div>
            <textarea class="editor-textarea" id="dev-b64-plain" placeholder="Type or paste plain text here..."></textarea>
          </div>
          <div class="editor-box">
            <div class="editor-header">
              <span>Base64 Output</span>
              <button class="btn-copy-subtle" id="copy-b64-encoded">Copy</button>
            </div>
            <textarea class="editor-textarea" id="dev-b64-encoded" placeholder="Base64 result will appear here..."></textarea>
          </div>
        </div>
      </div>

      <!-- Minifier Tab -->
      <div class="tab-content" id="tab-minifier" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span style="font-size:0.85rem; color:var(--text-muted);">Language:</span>
            <select class="control-select" id="mini-lang" style="padding:0.3rem 0.6rem; font-size:0.82rem;">
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="js">JavaScript / JSON</option>
            </select>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-minify">⚡ Minify Code</button>
            <button class="btn btn-secondary btn-sm" id="btn-beautify">✨ Beautify / Format</button>
          </div>
        </div>
        <div class="dual-editor-grid">
          <div class="editor-box">
            <div class="editor-header"><span>Source Code</span></div>
            <textarea class="editor-textarea" id="mini-input" placeholder="Paste source code here..."></textarea>
          </div>
          <div class="editor-box">
            <div class="editor-header">
              <span id="mini-stats">Processed Output</span>
              <button class="btn-copy-subtle" id="copy-mini">Copy</button>
            </div>
            <textarea class="editor-textarea" id="mini-output" readonly placeholder="Output code will appear here..."></textarea>
          </div>
        </div>
      </div>

      <!-- String & Case Converter Tab -->
      <div class="tab-content" id="tab-strings" style="display:none;">
        <div class="editor-box" style="margin-bottom:1.25rem;">
          <div class="editor-header">
            <span>Input String</span>
            <span id="str-counter" style="color:var(--neon-cyan);">0 chars | 0 words</span>
          </div>
          <textarea class="editor-textarea" id="str-input" style="height:120px;" placeholder="Type text to convert case (e.g., hello world from thesimpleyash)..."></textarea>
        </div>
        <div class="case-grid">
          <div class="control-item">
            <label class="control-label">camelCase</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-camel" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-camel">📋</button>
            </div>
          </div>
          <div class="control-item">
            <label class="control-label">kebab-case</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-kebab" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-kebab">📋</button>
            </div>
          </div>
          <div class="control-item">
            <label class="control-label">snake_case</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-snake" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-snake">📋</button>
            </div>
          </div>
          <div class="control-item">
            <label class="control-label">PascalCase</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-pascal" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-pascal">📋</button>
            </div>
          </div>
          <div class="control-item">
            <label class="control-label">URL Slug</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-slug" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-slug">📋</button>
            </div>
          </div>
          <div class="control-item">
            <label class="control-label">URL Encoded</label>
            <div style="display:flex; gap:0.4rem;">
              <input type="text" class="control-input" id="case-url" readonly />
              <button class="btn btn-secondary btn-sm" data-copy="case-url">📋</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Regex Tester Tab -->
      <div class="tab-content" id="tab-regex" style="display:none;">
        <div class="regex-layout">
          <div class="control-item">
            <label class="control-label">Regular Expression Pattern</label>
            <input type="text" class="control-input" id="regex-pattern" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" placeholder="e.g. \\b\\w+ed\\b" />
          </div>
          <div class="control-item">
            <label class="control-label">Flags (g, i, m, s)</label>
            <input type="text" class="control-input" id="regex-flags" value="g" placeholder="flags" />
          </div>
        </div>
        <div class="dual-editor-grid">
          <div class="editor-box">
            <div class="editor-header"><span>Test String</span></div>
            <textarea class="editor-textarea" id="regex-test-str" placeholder="Paste test content here...">Contact us at yashgamershakya@gmail.com for fast assistance and developer support.</textarea>
          </div>
          <div class="editor-box">
            <div class="editor-header">
              <span id="regex-matches-count">Matches (0)</span>
            </div>
            <div id="regex-results-view" style="padding:1rem; font-family:var(--font-mono); font-size:0.88rem; color:#cbd5e1; height:240px; overflow-y:auto; line-height:1.6; background:transparent;"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab Switching
  const tabBtns = container.querySelectorAll('.tool-tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      const target = container.querySelector(`#tab-${btn.dataset.tab}`);
      if (target) target.style.display = 'block';
    });
  });

  // JSON ⇄ XML Logic
  const jsonArea = container.querySelector('#dev-json-area');
  const xmlArea = container.querySelector('#dev-xml-area');
  const btnJsonToXml = container.querySelector('#btn-json-to-xml');
  const btnXmlToJson = container.querySelector('#btn-xml-to-json');
  const btnSampleJson = container.querySelector('#btn-sample-json');

  btnSampleJson.addEventListener('click', () => {
    const sample = {
      project: "TheSimpleTools",
      tagline: "The Ultimate All-in-One Online Utility Toolbox",
      author: "YashGamerShakya",
      email: "yashgamershakya@gmail.com",
      features: ["Audio Enhancer", "APK Tools", "Video Processor", "Image Converter"],
      privacy: { clientSide: true, uploads: false }
    };
    jsonArea.value = JSON.stringify(sample, null, 2);
    convertJsonToXml();
  });

  function jsonToXml(obj) {
    let xml = '';
    for (let prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue;
      if (Array.isArray(obj[prop])) {
        for (let elem of obj[prop]) {
          xml += `<${prop}>${typeof elem === 'object' ? jsonToXml(elem) : escapeXml(elem)}</${prop}>\n`;
        }
      } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        xml += `<${prop}>\n${jsonToXml(obj[prop])}</${prop}>\n`;
      } else {
        xml += `<${prop}>${escapeXml(obj[prop])}</${prop}>\n`;
      }
    }
    return xml;
  }

  function escapeXml(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function convertJsonToXml() {
    try {
      const parsed = JSON.parse(jsonArea.value);
      xmlArea.value = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(parsed)}</root>`;
      if (window.showToast) window.showToast('Converted JSON to XML!');
    } catch (err) {
      if (window.showToast) window.showToast('Invalid JSON syntax: ' + err.message);
    }
  }

  function xmlToJson(xml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('XML parsing error: ' + doc.getElementsByTagName('parsererror')[0].textContent);
    }
    function parseNode(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.nodeValue.trim();
      if (node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE) {
        return node.childNodes[0].nodeValue.trim();
      }
      const obj = {};
      for (let child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const val = parseNode(child);
          if (obj[child.nodeName]) {
            if (!Array.isArray(obj[child.nodeName])) {
              obj[child.nodeName] = [obj[child.nodeName]];
            }
            obj[child.nodeName].push(val);
          } else {
            obj[child.nodeName] = val;
          }
        }
      }
      return obj;
    }
    return parseNode(doc.documentElement);
  }

  btnJsonToXml.addEventListener('click', convertJsonToXml);
  btnXmlToJson.addEventListener('click', () => {
    try {
      const obj = xmlToJson(xmlArea.value);
      jsonArea.value = JSON.stringify(obj, null, 2);
      if (window.showToast) window.showToast('Converted XML to JSON!');
    } catch (err) {
      if (window.showToast) window.showToast('Invalid XML syntax: ' + err.message);
    }
  });

  // Base64 Logic
  const b64Plain = container.querySelector('#dev-b64-plain');
  const b64Encoded = container.querySelector('#dev-b64-encoded');
  container.querySelector('#btn-b64-encode').addEventListener('click', () => {
    try {
      b64Encoded.value = btoa(unescape(encodeURIComponent(b64Plain.value)));
      if (window.showToast) window.showToast('Encoded to Base64!');
    } catch (e) {
      if (window.showToast) window.showToast('Encode error: ' + e.message);
    }
  });
  container.querySelector('#btn-b64-decode').addEventListener('click', () => {
    try {
      b64Plain.value = decodeURIComponent(escape(atob(b64Encoded.value)));
      if (window.showToast) window.showToast('Decoded from Base64!');
    } catch (e) {
      if (window.showToast) window.showToast('Decode error: ' + e.message);
    }
  });

  // Minifier Logic
  const miniInput = container.querySelector('#mini-input');
  const miniOutput = container.querySelector('#mini-output');
  const miniLang = container.querySelector('#mini-lang');
  const miniStats = container.querySelector('#mini-stats');

  container.querySelector('#btn-minify').addEventListener('click', () => {
    const code = miniInput.value;
    if (!code) return;
    const lang = miniLang.value;
    let minified = '';
    if (lang === 'html') {
      minified = code.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    } else if (lang === 'css') {
      minified = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*([\{\}\:\;\,])\s*/g, '$1').replace(/\s{2,}/g, ' ').trim();
    } else {
      // JS / JSON
      try {
        minified = JSON.stringify(JSON.parse(code));
      } catch (e) {
        minified = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/\s{2,}/g, ' ').trim();
      }
    }
    miniOutput.value = minified;
    const savings = (((code.length - minified.length) / code.length) * 100).toFixed(1);
    miniStats.textContent = `Output (${savings}% saved)`;
    if (window.showToast) window.showToast(`Minified! Reduced size by ${savings}%`);
  });

  container.querySelector('#btn-beautify').addEventListener('click', () => {
    const code = miniInput.value;
    if (!code) return;
    try {
      miniOutput.value = JSON.stringify(JSON.parse(code), null, 2);
      miniStats.textContent = 'Output (Beautified JSON)';
    } catch (e) {
      miniOutput.value = code;
    }
  });

  // String & Case Converter
  const strInput = container.querySelector('#str-input');
  const strCounter = container.querySelector('#str-counter');
  const camelEl = container.querySelector('#case-camel');
  const kebabEl = container.querySelector('#case-kebab');
  const snakeEl = container.querySelector('#case-snake');
  const pascalEl = container.querySelector('#case-pascal');
  const slugEl = container.querySelector('#case-slug');
  const urlEl = container.querySelector('#case-url');

  strInput.addEventListener('input', () => {
    const val = strInput.value;
    const chars = val.length;
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    strCounter.textContent = `${chars} chars | ${words} words`;

    const cleanWords = val.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
    if (cleanWords.length > 0) {
      camelEl.value = cleanWords[0] + cleanWords.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      pascalEl.value = cleanWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
      kebabEl.value = cleanWords.join('-');
      snakeEl.value = cleanWords.join('_');
      slugEl.value = cleanWords.join('-').toLowerCase();
    } else {
      camelEl.value = '';
      pascalEl.value = '';
      kebabEl.value = '';
      snakeEl.value = '';
      slugEl.value = '';
    }
    urlEl.value = encodeURIComponent(val);
  });

  container.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = container.querySelector(`#${btn.dataset.copy}`);
      if (input && input.value) {
        navigator.clipboard.writeText(input.value);
        if (window.showToast) window.showToast('Copied to clipboard!');
      }
    });
  });

  // Regex Tester
  const regPat = container.querySelector('#regex-pattern');
  const regFlags = container.querySelector('#regex-flags');
  const regTestStr = container.querySelector('#regex-test-str');
  const regResultsView = container.querySelector('#regex-results-view');
  const regCount = container.querySelector('#regex-matches-count');

  function updateRegex() {
    const pattern = regPat.value;
    const flags = regFlags.value;
    const text = regTestStr.value;

    if (!pattern) {
      regResultsView.innerHTML = escapeXml(text);
      regCount.textContent = 'Matches (0)';
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex) || [];
      regCount.textContent = `Matches (${matches.length})`;

      // Highlight matches in view
      const highlighted = text.replace(regex, (match) => {
        return `<mark style="background:var(--crimson); color:#fff; border-radius:3px; padding:0 3px;">${escapeXml(match)}</mark>`;
      });
      regResultsView.innerHTML = highlighted.replace(/\n/g, '<br>');
    } catch (e) {
      regCount.textContent = 'Invalid Regex';
      regResultsView.innerHTML = `<span style="color:#ef4444;">Syntax Error: ${escapeXml(e.message)}</span>`;
    }
  }

  regPat.addEventListener('input', updateRegex);
  regFlags.addEventListener('input', updateRegex);
  regTestStr.addEventListener('input', updateRegex);
  updateRegex();

  // Copy helper for textareas
  ['copy-json', 'copy-xml', 'copy-b64-plain', 'copy-b64-encoded', 'copy-mini'].forEach(id => {
    const btn = container.querySelector(`#${id}`);
    if (btn) {
      btn.addEventListener('click', () => {
        const area = btn.closest('.editor-box').querySelector('textarea');
        if (area && area.value) {
          navigator.clipboard.writeText(area.value);
          if (window.showToast) window.showToast('Copied to clipboard!');
        }
      });
    }
  });
}
