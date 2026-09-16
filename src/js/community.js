export function initCommunity() {
  const INITIAL_REQUESTS = [
    { id: 'req-1', title: 'Hardware Accelerated WebM to MP4 Transcoder', category: 'Media', upvotes: 42, userUpvoted: false },
    { id: 'req-2', title: 'PDF Page Extractor, Splitter & OCR Utilities', category: 'Documents', upvotes: 38, userUpvoted: false },
    { id: 'req-3', title: 'Lossless AVIF & HEIC Universal Image Converter', category: 'Converters', upvotes: 29, userUpvoted: false },
    { id: 'req-4', title: 'GraphQL to TypeScript Interface Type Generator', category: 'Dev Tools', upvotes: 21, userUpvoted: false }
  ];

  let storedRequests = null;
  try {
    const saved = localStorage.getItem('thesimpleyash_tool_requests');
    if (saved) storedRequests = JSON.parse(saved);
  } catch (e) {}

  if (!storedRequests || !Array.isArray(storedRequests)) {
    storedRequests = INITIAL_REQUESTS;
    localStorage.setItem('thesimpleyash_tool_requests', JSON.stringify(storedRequests));
  }

  const listEl = document.querySelector('#community-requests-list');
  const formEl = document.querySelector('#tool-request-form');

  function renderRequests() {
    if (!listEl) return;
    listEl.innerHTML = '';

    // Sort by upvotes descending
    storedRequests.sort((a, b) => b.upvotes - a.upvotes);

    storedRequests.slice(0, 5).forEach(req => {
      const item = document.createElement('div');
      item.className = 'request-item';
      item.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.2rem;">
          <div style="font-size:0.92rem; font-weight:600; color:#fff;">${escapeHtml(req.title)}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">Category: ${escapeHtml(req.category)}</div>
        </div>
        <button class="upvote-btn ${req.userUpvoted ? 'upvoted' : ''}" data-id="${req.id}">
          ▲ ${req.upvotes}
        </button>
      `;

      const upvoteBtn = item.querySelector('.upvote-btn');
      upvoteBtn.addEventListener('click', () => {
        if (!req.userUpvoted) {
          req.upvotes += 1;
          req.userUpvoted = true;
          window.showToast?.(`Upvoted "${req.title}"!`);
        } else {
          req.upvotes -= 1;
          req.userUpvoted = false;
        }
        localStorage.setItem('thesimpleyash_tool_requests', JSON.stringify(storedRequests));
        renderRequests();
      });

      listEl.appendChild(item);
    });
  }

  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = formEl.querySelector('#req-title');
      const catSelect = formEl.querySelector('#req-category');
      const descInput = formEl.querySelector('#req-desc');

      const title = titleInput.value.trim();
      const cat = catSelect.value;
      if (!title) return;

      const newReq = {
        id: 'req-' + Date.now(),
        title: title,
        category: cat,
        upvotes: 1,
        userUpvoted: true,
        desc: descInput ? descInput.value.trim() : ''
      };

      storedRequests.unshift(newReq);
      localStorage.setItem('thesimpleyash_tool_requests', JSON.stringify(storedRequests));
      renderRequests();

      titleInput.value = '';
      if (descInput) descInput.value = '';

      if (window.showToast) {
        window.showToast('Your tool request was submitted to the community queue!');
      }
    });
  }

  renderRequests();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Toast notification helper
export function initToastSystem() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div style="font-size:1.2rem; color:var(--crimson);">⚡</div>
      <div style="font-size:0.9rem; font-weight:500; color:#fff;">${escapeHtml(message)}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };
}
