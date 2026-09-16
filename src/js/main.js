import '../style.css';
import { TOOLS_DATA, CATEGORIES } from './data/toolsData.js';
import { initCommunity, initToastSystem } from './community.js';

// Tool renderers
import { renderImageConverter } from './tools/imageConverter.js';
import { renderApkUtilities } from './tools/apkUtilities.js';
import { renderExeApkBridge } from './tools/exeApkBridge.js';
import { renderAudioConverter } from './tools/audioConverter.js';
import { renderAudioEnhancer } from './tools/audioEnhancer.js';
import { renderDevSuite } from './tools/devSuite.js';
import { renderVectorSuite } from './tools/vectorSuite.js';
import { renderCryptoCalc } from './tools/cryptoCalc.js';
import { renderVideoProcessor } from './tools/videoProcessor.js';
import { renderBatchSuite } from './tools/batchSuite.js';
import { renderImageUpscaler } from './tools/imageUpscaler.js';
import { renderMediaReducer } from './tools/mediaReducer.js';

const TOOL_RENDERERS = {
  'image-converter': renderImageConverter,
  'apk-utilities': renderApkUtilities,
  'exe-apk-bridge': renderExeApkBridge,
  'audio-converter': renderAudioConverter,
  'audio-enhancer': renderAudioEnhancer,
  'dev-suite': renderDevSuite,
  'vector-suite': renderVectorSuite,
  'crypto-calc': renderCryptoCalc,
  'video-processor': renderVideoProcessor,
  'batch-suite': renderBatchSuite,
  'image-upscaler': renderImageUpscaler,
  'media-reducer': renderMediaReducer
};

document.addEventListener('DOMContentLoaded', () => {
  initToastSystem();
  initCommunity();
  initMouseGlow();
  initToolDirectory();
  initSearch();
  initModal();
  initNavigationHandlers();
  initLegalModals();
  initMobileNav();
  checkHashRoute();

  window.addEventListener('hashchange', checkHashRoute);
});

// Ambient Mouse Glow Follower
function initMouseGlow() {
  const glow = document.querySelector('.ambient-cursor-glow');
  if (!glow) return;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animate);
  }
  animate();
}

// Tool Directory & Filter Pills
let activeCategory = 'all';
let searchQuery = '';

function initToolDirectory() {
  const pillsContainer = document.querySelector('#filter-pills-container');
  if (pillsContainer) {
    pillsContainer.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === 'all' 
        ? TOOLS_DATA.length 
        : TOOLS_DATA.filter(t => t.category === cat.id).length;
      return `
        <button class="filter-pill ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
          <span>${cat.label}</span>
          <span class="filter-count">${count}</span>
        </button>
      `;
    }).join('');

    pillsContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        pillsContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderToolsGrid();
      });
    });
  }

  renderToolsGrid();
}

