/**
 * auth.js — Login & Signup form enhancements
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Password visibility toggles
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper').querySelector('input');
      const icon  = btn.querySelector('.material-symbols-outlined');
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility';
      }
    });
  });

  // ── Password strength meter
  const pwInput = document.querySelector('#password');
  const strengthBar  = document.querySelector('.pw-strength-fill');
  const strengthText = document.querySelector('.pw-strength-text');

  if (pwInput && strengthBar) {
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      let score = 0;
      if (val.length >= 8)  score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const pct = (score / 4) * 100;
      strengthBar.style.width = pct + '%';

      const levels = [
        { pct: 25,  color: '#ba1a1a', label: 'Weak' },
        { pct: 50,  color: '#754c00', label: 'Fair' },
        { pct: 75,  color: '#0f38ed', label: 'Good' },
        { pct: 100, color: '#006e2a', label: 'Strong' },
      ];
      const level = levels[score - 1] || levels[0];
      strengthBar.style.background = level ? level.color : '#e2e2e5';
      if (strengthText) strengthText.textContent = val.length ? (level ? level.label : '') : '';
    });
  }

  // ── Auto-dismiss flash messages
  document.querySelectorAll('.flash').forEach(flash => {
    setTimeout(() => {
      flash.style.animation = 'slideOut 0.35s ease forwards';
      setTimeout(() => flash.remove(), 350);
    }, 5000);
    flash.addEventListener('click', () => {
      flash.style.animation = 'slideOut 0.35s ease forwards';
      setTimeout(() => flash.remove(), 350);
    });
  });

  // ── Form loading state on submit
  document.querySelectorAll('.auth-form').forEach(form => {
    form.addEventListener('submit', function () {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner" style="width:1.2rem;height:1.2rem;border-width:2px;margin-right:0.5rem;"></span> Processing...';
      }
    });
  });
});
