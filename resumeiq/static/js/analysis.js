/**
 * analysis.js — Animated score circle, skill bars, career paths
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Flash dismiss
  document.querySelectorAll('.flash').forEach(flash => {
    const dismiss = () => {
      flash.style.animation = 'slideOut 0.35s ease forwards';
      setTimeout(() => flash.remove(), 350);
    };
    setTimeout(dismiss, 5500);
    flash.addEventListener('click', dismiss);
  });

  // ── Animated score circle (SVG stroke-dashoffset)
  const scoreCircle = document.querySelector('.score-ring');
  if (scoreCircle) {
    const score    = parseInt(scoreCircle.dataset.score || '0', 10);
    const radius   = parseFloat(scoreCircle.getAttribute('r'));
    const circum   = 2 * Math.PI * radius;
    scoreCircle.setAttribute('stroke-dasharray', circum);
    scoreCircle.setAttribute('stroke-dashoffset', circum);

    setTimeout(() => {
      const offset = circum - (score / 100) * circum;
      scoreCircle.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)';
      scoreCircle.setAttribute('stroke-dashoffset', offset);
    }, 400);
  }

  // ── ATS ring
  const atsRing = document.querySelector('.ats-ring');
  if (atsRing) {
    const score  = parseInt(atsRing.dataset.score || '0', 10);
    const radius = parseFloat(atsRing.getAttribute('r'));
    const circum = 2 * Math.PI * radius;
    atsRing.setAttribute('stroke-dasharray', circum);
    atsRing.setAttribute('stroke-dashoffset', circum);
    setTimeout(() => {
      const offset = circum - (score / 100) * circum;
      atsRing.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
      atsRing.setAttribute('stroke-dashoffset', offset);
    }, 600);
  }

  // ── Animated skill bar widths
  function animateBars() {
    document.querySelectorAll('.skill-bar-fill[data-width]').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.dataset.width + '%';
      }, 300 + i * 120);
    });
  }
  animateBars();

  // ── Counter animation for score number display
  function animateCount(el, target, suffix='') {
    let start = 0;
    const dur = 1400;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  document.querySelectorAll('[data-count]').forEach(el => {
    setTimeout(() => animateCount(el, parseInt(el.dataset.count, 10), el.dataset.suffix || ''), 500);
  });

  // ── Intersection observer: animate on scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger bar animation for newly visible bars
          entry.target.querySelectorAll('.skill-bar-fill[data-width]').forEach((bar, i) => {
            setTimeout(() => bar.style.width = bar.dataset.width + '%', i * 120);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });

    // visible class
    document.querySelectorAll('.visible').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // ── Career path hover effect already via CSS; add JS click to show %
  document.querySelectorAll('.career-path-item').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.cp-title')?.textContent;
      const score = item.querySelector('.cp-score')?.textContent;
      if (title && score) {
        showToast(`${title} — ${score} match based on your skill profile`, 'info');
      }
    });
  });

  // ── Delete confirm
  document.querySelectorAll('[data-confirm]').forEach(btn => {
    btn.addEventListener('click', e => {
      if (!confirm(btn.dataset.confirm || 'Are you sure?')) e.preventDefault();
    });
  });
});

function showToast(message, type = 'info') {
  let container = document.querySelector('.flash-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'flash-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `flash flash-${type}`;
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  toast.innerHTML = `<span class="material-symbols-outlined icon-fill">${icons[type]||'info'}</span> ${message}`;
  container.appendChild(toast);
  const dismiss = () => {
    toast.style.animation = 'slideOut 0.35s ease forwards';
    setTimeout(() => toast.remove(), 350);
  };
  setTimeout(dismiss, 4500);
  toast.addEventListener('click', dismiss);
}