function renderToolsGrid() {
  const grid = document.querySelector('#tools-grid');
  const emptyState = document.querySelector('#empty-search-state');
  if (!grid) return;

  const query = searchQuery.toLowerCase().trim();
  const filtered = TOOLS_DATA.filter(tool => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery = !query || 
      tool.title.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.add('visible');
    return;
  }

  if (emptyState) emptyState.classList.remove('visible');

  grid.innerHTML = filtered.map(tool => `
    <div class="tool-card" data-tool-id="${tool.id}" tabindex="0">
      <div class="tool-card-header">
        <div class="tool-icon-wrapper">
          ${tool.icon}
        </div>
        <span class="tool-badge ${tool.badgeType || ''}">${tool.badge}</span>
      </div>
      <h3 class="tool-card-title">${tool.title}</h3>
      <p class="tool-card-desc">${tool.desc}</p>
      <div class="tool-tags">
        ${tool.tags.map(t => `<span class="tool-tag-item">${t}</span>`).join('')}
      </div>
      <div class="tool-card-footer">
        <span style="font-size:0.8rem; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.05em;">Client-Side</span>
        <div class="tool-card-action">
          <span>Launch Tool</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      openToolModal(card.dataset.toolId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openToolModal(card.dataset.toolId);
      }
    });
  });
}

// AI-Style Interactive Search Bar
function initSearch() {
  const searchInput = document.querySelector('#global-search-input');
  const clearBtn = document.querySelector('#search-clear-btn');
  if (!searchInput) return;

  // Placeholder rotation
  const placeholders = [
    "Search any tool (e.g., MP4 to MP3, .exe to .apk, JSON to XML)...",
    "Try 'audio enhancer', 'apk decompiler', 'webp converter'...",
    "Try 'sha-256 hash', 'svg rasterizer', 'regex tester'...",
    "Search developer suite, batch tools, calculators..."
  ];
  let phIdx = 0;
  setInterval(() => {
    if (document.activeElement !== searchInput && !searchInput.value) {
      phIdx = (phIdx + 1) % placeholders.length;
      searchInput.setAttribute('placeholder', placeholders[phIdx]);
    }
  }, 4000);

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
    renderToolsGrid();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      renderToolsGrid();
      searchInput.focus();
    });
  }

  // Keyboard shortcut '/' and 'Ctrl+K'
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  const resetBtn = document.querySelector('#reset-search-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      activeCategory = 'all';
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (pills[0]) pills[0].classList.add('active');
      renderToolsGrid();
    });
  }
}

// Header & Navigation Interactive Handlers
function initNavigationHandlers() {
  // Home Link
  const navHome = document.querySelector('#nav-home');
  const headerLogo = document.querySelector('#header-logo');
  [navHome, headerLogo].forEach(el => {
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });

  // All Tools Link
  const navAllTools = document.querySelector('#nav-all-tools');
  if (navAllTools) {
    navAllTools.addEventListener('click', (e) => {
      e.preventDefault();
      activeCategory = 'all';
      searchQuery = '';
      const searchInput = document.querySelector('#global-search-input');
      if (searchInput) searchInput.value = '';
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (pills[0]) pills[0].classList.add('active');
      renderToolsGrid();

      const target = document.querySelector('#converter-suite');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Developer Suite Header Link
  const navDevSuite = document.querySelector('#nav-dev-suite');
  if (navDevSuite) {
    navDevSuite.addEventListener('click', (e) => {
      e.preventDefault();
      activeCategory = 'dev-tools';
      const pills = document.querySelectorAll('.filter-pill');
      pills.forEach(p => {
        if (p.dataset.category === 'dev-tools') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
      renderToolsGrid();

      const target = document.querySelector('#converter-suite');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Community Link
  const navCommunity = document.querySelector('#nav-community');
  if (navCommunity) {
    navCommunity.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#community');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Explore Tools Button
  const btnExplore = document.querySelector('#btn-explore-tools');
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#converter-suite');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Suggest Tool Hero / Community Button
  const btnSuggestTool = document.querySelector('#btn-suggest-tool');
  if (btnSuggestTool) {
    btnSuggestTool.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.querySelector('#req-title');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => input.focus(), 400);
      }
    });
  }

  // Direct Click Handlers on Footer Tool Links
  document.querySelectorAll('[data-open-tool]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const toolId = link.dataset.openTool;
      openToolModal(toolId);
    });
  });
}

// Modal Manager
let currentOpenToolId = null;

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function runModalCleanups(modalBody) {
  if (modalBody && Array.isArray(modalBody._toolCleanups)) {
    for (const fn of modalBody._toolCleanups) {
      try { fn(); } catch (e) { console.warn('Tool cleanup failed:', e); }
    }
    modalBody._toolCleanups = [];
  }
}

function initModal() {
  const overlay = document.querySelector('#tool-modal-overlay');
  const closeBtn = document.querySelector('#modal-close-btn');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', closeToolModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeToolModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ov = document.querySelector('#tool-modal-overlay');
      if (ov && ov.classList.contains('active')) {
        // Let calculator-style inputs handle Escape first is not possible here;
        // closing on Escape is standard modal behavior.
        closeToolModal();
      }
    }
  });
}

export function openToolModal(toolId) {
  if (toolId === currentOpenToolId) return;

  const tool = TOOLS_DATA.find(t => t.id === toolId);
  if (!tool) return;

  const overlay = document.querySelector('#tool-modal-overlay');
  const modalIcon = document.querySelector('#modal-tool-icon');
  const modalTitle = document.querySelector('#modal-tool-title');
  const modalSubtitle = document.querySelector('#modal-tool-subtitle');
  const modalBody = document.querySelector('#modal-tool-body');
  if (!overlay || !modalBody) return;

  // Tear down any previous tool workspace (timers / global listeners)
  // before clearing the DOM, so re-opened tools start fresh.
  runModalCleanups(modalBody);

  if (modalIcon) modalIcon.innerHTML = tool.icon;
  if (modalTitle) modalTitle.textContent = tool.title;
  if (modalSubtitle) modalSubtitle.textContent = tool.desc;

  modalBody.innerHTML = '';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  currentOpenToolId = toolId;
  if (window.location.hash !== `#tool-${toolId}`) {
    window.location.hash = `tool-${toolId}`;
  }

  const renderer = TOOL_RENDERERS[toolId];
  if (renderer) {
    try {
      renderer(modalBody);
    } catch (err) {
      console.error(`Error rendering tool ${toolId}:`, err);
      modalBody.innerHTML = `
        <div style="text-align:center; padding:3rem 1.5rem;">
          <div style="font-size:2.8rem; margin-bottom:1rem;">⚠️</div>
          <h3 style="color:#fff; font-size:1.3rem; margin-bottom:0.5rem;">Tool Workspace Initialization Notice</h3>
          <p style="color:var(--text-muted); max-width:480px; margin:0 auto 1.5rem; font-size:0.9rem;">
            An issue occurred while initializing <strong>${escapeHtml(tool.title)}</strong>: ${escapeHtml(err.message || String(err))}
          </p>
          <button class="btn btn-primary btn-sm" id="btn-retry-tool-render">Reload Workspace</button>
        </div>
      `;
      modalBody.querySelector('#btn-retry-tool-render')?.addEventListener('click', () => openToolModal(toolId));
    }
  } else {
    modalBody.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);">Workspace for ${escapeHtml(tool.title)} is ready.</div>`;
  }
}

