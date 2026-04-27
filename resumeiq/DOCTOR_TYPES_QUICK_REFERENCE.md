# Doctor Types Quick Reference

## All 15 Doctor Specializations Now Supported

### By Salary (Highest to Lowest):

1. 🏥 **Orthopedic Surgeon** - $300K–$450K (Highest)
2. 🏥 **Anesthesiologist** - $270K–$420K
3. 🏥 **Cardiologist** - $280K–$400K
4. 🏥 **Surgeon** - $250K–$400K
5. 🏥 **Radiologist** - $260K–$380K
6. 🏥 **Urologist** - $240K–$380K
7. 🏥 **Gastroenterologist** - $240K–$380K
8. 🏥 **Neurologist** - $240K–$360K
9. 🏥 **Pulmonologist** - $220K–$360K
10. 🏥 **OB/GYN** - $220K–$340K
11. 🏥 **Psychiatrist** - $200K–$310K
12. 🏥 **Ophthalmologist** - $200K–$350K
13. 🏥 **Dermatologist** - $200K–$350K
14. 🏥 **Pediatrician** - $150K–$240K
15. 🏥 **General Practitioner** - $180K–$250K (Lowest)

### By Demand:

**Very High Demand** ⭐⭐⭐
- Orthopedic Surgeon
- Anesthesiologist
- Cardiologist
- Psychiatrist
- Pediatrician
- Dermatologist

**High Demand** ⭐⭐
- General Practitioner
- Neurologist
- Surgeon
- Radiologist
- OB/GYN
- Urologist
- Gastroenterologist
- Ophthalmologist
- Pulmonologist

### By Growth Potential:

**High Growth** 📈
- Psychiatrist (Mental health boom)
- Dermatologist (Cosmetic + dermatology growth)

**Medium Growth** ➡️
- Cardiologist, Neurologist, Orthopedic, Pediatrician, Psychiatrist, Surgeon, Anesthesiologist, Radiologist, OB/GYN, Ophthalmologist, Urologist, Gastroenterologist, Pulmonologist

**Low Growth** 📉
- General Practitioner
- Orthopedic Surgeon (despite high salary)

---

## Specialties Overview

```
HEALTHCARE PROFESSIONS
│
├─ NURSING STAFF
│  ├─ Registered Nurse (RN)
│  ├─ Licensed Practical Nurse (LPN)
│  └─ Certified Nursing Assistant (CNA)
│
├─ DOCTORS (PHYSICIANS) ⭐ NEW - 15 TYPES
│  ├─ General Practitioner / Family Medicine
│  ├─ Specialists
│  │  ├─ Cardiologist (Heart)
│  │  ├─ Neurologist (Brain/Nervous)
│  │  ├─ Orthopedic Surgeon (Bones/Joints)
│  │  ├─ Pediatrician (Children)
│  │  ├─ Psychiatrist (Mental Health)
│  │  ├─ Dermatologist (Skin)
│  │  ├─ Ophthalmologist (Eyes)
│  │  ├─ OB/GYN (Women's Health)
│  │  ├─ Urologist (Urinary System)
│  │  ├─ Gastroenterologist (Digestive)
│  │  ├─ Pulmonologist (Lungs)
│  │  ├─ Radiologist (Imaging)
│  │  └─ Anesthesiologist (Anesthesia)
│  │
│  └─ Surgeons
│     ├─ General Surgeon
│     └─ Specialty Surgeons
│
├─ MEDICAL SUPPORT
│  ├─ Medical Assistant
│  └─ Pharmacy Technician
│
└─ ADMINISTRATION
   └─ Healthcare Administrator
```

---

## Detection Keywords

The system now recognizes these keywords for doctor resumes:

- MD, MD.
- Doctor, Physician, Practitioner
- Board Certified, Board Certification
- Cardiologist, Neurologist, Orthopedic
- Pediatrician, Psychiatrist, Surgeon
- Anesthesiologist, Radiologist
- Ophthalmologist, Dermatologist
- OB/GYN, Urologist
- Gastroenterologist, Pulmonologist
- Hospital, Clinical, Medical
- Surgery, Surgical, Surgical Skills
- And 30+ more keywords...

---

## Sample Doctor Resume Sections

### For Cardiologist:
```
Key Points to Include:
✅ Board Certified - American College of Cardiology
✅ Procedures performed: 500+ cardiac catheterizations
✅ Patient outcomes: 98% success rate
✅ CME hours: 50+ annually
✅ Publications: 8 peer-reviewed papers
✅ Hospital affiliations: Cardiac privileges at 3 major hospitals
```

### For Surgeon:
```
Key Points to Include:
✅ Surgical specialty and training
✅ Procedures performed and success rates
✅ Board certifications
✅ Complication rates (low = good)
✅ Patient volume managed
✅ Surgical innovations or techniques
✅ Leadership roles in surgical dept
```

### For Psychiatrist:
```
Key Points to Include:
✅ Subspecialty (Child, Addiction, Forensic)
✅ Patient volume and complexity
✅ Psychopharmacology expertise
✅ Publications and research
✅ CME in latest psychiatric treatments
✅ Telemedicine experience (growing demand!)
✅ Community mental health initiatives
```

---

## Resume Scoring

**Maximum Doctor Resume Score**: 100/100

**Scoring Breakdown**:
- Skills Match: 0-60 points
- Experience Years: 0-25 points
- Completeness: 0-15 points

**Excellent Resume**: 85+ (Has board certification, clear specialty, strong metrics)
**Good Resume**: 75-84 (Has specialty focus, lacks some metrics)
**Decent Resume**: 65-74 (Generic medical background, needs specialization)
**Needs Work**: <65 (Vague experience, missing certifications)

---

## How System Helps Doctors

1. **Identifies Specialty** - Cardiologist? Neurologist? Surgeon?
2. **Shows Salary Potential** - $180K–$450K range based on specialty
3. **Highlights Career Growth** - High, Medium, or Low growth potential
4. **Provides Targeted Suggestions**:
   - Include board certifications
   - Add patient outcome metrics
   - Highlight research publications
   - List continuing education
   - Show surgical experience (if applicable)
5. **Recommends Certifications**:
   - Board certification exam prep
   - CME courses
   - Subspecialty training
6. **Suggests Portfolio Projects**:
   - Patient outcome dashboards
   - Clinical protocols
   - Research literature reviews
   - Evidence-based practice guidelines

---

## Testing Doctor Detection

```python
from analyzer import detect_industry, analyze_resume

# Test with doctor resume
result = analyze_resume("cardiologist_resume.pdf")

print(result['industry'])  # Output: Healthcare
print(result['career_suggestion'])  # Output: Cardiologist
print(result['career_suggestions'][0]['salary'])  # $280K–$400K
```

---

✅ **All 15 Doctor Types Supported and Ready!**

Use this system to:
- Upload doctor resumes
- Get specialty-specific recommendations
- See realistic salary ranges
- Get board certification guidance
- Identify career advancement paths
- Find relevant CME courses
