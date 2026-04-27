# 🔌 InsightHR API Documentation

**Complete API reference for InsightHR Nexus backend.**

---

## 📚 Table of Contents

- [Authentication](#authentication-routes)
- [Dashboard](#dashboard-routes)
- [Resume Analysis](#resume-analysis-routes)
- [Reports](#report-routes)
- [Comparison](#comparison-routes)
- [History](#history-routes)
- [Settings](#settings-routes)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

---

## 🔐 Authentication Routes

### **POST /login**
User authentication.

**Request:**
```html
Content-Type: application/x-www-form-urlencoded

email=user@example.com
password=password123
remember=on
```

**Response (Success - 302 Redirect to /dashboard):**
```
Set-Cookie: session=...
Location: /dashboard
```

**Response (Error - 200 GET /login):**
```html
<!-- Login page with error message -->
```

---

### **POST /signup**
Create new user account.

**Request:**
```html
Content-Type: application/x-www-form-urlencoded

full_name=John Doe
email=john@example.com
password=Password123
confirm_password=Password123
```

**Validation Rules:**
- Full name: required, max 120 chars
- Email: required, unique, valid format
- Password: min 6 chars, matches confirmation
- Password: hashed with Werkzeug PBKDF2

**Response (Success - 302 Redirect to /login):**
```
Flash: "Account created successfully! Please log in."
Location: /login
```

**Response (Error):**
```
Flash: "Email already exists" | "Passwords don't match" | etc.
```

---

### **GET /logout**
Terminate user session.

**Response:**
```
Session cleared
Flash: "You have been logged out successfully."
302 Redirect to /login
```

---

### **GET /forgot-password**
Display forgot password form.

**Response:**
```html
<!-- Forgot password page with email input -->
```

---

### **POST /forgot-password**
Initiate password reset (email simulation).

**Request:**
```html
Content-Type: application/x-www-form-urlencoded

email=user@example.com
```

**Response:**
```
Flash: "If that email is registered, a reset link has been sent."
302 Redirect to /login
```

*Note: Email functionality simulated in dev mode.*

---

### **GET /social_login/<provider>**
Social authentication entry point.

**Parameters:**
- `provider`: "google" | "github" | "linkedin"

**Response:**
```
Flash: "Google login will be enabled when OAuth credentials are configured."
302 Redirect to /login
```

*Note: OAuth not yet implemented - UI ready for v2*

---

## 📊 Dashboard Routes

### **GET /dashboard**
Main dashboard page (requires login).

**Response:**
```html
<!-- Dashboard with:
- Welcome message
- Stats cards (total, avg score, recent)
- Upload zone
- Weekly chart
- Recent analyses
- Skill trends
-->
```

**Template Context:**
```python
{
  'recent': [Resume objects],          # Last 5 analyses
  'total': int,                        # Total analysis count
  'avg_score': float,                  # Average score %
  'weekly_data': json,                 # Chart data last 7 days
  'top_skills': json,                  # Top 6 skills frequency
}
```

---

## 📝 Resume Analysis Routes

### **POST /analyze**
Upload and analyze a resume.

**Request:**
```
Content-Type: multipart/form-data

resume: <file>  # PDF, DOCX, or TXT
```

**File Validation:**
- Extensions: .pdf, .docx, .txt (case-insensitive)
- Max size: 10 MB (checked in app.config)
- MIME types: handled by filename extension

**Processing:**
1. Save file with UUID filename
2. Extract text based on extension
3. Run analysis (2-3 seconds)
4. Store in database
5. Redirect to report

**Response (Success - 302):**
```
Location: /report/123
```

**Response (Error):**
```
Flash: "No file selected." | "Invalid file format." | etc.
302 Redirect to /dashboard
```

**Database Insert:**
```python
Resume(
  user_id=current_user.id,
  filename=original_filename,
  candidate_name=extracted,
  score=0-100,
  ats_score=0-100,
  experience_years=float,
  tone=string,
  section_scores=json,
  strengths=json,
  skills=json,
  missing_skills=json,
  missing_sections=json,
  career_suggestion=string,
  career_suggestions=json,
  suggestions=json,
  courses=json,
  project_ideas=json,
)
```

---

## 📄 Report Routes

### **GET /report/<int:resume_id>**
Display analysis report for specific resume.

**Parameters:**
- `resume_id`: Integer ID of resume analysis

**Access Control:**
- User can only view own reports
- 404 if resume doesn't exist or doesn't belong to user

**Response:**
```html
<!-- Report page with:
- Candidate name
- Overall score (circular chart)
- ATS score (circular chart)
- Section scores (radar chart)
- Skills list
- Missing skills
- Improvement suggestions
- Career suggestions
- Courses recommended
- Download PDF button
- Share button
-->
```

**Template Context:**
```python
{
  'resume': Resume object,
  'safe_json': function,  # JSON parser helper
}
```

---

## 🔄 Comparison Routes

### **GET /compare**
Display compare page (requires login).

**Response:**
```html
<!-- Compare page with:
- Upload zone for resume A
- Upload zone for resume B
- Compare button
- Results section (empty initially)
-->
```

---

### **POST /compare**
Compare two uploaded resumes.

**Request:**
```
Content-Type: multipart/form-data

resume_a: <file>  # First resume
resume_b: <file>  # Second resume
```

**Processing:**
1. Validate both files
2. Save both with UUID names
3. Analyze both independently
4. Compare results
5. Determine winner

**Response:**
```html
<!-- Compare page with results showing:
- Resume A: name, score, ATS, skills
- Resume B: name, score, ATS, skills
- Winner determination
- AI recommendation
- Side-by-side metrics
-->
```

**Comparison Object:**
```python
{
  'a': analysis_dict,           # First resume analysis
  'b': analysis_dict,           # Second resume analysis
  'winner': candidate_name,     # Best candidate
  'recommendation': string,     # AI reasoning
  'name_a': filename,
  'name_b': filename,
}
```

---

## 📖 History Routes

### **GET /history**
List all user's analyses with pagination.

**Query Parameters:**
- `page`: int (default: 1)
- `search`: string (optional, searches name/file/role)
- `min_score`: float (optional, minimum score filter)

**Response:**
```html
<!-- History page with:
- Search bar
- Score filter dropdown
- Results table with pagination
- Report view button
- Delete button per row
- Navigation prev/next
-->
```

**Template Context:**
```python
{
  'pagination': Pagination object,  # paginate() result
  'search': string,
  'min_score': float,
}
```

**Pagination Attributes:**
```python
pagination.items        # [Resume, Resume, ...]
pagination.pages        # Total pages
pagination.current_page # Current page #
pagination.has_prev     # Boolean
pagination.has_next     # Boolean
pagination.per_page     # 8 results per page
pagination.total        # Total results
```

---

### **POST /delete/<int:resume_id>**
Delete a specific analysis.

**Access Control:**
- User can only delete own analyses
- 404 if not found or doesn't belong to user

**Response:**
```
Database: Resume deleted with cascade
Flash: "Report deleted successfully."
302 Redirect to /history
```

---

## ⚙️ Settings Routes

### **GET /settings**
Display settings & profile page (requires login).

**Response:**
```html
<!-- Settings page with forms for:
- Update profile name
- Change password
- Upload avatar
- Theme toggle
- Delete account
-->
```

**Template Context:**
```python
{
  # current_user auto-available from Flask-Login
}
```

---

### **POST /settings**
Handle settings updates (requires login).

**Action: update_profile**
```html
Content-Type: application/x-www-form-urlencoded

action=update_profile
full_name=New Name
```

Response:
```
User updated
Flash: "Profile updated successfully." or "Name cannot be empty."
Redirect to /settings
```

---

**Action: change_password**
```html
Content-Type: application/x-www-form-urlencoded

action=change_password
current_password=oldpass123
new_password=newpass456
confirm_password=newpass456
```

Validation:
- Current password must match stored hash
- New passwords must match each other
- Min 6 characters

Response:
```
Password updated (hashed)
Flash: Success or error message
Redirect to /settings
```

---

**Action: update_theme**
```html
Content-Type: application/x-www-form-urlencoded

action=update_theme
theme=dark  or  theme=light
```

Response (JSON):
```json
{
  "status": "ok",
  "theme": "dark"
}
```

---

**Action: upload_avatar**
```
Content-Type: multipart/form-data

action=upload_avatar
avatar=<image file>  # JPG, PNG, GIF
```

File Handling:
- Saved as `avatar_{user_id}.{ext}`
- Stored in `static/images/`
- URL updated in database

Response:
```
File saved
Flash: "Profile picture updated."
Redirect to /settings
```

---

**Action: delete_account**
```html
Content-Type: application/x-www-form-urlencoded

action=delete_account
```

Response:
```
User deleted (cascade deletes all resumes)
Session cleared
Flash: "Your account has been deleted."
302 Redirect to /signup
```

---

## 📤 File Serving

### **GET /uploads/<path:filename>**
Download uploaded resume files.

**Access Control:**
- Requires login
- User can access their uploaded files
- Server-side validation recommended for production

**Response:**
```
file stream
Content-Type: application/octet-stream
```

---

## 🔄 Response Format

### **Standard HTML Response**
- Template rendering with Flask render_template()
- Context dictionary passed to template
- 200 OK or 302 redirect

### **Error Responses**

**404 Not Found:**
```html
<!-- Flask default 404 page or custom template -->
```

**403 Forbidden:**
```
Access denied - not owner of resource
```

**400 Bad Request:**
```
Flash: Validation error message
Form re-rendered with errors
```

### **Flash Messages**

**Success (Green):**
```
Flash: "Action completed successfully.", "success"
```

**Error (Red):**
```
Flash: "Something went wrong.", "danger"
```

**Warning (Yellow):**
```
Flash: "Please verify this action.", "warning"
```

**Info (Blue):**
```
Flash: "Note: This is informational.", "info"
```

---

## ⚠️ Error Handling

### **Common Errors**

| Error | Cause | Resolution |
|-------|-------|-----------|
| 401 Unauthorized | Not logged in | Login first |
| 404 Not Found | Resource doesn't exist | Check ID |
| 400 Bad Request | Invalid form data | Check validation |
| 413 Payload Too Large | File > 10 MB | Upload smaller file |
| 415 Unsupported Media | Wrong file type | Use PDF/DOCX/TXT |
| 500 Server Error | Backend error | Check logs |

### **Validation Error Messages**

```python
"All fields are required."
"Passwords do not match."
"Password must be at least 6 characters."
"An account with this email already exists."
"Invalid email or password."
"No file selected."
"Only PDF, DOCX, and TXT files are allowed."
"File cannot be larger than 10 MB."
```

---

## 🔑 Authentication

### **Login Manager**

- **Module:** Flask-Login
- **Session:** Browser cookie-based
- **Duration:** 30 days if "Remember me" checked
- **Protection:** CSRF-ready (implement in production)

### **User Loader**

```python
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))
```

### **Protected Routes**

All routes except `/login`, `/signup`, `/forgot-password`, `/social_login/<provider>` require:

```python
@login_required
```

Access denied: redirect to `/login` with error message.

---

## 🗄️ Database Models

### **User Model**
```python
class User:
  id              # Integer PK
  full_name       # String(120)
  email           # String(150) UNIQUE
  password_hash   # String(256) - Werkzeug PBKDF2
  theme_pref      # String(10) - "light" | "dark"
  avatar_url      # String(300)
  created_at      # DateTime
  resumes         # Relationship (Resume[])
```

### **Resume Model**
```python
class Resume:
  id                  # Integer PK
  user_id             # Integer FK
  filename            # String(255)
  candidate_name      # String(150)
  score               # Float (0-100)
  ats_score           # Float (0-100)
  experience_years    # Float
  tone                # String(50)
  section_scores      # Text (JSON)
  strengths           # Text (JSON)
  skills              # Text (JSON)
  missing_skills      # Text (JSON)
  missing_sections    # Text (JSON)
  career_suggestion   # String(100)
  career_suggestions  # Text (JSON)
  suggestions         # Text (JSON)
  courses             # Text (JSON)
  project_ideas       # Text (JSON)
  created_at          # DateTime
```

---

## 🚀 Extending the API

### **Adding New Route**

```python
@app.route('/api/new-feature', methods=['GET', 'POST'])
@login_required
def new_feature():
    """New feature description."""
    if request.method == 'POST':
        # Handle POST
        data = request.form.get('data')
        # Process...
        flash('Success!', 'success')
        return redirect(url_for('dashboard'))
    
    # GET - Show form
    return render_template('new_feature.html')
```

### **Adding New API Response**

```python
@app.route('/api/data', methods=['GET'])
@login_required
def get_data():
    """Return JSON data."""
    data = {
        'status': 'ok',
        'results': [...]
    }
    return jsonify(data)
```

---

## 📊 Rate Limiting

*Recommended for production:*

```python
from flask_limiter import Limiter

limiter = Limiter(app)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    # Max 5 login attempts per minute
    pass
```

---

**API Documentation v1.0**
Last Updated: 2024
