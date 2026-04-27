# models.py — Database Models for InsightHR
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(UserMixin, db.Model):
    """User account model."""
    __tablename__ = 'users'

    id            = db.Column(db.Integer, primary_key=True)
    full_name     = db.Column(db.String(120), nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False)
    mobile_number = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    theme_pref    = db.Column(db.String(10), default='light')  # 'light' or 'dark'
    avatar_url    = db.Column(db.String(300), default='')
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: one user → many resumes
    resumes = db.relationship('Resume', backref='owner', lazy=True,
                              cascade='all, delete-orphan')

    def __repr__(self):
        return f'<User {self.email}>'


class Resume(db.Model):
    """Resume analysis result model."""
    __tablename__ = 'resumes'

    id                = db.Column(db.Integer, primary_key=True)
    user_id           = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename          = db.Column(db.String(255), nullable=False)
    candidate_name    = db.Column(db.String(150), default='Unknown')
    score             = db.Column(db.Float, default=0.0)           # 0–100 overall
    ats_score         = db.Column(db.Float, default=0.0)           # ATS compatibility
    experience_years  = db.Column(db.Float, default=0.0)
    tone              = db.Column(db.String(50), default='Neutral')

    # Section scores (JSON strings)
    section_scores    = db.Column(db.Text, default='{}')           # JSON - per-section scores

    # Extracted data (JSON lists as strings)
    strengths         = db.Column(db.Text, default='[]')
    skills            = db.Column(db.Text, default='[]')
    missing_skills    = db.Column(db.Text, default='[]')
    suggestions       = db.Column(db.Text, default='[]')
    missing_sections  = db.Column(db.Text, default='[]')           # sections not detected
    courses           = db.Column(db.Text, default='[]')           # AI suggested courses
    project_ideas     = db.Column(db.Text, default='[]')           # AI suggested projects

    # Career suggestions (JSON list of dicts with role, salary, skills, growth, demand)
    career_suggestions = db.Column(db.Text, default='[]')
    career_suggestion  = db.Column(db.String(100), default='')     # top role (simple string)

    created_at        = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Resume {self.filename} score={self.score}>'
