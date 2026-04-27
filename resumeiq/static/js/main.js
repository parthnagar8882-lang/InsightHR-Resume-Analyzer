/* static/js/main.js — InsightHR Core Scripts */
/* jshint esversion: 6 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. THEME MANAGEMENT ───────────────────────────────────────────────────
    const htmlEl     = document.documentElement;
    const themeToggles = document.querySelectorAll('.theme-toggle, #theme-toggle, #theme-toggle-mobile');
    const settingsUrl = document.body.dataset.settingsUrl;

    const setTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('insighthr_theme', theme);
        // Update all toggle icons
        themeToggles.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
        // Update Chart.js if present
        if (window.weeklyChart) updateChartTheme(window.weeklyChart, theme);
        if (window.scoreChart)  updateChartTheme(window.scoreChart, theme);
        if (window.skillChart)  updateChartTheme(window.skillChart, theme);
        if (window.atsChart)    updateChartTheme(window.atsChart, theme);
    };

    const persistTheme = (theme) => {
        if (!settingsUrl) return;

        const body = new URLSearchParams({ action: 'update_theme', theme });
        fetch(settingsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        }).catch(() => null);
    };

    // Read server-side preference first, then localStorage, then system
    const serverTheme = htmlEl.getAttribute('data-theme');
    const savedTheme  = localStorage.getItem('insighthr_theme');
    const sysDark     = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initTheme   = serverTheme || savedTheme || (sysDark ? 'dark' : 'light');
    setTheme(initTheme);

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const nextTheme = current === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            persistTheme(nextTheme);
        });
    });

    // ── 2. MOBILE SIDEBAR ─────────────────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar    = document.querySelector('.sidebar');
    const overlay    = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
        display: none; position: fixed; inset: 0;
        background: rgba(0,0,0,0.45); z-index: 35;
        backdrop-filter: blur(2px);
    `;
    document.body.appendChild(overlay);

    const openSidebar  = () => { sidebar && sidebar.classList.add('mobile-open'); overlay.style.display = 'block'; };
    const closeSidebar = () => { sidebar && sidebar.classList.remove('mobile-open'); overlay.style.display = 'none'; };

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar && sidebar.classList.contains('mobile-open') ? closeSidebar() : openSidebar();
        });
    }
    overlay.addEventListener('click', closeSidebar);

    // ── 3. DRAG & DROP FILE UPLOAD (Dashboard) ───────────────────────────────
    const uploadZone = document.getElementById('upload-zone');
    const fileInput  = document.getElementById('resume-upload');
    const uploadForm = document.getElementById('upload-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const browseBtn  = document.getElementById('browse-files-btn');

    console.log('🔍 Upload handler initialization:');
    console.log('  uploadZone found:', !!uploadZone, uploadZone);
    console.log('  fileInput found:', !!fileInput, fileInput);
    console.log('  uploadForm found:', !!uploadForm, uploadForm);
    console.log('  fileInput type:', fileInput?.type);
    console.log('  fileInput accept:', fileInput?.accept);

    if (uploadZone && fileInput) {
        console.log('✅ Upload zone and file input found - initializing upload handlers');
        
        // Make upload zone focusable
        uploadZone.setAttribute('role', 'button');
        uploadZone.setAttribute('tabindex', '0');
        const maxSize = 10 * 1024 * 1024;

        const setAnalyzeReady = (ready) => {
            if (!analyzeBtn) return;
            analyzeBtn.disabled = !ready;
            analyzeBtn.style.opacity = ready ? '1' : '0.6';
            analyzeBtn.style.cursor = ready ? 'pointer' : 'not-allowed';
        };

        const handleSelectedFile = (file) => {
            if (!file) {
                setAnalyzeReady(false);
                return;
            }

            if (file.size > maxSize) {
                alert('File size exceeds 10MB limit. Please choose a smaller file.');
                fileInput.value = '';
                uploadZone.classList.remove('has-file');
                setAnalyzeReady(false);
                return;
            }

            updateFileDisplay(uploadZone, file);
            setAnalyzeReady(true);

            if (uploadForm) {
                if (analyzeBtn) {
                    analyzeBtn.disabled = true;
                    analyzeBtn.innerHTML = '<span class="spinner"></span> Processing...';
                }
                setTimeout(() => uploadForm.submit(), 250);
            }
        };
        
        // Simple, reliable click trigger function
        const triggerFileInput = () => {
            console.log('📁 Browse clicked - attempting to open file dialog');
            
            // Method 1: Direct click
            console.log('  Trying method 1: Direct fileInput.click()');
            try {
                fileInput.click();
                console.log('✅ Method 1 succeeded: File dialog opened');
            } catch (err) {
                console.error('❌ Method 1 failed:', err);
                
                // Method 2: Temporarily show the file input
                console.log('  Trying method 2: Temporarily show input + click');
                fileInput.style.position = 'static';
                fileInput.style.opacity = '1';
                fileInput.style.visibility = 'visible';
                fileInput.style.width = 'auto';
                fileInput.style.height = 'auto';
                
                try {
                    fileInput.click();
                    console.log('✅ Method 2 succeeded: File dialog opened');
                } catch (err2) {
                    console.error('❌ Method 2 also failed:', err2);
                }
                
                // Hide it again
                setTimeout(() => {
                    fileInput.style.position = '';
                    fileInput.style.opacity = '';
                    fileInput.style.visibility = '';
                    fileInput.style.width = '';
                    fileInput.style.height = '';
                }, 100);
            }
        };
        
        // Simple direct click handler - no event prevention
        uploadZone.addEventListener('click', (e) => {
            console.log('📍 Click event on upload zone detected');
            triggerFileInput();
        });

        // Keyboard accessibility (Enter & Space)
        uploadZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerFileInput();
            }
        });

        // Drag events
        ['dragenter','dragover'].forEach(evt => {
            uploadZone.addEventListener(evt, e => {
                e.preventDefault(); 
                e.stopPropagation();
                uploadZone.classList.add('dragover');
                console.log('🔄 Drag over - ready to drop');
            });
        });
        ['dragleave','drop'].forEach(evt => {
            uploadZone.addEventListener(evt, e => {
                e.preventDefault(); 
                e.stopPropagation();
                uploadZone.classList.remove('dragover');
            });
        });
        uploadZone.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                console.log(`📤 File dropped: ${files[0].name}`);
                fileInput.files = files;
                updateFileDisplay(uploadZone, files[0]);
                // Auto-submit after 500ms
                setTimeout(() => {
                    console.log('📤 Auto-submitting form with dropped file');
                    uploadForm && uploadForm.submit();
                }, 500);
            }
        });
        
        // File input change handler - AUTO-SUBMIT
        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) {
                console.log(`✅ File selected: ${fileInput.files[0].name}`);
                updateFileDisplay(uploadZone, fileInput.files[0]);
                
                // Validate file size (max 10MB)
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (fileInput.files[0].size > maxSize) {
                    console.error('❌ File too large (max 10MB)');
                    alert('File size exceeds 10MB limit. Please choose a smaller file.');
                    fileInput.value = '';
                    uploadZone.classList.remove('has-file');
                    return;
                }
                
                // Auto-submit the form after file selection
                if (uploadForm) {
                    console.log('📤 Auto-submitting form with selected file');
                    // Set loading state
                    if (analyzeBtn) {
                        analyzeBtn.disabled = true;
                        analyzeBtn.innerHTML = '<span class="spinner"></span> Processing…';
                    }
                    // Submit form
                    setTimeout(() => uploadForm.submit(), 300);
                }
            }
        });
    } else {
        console.error('❌ UPLOAD ZONE INITIALIZATION FAILED');
        if (!uploadZone) console.error('  - uploadZone element NOT FOUND (id="upload-zone")');
        if (!fileInput) console.error('  - fileInput element NOT FOUND (id="resume-upload")');
        console.error('  Available IDs in page:', Array.from(document.querySelectorAll('[id]')).map(el => el.id).join(', '));
    }

    function updateFileDisplay(zone, file) {
        zone.classList.add('has-file');
        const icon = zone.querySelector('.upload-icon');
        const primary = zone.querySelector('p.upload-primary');
        const sub     = zone.querySelector('p.upload-sub');
        if (icon)    { 
            icon.className = 'fas fa-file-check upload-icon'; 
            icon.style.color = 'var(--green)'; 
        }
        if (primary) primary.innerHTML = `<strong>✓ ${file.name}</strong>`;
        if (sub)     sub.textContent = formatFileSize(file.size);
    }

    // ── 4. COMPARE PAGE DROP ZONES ────────────────────────────────────────────
    const setupDropzone = (zoneId, inputId) => {
        const zone  = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        if (!zone || !input) return;
        
        console.log(`✅ Setting up dropzone: ${zoneId} -> ${inputId}`);
        
        // Simple click handler
        const triggerFileInput = () => {
            console.log(`📁 Browse ${inputId} clicked`);
            input.click();
        };
        
        zone.addEventListener('click', triggerFileInput);
        
        // Keyboard accessibility
        zone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerFileInput();
            }
        });
        
        // Drag events
        ['dragenter','dragover'].forEach(e => {
            zone.addEventListener(e, ev => { 
                ev.preventDefault(); 
                ev.stopPropagation();
                zone.classList.add('dragover'); 
            });
        });
        ['dragleave','drop'].forEach(e => {
            zone.addEventListener(e, ev => { 
                ev.preventDefault(); 
                ev.stopPropagation();
                zone.classList.remove('dragover'); 
            });
        });
        zone.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            if (files.length > 0) { 
                console.log(`📤 File dropped on ${zoneId}: ${files[0].name}`);
                input.files = files; 
                updateDropZone(zone, files[0]); 
            }
        });
        input.addEventListener('change', () => {
            if (input.files[0]) {
                console.log(`✅ File selected for ${inputId}: ${input.files[0].name}`);
                updateDropZone(zone, input.files[0]);
            }
        });
    };

    function updateDropZone(zone, file) {
        zone.classList.add('has-file');
        const p = zone.querySelector('p');
        if (p) p.innerHTML = `<strong>✓ ${file.name}</strong><br><small>${formatFileSize(file.size)}</small>`;
        const icon = zone.querySelector('i');
        if (icon) { 
            icon.className = 'fas fa-file-check upload-icon'; 
            icon.style.color = 'var(--green)'; 
        }
    }

    setupDropzone('upload-zone-1', 'resume_a');
    setupDropzone('upload-zone-2', 'resume_b');

    // ── 5. FLASH MESSAGE AUTO-DISMISS ─────────────────────────────────────────
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            alert.style.opacity     = '0';
            alert.style.transform   = 'translateY(-12px)';
            alert.style.transition  = 'all 0.45s ease';
            setTimeout(() => alert.remove(), 460);
        }, 5000);
    });

    // ── 6. SKILL BAR ANIMATIONS ───────────────────────────────────────────────
    animateSkillBars();

    // ── 7. PDF EXPORT ─────────────────────────────────────────────────────────
    setupPDFExport();

    // ── 8. CHART INITIALIZATION ───────────────────────────────────────────────
    initCharts();

    // ── 9. PASSWORD TOGGLE ────────────────────────────────────────────────────
    document.querySelectorAll('.eye-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            const icon   = btn.querySelector('i');
            if (!target) return;
            if (target.type === 'password') {
                target.type = 'text';
                icon && icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                target.type = 'password';
                icon && icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // ── 10. FORM LOADING STATE ────────────────────────────────────────────────
    document.querySelectorAll('form[data-loading]').forEach(form => {
        form.addEventListener('submit', () => {
            const btn = form.querySelector('[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner"></span> Processing…';
            }
        });
    });

    // ── 11. ACTIVE NAV HIGHLIGHT ──────────────────────────────────────────────
    highlightNav();

    // ── 12. COUNTER ANIMATION ─────────────────────────────────────────────────
    animateCounters();

    // ── 13. SCROLL REVEAL ─────────────────────────────────────────────────────
    setupScrollReveal();

}); // end DOMContentLoaded


// ── HELPER: Format file size ──────────────────────────────────────────────────
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}


// ── CHART INITIALIZATION ──────────────────────────────────────────────────────
function getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text:      isDark ? '#94A3B8' : '#6B7280',
        grid:      isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
        primary:   '#6C63FF',
        secondary: '#8B5CF6',
        accent:    '#14B8A6',
        primaryBg: 'rgba(108,99,255,0.15)',
        dark:      isDark,
    };
}

function initCharts() {
    const c = getThemeColors();

    // ── Weekly Activity Bar Chart (Dashboard) ──
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx && window.chartData) {
        const labels = window.chartData.map(d => d.day);
        const data   = window.chartData.map(d => d.count);

        window.weeklyChart = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Resumes Analyzed',
                    data,
                    backgroundColor: c.primaryBg,
                    borderColor: c.primary,
                    borderWidth: 1.5,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 900, easing: 'easeInOutQuart' },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: c.text, font: { family: "'Inter',sans-serif", size: 11 } },
                        grid: { color: c.grid }
                    },
                    x: {
                        ticks: { color: c.text, font: { family: "'Inter',sans-serif", size: 11 } },
                        grid: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // ── Top Skills Doughnut (Dashboard) ──
    const skillCtx = document.getElementById('skillChart');
    if (skillCtx && window.topSkillsData && window.topSkillsData.length) {
        const labels = window.topSkillsData.map(d => d[0]);
        const data   = window.topSkillsData.map(d => d[1]);
        const colors = ['#6C63FF','#8B5CF6','#14B8A6','#3B82F6','#F59E0B','#EF4444'];

        window.skillChart = new Chart(skillCtx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{ data, backgroundColor: colors, borderWidth: 0, cutout: '70%' }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: c.text, font: { size: 11, family: "'Inter',sans-serif" }, boxWidth: 10, padding: 12 } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} analyses` } }
                },
                animation: { animateScale: true, animateRotate: true }
            }
        });
    }

    // ── Score Doughnut (Report Page) ──
    const scoreCtx = document.getElementById('scoreChart');
    if (scoreCtx && window.resumeScore !== undefined) {
        const score = window.resumeScore;
        let color = '#EF4444';
        if (score >= 80) color = '#10B981';
        else if (score >= 60) color = '#F59E0B';
        const bg = c.dark ? '#334155' : '#E5E7EB';

        window.scoreChart = new Chart(scoreCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [color, bg],
                    borderWidth: 0,
                    cutout: '82%',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { tooltip: { enabled: false } },
                animation: { animateRotate: true, duration: 1200, easing: 'easeInOutQuart' }
            }
        });
    }

    // ── ATS Score Doughnut (Report Page) ──
    const atsCtx = document.getElementById('atsChart');
    if (atsCtx && window.atsScore !== undefined) {
        const score = window.atsScore;
        let color = '#EF4444';
        if (score >= 80) color = '#10B981';
        else if (score >= 60) color = '#F59E0B';
        const bg = c.dark ? '#334155' : '#E5E7EB';

        window.atsChart = new Chart(atsCtx, {
            type: 'doughnut',
            data: { datasets: [{ data: [score, 100-score], backgroundColor: [color, bg], borderWidth: 0, cutout: '80%' }] },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { tooltip: { enabled: false } },
                animation: { animateRotate: true, duration: 1200, delay: 300, easing: 'easeInOutQuart' }
            }
        });
    }
}

function updateChartTheme(chart, theme) {
    const isDark   = theme === 'dark';
    const textCol  = isDark ? '#94A3B8' : '#6B7280';
    const gridCol  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

    if (chart.config.type === 'bar') {
        if (chart.options.scales.x) chart.options.scales.x.ticks.color = textCol;
        if (chart.options.scales.y) {
            chart.options.scales.y.ticks.color = textCol;
            chart.options.scales.y.grid.color  = gridCol;
        }
    } else if (chart.config.type === 'doughnut') {
        const bg = isDark ? '#334155' : '#E5E7EB';
        if (chart.data.datasets[0].data.length === 2) {
            chart.data.datasets[0].backgroundColor[1] = bg;
        } else if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = textCol;
        }
    }
    chart.update();
}


// ── SKILL BAR ANIMATION ───────────────────────────────────────────────────────
function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-width');
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.1 });
    bars.forEach(bar => observer.observe(bar));
}


// ── PDF EXPORT ────────────────────────────────────────────────────────────────
function setupPDFExport() {
    const btn = document.getElementById('export-pdf-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        btn.innerHTML = '<span class="spinner"></span> Generating…';
        btn.disabled  = true;

        const element   = document.querySelector('.page-content');
        const prevTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', 'light');

        if (window.scoreChart) updateChartTheme(window.scoreChart, 'light');
        if (window.atsChart)   updateChartTheme(window.atsChart, 'light');

        // Hide action buttons during capture
        const actionBtns = document.querySelectorAll('.no-print');
        actionBtns.forEach(b => b.style.display = 'none');

        const opt = {
            margin:      [10, 10, 10, 10],
            filename:    'InsightHR_Resume_Report.pdf',
            image:       { type: 'jpeg', quality: 0.97 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } finally {
            btn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
            btn.disabled  = false;
            document.documentElement.setAttribute('data-theme', prevTheme);
            if (window.scoreChart) updateChartTheme(window.scoreChart, prevTheme);
            if (window.atsChart)   updateChartTheme(window.atsChart, prevTheme);
            actionBtns.forEach(b => b.style.display = '');
        }
    });
}


// ── ACTIVE NAV ────────────────────────────────────────────────────────────────
function highlightNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href && href !== '#' && path.startsWith(href.split('?')[0]) && href !== '/') {
            link.classList.add('active');
        }
    });
}


// ── COUNTER ANIMATION ─────────────────────────────────────────────────────────
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el      = entry.target;
            const target  = parseFloat(el.getAttribute('data-count'));
            const isFloat = !Number.isInteger(target);
            const suffix  = el.getAttribute('data-suffix') || '';
            let start = 0;
            const step = target / 50;
            const timer = setInterval(() => {
                start += step;
                if (start >= target) { start = target; clearInterval(timer); }
                el.textContent = (isFloat ? start.toFixed(1) : Math.round(start)) + suffix;
            }, 25);
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });
    counters.forEach(c => observer.observe(c));
}


// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function setupScrollReveal() {
    if (!window.IntersectionObserver) return;
    const els = document.querySelectorAll('.glass-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}


// ── GLOBAL: togglePassword (used in templates inline) ────────────────────────
function togglePassword(fieldId, event) {
    const field = document.getElementById(fieldId);
    const icon  = event.currentTarget ? event.currentTarget.querySelector('i') : null;
    if (!field) return;
    if (field.type === 'password') {
        field.type = 'text';
        if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        field.type = 'password';
        if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}


// ── Settings: AJAX Theme Update ───────────────────────────────────────────────
function updateThemeAjax(settingsUrl) {
    const checked = document.querySelector('.theme-option.selected input[type="radio"]');
    if (!checked) return;
    const theme = checked.value;
    const btn   = document.getElementById('theme-save-btn');
    if (btn) btn.innerHTML = '<span class="spinner"></span> Saving…';

    const body = new URLSearchParams({ action: 'update_theme', theme });
    fetch(settingsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 'ok') {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('insighthr_theme', theme);
            document.querySelectorAll('.theme-toggle i').forEach(i => {
                i.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            });
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Saved';
                setTimeout(() => btn.innerHTML = 'Save Theme', 2000);
            }
        }
    })
    .catch(() => { if (btn) btn.innerHTML = 'Error. Try Again.'; });
}
