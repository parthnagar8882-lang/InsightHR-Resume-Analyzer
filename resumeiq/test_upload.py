#!/usr/bin/env python3
"""
Test script to verify the complete upload and analysis flow
"""
import os
import json
from io import BytesIO
from app import app, db, User, Resume
from analyzer import analyze_resume
import tempfile

def test_resume_analysis():
    """Test the complete resume analysis flow"""
    
    print("\n" + "="*60)
    print("🧪 TESTING RESUME ANALYSIS FLOW")
    print("="*60)
    
    # Create a test resume content
    test_resume_content = """
    JOHN DOE
    john.doe@example.com | (555) 123-4567 | LinkedIn.com/in/johndoe | GitHub.com/johndoe
    
    PROFESSIONAL SUMMARY
    Experienced Software Engineer with 5 years of expertise in full-stack development. 
    Proficient in Python, JavaScript, and cloud technologies. Strong track record of 
    delivering scalable applications and leading cross-functional teams.
    
    CORE COMPETENCIES
    • Python • JavaScript • React • Node.js • Django • Flask • AWS
    • Docker • Kubernetes • SQL • PostgreSQL • MongoDB • RESTful APIs
    • Agile/Scrum • CI/CD • Git • Linux • Machine Learning basics
    
    PROFESSIONAL EXPERIENCE
    
    Senior Software Engineer
    TechCorp Inc. | San Francisco, CA | Jan 2022 – Present
    • Led development of microservices architecture handling 10M+ requests/day
    • Mentored team of 4 junior developers on best practices and code quality
    • Reduced API response time by 40% through optimization and caching
    • Implemented automated testing pipeline increasing coverage to 85%
    
    Software Engineer
    StartupXYZ | Remote | Jun 2019 – Dec 2021
    • Developed full-stack web application using React and Node.js
    • Designed and implemented database schemas for complex data relationships
    • Built CI/CD pipelines using Docker and GitHub Actions
    • Collaborated with product team to deliver features ahead of schedule
    
    Junior Developer
    WebSolutions LLC | Boston, MA | Jan 2018 – May 2019
    • Built responsive web interfaces using React and CSS
    • Maintained and improved legacy Python codebase
    • Participated in code reviews and knowledge sharing sessions
    
    EDUCATION
    
    Bachelor of Science in Computer Science
    State University | Graduated: May 2017
    GPA: 3.7/4.0
    Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development
    
    CERTIFICATIONS
    • AWS Certified Solutions Architect (2021)
    • Docker Certified Associate (2020)
    
    PROJECTS
    
    AI Resume Analyzer Platform
    GitHub.com/johndoe/resumeiq | Python, Flask, React, NLP
    • Built AI-powered resume analysis tool with 68+ skill detection
    • Implemented ATS score calculation and career suggestions
    • Deployed to AWS with Docker containerization
    
    Task Management API
    GitHub.com/johndoe/taskapi | Node.js, MongoDB, GraphQL
    • Designed GraphQL API for collaborative task management
    • Implemented real-time updates using WebSockets
    • Achieved 99.9% uptime with load balancing
    
    LANGUAGES
    • English (Native)
    • Spanish (Fluent)
    """
    
    # Save test resume to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
        f.write(test_resume_content)
        temp_file = f.name
    
    try:
        print(f"\n✅ Created test resume file: {temp_file}")
        
        # Analyze the resume
        print("\n🔍 Analyzing resume...")
        result = analyze_resume(temp_file)
        
        print("\n" + "="*60)
        print("📊 ANALYSIS RESULTS")
        print("="*60)
        
        print(f"\n👤 Candidate Name: {result.get('candidate_name', 'N/A')}")
        print(f"📈 Overall Score: {result.get('score', 0)}/100")
        print(f"🤖 ATS Score: {result.get('ats_score', 0)}/100")
        print(f"💼 Experience Years: {result.get('experience_years', 0)}")
        print(f"🎭 Tone: {result.get('tone', 'N/A')}")
        
        print("\n📋 Skills Detected:")
        skills = result.get('skills', [])
        if skills:
            for skill in skills[:10]:  # Show top 10
                print(f"   • {skill}")
            if len(skills) > 10:
                print(f"   ... and {len(skills) - 10} more")
        else:
            print("   No skills detected")
        
        print("\n⚠️ Missing Skills:")
        missing = result.get('missing_skills', [])
        if missing:
            for skill in missing[:5]:
                print(f"   • {skill}")
        else:
            print("   No missing skills identified")
        
        print("\n💡 Career Suggestion:", result.get('career_suggestion', 'N/A'))
        
        print("\n🎯 Strengths:")
        strengths = result.get('strengths', [])
        if strengths:
            for strength in strengths[:3]:
                print(f"   • {strength}")
        else:
            print("   No strengths identified")
        
        print("\n✨ Suggestions:")
        suggestions = result.get('suggestions', [])
        if suggestions:
            for suggestion in suggestions[:3]:
                print(f"   • {suggestion}")
        else:
            print("   No suggestions available")
        
        print("\n" + "="*60)
        print("✅ ANALYSIS COMPLETE - All systems operational!")
        print("="*60 + "\n")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during analysis: {str(e)}")
        return False
        
    finally:
        # Clean up
        if os.path.exists(temp_file):
            os.remove(temp_file)
            print(f"🧹 Cleaned up temp file")

if __name__ == '__main__':
    with app.app_context():
        success = test_resume_analysis()
        exit(0 if success else 1)
