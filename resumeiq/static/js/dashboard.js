/**
 * dashboard.js — Upload, drag-drop, animations, flash handling
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Flash auto-dismiss
  document.querySelectorAll('.flash').forEach(flash => {
    const dismiss = () => {
      flash.style.animation = 'slideOut 0.35s ease forwards';
      setTimeout(() => flash.remove(), 350);
    };
    setTimeout(dismiss, 5500);
    flash.addEventListener('click', dismiss);
  });

  // ── Upload zone drag-and-drop
  const uploadArea = document.getElementById('uploadArea');
  const fileInput  = document.getElementById('resumeFile');
  const uploadForm = document.getElementById('uploadForm');
  const loadingOverlay = document.getElementById('loadingOverlay');

  if (!uploadArea || !fileInput) return;

  // Click to open file dialog
  uploadArea.addEventListener('click', (e) => {
    if (!e.target.closest('button')) fileInput.click();
  });

  const selectBtn = document.getElementById('selectFilesBtn');
  if (selectBtn) selectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  // Drag events
  ['dragenter', 'dragover'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault();
      uploadArea.classList.add('dragging');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    uploadArea.addEventListener(evt, e => {
      e.preventDefault();
      uploadArea.classList.remove('dragging');
    });
  });

  uploadArea.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    if (files.length) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFileSelected(fileInput.files[0]);
  });

  function handleFileSelected(file) {
    const allowed = ['application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword', 'text/plain'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf','docx','doc','txt'].includes(ext)) {
      showToast('Invalid file type. Please upload PDF, DOCX or TXT.', 'error');
      return;
    }
    if (file.size > 16 * 1024 * 1024) {
      showToast('File too large. Maximum 16 MB.', 'error');
      return;
    }
    // Update UI
    const iconEl = uploadArea.querySelector('.material-symbols-outlined');
    if (iconEl) iconEl.textContent = 'check_circle';
    const h3 = uploadArea.querySelector('h3');
    if (h3) h3.textContent = file.name;
    const p  = uploadArea.querySelector('p');
    if (p)  p.textContent = `${(file.size / 1024).toFixed(1)} KB · Ready to analyze`;

    // Auto-submit
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (uploadForm) uploadForm.submit();
  }

  // ── Candidate row click → analysis
  document.querySelectorAll('.candidate-row[data-href]').forEach(row => {
    row.addEventListener('click', () => { window.location.href = row.dataset.href; });
  });

  // ── Animate stat cards on scroll
  const animEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animEls.forEach(el => {
      el.style.opacity = '0';
      io.observe(el);
    });
  }

  // ── Counter animation for stat numbers
  function animateCount(el, target, suffix = '') {
    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    setTimeout(() => animateCount(el, target, suffix), 300);
  });
});

// ── Toast notification
function showToast(message, type = 'info') {
  const container = document.querySelector('.flash-container') || createFlashContainer();
  const toast = document.createElement('div');
  toast.className = `flash flash-${type}`;
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  toast.innerHTML = `<span class="material-symbols-outlined icon-fill">${icons[type]||'info'}</span> ${message}`;
  container.appendChild(toast);
  const dismiss = () => {
    toast.style.animation = 'slideOut 0.35s ease forwards';
    setTimeout(() => toast.remove(), 350);
  };
  setTimeout(dismiss, 5000);
  toast.addEventListener('click', dismiss);
}

function createFlashContainer() {
  const c = document.createElement('div');
  c.className = 'flash-container';
  document.body.appendChild(c);
  return c;
}