export function closeToolModal() {
  const overlay = document.querySelector('#tool-modal-overlay');
  const modalBody = document.querySelector('#modal-tool-body');
  runModalCleanups(modalBody);
  if (modalBody) modalBody.innerHTML = '';
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  currentOpenToolId = null;
  if (window.location.hash.startsWith('#tool-') || ['#terms', '#privacy', '#api', '#contact', '#about'].includes(window.location.hash)) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
}

function checkHashRoute() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#tool-')) {
    const id = hash.replace('#tool-', '');
    // Setting window.location.hash inside openToolModal re-fires hashchange.
    // Skip the re-render when the requested tool is already open.
    const overlay = document.querySelector('#tool-modal-overlay');
    if (id === currentOpenToolId && overlay && overlay.classList.contains('active')) return;
    openToolModal(id);
  } else if (['#terms', '#privacy', '#api', '#contact', '#about'].includes(hash)) {
    const legalKey = hash.replace('#', '');
    openLegalModal(legalKey);
  }
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

// Legal & Information Modals
function initLegalModals() {
  document.querySelectorAll('[data-legal]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.dataset.legal;
      openLegalModal(type);
    });
  });
}

function openLegalModal(type) {
  const overlay = document.querySelector('#tool-modal-overlay');
  const modalIcon = document.querySelector('#modal-tool-icon');
  const modalTitle = document.querySelector('#modal-tool-title');
  const modalSubtitle = document.querySelector('#modal-tool-subtitle');
  const modalBody = document.querySelector('#modal-tool-body');

  if (type === 'contact') {
    modalIcon.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`;
    modalTitle.textContent = "Contact & Support";
    modalSubtitle.textContent = "TheSimpleTools Official Creator Support";
    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.75rem;">
        <!-- Email Banner Card -->
        <div style="background:linear-gradient(135deg, rgba(220,20,60,0.15) 0%, rgba(148,0,211,0.2) 100%); border:1px solid var(--border-glass); border-radius:var(--radius-lg); padding:1.75rem; text-align:center;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">📬</div>
          <h3 style="font-size:1.35rem; font-weight:700; color:#fff; margin-bottom:0.4rem;">Official Creator Support</h3>
          <p style="color:var(--text-muted); font-size:0.92rem; max-width:480px; margin:0 auto 1.25rem;">
            Questions, tool requests, bug reports, or feature feedback? Reach out directly to the official developer mailbox:
          </p>

          <div style="display:inline-flex; align-items:center; gap:0.75rem; background:rgba(15,15,24,0.9); border:1px solid rgba(148,0,211,0.4); border-radius:var(--radius-full); padding:0.65rem 1.4rem; box-shadow:0 0 20px rgba(148,0,211,0.2); margin-bottom:1.25rem;">
            <span style="font-family:var(--font-mono); font-size:1.05rem; font-weight:700; color:#93c5fd;" id="contact-email-val">yashgamershakya@gmail.com</span>
            <button class="btn btn-secondary btn-sm" id="btn-copy-email-action" style="padding:0.3rem 0.75rem; font-size:0.8rem;">
              📋 Copy
            </button>
          </div>

          <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=yashgamershakya@gmail.com&su=TheSimple%27s%20Tools%20Inquiry" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Launch Gmail Web</span>
            </a>
            <a href="mailto:yashgamershakya@gmail.com?subject=TheSimple%27s%20Tools%20Support" class="btn btn-secondary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              <span>Open Default Mail App</span>
            </a>
          </div>
        </div>

        <!-- Interactive Direct Message Form -->
        <div style="background:rgba(18,18,28,0.85); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-lg); padding:1.75rem;">
          <h4 style="font-size:1.15rem; font-weight:700; color:#fff; margin-bottom:0.4rem;">Send a Message Directly to Creator</h4>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Submitting this form dispatches an automated notification directly to <strong>yashgamershakya@gmail.com</strong>.
          </p>

          <div id="contact-form-status-box"></div>

          <form id="contact-quick-form">
            <div class="tool-controls-row" style="background:transparent; padding:0; border:none; margin:0 0 1rem;">
              <div class="control-item">
                <label class="control-label" for="contact-name">Your Name</label>
                <input type="text" class="control-input" id="contact-name" name="name" placeholder="Your name..." required />
              </div>
              <div class="control-item">
                <label class="control-label" for="contact-sender-email">Your Email Address</label>
                <input type="email" class="control-input" id="contact-sender-email" name="email" placeholder="name@example.com..." required />
              </div>
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
              <label class="control-label" for="contact-subject">Subject</label>
              <input type="text" class="control-input" id="contact-subject" name="subject" placeholder="Feature suggestion, feedback, tool issue..." required />
            </div>
            <div class="form-group" style="margin-bottom:1.25rem;">
              <label class="control-label" for="contact-message">Message Details</label>
              <textarea class="control-input" id="contact-message" name="message" rows="4" placeholder="Explain your feedback or issue in detail..." style="resize:vertical;" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" id="btn-submit-contact" style="width:100%;">
              <span>Send Message to yashgamershakya@gmail.com</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>
    `;

    const copyBtn = modalBody.querySelector('#btn-copy-email-action');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const ok = await copyTextToClipboard('yashgamershakya@gmail.com');
        copyBtn.textContent = ok ? '✓ Copied!' : 'Copy failed';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
        if (ok && window.showToast) window.showToast('Copied yashgamershakya@gmail.com to clipboard!');
        else if (!ok && window.showToast) window.showToast('Copy blocked — long-press to copy the address.');
      });
    }

    const contactForm = modalBody.querySelector('#contact-quick-form');
    const statusBox = modalBody.querySelector('#contact-form-status-box');

    if (contactForm) {
      const submitBtnDefaultHtml = contactForm.querySelector('#btn-submit-contact')?.innerHTML || '';
      const showFormError = (msg) => {
        statusBox.innerHTML = `
          <div style="background:rgba(220, 20, 60, 0.12); border:1px solid rgba(220, 20, 60, 0.35); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.25rem;">
            <p style="color:#fca5a5; font-size:0.88rem; margin:0;">⚠️ ${escapeHtml(msg)}</p>
          </div>
        `;
      };

      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('#btn-submit-contact');
        const nameVal = contactForm.querySelector('#contact-name').value.trim();
        const emailVal = contactForm.querySelector('#contact-sender-email').value.trim();
        const subjectVal = contactForm.querySelector('#contact-subject').value.trim();
        const messageVal = contactForm.querySelector('#contact-message').value.trim();

        if (!nameVal || !emailVal || !subjectVal || !messageVal) {
          showFormError('Please fill in your name, email, subject, and message before sending.');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          showFormError('That email address does not look valid — please double-check it.');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Dispatching to yashgamershakya@gmail.com...</span>`;
        statusBox.innerHTML = '';

        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=yashgamershakya@gmail.com&su=${encodeURIComponent(`[TheSimple's Tools] ${subjectVal}`)}&body=${encodeURIComponent(`Sender: ${nameVal} (${emailVal})\n\nMessage:\n${messageVal}`)}`;
        const mailtoLink = `mailto:yashgamershakya@gmail.com?subject=${encodeURIComponent(`[TheSimple's Tools] ${subjectVal}`)}&body=${encodeURIComponent(`Sender: ${nameVal} (${emailVal})\n\nMessage:\n${messageVal}`)}`;

        const restoreSubmit = (label) => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = label || submitBtnDefaultHtml;
        };

        try {
          const payload = {
            name: nameVal,
            email: emailVal,
            _subject: `[TheSimpleTools Contact] ${subjectVal}`,
            message: messageVal,
            _template: 'table',
            _captcha: 'false'
          };

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          let response = null;
          try {
            response = await fetch('https://formsubmit.co/ajax/yashgamershakya@gmail.com', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
          } finally {
            clearTimeout(timeoutId);
          }

          const data = await response.json().catch(() => null);
          const delivered = response.ok && (data?.success === 'true' || data?.success === true || data === null);

          if (delivered) {
            statusBox.innerHTML = `
              <div style="background:rgba(34, 197, 94, 0.15); border:1px solid rgba(34, 197, 94, 0.4); border-radius:var(--radius-md); padding:1.25rem; text-align:center; margin-bottom:1.25rem;">
                <div style="font-size:2rem; margin-bottom:0.35rem;">🎉</div>
                <h4 style="color:#86efac; font-size:1.1rem; font-weight:700; margin-bottom:0.3rem;">Message Delivered Successfully!</h4>
                <p style="color:#cbd5e1; font-size:0.88rem; line-height:1.5;">
                  Your message has been transmitted directly to <strong>yashgamershakya@gmail.com</strong>.
                  The administrator will review your message shortly.
                </p>
              </div>
            `;
            contactForm.reset();
            restoreSubmit();
            if (window.showToast) window.showToast('Message sent to yashgamershakya@gmail.com!');
            return;
          } else {
            throw new Error(data?.message || `Dispatch rejected (HTTP ${response.status}). Note: FormSubmit requires a one-time mailbox activation before background sends succeed.`);
          }
        } catch (err) {
          const isAbort = err && err.name === 'AbortError';
          console.warn('Contact dispatch failed, offering direct mail fallback:', err);
          statusBox.innerHTML = `
            <div style="background:rgba(220, 20, 60, 0.12); border:1px solid rgba(220, 20, 60, 0.35); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
              <h4 style="color:#fca5a5; font-size:1rem; font-weight:700; margin-bottom:0.4rem;">Direct Mail Fallback Ready</h4>
              <p style="color:#cbd5e1; font-size:0.85rem; margin-bottom:0.75rem; line-height:1.5;">
                ${escapeHtml(isAbort ? 'The background dispatch timed out.' : 'Background dispatch was blocked (network, adblocker, or FormSubmit mailbox not yet activated).')}
                Your typed message is preserved! Send it instantly via your preferred client:
              </p>
              <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                <a href="${gmailLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                  🚀 Open Pre-filled Gmail
                </a>
                <a href="${mailtoLink}" class="btn btn-secondary btn-sm">
                  ✉️ Open Default Mail App
                </a>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-typed-msg">
                  📋 Copy Full Message
                </button>
              </div>
            </div>
          `;

          const copyTypedBtn = statusBox.querySelector('#btn-copy-typed-msg');
          if (copyTypedBtn) {
            copyTypedBtn.addEventListener('click', async () => {
              const fullText = `To: yashgamershakya@gmail.com\nFrom: ${nameVal} (${emailVal})\nSubject: [TheSimple's Tools] ${subjectVal}\n\n${messageVal}`;
              const ok = await copyTextToClipboard(fullText);
              copyTypedBtn.textContent = ok ? '✓ Copied!' : 'Copy failed';
              setTimeout(() => copyTypedBtn.textContent = '📋 Copy Full Message', 2000);
              if (ok && window.showToast) window.showToast('Copied full email text to clipboard!');
            });
          }

          restoreSubmit(`<span>Retry Sending Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`);
        }
      });
    }
  } else if (type === 'about') {
    modalIcon.innerHTML = `<span style="font-size:1.4rem;">🌟</span>`;
    modalTitle.textContent = "About TheSimpleTools";
    modalSubtitle.textContent = "The Ultimate All-in-One Online Utility Toolbox";
    modalBody.innerHTML = `
      <div style="line-height:1.7; color:#cbd5e1; font-size:0.95rem; display:flex; flex-direction:column; gap:1.25rem;">
        <div>
          <h3 style="color:#fff; font-size:1.3rem; margin-bottom:0.5rem;">Our Mission</h3>
          <p>
            <strong>TheSimpleTools</strong> was created with a clear vision: to provide developers, media creators, students, and power users with a lightning-fast, high-tech, and completely private toolbox that operates 100% locally in the browser.
          </p>
        </div>

        <div style="background:rgba(20,20,32,0.7); border:1px solid var(--border-glass); border-radius:var(--radius-md); padding:1.25rem;">
          <h4 style="color:#f43f5e; font-size:1rem; margin-bottom:0.5rem;">Inspired by YashGamerShakya</h4>
          <p style="font-size:0.9rem; color:var(--text-muted);">
            Conceived and built to eliminate slow, ad-ridden web utilities and protect user confidentiality. No files, audio tracks, or code snippets are ever uploaded to a remote server.
          </p>
          <div style="margin-top:0.75rem; font-size:0.88rem;">
            <span>Contact Creator: </span>
            <a href="mailto:yashgamershakya@gmail.com" style="color:#93c5fd; font-family:var(--font-mono); text-decoration:underline;">yashgamershakya@gmail.com</a>
          </div>
        </div>

        <div>
          <h3 style="color:#fff; font-size:1.15rem; margin-bottom:0.5rem;">Key Architecture Pillars</h3>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.4rem;">
            <li><strong>Hardware Accelerated Web APIs:</strong> Web Audio API, Canvas 2D, and Web Crypto API for zero-latency execution.</li>
            <li><strong>Zero Server Uploads:</strong> Absolute privacy. Your data stays in your browser memory.</li>
            <li><strong>Mobile & Package Utilities:</strong> Native APK structure inspection, DEX analysis, and APK-to-ZIP conversion powered by JSZip.</li>
            <li><strong>Community Powered:</strong> Continuously evolving based on user votes and tool suggestions.</li>
          </ul>
        </div>
      </div>
    `;
  } else if (type === 'terms') {
    modalIcon.innerHTML = `<span style="font-size:1.4rem;">⚖️</span>`;
    modalTitle.textContent = "Terms of Service";
    modalSubtitle.textContent = "TheSimpleTools Usage Terms & Conditions";
    modalBody.innerHTML = `
      <div style="line-height:1.7; color:#cbd5e1; font-size:0.95rem; display:flex; flex-direction:column; gap:1.25rem;">
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">1. Acceptance of Terms</h3>
          <p>By accessing or utilizing TheSimpleTools, you acknowledge and agree to these terms. All utilities provided on this platform execute strictly on the client side inside modern web browsers.</p>
        </div>
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">2. Client-Side Processing & Privacy</h3>
          <p>All file conversions, audio decoding, video processing, and APK conversions run locally in your computer or mobile device. The platform never transmits your files or sensitive code to any third party.</p>
        </div>
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">3. Free & Open Access</h3>
          <p>TheSimpleTools is free to use for personal, academic, and commercial developer workflows without licensing charges.</p>
        </div>
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">4. Inquiries & Support</h3>
          <p>For questions or licensing queries, contact the team at <a href="mailto:yashgamershakya@gmail.com" style="color:#f43f5e; text-decoration:underline;">yashgamershakya@gmail.com</a>.</p>
        </div>
      </div>
    `;
  } else if (type === 'privacy') {
    modalIcon.innerHTML = `<span style="font-size:1.4rem;">🛡️</span>`;
    modalTitle.textContent = "Privacy Policy";
    modalSubtitle.textContent = "100% Client-Side Zero-Data-Collection Guarantee";
    modalBody.innerHTML = `
      <div style="line-height:1.7; color:#cbd5e1; font-size:0.95rem; display:flex; flex-direction:column; gap:1.25rem;">
        <div style="background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); border-radius:var(--radius-md); padding:1rem 1.25rem;">
          <h4 style="color:#86efac; font-size:1.05rem; margin-bottom:0.25rem;">🔒 Zero Server Upload Architecture</h4>
          <p style="font-size:0.9rem; color:#cbd5e1;">Your files never leave your browser. All computations (SHA-256 hashes, audio enhancements, APK unzipping, image compressions) run in browser memory.</p>
        </div>
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">Data Storage</h3>
          <p>No user accounts, cookies, or tracking beacons are used. Only non-identifiable community upvote states and tool request lists are saved in your browser's local storage for your convenience.</p>
        </div>
        <div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">Contact Privacy Officer</h3>
          <p>If you have any questions regarding privacy, contact <a href="mailto:yashgamershakya@gmail.com" style="color:#f43f5e; text-decoration:underline;">yashgamershakya@gmail.com</a>.</p>
        </div>
      </div>
    `;
  } else if (type === 'api') {
    modalIcon.innerHTML = `<span style="font-size:1.4rem;">⚡</span>`;
    modalTitle.textContent = "Developer API & SDK Documentation";
    modalSubtitle.textContent = "Integrating TheSimpleTools Engine";
    modalBody.innerHTML = `
      <div style="line-height:1.7; color:#cbd5e1; font-size:0.95rem; display:flex; flex-direction:column; gap:1.25rem;">
        <p>TheSimpleTools is built as a set of decoupled, high-performance ES6 JavaScript modules that can be imported directly into other web applications.</p>

        <div>
          <h4 style="color:#fff; margin-bottom:0.3rem;">Example: Client-Side Audio WAV Transcoder</h4>
          <pre style="background:#09090e; border:1px solid rgba(255,255,255,0.08); padding:1rem; border-radius:8px; font-family:var(--font-mono); color:#93c5fd; font-size:0.82rem; overflow-x:auto;">
import { audioBufferToWav } from './tools/audioConverter.js';

// Decode any audio format with native Web Audio API
const audioCtx = new AudioContext();
const audioBuffer = await audioCtx.decodeAudioData(fileArrayBuffer);

// Export lossless WAV blob with custom sample rate (e.g. 48kHz)
const wavBlob = audioBufferToWav(audioBuffer, { sampleRate: 48000, channels: 2 });
          </pre>
        </div>

        <div>
          <h4 style="color:#fff; margin-bottom:0.3rem;">Example: Client-Side APK to ZIP Converter</h4>
          <pre style="background:#09090e; border:1px solid rgba(255,255,255,0.08); padding:1rem; border-radius:8px; font-family:var(--font-mono); color:#c084fc; font-size:0.82rem; overflow-x:auto;">
import JSZip from 'jszip';

const zip = new JSZip();
const apkPackage = await zip.loadAsync(apkFile);
const zipBlob = await apkPackage.generateAsync({ type: 'blob', compression: 'DEFLATE' });
          </pre>
        </div>

        <div>
          <p>For custom SDK enterprise integrations, contact: <a href="mailto:yashgamershakya@gmail.com" style="color:#f43f5e; text-decoration:underline;">yashgamershakya@gmail.com</a>.</p>
        </div>
      </div>
    `;
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initMobileNav() {
  const toggle = document.querySelector('#mobile-nav-toggle');
  const links = document.querySelector('#nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }
}
