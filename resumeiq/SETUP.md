# 🚀 InsightHR Nexus - Setup & Installation Guide

**Complete step-by-step guide to get InsightHR running on your machine.**

---

## ⚡ Quick Start (5 minutes)

### **Windows:**

```powershell
# 1. Navigate to project
cd d:\py_project\resumeiq

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run application
python app.py
```

Then visit: **http://127.0.0.1:5000**

### **macOS/Linux:**

```bash
# 1. Navigate to project
cd ~/py_project/resumeiq

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run application
python app.py
```

Then visit: **http://127.0.0.1:5000**

---

## 📋 System Requirements

- **Python:** 3.9 or higher
- **RAM:** 2 GB minimum
- **Storage:** 1 GB for project + database
- **Browser:** Chrome, Firefox, Safari, Edge (latest)
- **OS:** Windows, macOS, Linux

---

## 🔧 Detailed Installation

### **Step 1: Prerequisites**

**Check Python version:**
```bash
python --version  # Should be 3.9+
```

**Update pip:**
```bash
python -m pip install --upgrade pip
```

### **Step 2: Create Virtual Environment**

Virtual environments isolate project dependencies from your system Python.

**Windows:**
```powershell
python -m venv venv
venv\Scripts\activate  # You'll see (venv) in terminal
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate  # You'll see (venv) in terminal
```

### **Step 3: Install Dependencies**

```bash
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Flask-3.0.3 Flask-SQLAlchemy-3.1.1 ...
```

### **Step 4: Verify Installation**

```bash
python -c "import flask; print(f'Flask {flask.__version__} installed')"
python -c "import sqlalchemy; print(f'SQLAlchemy {sqlalchemy.__version__} installed')"
```

### **Step 5: Initialize Database**

```bash
python app.py
```

**Expected output:**
```
✅ InsightHR database initialized.
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

Press `Ctrl+C` to stop the server.

### **Step 6: Run Application**

```bash
python app.py
```

Open your browser: **http://127.0.0.1:5000**

---

## 👤 Create Test Account

1. Click **"Create one free"** on login page
2. Fill in:
   - **Full Name:** Test User
   - **Email:** test@example.com
   - **Password:** TestPass123
   - Check "I agree to Terms"
3. Click **"Create Account"**
4. Login with these credentials
5. You're in! 🎉

---

## 📊 Test Resume Analysis

1. **Go to Dashboard**
2. **Upload a Resume:**
   - Create a simple text file with resume content, OR
   - Use a sample resume (provided in `/samples/`)
   - Drag & drop into upload zone
3. **Click "Analyze with AI"**
4. **View Report** with AI insights
5. **Compare Resumes** (upload 2 resumes)
6. **View History** of all analyses

---

## 🎨 Theme Toggle

- **Top-right button** toggles light/dark mode
- Preference is saved per user
- Automatic sync across tabs

---

## 🚨 Troubleshooting

### **"Python not found"**
```bash
# Install Python from python.org
# Make sure to check "Add Python to PATH" during installation
python --version
```

### **"Module not found: Flask"**
```bash
# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# Then install:
pip install -r requirements.txt
```

### **"Port 5000 already in use"**
```bash
# Change port in app.py:
app.run(debug=True, port=5001)  # Use 5001 instead

# Or kill process using port 5000:
# Windows:
netstat -ano | findstr :5000

# macOS/Linux:
lsof -i :5000
```

### **"Database locked" error**
```bash
# Delete old database and recreate:
rm database.db  # or delete database.db on Windows

# Run app to recreate:
python app.py
```

### **PDF/DOCX files not parsing**
- Ensure PyPDF2 and python-docx are installed:
  ```bash
  pip install PyPDF2 python-docx --upgrade
  ```
- Fallback demo data will be used if extraction fails

---

## 📁 Project Structure

```
resumeiq/
├── app.py                    # Main Flask app
├── models.py                 # Database models
├── analyzer.py               # Resume analysis engine
├── requirements.txt          # Dependencies
├── .env.example              # Configuration template
├── database.db               # SQLite database (auto-created)
├── templates/                # HTML templates
│   ├── base.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── report.html
│   ├── history.html
│   ├── compare.html
│   ├── settings.html
│   └── forgot_password.html
├── static/
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript
│   ├── images/               # Assets
│   └── uploads/              # Uploaded files
└── README.md                 # Full documentation
```

---

## 🔐 Security Notes

### **For Development:**
- Secret key is set in app.py
- Database is SQLite (local)
- Password hashing with Werkzeug ✓

### **For Production:**
- Change `SECRET_KEY` to a random value:
  ```python
  import secrets
  secrets.token_hex(32)  # Generate strong key
  ```
- Use PostgreSQL instead of SQLite
- Enable HTTPS/SSL
- Set `DEBUG=False`
- Use environment variables for secrets
- Implement rate limiting
- Add CSRF protection

---

## 🌐 Production Deployment

### **Option 1: Heroku**

```bash
# Install Heroku CLI
# Create app
heroku create insighthr-nexus

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### **Option 2: Docker**

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

```bash
docker build -t insighthr .
docker run -p 5000:5000 insighthr
```

### **Option 3: AWS/Azure/Google Cloud**

Each cloud provider has deployment guides. Generally:
1. Push code to GitHub
2. Connect cloud to GitHub
3. Auto-deploy on push

---

## 📚 Next Steps

1. ✅ Complete setup following this guide
2. Create test account and explore features
3. Read [README.md](README.md) for full documentation
4. Customize colors/branding
5. Deploy to production
6. Integrate OAuth (Google, GitHub)
7. Add email notifications
8. Expand skill taxonomy

---

## 💬 Getting Help

- **Docs:** See [README.md](README.md)
- **Issues:** Open GitHub issue
- **Email:** support@insighthr.com
- **Community:** Join Discord server

---

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)
- [HTML/CSS/JavaScript Basics](https://developer.mozilla.org/)

---

**Happy coding! 🚀**

Made with ❤️ by the InsightHR team
