# 🤝 Contributing to InsightHR Nexus

Thank you for your interest in contributing! This document outlines the process and guidelines.

---

## 🎯 Ways to Contribute

- 🐛 **Bug Reports:** Report issues you find
- ✨ **Features:** Suggest new ideas
- 📝 **Documentation:** Improve docs
- 💻 **Code:** Submit pull requests
- 🎨 **Design:** Help with UI/UX
- 🌍 **Localization:** Add language support

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# On GitHub, click "Fork" button
# Clone your fork:
git clone https://github.com/YOUR-USERNAME/resumeiq.git
cd resumeiq
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# Good names: feature/dark-mode, fix/pdf-parsing, docs/api
```

### 3. Set Up Development Environment
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Make Changes
- Follow code style guidelines
- Write clear commit messages
- Add tests if applicable
- Update documentation

### 5. Commit & Push
```bash
git add .
git commit -m "Add feature: description of change"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- Describe your changes
- Reference any related issues
- Submit for review

---

## 📋 Code Style Guide

### **Python (PEP 8)**

```python
# Good
def extract_skills(resume_text):
    """Extract technical skills from resume text."""
    found_skills = []
    for skill in KNOWN_SKILLS:
        if skill.lower() in resume_text.lower():
            found_skills.append(skill)
    return found_skills

# Bad
def extractSkills(resumeText):
    foundSkills=[]
    for skill in KNOWN_SKILLS:
        if skill.lower() in resumeText.lower(): foundSkills.append(skill)
    return foundSkills
```

### **JavaScript (ES6)**

```javascript
// Good
function calculateScore(skills, experience, missingSections) {
  const skillScore = Math.min(skills.length, 20) / 20 * 60;
  const expScore = Math.min(experience, 10) / 10 * 25;
  const completeness = (5 - Math.min(missingSections.length, 5)) / 5 * 15;
  
  return Math.max(0, Math.min(100, skillScore + expScore + completeness));
}

// Bad
function calcScore(s,e,m){
return Math.max(0,Math.min(100,(Math.min(s.length,20)/20*60)+(Math.min(e,10)/10*25)+((5-Math.min(m.length,5))/5*15)))
}
```

### **CSS**

```css
/* Good */
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6C63FF, #8B5CF6);
  color: white;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

/* Bad */
.btn-primary{padding:12px;background:#6C63FF;border-radius:5px}
```

---

## 🐛 Reporting Bugs

Create an issue with:
- **Title:** Clear, concise description
- **Description:** What happened vs expected
- **Steps:** How to reproduce
- **Screenshots:** If applicable
- **Environment:** OS, browser, Python version

```markdown
## Bug: Resume upload fails for DOCX files

### Expected
DOCX files should upload and analyze successfully.

### Actual
Error: "File parsing failed" when uploading .docx

### Steps
1. Go to dashboard
2. Upload test.docx (any DOCX file)
3. Click "Analyze"
4. See error

### Environment
- OS: Windows 11
- Browser: Chrome 120
- Python: 3.9.0
```

---

## ✨ Suggesting Features

Create a discussion with:
- **Description:** What feature, why needed
- **Use Case:** How would you use it
- **Examples:** Similar features in other apps
- **Benefits:** Why it matters

```markdown
## Feature: Batch Resume Analysis

### Description
Allow users to upload and analyze multiple resumes at once.

### Why
HR teams need to screen many candidates quickly.

### Benefits
- 10x faster workflow
- Better for team collaboration
- Reduces manual work

### Example
Similar to upload UI in Dropbox or Google Drive.
```

---

## 📝 Documentation Standards

All documentation should:
- Use clear, simple language
- Include code examples where relevant
- Have table of contents for longer docs
- Be accessible (WCAG compliant)
- Include screenshots/diagrams when helpful

---

## ✅ Testing

Before submitting:

### **Manual Testing**
```bash
python app.py
# Test in browser: http://127.0.0.1:5000
```

Test checklist:
- [ ] Signup works
- [ ] Login works
- [ ] Resume upload works (PDF, DOCX, TXT)
- [ ] Analysis generates report
- [ ] Compare feature works
- [ ] Dark mode toggles
- [ ] History page shows results
- [ ] Settings page works
- [ ] Mobile responsive

### **Code Testing**
```bash
# Lint Python code
pylint app.py models.py analyzer.py

# Check imports
python -m py_compile app.py models.py analyzer.py
```

---

## 🎯 Priority Areas

High-priority contributions:
1. **OAuth Integration:** Google, GitHub, LinkedIn logins
2. **Email Service:** Password reset emails
3. **Advanced Scoring:** Improve AI scoring algorithm
4. **Performance:** Optimize database queries
5. **Testing:** Write unit tests
6. **Documentation:** Improve docs/examples
7. **Mobile App:** React Native version
8. **Localization:** Multi-language support

---

## 📋 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic change)
- `refactor:` Refactoring
- `perf:` Performance improvement
- `test:` Tests

**Examples:**
```
feat(auth): add OAuth Google login
fix(analyzer): correct PDF text extraction
docs(readme): update installation steps
refactor(dashboard): optimize chart rendering
```

---

## 🔄 Pull Request Process

1. **Update from main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature
   ```

3. **Create PR** with:
   - Clear title and description
   - Reference any issues: `Fixes #123`
   - Checklist of what you changed
   - Screenshots if UI changes

4. **Respond to feedback**
   - Update code based on comments
   - Re-push to same branch
   - PR auto-updates

5. **Merge**
   - Maintainer merges after approval
   - Your branch is deleted
   - Celebrate! 🎉

---

## 👥 Code Review Guidelines

**As an Author:**
- Keep PRs focused (one feature per PR)
- Explain complex logic in comments
- Respond to feedback professionally
- Ask questions if feedback unclear

**As a Reviewer:**
- Be respectful and constructive
- Praise good work
- Suggest improvements clearly
- Approve when satisfied

---

## 🏆 Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page
- Project website

---

## ❓ Questions?

- **GitHub Issues:** Ask in issue tracker
- **Discussions:** Use GitHub Discussions
- **Email:** contact@insighthr.com
- **Discord:** Join community server

---

## 📜 License

By contributing, you agree your code is licensed under MIT License.

---

**Thank you for making InsightHR better! 💪**
