# app.py — Main Flask Application for InsightHR
import os
import json
import uuid
import re
from datetime import datetime
from flask import (Flask, render_template, request, redirect,
                   url_for, flash, session, jsonify, send_from_directory)
from flask_login import (LoginManager, login_user, logout_user,
                         login_required, current_user)
from sqlalchemy import text, inspect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

from models import db, User, Resume
from analyzer import analyze_resume, compare_resumes

# ── App Configuration ─────────────────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
if load_dotenv:
    load_dotenv(os.path.join(BASE_DIR, '.env'))

app = Flask(__name__)
app.config['SECRET_KEY']              = 'insighthr-nexus-secret-2024-v2'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER']           = os.path.join(BASE_DIR, 'uploads')
app.config['MAX_CONTENT_LENGTH']      = 10 * 1024 * 1024   # 10 MB limit
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

# ── Extensions ────────────────────────────────────────────────────────────────
db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view      = 'login'
login_manager.login_message   = 'Please log in to access InsightHR.'
login_manager.login_message_category = 'info'

# ── Helpers ───────────────────────────────────────────────────────────────────
def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def safe_json(value, default=None):
    """Parse a JSON string safely; return default on failure."""
    if default is None:
        default = []
    try:
        return json.loads(value) if value else default
    except (json.JSONDecodeError, TypeError):
        return default

def normalize_mobile_number(value: str) -> str:
    """Keep only digits so phone logins match consistently."""
    digits = re.sub(r'\D', '', (value or '').strip())
    if len(digits) == 12 and digits.startswith('91'):
        return digits[-10:]
    if len(digits) == 11 and digits.startswith('0'):
        return digits[-10:]
    return digits

def is_valid_mobile_number(value: str) -> bool:
    """Validate a realistic Indian-style mobile number."""
    return bool(re.fullmatch(r'[6-9]\d{9}', value))

