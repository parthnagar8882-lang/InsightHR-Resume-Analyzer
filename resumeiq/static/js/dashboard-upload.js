document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('resume-upload');
    const uploadForm = document.getElementById('upload-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const browseBtn = document.getElementById('browse-files-btn');

    if (!uploadZone || !fileInput || !uploadForm) return;

    const maxSize = 10 * 1024 * 1024;

    const setAnalyzeState = (enabled) => {
        if (!analyzeBtn) return;
        analyzeBtn.disabled = false;
        analyzeBtn.style.opacity = '1';
        analyzeBtn.style.cursor = 'pointer';
    };

    const updateFileDisplay = (file) => {
        const icon = uploadZone.querySelector('.upload-icon');
        const primary = uploadZone.querySelector('.upload-primary');
        const sub = uploadZone.querySelector('.upload-sub');

        uploadZone.classList.add('has-file');

        if (icon) {
            icon.className = 'fas fa-file-check upload-icon';
            icon.style.color = 'var(--green)';
        }
        if (primary) primary.innerHTML = `<strong>${file.name}</strong>`;
        if (sub) sub.textContent = `${formatSize(file.size)} • Uploading for ATS analysis...`;
    };

    const resetFileDisplay = () => {
        const icon = uploadZone.querySelector('.upload-icon');
        const primary = uploadZone.querySelector('.upload-primary');
        const sub = uploadZone.querySelector('.upload-sub');

        uploadZone.classList.remove('has-file');

        if (icon) {
            icon.className = 'fas fa-file-upload upload-icon';
            icon.style.color = '';
        }
        if (primary) primary.innerHTML = 'Drag &amp; drop resume here';
        if (sub) sub.textContent = 'PDF, DOCX, or TXT · Max 10 MB';
    };

    const submitForAnalysis = () => {
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="spinner"></span> Processing...';
        }
        uploadForm.submit();
    };

    const handleFile = (file) => {
        if (!file) {
            resetFileDisplay();
            setAnalyzeState(false);
            return;
        }

        if (file.size > maxSize) {
            alert('File size exceeds 10MB limit. Please choose a smaller resume.');
            fileInput.value = '';
            resetFileDisplay();
            setAnalyzeState(false);
            return;
        }

        updateFileDisplay(file);
        setAnalyzeState(true);
        setTimeout(submitForAnalysis, 200);
    };

    const openPicker = () => fileInput.click();

    uploadZone.addEventListener('click', (event) => {
        if (event.target === fileInput) return;
        openPicker();
    });

    if (browseBtn) {
        browseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openPicker();
        });
    }

    uploadZone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
        }
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
        uploadZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            uploadZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
        uploadZone.addEventListener(eventName, (event) => {
            event.preventDefault();
            uploadZone.classList.remove('dragover');
        });
    });

    uploadZone.addEventListener('drop', (event) => {
        const files = event.dataTransfer.files;
        if (!files.length) return;
        fileInput.files = files;
        handleFile(files[0]);
    });

    fileInput.addEventListener('change', () => {
        handleFile(fileInput.files[0]);
    });

    uploadForm.addEventListener('submit', (event) => {
        if (fileInput.files && fileInput.files.length) {
            if (analyzeBtn) {
                analyzeBtn.disabled = true;
                analyzeBtn.innerHTML = '<span class="spinner"></span> Processing...';
            }
            return;
        }
        event.preventDefault();
        alert('Please choose a resume file first.');
        setAnalyzeState(false);
    });

    setAnalyzeState(true);
});

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
