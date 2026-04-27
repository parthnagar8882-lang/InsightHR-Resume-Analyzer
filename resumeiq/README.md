# 🚀 InsightHR Nexus - AI-Powered Resume Analyzer & Career Guidance Platform

**The ultimate AI-powered platform for intelligent resume analysis, career intelligence, and talent intelligence.**

> **Tagline:** "AI-Powered Resume Intelligence & Career Guidance"

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Customization](#customization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure signup and login with password hashing (Werkzeug)
- Remember me functionality
- Forgot password flow
- User profile management
- Theme preference persistence (light/dark mode)
- Profile picture upload
- Change password
- Account deletion

### 📊 **Resume Analysis Engine**
- **AI-Powered Scoring:** 0-100 overall score
- **ATS Compatibility Score:** Applicant Tracking System compatibility assessment
- **Multi-Format Support:** PDF, DOCX, TXT files
- **Section-wise Analysis:** Skills, Education, Experience, Projects, Certifications, Formatting
- **Skill Detection:** 60+ known technical and soft skills
- **Missing Sections:** Identifies absent resume sections
- **Tone Analysis:** Detects writing tone (Professional, Confident, Technical, etc.)

### 🎯 **Career Guidance**
- **Top 3 Career Suggestions:** Roles, salary ranges, growth potential, industry demand
- **Skill Gap Analysis:** Identifies missing technical and soft skills
- **Progress Tracking:** Visualizes skill proficiency with color-coded progress bars
- **Salary Insights:** Average salary ranges for suggested roles

### 📈 **Resume Comparison**
- Side-by-side comparison of two resumes
- Winner determination based on overall fit
- Skills comparison
- Experience comparison
- AI-powered recommendation

### 📚 **Smart Recommendations**
- **AI Suggestions:** 15+ actionable improvement suggestions
- **Course Recommendations:** 10+ online courses tailored to skill gaps
- **Project Ideas:** 10+ project ideas to build portfolio
- **Internship/Job Suggestions:** AI-recommended opportunities

### 📖 **History & Reporting**
- Save all previous analyses in database
- Search by candidate name, role, or filename
- Filter by score range
- Pagination support
- Delete old reports
- Export reports as PDF

### 🎨 **Premium Modern UI**
- **Glassmorphism Design:** Frosted glass effect cards
- **Responsive Layout:** Mobile-first responsive design
- **Dark Mode Support:** Full dark/light theme toggle
- **Smooth Animations:** Subtle transitions and animations
- **Modern Color Palette:** Purple (#6C63FF) + Teal (#14B8A6) theme
- **Intuitive Navigation:** Sidebar-based navigation

### 📱 **Responsive Design**
- Desktop optimized
- Tablet friendly
- Mobile responsive (hamburger menu on mobile)
- Touch-friendly interactions

---

## 🛠️ Tech Stack

### **Frontend**
- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism, animations, responsive design
- **JavaScript (ES6+)** - Interactive features, drag-drop, theme toggle
- **Chart.js** - Data visualization
- **Font Awesome 6** - Icon library
- **Google Fonts** - Inter font family

### **Backend**
- **Python 3.9+**
- **Flask 3.0.3** - Web framework
- **Flask-SQLAlchemy 3.1.1** - ORM
- **Flask-Login 0.6.3** - Authentication
- **Werkzeug 3.0.3** - Password hashing & utilities
- **PyPDF2 3.0.1** - PDF text extraction
- **python-docx 1.1.2** - DOCX text extraction

### **Database**
- **SQLite** - Lightweight database

### **Additional Libraries**
- Pillow - Image handling
- WTForms - Form validation

---

## 📦 Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Step 1: Clone or Download Project
```bash
cd d:\py_project\resumeiq
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Initialize Database
```bash
python app.py
```
This will:
- Create SQLite database (`database.db`)
- Create all tables
- Create `uploads/` directory
- Print: `✅ InsightHR database initialized.`

### Step 6: Run Application
```bash
python app.py
```

Visit: **http://127.0.0.1:5000**

---

## 🚀 Quick Start

### 1. **Create Account**
- Go to signup page
- Fill in: Full Name, Email, Password
- Agree to terms
- Click "Create Account"

### 2. **Login**
- Enter email and password
- Click "Sign In"
- Check "Remember me" to stay logged in

### 3. **Analyze Resume**
- On dashboard, drag & drop or click to upload resume
- Supported formats: PDF, DOCX, TXT (max 10 MB)
- Click "Analyze with AI"
- Wait for processing (~2-3 seconds)

### 4. **View Report**
- See overall AI score (0-100%)
- View ATS compatibility score
- Review section-wise scores
- Check identified skills
- Review improvement suggestions
- See recommended courses and projects

### 5. **Compare Resumes**
- Go to Compare page
- Upload two resumes
- Click "Compare Resumes"
- View side-by-side comparison
- Get AI recommendation

### 6. **History**
- View all previous analyses
- Search by name, role, filename
- Filter by score
- Re-view any report
- Delete old reports

### 7. **Settings**
- Update profile name
- Upload profile picture
- Change password
- Toggle dark/light mode
- Delete account

---

## 📁 Project Structure

```
resumeiq/
├── app.py                 # Flask application & routes
├── models.py              # Database models (User, Resume)
├── analyzer.py            # Resume analysis engine
├── requirements.txt       # Python dependencies
├── database.db            # SQLite database (auto-created)
│
├── templates/
│   ├── base.html          # Base template with sidebar
│   ├── login.html         # Login page
│   ├── signup.html        # Signup page
│   ├── forgot_password.html # Password reset page
│   ├── dashboard.html     # Main dashboard
│   ├── report.html        # Analysis report page
│   ├── compare.html       # Resume comparison page
│   ├── history.html       # Analysis history page
│   ├── settings.html      # User settings page
│   └── analysis.html      # Analysis page
│
├── static/
│   ├── css/
│   │   ├── style.css      # Main styles (1380+ lines)
│   │   ├── auth.css       # Auth page styles
│   │   ├── dashboard.css  # Dashboard styles
│   │   └── main.css       # Additional utilities
│   │
│   ├── js/
│   │   ├── main.js        # Core scripts (451+ lines)
│   │   ├── dashboard.js   # Dashboard interactions
│   │   ├── auth.js        # Auth page scripts
│   │   ├── analysis.js    # Analysis page scripts
│   │   └── theme.js       # Theme management
│   │
│   ├── images/            # User avatars stored here
│   └── uploads/           # Uploaded resume files
│
└── README.md              # This file
```

---

## 🔌 API Routes

### **Authentication**
| Route | Method | Description |
|-------|--------|-------------|
| `/login` | GET, POST | Login page and authentication |
| `/signup` | GET, POST | Signup page and account creation |
| `/logout` | POST | Logout and session clear |
| `/forgot-password` | GET, POST | Password reset flow |
| `/social_login/<provider>` | GET | Social login (UI only) |

### **Core Features**
| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Root redirect to dashboard or login |
| `/dashboard` | GET | Main dashboard with stats |
| `/analyze` | POST | Upload and analyze resume |
| `/report/<id>` | GET | View analysis report |
| `/history` | GET | View all analyses with search/filter |
| `/delete/<id>` | POST | Delete a report |
| `/compare` | GET, POST | Compare two resumes |
| `/settings` | GET, POST | User settings and profile |
| `/uploads/<path>` | GET | Serve uploaded files |

---

## 🗄️ Database Schema

### **User Model**
```python
id              Integer (PK)
full_name       String(120)
email           String(150) UNIQUE
password_hash   String(256)
theme_pref      String(10) - 'light' or 'dark'
avatar_url      String(300)
created_at      DateTime
resumes         Relationship(Resume)
```

### **Resume Model**
```python
id                  Integer (PK)
user_id             Integer (FK)
filename            String(255)
candidate_name      String(150)
score               Float (0-100)
ats_score           Float (0-100)
experience_years    Float
tone                String(50)
section_scores      Text (JSON) - {Skills, Education, Experience, ...}
strengths           Text (JSON) - list of strengths
skills              Text (JSON) - list of detected skills
missing_skills      Text (JSON) - list of missing skills
missing_sections    Text (JSON) - list of missing sections
suggestions         Text (JSON) - improvement suggestions
career_suggestion   String(100) - top role
career_suggestions  Text (JSON) - [role, salary, growth, demand, skills]
courses             Text (JSON) - recommended courses
project_ideas       Text (JSON) - project ideas
created_at          DateTime
```

---

## 🎨 Customization

### **Change Brand Colors**

Edit `static/css/style.css` - CSS Variables section:

```css
:root {
  --primary:         #6C63FF;    /* Purple */
  --accent:          #14B8A6;    /* Teal */
  --btn-gradient:    linear-gradient(135deg, #6C63FF, #8B5CF6);
}
```

### **Update Brand Name & Logo**

Edit `templates/base.html`:
```html
<div class="brand-name">InsightHR</div>
<div class="brand-tagline">AI Resume Intelligence</div>
```

### **Customize Skill Taxonomy**

Edit `analyzer.py` - `KNOWN_SKILLS` list:
```python
KNOWN_SKILLS = [
    "python", "javascript", "react", ...
]
```

### **Modify Scoring Algorithm**

Edit `analyzer.py` - `calculate_score()` function to adjust weights:
```python
skill_score   = min(len(skills), 20) / 20 * 60  # 60% weight
exp_score     = min(experience, 10) / 10 * 25   # 25% weight
completeness  = (5 - min(len(missing_sections), 5)) / 5 * 15  # 15% weight
```

### **Change Theme Colors**

The app automatically updates to the specified color palette. Change in CSS variables or use theme toggle.

---

## 🚀 Deployment

### **Production Deployment**

1. **Set Flask to Production:**
   ```python
   app.run(debug=False, host='0.0.0.0', port=5000)
   ```

2. **Use Production WSGI Server (Gunicorn):**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Environment Variables:**
   Create `.env`:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-here
   DATABASE_URL=sqlite:///database.db
   ```

4. **Database Migration:**
   For production, use PostgreSQL instead of SQLite:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/insighthr'
   ```

5. **SSL/HTTPS:**
   Use Let's Encrypt + Nginx reverse proxy

6. **Hosting Options:**
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Google Cloud Run
   - Azure App Service

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@insighthr.com
- Documentation: https://docs.insighthr.com

---

## 🎯 Roadmap

### Version 2.0
- [ ] OAuth integration (Google, LinkedIn, GitHub)
- [ ] Email notifications
- [ ] Batch resume analysis
- [ ] Advanced ML-based scoring
- [ ] LinkedIn profile parsing
- [ ] Interview preparation module
- [ ] Job matching with real postings
- [ ] Team/organization features
- [ ] API for developers
- [ ] Mobile app (iOS/Android)

---

## 👥 Team

**InsightHR Team**
- AI & Backend Development
- Frontend & UI/UX
- Product Management

---

## 🙏 Acknowledgments

- Built with ❤️ for HR professionals and candidates
- Inspired by modern SaaS platforms (Linear, Notion, Stripe)
- Powered by Chart.js for data visualization
- Beautiful UI inspired by glassmorphism design trends

---

**Made with ❤️ by InsightHR Team**

**© 2024 InsightHR Nexus. All rights reserved.**