def normalize_email_address(value: str) -> str:
    """Normalize email and reject clearly invalid formats."""
    email = (value or '').strip().lower()
    if not email:
        return ''
    if not re.fullmatch(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', email):
        return ''
    return email

def ensure_user_mobile_column():
    """Add the mobile_number column/index for existing SQLite databases."""
    inspector = inspect(db.engine)
    columns = {column['name'] for column in inspector.get_columns('users')}
    if 'mobile_number' not in columns:
        db.session.execute(text("ALTER TABLE users ADD COLUMN mobile_number VARCHAR(20)"))
        db.session.commit()
    db.session.execute(
        text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_mobile_number ON users (mobile_number)")
    )
    db.session.commit()

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# ── Context Processor — make helpers available in all templates ───────────────
@app.context_processor
def inject_globals():
    return {
        'current_year': datetime.utcnow().year,
        'safe_json': safe_json,
    }

# ── Routes ────────────────────────────────────────────────────────────────────

# ---------- Test Upload Page (for debugging) ----------
@app.route('/test-upload')
def test_upload():
    """Serve test upload page for debugging file upload flow"""
    return send_from_directory(BASE_DIR, 'test_upload.html')

# ---------- Home / Root ----------
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


# ---------- Authentication ----------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        login_id = request.form.get('login_id', '').strip()
        password = request.form.get('password', '')
        remember = bool(request.form.get('remember'))

        if '@' in login_id:
            email = normalize_email_address(login_id)
            if not email:
                flash('Please enter valid mobile number or email id.', 'danger')
                return render_template('login.html')
            user = User.query.filter_by(email=email).first()
        else:
            mobile_number = normalize_mobile_number(login_id)
            user = None
            if not is_valid_mobile_number(mobile_number):
                flash('Please enter valid mobile number or email id.', 'danger')
                return render_template('login.html')
            user = User.query.filter_by(mobile_number=mobile_number).first()
        if not user:
            flash('Please enter valid mobile number or email id.', 'danger')
            return render_template('login.html')
        if check_password_hash(user.password_hash, password):
            login_user(user, remember=remember)
            session['theme'] = user.theme_pref
            next_page = request.args.get('next')
            return redirect(next_page or url_for('dashboard'))
        flash('Incorrect password. Please try again.', 'danger')

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        full_name     = request.form.get('full_name', '').strip()
        email         = normalize_email_address(request.form.get('email', ''))
        mobile_number = normalize_mobile_number(request.form.get('mobile_number', ''))
        password      = request.form.get('password', '')
        confirm       = request.form.get('confirm_password', '')

        if not full_name or not request.form.get('email', '').strip() or not mobile_number or not password:
            flash('All fields are required.', 'danger')
            return render_template('signup.html')
        if not email:
            flash('Please enter a valid email address.', 'danger')
            return render_template('signup.html')
        if not is_valid_mobile_number(mobile_number):
            flash('Please enter a valid mobile number.', 'danger')
            return render_template('signup.html')
        if password != confirm:
            flash('Passwords do not match.', 'danger')
            return render_template('signup.html')
        if len(password) < 6:
            flash('Password must be at least 6 characters.', 'danger')
            return render_template('signup.html')
        if User.query.filter_by(email=email).first():
            flash('An account with this email already exists.', 'warning')
            return render_template('signup.html')
        if User.query.filter_by(mobile_number=mobile_number).first():
            flash('An account with this mobile number already exists.', 'warning')
            return render_template('signup.html')

        user = User(
            full_name=full_name,
            email=email,
            mobile_number=mobile_number,
            password_hash=generate_password_hash(password),
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        session['theme'] = user.theme_pref
        flash(f'Congratulations {user.full_name}, your account was created successfully.', 'success')
        return redirect(url_for('dashboard'))

    return render_template('signup.html')


@app.route('/verify-signup', methods=['GET', 'POST'])
def verify_signup_redirect():
    return redirect(url_for('signup'))


@app.route('/resend-signup-otp', methods=['POST'])
def resend_signup_otp_redirect():
    return redirect(url_for('signup'))


@app.route('/logout')
@login_required
def logout():
    # Remove app-specific session data without wiping Flask-Login's
    # internal logout markers (used to clear remember-me cookies).
    session.pop('theme', None)
    logout_user()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('login'))


@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Forgot password page — simulated flow (no email server required)."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        user  = User.query.filter_by(email=email).first()
        # Always show success message to prevent user enumeration
        flash('If that email is registered, a reset link has been sent. Check your inbox.', 'info')
        return redirect(url_for('login'))
    return render_template('forgot_password.html')


@app.route('/social_login/<provider>')
def social_login(provider):
    flash(f'{provider.capitalize()} login will be enabled when OAuth credentials are configured.', 'info')
    return redirect(url_for('login'))


# ---------- Dashboard ----------
@app.route('/dashboard')
@login_required
def dashboard():
    recent = (Resume.query
              .filter_by(user_id=current_user.id)
              .order_by(Resume.created_at.desc())
              .limit(5).all())

    total     = Resume.query.filter_by(user_id=current_user.id).count()
    avg_score = 0.0
    if total:
        scores    = [r.score for r in Resume.query.filter_by(user_id=current_user.id).all()]
        avg_score = round(sum(scores) / len(scores), 1)

    # Weekly chart data (last 7 days count)
    from sqlalchemy import func
    from datetime import timedelta
    weekly_data = []
    for i in range(6, -1, -1):
        day   = datetime.utcnow().date() - timedelta(days=i)
        count = (Resume.query
                 .filter_by(user_id=current_user.id)
                 .filter(func.date(Resume.created_at) == day)
                 .count())
        weekly_data.append({'day': day.strftime('%a'), 'count': count})

    # Skill trend — most frequent skills across all resumes
    all_resumes = Resume.query.filter_by(user_id=current_user.id).all()
    skill_freq  = {}
    for r in all_resumes:
        for sk in safe_json(r.skills):
            skill_freq[sk] = skill_freq.get(sk, 0) + 1
    top_skills = sorted(skill_freq.items(), key=lambda x: x[1], reverse=True)[:6]

    return render_template('dashboard.html',
                           recent=recent,
                           total=total,
                           avg_score=avg_score,
                           weekly_data=json.dumps(weekly_data),
                           top_skills=json.dumps(top_skills))


# ---------- Analyze ----------
@app.route('/analyze', methods=['POST'])
@login_required
def analyze():
    if 'resume' not in request.files:
        flash('No file selected.', 'danger')
        return redirect(url_for('dashboard'))

    file = request.files['resume']
    if file.filename == '':
        flash('No file selected.', 'danger')
        return redirect(url_for('dashboard'))

    if not allowed_file(file.filename):
        flash('Only PDF, DOCX, and TXT files are allowed.', 'danger')
        return redirect(url_for('dashboard'))

    # Save file with unique name to avoid collisions
    ext      = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Run analysis
    result = analyze_resume(filepath)

    # Persist to DB
    resume = Resume(
        user_id           = current_user.id,
        filename          = secure_filename(file.filename),
        candidate_name    = result['candidate_name'],
        score             = result['score'],
        ats_score         = result['ats_score'],
        experience_years  = result['experience_years'],
        tone              = result['tone'],
        section_scores    = result['section_scores'],
        strengths         = result['strengths'],
        skills            = result['skills'],
        missing_skills    = result['missing_skills'],
        missing_sections  = result['missing_sections'],
        career_suggestion = result['career_suggestion'],
        career_suggestions= result['career_suggestions'],
        suggestions       = result['suggestions'],
        courses           = result['courses'],
        project_ideas     = result['project_ideas'],
    )
    db.session.add(resume)
    db.session.commit()

    return redirect(url_for('report', resume_id=resume.id))


# ---------- Report ----------
@app.route('/report/<int:resume_id>')
@login_required
def report(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    return render_template('report.html', resume=resume, safe_json=safe_json)


# ---------- History ----------
@app.route('/history')
@login_required
def history():
    page      = request.args.get('page', 1, type=int)
    search    = request.args.get('search', '')
    min_score = request.args.get('min_score', 0, type=float)

    query = Resume.query.filter_by(user_id=current_user.id)
    if search:
        query = query.filter(
            db.or_(
                Resume.filename.ilike(f'%{search}%'),
                Resume.candidate_name.ilike(f'%{search}%'),
                Resume.career_suggestion.ilike(f'%{search}%'),
            )
        )
    if min_score:
        query = query.filter(Resume.score >= min_score)

    pagination = (query.order_by(Resume.created_at.desc())
                       .paginate(page=page, per_page=8, error_out=False))

    return render_template('history.html',
                           pagination=pagination,
                           search=search,
                           min_score=min_score)


# ---------- Delete History Entry ----------
@app.route('/delete/<int:resume_id>', methods=['POST'])
@login_required
def delete_resume(resume_id):
    resume = Resume.query.filter_by(id=resume_id, user_id=current_user.id).first_or_404()
    db.session.delete(resume)
    db.session.commit()
    flash('Report deleted successfully.', 'success')
    return redirect(url_for('history'))


# ---------- Compare ----------
@app.route('/compare', methods=['GET', 'POST'])
@login_required
def compare():
    result = None
    if request.method == 'POST':
        file_a = request.files.get('resume_a')
        file_b = request.files.get('resume_b')

        if not file_a or not file_b or file_a.filename == '' or file_b.filename == '':
            flash('Please upload both resumes.', 'danger')
            return render_template('compare.html', result=None)

        if not (allowed_file(file_a.filename) and allowed_file(file_b.filename)):
            flash('Only PDF, DOCX, and TXT files are allowed.', 'danger')
            return render_template('compare.html', result=None)

        def save_temp(f):
            ext  = f.filename.rsplit('.', 1)[1].lower()
            name = f"{uuid.uuid4().hex}.{ext}"
            path = os.path.join(app.config['UPLOAD_FOLDER'], name)
            f.save(path)
            return path

        path_a = save_temp(file_a)
        path_b = save_temp(file_b)

        result = compare_resumes(path_a, path_b)
        result['name_a'] = secure_filename(file_a.filename)
        result['name_b'] = secure_filename(file_b.filename)

    return render_template('compare.html', result=result, safe_json=safe_json)


# ---------- Settings ----------
@app.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    if request.method == 'POST':
        action = request.form.get('action')

        if action == 'update_profile':
            full_name = request.form.get('full_name', '').strip()
            if full_name:
                current_user.full_name = full_name
                db.session.commit()
                flash('Profile updated successfully.', 'success')
            else:
                flash('Name cannot be empty.', 'danger')

        elif action == 'change_password':
            current_pw = request.form.get('current_password', '')
            new_pw     = request.form.get('new_password', '')
            confirm_pw = request.form.get('confirm_password', '')

            if not check_password_hash(current_user.password_hash, current_pw):
                flash('Current password is incorrect.', 'danger')
            elif new_pw != confirm_pw:
                flash('New passwords do not match.', 'danger')
            elif len(new_pw) < 6:
                flash('Password must be at least 6 characters.', 'danger')
            else:
                current_user.password_hash = generate_password_hash(new_pw)
                db.session.commit()
                flash('Password changed successfully.', 'success')

        elif action == 'update_theme':
            theme = request.form.get('theme', 'light')
            current_user.theme_pref = theme
            session['theme'] = theme
            db.session.commit()
            return jsonify({'status': 'ok', 'theme': theme})

        elif action == 'upload_avatar':
            file = request.files.get('avatar')
            if file and file.filename:
                ext  = file.filename.rsplit('.', 1)[-1].lower()
                name = f"avatar_{current_user.id}.{ext}"
                path = os.path.join('static', 'images', name)
                file.save(os.path.join(BASE_DIR, path))
                current_user.avatar_url = '/' + path.replace('\\', '/')
                db.session.commit()
                flash('Profile picture updated.', 'success')

        elif action == 'delete_account':
            db.session.delete(current_user)
            db.session.commit()
            logout_user()
            flash('Your account has been deleted.', 'info')
            return redirect(url_for('signup'))

    return render_template('settings.html')


# ---------- Serve Uploaded Files ----------
@app.route('/uploads/<path:filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ── App Entry Point ───────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("Starting InsightHR...", flush=True)
    with app.app_context():
        print("Preparing folders and database...", flush=True)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(os.path.join(BASE_DIR, 'static', 'images'), exist_ok=True)
        db.create_all()
        ensure_user_mobile_column()
        print("InsightHR database initialized.", flush=True)
    print("Launching Flask server at http://127.0.0.1:5000", flush=True)
    app.run(debug=True, use_reloader=False, host='127.0.0.1', port=5000)
