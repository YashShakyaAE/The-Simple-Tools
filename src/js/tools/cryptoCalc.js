// Calculators & Web Utilities Suite for TheSimpleTools
// Includes: Full Interactive Scientific & Standard Calculator, Web URL/Color Utilities,
// Crypto Hash & HMAC with pure JS fallbacks, Multi-category Unit Converter,
// Live Unix Epoch Clock, and Bulletproof UUID v4 Generator.

export function renderCryptoCalc(container) {
  container.innerHTML = `
    <div class="tool-workspace">
      <div class="tool-tabs" id="crypto-tabs">
        <button class="tool-tab-btn active" data-tab="calculator">🧮 Scientific Calculator</button>
        <button class="tool-tab-btn" data-tab="web-utils">🌐 Web Utilities</button>
        <button class="tool-tab-btn" data-tab="hash">🔐 Crypto Hash & HMAC</button>
        <button class="tool-tab-btn" data-tab="units">📐 Unit Converter</button>
        <button class="tool-tab-btn" data-tab="epoch">⏱️ Unix Epoch & Clock</button>
        <button class="tool-tab-btn" data-tab="uuid">🎲 UUID / GUID Generator</button>
      </div>

      <!-- Tab 1: Scientific & Standard Calculator -->
      <div class="tab-content" id="tab-calculator">
        <div class="calculator-container">
          <div class="calculator-layout">
            <div class="calculator-main-card">
              <!-- Calculator Screen -->
              <div class="calc-screen">
                <div class="calc-history-line" id="calc-history-line">0</div>
                <div class="calc-current-line" id="calc-current-line">0</div>
              </div>

              <!-- Calculator Mode Switch & Memory -->
              <div class="calc-top-bar">
                <div class="calc-mode-pill">
                  <span class="calc-mode-indicator active" id="calc-deg-rad-btn" title="Toggle Degrees / Radians">DEG</span>
                  <span style="color:var(--text-dim);">•</span>
                  <span style="color:#a855f7; font-size:0.75rem; font-weight:600;">HIGH-PRECISION</span>
                </div>
                <div class="calc-memory-actions">
                  <button class="calc-mem-btn" data-mem="mc" title="Memory Clear">MC</button>
                  <button class="calc-mem-btn" data-mem="mr" title="Memory Recall">MR</button>
                  <button class="calc-mem-btn" data-mem="mplus" title="Memory Add">M+</button>
                  <button class="calc-mem-btn" data-mem="mminus" title="Memory Subtract">M-</button>
                </div>
              </div>

              <!-- Calculator Keypad Grid -->
              <div class="calc-keypad-grid">
                <!-- Row 1: Scientific Functions -->
                <button class="calc-btn calc-btn-fn" data-action="sin">sin</button>
                <button class="calc-btn calc-btn-fn" data-action="cos">cos</button>
                <button class="calc-btn calc-btn-fn" data-action="tan">tan</button>
                <button class="calc-btn calc-btn-fn" data-action="pi">π</button>
                <button class="calc-btn calc-btn-fn" data-action="e">e</button>

                <!-- Row 2: Powers & Roots -->
                <button class="calc-btn calc-btn-fn" data-action="sqrt">√x</button>
                <button class="calc-btn calc-btn-fn" data-action="pow">x^y</button>
                <button class="calc-btn calc-btn-fn" data-action="sqr">x²</button>
                <button class="calc-btn calc-btn-fn" data-action="log">log</button>
                <button class="calc-btn calc-btn-fn" data-action="ln">ln</button>

                <!-- Row 3: Control & Parenthesis -->
                <button class="calc-btn calc-btn-clear" data-action="clear">AC</button>
                <button class="calc-btn calc-btn-del" data-action="backspace">⌫</button>
                <button class="calc-btn calc-btn-op" data-action="(">(</button>
                <button class="calc-btn calc-btn-op" data-action=")">)</button>
                <button class="calc-btn calc-btn-op" data-action="/">÷</button>

                <!-- Row 4: Digits 7, 8, 9, Multiply, Percent -->
                <button class="calc-btn calc-btn-num" data-num="7">7</button>
                <button class="calc-btn calc-btn-num" data-num="8">8</button>
                <button class="calc-btn calc-btn-num" data-num="9">9</button>
                <button class="calc-btn calc-btn-op" data-action="*">×</button>
                <button class="calc-btn calc-btn-fn" data-action="percent">%</button>

                <!-- Row 5: Digits 4, 5, 6, Subtract, Reciprocal -->
                <button class="calc-btn calc-btn-num" data-num="4">4</button>
                <button class="calc-btn calc-btn-num" data-num="5">5</button>
                <button class="calc-btn calc-btn-num" data-num="6">6</button>
                <button class="calc-btn calc-btn-op" data-action="-">−</button>
                <button class="calc-btn calc-btn-fn" data-action="recip">1/x</button>

                <!-- Row 6: Digits 1, 2, 3, Add, Negate -->
                <button class="calc-btn calc-btn-num" data-num="1">1</button>
                <button class="calc-btn calc-btn-num" data-num="2">2</button>
                <button class="calc-btn calc-btn-num" data-num="3">3</button>
                <button class="calc-btn calc-btn-op" data-action="+">+</button>
                <button class="calc-btn calc-btn-fn" data-action="negate">±</button>

                <!-- Row 7: Digit 0, Decimal, Equals -->
                <button class="calc-btn calc-btn-num calc-btn-zero" data-num="0">0</button>
                <button class="calc-btn calc-btn-num" data-num=".">.</button>
                <button class="calc-btn calc-btn-eq" data-action="evaluate">=</button>
              </div>
            </div>

            <!-- Calculator Side Panel: History Tape & Guide -->
            <div class="calculator-side-panel">
              <div class="calc-side-header">
                <span>Calculation History</span>
                <button class="btn-clear-history" id="calc-clear-history-btn">Clear</button>
              </div>
              <div class="calc-history-list" id="calc-history-list">
                <div class="calc-history-empty">No calculations yet. Enter an expression to begin.</div>
              </div>
              <div class="calc-keyboard-hint">
                <span>💡 Keyboard support: Use numbers, <kbd>+</kbd>, <kbd>-</kbd>, <kbd>*</kbd>, <kbd>/</kbd>, <kbd>Enter</kbd> (=), <kbd>Esc</kbd> (Clear), and <kbd>Backspace</kbd>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Web Utilities (URL Parser & Color Tools) -->
      <div class="tab-content" id="tab-web-utils" style="display:none;">
        <div class="web-utils-grid">
          <!-- URL Encoder / Decoder & Inspector -->
          <div class="tool-subcard">
            <div class="tool-subcard-header">
              <h4 style="font-size:1rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:0.5rem;">
                <span>🔗</span> URL Encoder, Decoder & Component Parser
              </h4>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-secondary btn-sm" id="btn-url-encode">Encode</button>
                <button class="btn btn-secondary btn-sm" id="btn-url-decode">Decode</button>
              </div>
            </div>
            <div class="form-group" style="margin-top:1rem;">
              <label class="form-label">Target URL or Query String</label>
              <textarea class="form-textarea" id="url-utils-input" style="height:80px;" placeholder="Paste URL here (e.g. https://example.com:8080/path/api?name=TheSimple&filter=pro#section)...">https://thesimple.tools/search?q=calculator+converter&category=web-utilities&sort=desc#results</textarea>
            </div>

            <div class="url-parts-box" id="url-parts-box">
              <!-- Dynamically decomposed URL -->
            </div>
          </div>

          <!-- Color Converter & Palette Inspector -->
          <div class="tool-subcard">
            <div class="tool-subcard-header">
              <h4 style="font-size:1rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:0.5rem;">
                <span>🎨</span> Color Converter & Palette Inspector
              </h4>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <input type="color" id="color-picker-input" value="#C084FC" style="width:36px; height:32px; border:none; border-radius:6px; cursor:pointer; background:transparent;" />
              </div>
            </div>

            <div class="color-inspector-body">
              <div class="color-preview-banner" id="color-preview-banner" style="background-color: #C084FC;">
                <span class="color-preview-text" id="color-preview-text">#C084FC • rgb(192, 132, 252)</span>
              </div>

              <div class="color-formats-grid">
                <div class="color-format-row">
                  <span class="color-format-label">HEX</span>
                  <input type="text" class="control-input" id="color-hex-val" value="#C084FC" />
                  <button class="btn btn-secondary btn-sm" data-copy-val="color-hex-val">📋</button>
                </div>
                <div class="color-format-row">
                  <span class="color-format-label">RGB</span>
                  <input type="text" class="control-input" id="color-rgb-val" value="rgb(192, 132, 252)" />
                  <button class="btn btn-secondary btn-sm" data-copy-val="color-rgb-val">📋</button>
                </div>
                <div class="color-format-row">
                  <span class="color-format-label">HSL</span>
                  <input type="text" class="control-input" id="color-hsl-val" value="hsl(282, 100%, 41%)" />
                  <button class="btn btn-secondary btn-sm" data-copy-val="color-hsl-val">📋</button>
                </div>
                <div class="color-format-row">
                  <span class="color-format-label">CSS Token</span>
                  <input type="text" class="control-input" id="color-css-val" value="var(--purple, #C084FC)" />
                  <button class="btn btn-secondary btn-sm" data-copy-val="color-css-val">📋</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Crypto Hash & HMAC -->
      <div class="tab-content" id="tab-hash" style="display:none;">
        <div class="form-group">
          <label class="form-label">Input Text / Message</label>
          <textarea class="form-textarea" id="hash-input" style="height:90px;" placeholder="Type text to calculate cryptographic hashes...">TheSimpleTools - The Ultimate All-in-One Online Utility Toolbox</textarea>
        </div>
        <div class="form-group" style="margin-bottom:1.5rem;">
          <label class="form-label">Optional HMAC Secret Key (Leave empty for standard hash)</label>
          <input type="text" class="form-input" id="hash-hmac-key" placeholder="e.g. secret_key_123" />
        </div>

        <div class="hash-results-grid">
          <div class="hash-row">
            <span class="hash-algorithm">SHA-256</span>
            <span class="hash-value" id="hash-sha256">...</span>
            <button class="btn btn-secondary btn-sm" data-copy-hash="hash-sha256" title="Copy Hash">📋 Copy</button>
          </div>
          <div class="hash-row">
            <span class="hash-algorithm">SHA-512</span>
            <span class="hash-value" id="hash-sha512">...</span>
            <button class="btn btn-secondary btn-sm" data-copy-hash="hash-sha512" title="Copy Hash">📋 Copy</button>
          </div>
          <div class="hash-row">
            <span class="hash-algorithm">MD5</span>
            <span class="hash-value" id="hash-md5">...</span>
            <button class="btn btn-secondary btn-sm" data-copy-hash="hash-md5" title="Copy Hash">📋 Copy</button>
          </div>
          <div class="hash-row">
            <span class="hash-algorithm">SHA-1</span>
            <span class="hash-value" id="hash-sha1">...</span>
            <button class="btn btn-secondary btn-sm" data-copy-hash="hash-sha1" title="Copy Hash">📋 Copy</button>
          </div>
          <div class="hash-row">
            <span class="hash-algorithm">SHA-384</span>
            <span class="hash-value" id="hash-sha384">...</span>
            <button class="btn btn-secondary btn-sm" data-copy-hash="hash-sha384" title="Copy Hash">📋 Copy</button>
          </div>
        </div>
      </div>

      <!-- Tab 4: Unit Converter -->
      <div class="tab-content" id="tab-units" style="display:none;">
        <div class="tool-controls-row" style="grid-template-columns: 1fr 1fr 1fr;">
          <div class="control-item">
            <label class="control-label">Category</label>
            <select class="control-select" id="unit-cat">
              <option value="storage">Digital Storage (Bytes)</option>
              <option value="network">Data Transfer Rate (Speed)</option>
              <option value="time">Time Duration</option>
              <option value="length">Length & Distance</option>
              <option value="temp">Temperature</option>
            </select>
          </div>
          <div class="control-item">
            <label class="control-label">Value</label>
            <input type="number" class="control-input" id="unit-val" value="1024" step="any" />
          </div>
          <div class="control-item">
            <label class="control-label">From Unit</label>
            <select class="control-select" id="unit-from"></select>
          </div>
        </div>

        <div style="background:rgba(15,15,24,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1.25rem; margin-top:1.25rem;">
          <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-muted); margin-bottom:0.75rem; text-transform:uppercase;">Conversion Results</h4>
          <div id="unit-results-list" style="display:flex; flex-direction:column; gap:0.5rem; font-family:var(--font-mono); font-size:0.9rem;"></div>
        </div>
      </div>

      <!-- Tab 5: Unix Epoch & Clock -->
      <div class="tab-content" id="tab-epoch" style="display:none;">
        <div style="background:rgba(20,20,32,0.8); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.5rem; text-align:center; margin-bottom:1.5rem;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Current Unix Epoch Timestamp</div>
          <div id="live-epoch-val" style="font-size:2.4rem; font-weight:800; font-family:var(--font-mono); color:#38bdf8; margin:0.5rem 0;">0000000000</div>
          <div id="live-epoch-date" style="font-size:0.95rem; color:#cbd5e1;">-</div>
        </div>

        <div class="dual-editor-grid">
          <div class="editor-box" style="padding:1.25rem;">
            <label class="control-label" style="margin-bottom:0.5rem;">Timestamp to Date</label>
            <input type="number" class="control-input" id="epoch-to-date-input" placeholder="e.g. 1773600000" style="margin-bottom:0.75rem;" />
            <div id="epoch-to-date-res" style="font-family:var(--font-mono); font-size:0.85rem; color:#86efac; line-height:1.6;">-</div>
          </div>
          <div class="editor-box" style="padding:1.25rem;">
            <label class="control-label" style="margin-bottom:0.5rem;">Date to Timestamp</label>
            <input type="datetime-local" class="control-input" id="date-to-epoch-input" style="margin-bottom:0.75rem;" />
            <div id="date-to-epoch-res" style="font-family:var(--font-mono); font-size:0.85rem; color:#86efac; line-height:1.6;">-</div>
          </div>
        </div>
      </div>

      <!-- Tab 6: UUID / GUID Generator -->
      <div class="tab-content" id="tab-uuid" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
          <div style="display:flex; gap:0.6rem; align-items:center;">
            <span style="font-size:0.85rem; color:var(--text-muted);">Count:</span>
            <select class="control-select" id="uuid-count" style="padding:0.35rem 0.75rem;">
              <option value="1">1 UUID</option>
              <option value="5" selected>5 UUIDs</option>
              <option value="10">10 UUIDs</option>
              <option value="20">20 UUIDs</option>
              <option value="50">50 UUIDs</option>
            </select>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-primary btn-sm" id="btn-gen-uuid">⚡ Regenerate</button>
            <button class="btn btn-secondary btn-sm" id="btn-copy-all-uuid">Copy All</button>
          </div>
        </div>
        <textarea class="editor-textarea" id="uuid-output" style="height:240px; background:rgba(15,15,24,0.8); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-md); padding:1rem; font-family:var(--font-mono); font-size:0.92rem; color:#93c5fd;" readonly></textarea>
      </div>
    </div>
  `;

  // -------------------------------------------------------------
  // TAB NAVIGATION
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // 1. INTERACTIVE SCIENTIFIC CALCULATOR ENGINE
  // -------------------------------------------------------------
  const calcHistoryLine = container.querySelector('#calc-history-line');
  const calcCurrentLine = container.querySelector('#calc-current-line');
  const calcHistoryList = container.querySelector('#calc-history-list');
  const calcClearHistoryBtn = container.querySelector('#calc-clear-history-btn');
  const calcDegRadBtn = container.querySelector('#calc-deg-rad-btn');

  let calcExpr = '0';
  let calcPrevAns = 0;
  let isNewNum = true;
  let isDegMode = true;
  let calcMemory = 0;
  let calcHistory = [];

  calcDegRadBtn.addEventListener('click', () => {
    isDegMode = !isDegMode;
    calcDegRadBtn.textContent = isDegMode ? 'DEG' : 'RAD';
    calcDegRadBtn.classList.toggle('active', isDegMode);
  });

  function updateCalcDisplay() {
    calcCurrentLine.textContent = calcExpr;
  }

  function appendCalcNum(digit) {
    if (isNewNum || calcExpr === '0') {
      calcExpr = digit === '.' ? '0.' : digit;
      isNewNum = false;
    } else {
      if (digit === '.' && calcExpr.includes('.')) {
        // Prevent double dot in the current token
        const tokens = calcExpr.split(/[\+\-\*\/\^\(\)]/);
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.includes('.')) return;
      }
      calcExpr += digit;
    }
    updateCalcDisplay();
  }

  function appendCalcOp(op) {
    isNewNum = false;
    const lastChar = calcExpr.trim().slice(-1);
    if (['+', '-', '*', '/', '^'].includes(lastChar) && op !== '(' && op !== ')') {
      calcExpr = calcExpr.trim().slice(0, -1) + op;
    } else {
      calcExpr += op;
    }
    updateCalcDisplay();
  }

  function clearCalc() {
    calcExpr = '0';
    isNewNum = true;
    calcHistoryLine.textContent = '0';
    updateCalcDisplay();
  }

  function backspaceCalc() {
    if (isNewNum || calcExpr.length <= 1) {
      calcExpr = '0';
      isNewNum = true;
    } else {
      calcExpr = calcExpr.slice(0, -1);
    }
    updateCalcDisplay();
  }

  function applyCalcFunction(fn) {
    try {
      let currentVal = parseFloat(calcExpr);
      if (isNaN(currentVal)) currentVal = 0;
      let res = 0;

      switch (fn) {
        case 'sin':
          const radSin = isDegMode ? (currentVal * Math.PI) / 180 : currentVal;
          res = Math.sin(radSin);
          break;
        case 'cos':
          const radCos = isDegMode ? (currentVal * Math.PI) / 180 : currentVal;
          res = Math.cos(radCos);
          break;
        case 'tan':
          const radTan = isDegMode ? (currentVal * Math.PI) / 180 : currentVal;
          res = Math.tan(radTan);
          break;
        case 'sqrt':
          if (currentVal < 0) throw new Error('Invalid Square Root');
          res = Math.sqrt(currentVal);
          break;
        case 'sqr':
          res = Math.pow(currentVal, 2);
          break;
        case 'pow':
          appendCalcOp('^');
          return;
        case 'log':
          if (currentVal <= 0) throw new Error('Invalid Log');
          res = Math.log10(currentVal);
          break;
        case 'ln':
          if (currentVal <= 0) throw new Error('Invalid Ln');
          res = Math.log(currentVal);
          break;
        case 'recip':
          if (currentVal === 0) throw new Error('Divide by zero');
          res = 1 / currentVal;
          break;
        case 'percent':
          res = currentVal / 100;
          break;
        case 'negate':
          res = -currentVal;
          break;
        case 'pi':
          calcExpr = Math.PI.toString();
          isNewNum = true;
          updateCalcDisplay();
          return;
        case 'e':
          calcExpr = Math.E.toString();
          isNewNum = true;
          updateCalcDisplay();
          return;
      }

      // Format result to avoid floating point precision artifacts
      res = cleanPrecision(res);
      calcHistoryLine.textContent = `${fn}(${currentVal}) =`;
      calcExpr = res.toString();
      isNewNum = true;
      updateCalcDisplay();
      pushHistory(`${fn}(${currentVal})`, res);
    } catch (e) {
      calcExpr = 'Error';
      updateCalcDisplay();
      isNewNum = true;
    }
  }

  function evaluateCalc() {
    try {
      const sanitized = calcExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**');

      // Validate expression to only allow arithmetic tokens
      if (!/^[0-9\+\-\*\/\.\(\)\s\*\*\%\,eE]+$/.test(sanitized)) {
        throw new Error('Invalid tokens');
      }

      // Safe evaluation using Function
      const evalFn = new Function(`"use strict"; return (${sanitized});`);
      let result = evalFn();

      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Math error');
      }

      result = cleanPrecision(result);
      calcHistoryLine.textContent = `${calcExpr} =`;
      pushHistory(calcExpr, result);

      calcPrevAns = result;
      calcExpr = result.toString();
      isNewNum = true;
      updateCalcDisplay();
    } catch (err) {
      calcHistoryLine.textContent = `${calcExpr} =`;
      calcExpr = 'Error';
      isNewNum = true;
      updateCalcDisplay();
    }
  }

  function cleanPrecision(num) {
    if (typeof num !== 'number') return num;
    return parseFloat(num.toFixed(10));
  }

  function pushHistory(eq, ans) {
    calcHistory.unshift({ eq, ans });
    if (calcHistory.length > 20) calcHistory.pop();
    renderHistory();
  }

  function renderHistory() {
    if (calcHistory.length === 0) {
      calcHistoryList.innerHTML = `<div class="calc-history-empty">No calculations yet. Enter an expression to begin.</div>`;
      return;
    }
    calcHistoryList.innerHTML = calcHistory.map((item, idx) => `
      <div class="calc-history-item" data-idx="${idx}">
        <div class="calc-history-item-eq">${escapeHtml(item.eq)} =</div>
        <div class="calc-history-item-ans">${item.ans}</div>
      </div>
    `).join('');

    calcHistoryList.querySelectorAll('.calc-history-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const item = calcHistory[itemEl.dataset.idx];
        if (item) {
          calcExpr = item.ans.toString();
          isNewNum = true;
          updateCalcDisplay();
          calcHistoryLine.textContent = `Ans: ${item.eq}`;
        }
      });
    });
  }

  calcClearHistoryBtn.addEventListener('click', () => {
    calcHistory = [];
    renderHistory();
  });

  // Attach button events
  container.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.num !== undefined) {
        appendCalcNum(btn.dataset.num);
      } else if (btn.dataset.action) {
        const action = btn.dataset.action;
        if (['+', '-', '*', '/', '(', ')'].includes(action)) {
          appendCalcOp(action);
        } else if (action === 'clear') {
          clearCalc();
        } else if (action === 'backspace') {
          backspaceCalc();
        } else if (action === 'evaluate') {
          evaluateCalc();
        } else {
          applyCalcFunction(action);
        }
      }
    });
  });

  // Memory buttons
  container.querySelectorAll('.calc-mem-btn').forEach(mBtn => {
    mBtn.addEventListener('click', () => {
      const type = mBtn.dataset.mem;
      const current = parseFloat(calcExpr) || 0;
      if (type === 'mc') calcMemory = 0;
      else if (type === 'mr') { calcExpr = calcMemory.toString(); isNewNum = true; updateCalcDisplay(); }
      else if (type === 'mplus') calcMemory += current;
      else if (type === 'mminus') calcMemory -= current;
      if (window.showToast) window.showToast(`Memory: ${cleanPrecision(calcMemory)}`);
    });
  });

  // Keyboard support when calculator tab is visible
  const keydownListener = (e) => {
    const calcTab = container.querySelector('#tab-calculator');
    if (!calcTab || calcTab.style.display === 'none') return;
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key >= '0' && e.key <= '9') {
      appendCalcNum(e.key);
    } else if (e.key === '.') {
      appendCalcNum('.');
    } else if (['+', '-', '*', '/', '(', ')', '^'].includes(e.key)) {
      appendCalcOp(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluateCalc();
    } else if (e.key === 'Backspace') {
      backspaceCalc();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      clearCalc();
    }
  };
  window.addEventListener('keydown', keydownListener);
  // Register workspace teardown so re-opening the modal doesn't stack
  // duplicate global listeners (main.js runs these on modal close/reopen).
  container._toolCleanups = container._toolCleanups || [];
  container._toolCleanups.push(() => window.removeEventListener('keydown', keydownListener));

  // -------------------------------------------------------------
  // 2. WEB UTILITIES: URL PARSER & COLOR INSPECTOR
  // -------------------------------------------------------------
  const urlInput = container.querySelector('#url-utils-input');
  const btnUrlEncode = container.querySelector('#btn-url-encode');
  const btnUrlDecode = container.querySelector('#btn-url-decode');
  const urlPartsBox = container.querySelector('#url-parts-box');

  function parseAndDisplayUrl() {
    const raw = urlInput.value.trim();
    if (!raw) {
      urlPartsBox.innerHTML = `<div style="color:var(--text-dim); font-size:0.85rem;">Enter a URL above to inspect components.</div>`;
      return;
    }

    try {
      // If it doesn't start with protocol, try prepending https://
      let parsedUrl;
      try {
        parsedUrl = new URL(raw);
      } catch {
        parsedUrl = new URL('https://' + raw);
      }

      const params = Array.from(parsedUrl.searchParams.entries());

      urlPartsBox.innerHTML = `
        <div class="url-parts-table">
          <div class="url-part-row">
            <span class="url-part-label">Protocol</span>
            <span class="url-part-val" style="color:#38bdf8;">${escapeHtml(parsedUrl.protocol)}</span>
          </div>
          <div class="url-part-row">
            <span class="url-part-label">Hostname</span>
            <span class="url-part-val" style="color:#a78bfa;">${escapeHtml(parsedUrl.hostname)}</span>
          </div>
          <div class="url-part-row">
            <span class="url-part-label">Port</span>
            <span class="url-part-val">${escapeHtml(parsedUrl.port || '(default)')}</span>
          </div>
          <div class="url-part-row">
            <span class="url-part-label">Pathname</span>
            <span class="url-part-val" style="color:#86efac;">${escapeHtml(parsedUrl.pathname)}</span>
          </div>
          <div class="url-part-row">
            <span class="url-part-label">Hash (#)</span>
            <span class="url-part-val" style="color:#f472b6;">${escapeHtml(parsedUrl.hash || '(none)')}</span>
          </div>
          <div class="url-part-row" style="flex-direction:column; align-items:flex-start; gap:0.5rem;">
            <span class="url-part-label">Query Parameters (${params.length})</span>
            ${params.length === 0 ? '<span style="color:var(--text-dim); font-size:0.82rem;">None</span>' : `
              <div class="url-params-list" style="width:100%; display:flex; flex-direction:column; gap:0.35rem;">
                ${params.map(([k, v]) => `
                  <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.03); padding:0.3rem 0.6rem; border-radius:4px; font-size:0.82rem;">
                    <span style="color:#fbbf24; font-weight:600;">${escapeHtml(k)}:</span>
                    <span style="color:#cbd5e1; word-break:break-all;">${escapeHtml(v)}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `;
    } catch (e) {
      urlPartsBox.innerHTML = `<div style="color:var(--crimson); font-size:0.85rem;">Invalid URL format. Check formatting and try again.</div>`;
    }
  }

  btnUrlEncode.addEventListener('click', () => {
    urlInput.value = encodeURIComponent(urlInput.value);
    parseAndDisplayUrl();
    if (window.showToast) window.showToast('URL Encoded!');
  });

  btnUrlDecode.addEventListener('click', () => {
    try {
      urlInput.value = decodeURIComponent(urlInput.value);
      parseAndDisplayUrl();
      if (window.showToast) window.showToast('URL Decoded!');
    } catch {
      if (window.showToast) window.showToast('Could not decode URL string.');
    }
  });

  urlInput.addEventListener('input', parseAndDisplayUrl);
  parseAndDisplayUrl();

  // Color Converter
  const colorPicker = container.querySelector('#color-picker-input');
  const colorPreviewBanner = container.querySelector('#color-preview-banner');
  const colorPreviewText = container.querySelector('#color-preview-text');
  const hexValInput = container.querySelector('#color-hex-val');
  const rgbValInput = container.querySelector('#color-rgb-val');
  const hslValInput = container.querySelector('#color-hsl-val');
  const cssValInput = container.querySelector('#color-css-val');

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function updateColorTools(hex) {
    try {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

      colorPreviewBanner.style.backgroundColor = hex;
      colorPreviewText.textContent = `${hex.toUpperCase()} • ${rgbStr} • ${hslStr}`;

      hexValInput.value = hex.toUpperCase();
      rgbValInput.value = rgbStr;
      hslValInput.value = hslStr;
      cssValInput.value = `background-color: ${hex}; /* ${rgbStr} */`;
      colorPicker.value = hex;
    } catch {}
  }

  colorPicker.addEventListener('input', (e) => updateColorTools(e.target.value));
  hexValInput.addEventListener('input', (e) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) updateColorTools(val);
  });

  container.querySelectorAll('[data-copy-val]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.copyVal;
      const el = container.querySelector(`#${targetId}`);
      if (el && el.value) {
        navigator.clipboard.writeText(el.value);
        if (window.showToast) window.showToast(`Copied ${el.value}!`);
      }
    });
  });

  // -------------------------------------------------------------
  // 3. CRYPTO HASH & HMAC WITH PURE JS FAIL-SAFE FALLBACKS
  // -------------------------------------------------------------
  const hashInput = container.querySelector('#hash-input');
  const hmacKeyInput = container.querySelector('#hash-hmac-key');

  // Pure JS MD5 implementation
  function md5(string) {
    function rotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }
    function wordToHex(lValue) {
      var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478); d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB); b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF); d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613); b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8); d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1); b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122); d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E); b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562); d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51); b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D); d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681); b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6); d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87); b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905); d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9); b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942); d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122); b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44); d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60); b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6); d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085); b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039); d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8); b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244); d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7); b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3); d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D); b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F); d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314); b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82); d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB); b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = addUnsigned(a, AA); b = addUnsigned(b, BB); c = addUnsigned(c, CC); d = addUnsigned(d, DD);
    }
    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
  }

  // Pure JS SHA-256 fallback
  function sha256Fallback(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';
    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;
    var hash = [];
    var k = [];
    var primeCounter = 0;

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
      var w = words.slice(j, (j += 16));
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

        var s1_maj = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        var temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + w[i]) | 0;
        var temp2 = (s1_maj + ((hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]))) | 0;

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (var b = 3; b >= 0; b--) {
        var byte = (hash[i] >> (b * 8)) & 255;
        result += ((byte < 16) ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  }

  async function computeHash(algorithm, text, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Check if subtle crypto is available
    const hasSubtle = typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function';

    if (hasSubtle) {
      try {
        if (!key) {
          const hashBuffer = await crypto.subtle.digest(algorithm, data);
          return bufferToHex(hashBuffer);
        } else {
          const keyData = encoder.encode(key);
          const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: { name: algorithm } }, false, ['sign']
          );
          const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
          return bufferToHex(signature);
        }
      } catch (err) {
        // Fall back if subtle fails
      }
    }

    // Pure JS Fallbacks
    if (algorithm === 'SHA-256') {
      return sha256Fallback(text + (key ? key : ''));
    } else if (algorithm === 'MD5') {
      return md5(text + (key ? key : ''));
    } else {
      return sha256Fallback(text + (key ? key : '')) + ' (Fallback)';
    }
  }

  function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function updateHashes() {
    const text = hashInput.value || '';
    const key = hmacKeyInput.value.trim();

    try {
      container.querySelector('#hash-sha256').textContent = await computeHash('SHA-256', text, key);
      container.querySelector('#hash-sha512').textContent = await computeHash('SHA-512', text, key);
      container.querySelector('#hash-sha1').textContent = await computeHash('SHA-1', text, key);
      container.querySelector('#hash-sha384').textContent = await computeHash('SHA-384', text, key);
      container.querySelector('#hash-md5').textContent = md5(text + (key ? key : ''));
    } catch (e) {
      console.error(e);
    }
  }

  hashInput.addEventListener('input', updateHashes);
  hmacKeyInput.addEventListener('input', updateHashes);
  updateHashes();

  container.querySelectorAll('[data-copy-hash]').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = container.querySelector(`#${btn.dataset.copyHash}`);
      if (el && el.textContent) {
        navigator.clipboard.writeText(el.textContent);
        if (window.showToast) window.showToast('Hash copied to clipboard!');
      }
    });
  });

  // -------------------------------------------------------------
  // 4. UNIT CONVERTER LOGIC (STORAGE, NETWORK, TIME, LENGTH, TEMP)
  // -------------------------------------------------------------
  const unitCat = container.querySelector('#unit-cat');
  const unitVal = container.querySelector('#unit-val');
  const unitFrom = container.querySelector('#unit-from');
  const unitResultsList = container.querySelector('#unit-results-list');

  const unitDefinitions = {
    storage: {
      units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
      factors: [1, 1024, 1024**2, 1024**3, 1024**4, 1024**5]
    },
    network: {
      units: ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'],
      factors: [1, 1000, 1000**2, 1000**3, 1000**4]
    },
    time: {
      units: ['ms', 'seconds', 'minutes', 'hours', 'days'],
      factors: [0.001, 1, 60, 3600, 86400]
    },
    length: {
      units: ['mm', 'cm', 'meters', 'km', 'inches', 'feet', 'yards', 'miles'],
      factors: [0.001, 0.01, 1, 1000, 0.0254, 0.3048, 0.9144, 1609.344]
    },
    temp: {
      units: ['Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)'],
      special: true
    }
  };

  function updateUnitOptions() {
    const cat = unitCat.value;
    const def = unitDefinitions[cat];
    if (!def) return;
    unitFrom.innerHTML = def.units.map(u => `<option value="${u}">${u}</option>`).join('');
    updateUnitResults();
  }

  function updateUnitResults() {
    const cat = unitCat.value;
    const def = unitDefinitions[cat];
    if (!def) return;
    const val = parseFloat(unitVal.value) || 0;

    if (cat === 'temp') {
      const from = unitFrom.value;
      let c = 0;
      if (from.startsWith('Celsius')) c = val;
      else if (from.startsWith('Fahrenheit')) c = (val - 32) * (5 / 9);
      else if (from.startsWith('Kelvin')) c = val - 273.15;

      const f = (c * 9/5) + 32;
      const k = c + 273.15;

      unitResultsList.innerHTML = `
        <div class="unit-result-row"><span>Celsius (°C)</span><span class="unit-res-val">${cleanPrecision(c)} °C</span></div>
        <div class="unit-result-row"><span>Fahrenheit (°F)</span><span class="unit-res-val">${cleanPrecision(f)} °F</span></div>
        <div class="unit-result-row"><span>Kelvin (K)</span><span class="unit-res-val">${cleanPrecision(k)} K</span></div>
      `;
      return;
    }

    const fromIdx = def.units.indexOf(unitFrom.value);
    const baseVal = val * (def.factors[fromIdx] || 1);

    unitResultsList.innerHTML = def.units.map((u, idx) => {
      const converted = baseVal / def.factors[idx];
      return `
        <div class="unit-result-row">
          <span style="color:#cbd5e1;">${u}</span>
          <span class="unit-res-val">${converted.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
        </div>
      `;
    }).join('');
  }

  unitCat.addEventListener('change', updateUnitOptions);
  unitVal.addEventListener('input', updateUnitResults);
  unitFrom.addEventListener('change', updateUnitResults);
  updateUnitOptions();

  // -------------------------------------------------------------
  // 5. UNIX EPOCH CLOCK & TIMESTAMP CONVERTERS
  // -------------------------------------------------------------
  const liveEpochVal = container.querySelector('#live-epoch-val');
  const liveEpochDate = container.querySelector('#live-epoch-date');
  const epochToDateInput = container.querySelector('#epoch-to-date-input');
  const epochToDateRes = container.querySelector('#epoch-to-date-res');
  const dateToEpochInput = container.querySelector('#date-to-epoch-input');
  const dateToEpochRes = container.querySelector('#date-to-epoch-res');

  function updateEpochClock() {
    const now = new Date();
    if (liveEpochVal) liveEpochVal.textContent = Math.floor(now.getTime() / 1000);
    if (liveEpochDate) liveEpochDate.textContent = `${now.toUTCString()} (Local: ${now.toLocaleTimeString()})`;
  }
  updateEpochClock();
  const epochInterval = setInterval(updateEpochClock, 1000);
  container._toolCleanups = container._toolCleanups || [];
  container._toolCleanups.push(() => clearInterval(epochInterval));

  epochToDateInput.addEventListener('input', () => {
    const ts = parseInt(epochToDateInput.value, 10);
    if (!ts || isNaN(ts)) { epochToDateRes.textContent = '-'; return; }
    const d = new Date(ts * 1000);
    if (isNaN(d.getTime())) { epochToDateRes.textContent = 'Invalid timestamp'; return; }
    epochToDateRes.innerHTML = `
      <div><strong>UTC:</strong> ${d.toUTCString()}</div>
      <div><strong>Local:</strong> ${d.toLocaleString()}</div>
      <div><strong>ISO 8601:</strong> ${d.toISOString()}</div>
    `;
  });

  dateToEpochInput.addEventListener('input', () => {
    const d = new Date(dateToEpochInput.value);
    if (isNaN(d.getTime())) { dateToEpochRes.textContent = '-'; return; }
    const sec = Math.floor(d.getTime() / 1000);
    dateToEpochRes.innerHTML = `
      <div><strong>Seconds:</strong> <span style="color:#38bdf8;">${sec}</span></div>
      <div><strong>Milliseconds:</strong> <span style="color:#93c5fd;">${d.getTime()}</span></div>
    `;
  });

  // -------------------------------------------------------------
  // 6. BULLETPROOF UUID / GUID GENERATOR (NEVER THROWS)
  // -------------------------------------------------------------
  const uuidCount = container.querySelector('#uuid-count');
  const uuidOutput = container.querySelector('#uuid-output');
  const btnGenUuid = container.querySelector('#btn-gen-uuid');
  const btnCopyUuid = container.querySelector('#btn-copy-all-uuid');

  function generateSingleUUID() {
    // 1. Try crypto.randomUUID() if supported
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch {}

    // 2. Try crypto.getRandomValues() if supported
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    } catch {}

    // 3. Fallback to RFC4122 v4 using timestamp and Math.random
    let d = new Date().getTime();
    let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function generateUUIDs() {
    try {
      const count = parseInt(uuidCount.value, 10) || 5;
      const uuids = [];
      for (let i = 0; i < count; i++) {
        uuids.push(generateSingleUUID());
      }
      uuidOutput.value = uuids.join('\n');
    } catch (e) {
      console.error('UUID generation error:', e);
      uuidOutput.value = 'Failed to generate UUIDs.';
    }
  }

  btnGenUuid.addEventListener('click', generateUUIDs);
  btnCopyUuid.addEventListener('click', () => {
    if (uuidOutput.value) {
      navigator.clipboard.writeText(uuidOutput.value);
      if (window.showToast) window.showToast('UUIDs copied to clipboard!');
    }
  });

  // Call safely
  generateUUIDs();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
