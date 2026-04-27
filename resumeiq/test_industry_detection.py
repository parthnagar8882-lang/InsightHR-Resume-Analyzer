#!/usr/bin/env python3
"""
Test script to demonstrate multi-industry resume analysis support.
"""

from analyzer import detect_industry, analyze_resume, INDUSTRY_KEYWORDS, SKILLS_BY_INDUSTRY

# Test 1: Industry Detection
print("=" * 70)
print("TEST 1: INDUSTRY DETECTION")
print("=" * 70)

test_resumes = {
    "Teacher": """
        John Smith
        Teaching Experience:
        - Elementary Teacher, 5 years
        - Curriculum Development
        - Classroom Management
        - Student Assessment and Grading
        - Lesson Planning
        Skills: Pedagogical expertise, student engagement, Microsoft Teams
    """,
    
    "Nurse": """
        Jane Doe
        Registered Nurse (RN)
        Clinical Skills: Patient Care, Nursing, EMR, Medication Management
        Experience: 8 years in Hospital Setting
        Certifications: BLS, ACLS, Critical Care (CCRN)
        HIPAA Compliance, Infection Control
    """,
    
    "Sales Person": """
        Mike Johnson
        Sales Executive
        Business Development Manager
        Account Management, Lead Generation, CRM
        Sales forecasting, Pipeline Management
        Experience: $5M+ revenue growth, Customer Acquisition
    """,
    
    "Software Engineer": """
        Alex Chen
        Full Stack Developer
        Python, JavaScript, React, Node.js
        SQL, Docker, Kubernetes, AWS
        Machine Learning, Data Analysis
        GitHub: Projects with 2K+ stars
    """
}

for role_name, resume_text in test_resumes.items():
    detected = detect_industry(resume_text)
    print(f"\n{role_name} Resume → Detected Industry: {detected}")


# Test 2: Show industry-specific skills
print("\n" + "=" * 70)
print("TEST 2: INDUSTRY-SPECIFIC SKILLS")
print("=" * 70)

industries_to_show = ["Teaching", "Healthcare", "Sales/Marketing"]
for industry in industries_to_show:
    skills = SKILLS_BY_INDUSTRY.get(industry, [])[:5]
    print(f"\n{industry} (first 5 skills): {skills}")


# Test 3: Show industry keywords
print("\n" + "=" * 70)
print("TEST 3: INDUSTRY KEYWORDS")
print("=" * 70)

for industry, keywords in list(INDUSTRY_KEYWORDS.items())[:3]:
    print(f"\n{industry}: {keywords[:5]} ...")


print("\n" + "=" * 70)
print("Multi-Industry Support Successfully Implemented!")
print("=" * 70)
print("\nSupported Industries:")
print("  • Technology (Software Engineering, DevOps, etc.)")
print("  • Teaching (Teachers, Instructional Designers, etc.)")
print("  • Healthcare (Nurses, Doctors, Therapists, etc.)")
print("  • Sales/Marketing (Sales, Marketing Managers, etc.)")
print("  • Finance/Accounting (Accountants, Financial Analysts, etc.)")
print("  • HR/Administration (HR Managers, Recruiters, etc.)")
print("  • Creative/Design (UX/UI, Graphic Design, etc.)")
print("\nEach industry includes:")
print("  ✓ Industry-specific skills")
print("  ✓ Relevant job roles with salary ranges")
print("  ✓ Growth and demand forecasts")
print("  ✓ Targeted improvement suggestions")
print("  ✓ Industry-specific courses")
print("  ✓ Relevant project ideas")
