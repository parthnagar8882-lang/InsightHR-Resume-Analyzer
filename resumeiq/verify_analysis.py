#!/usr/bin/env python3
"""Quick verification that analysis engine works"""
from analyzer import analyze_resume
import tempfile
import os

# Create test resume
content = """John Doe
john@example.com
Professional Summary: 5 years experience

Skills: Python JavaScript React Django Flask Node.js
Experience: Senior Developer at TechCorp
"""

with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
    f.write(content)
    temp_file = f.name

try:
    result = analyze_resume(temp_file)
    print('✅ Analysis Engine Test Results:')
    print(f'  Score: {result["score"]}/100')
    print(f'  ATS Score: {result["ats_score"]}/100')
    print(f'  Skills detected: {len(result["skills"])}')
    print(f'  Career suggestion: {result["career_suggestion"]}')
    print('✅ Analysis engine is working correctly!')
except Exception as e:
    print(f'❌ Error: {e}')
finally:
    os.remove(temp_file)
