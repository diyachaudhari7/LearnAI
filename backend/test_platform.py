import requests
import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("=== STARTING FULL PLATFORM API VERIFICATION ===")
    
    # 1. Health Check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health Check:", res.json())

    # 2. Demo User Login
    login_payload = {"email": "demo@example.com", "password": "Demo@123"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["data"]["access_token"]
    user_data = res.json()["data"]["user"]
    print(f"[PASS] Auth Login: Logged in as {user_data['name']} ({user_data['role']})")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Current User Me
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert res.status_code == 200
    print("[PASS] /auth/me")

    # 4. Dashboard Data
    res = requests.get(f"{BASE_URL}/dashboard", headers=headers)
    assert res.status_code == 200
    d_data = res.json()["data"]
    print(f"[PASS] Dashboard: {d_data['stats']['total_documents']} docs, {d_data['stats']['quizzes_completed']} quizzes completed, streak: {d_data['stats']['learning_streak_days']} days")
    print(f"       AI Recommendation: {d_data['ai_recommendation']['message']}")

    # 5. Documents List & Detail
    res = requests.get(f"{BASE_URL}/documents", headers=headers)
    assert res.status_code == 200
    docs = res.json()["data"]
    assert len(docs) >= 3, "Expected at least 3 pre-seeded documents"
    doc1 = docs[0]
    print(f"[PASS] List Documents: Found {len(docs)} documents ({[d['filename'] for d in docs]})")

    res = requests.get(f"{BASE_URL}/documents/{doc1['id']}", headers=headers)
    assert res.status_code == 200
    doc_detail = res.json()["data"]
    print(f"[PASS] Document Detail: {doc_detail['filename']} with {len(doc_detail['topics'])} topics and summary available: {doc_detail['has_summary']}")

    # 6. AI Summary
    res = requests.post(f"{BASE_URL}/ai/summary", headers=headers, json={"document_id": doc1["id"]})
    assert res.status_code == 200
    summary_data = res.json()["data"]
    print(f"[PASS] AI Summary: Overview length {len(summary_data['overview'])}, {len(summary_data['key_concepts'])} concepts, {len(summary_data['definitions'])} definitions")

    # 7. Quizzes & Quiz Detail
    res = requests.get(f"{BASE_URL}/quizzes", headers=headers)
    assert res.status_code == 200
    quizzes = res.json()["data"]
    assert len(quizzes) >= 3
    q1 = quizzes[0]
    print(f"[PASS] List Quizzes: Found {len(quizzes)} quizzes ({[q['title'] for q in quizzes]})")

    res = requests.get(f"{BASE_URL}/quizzes/{q1['id']}", headers=headers)
    assert res.status_code == 200
    q_detail = res.json()["data"]
    print(f"[PASS] Quiz Detail: '{q_detail['title']}' has {len(q_detail['questions'])} questions")

    # 8. Submit Quiz
    submit_answers = [{"question_id": q["id"], "selected_option": 0} for q in q_detail["questions"]]
    res = requests.post(f"{BASE_URL}/quizzes/{q1['id']}/submit", headers=headers, json={"time_taken_seconds": 120, "answers": submit_answers})
    assert res.status_code == 200
    result_data = res.json()["data"]
    print(f"[PASS] Submit Quiz: Score {result_data['score']}/{result_data['total_questions']} ({result_data['percentage']}%)")
    print(f"       AI Diagnostic Advice: {result_data['ai_recommendation']}")

    # 9. Competency Gap Analysis
    res = requests.get(f"{BASE_URL}/competency", headers=headers)
    assert res.status_code == 200
    comp_data = res.json()["data"]
    print(f"[PASS] Competency Analysis:")
    for c in comp_data["competencies"]:
        print(f"       - {c['skill']}: {c['score']}% ({c['status']})")
    print(f"       AI Gap Diagnosis: {comp_data['ai_analysis']}")
    print(f"       Priority Focus Order: {comp_data['recommended_focus']}")

    # 10. Personalized Learning Path
    res = requests.get(f"{BASE_URL}/learning-path", headers=headers)
    assert res.status_code == 200
    lp_data = res.json()["data"]
    print(f"[PASS] Learning Path: '{lp_data['title']}' with {len(lp_data['weeks'])} weeks")
    for w in lp_data["weeks"]:
        print(f"       - Week {w['week_number']} ({w['status']}, {w['progress']}%): {w['title']}")

    # 11. Toggle Topic Completion
    w2 = lp_data["weeks"][1]
    t1 = w2["topics"][0]
    res = requests.post(f"{BASE_URL}/learning-path/week/{w2['id']}/topic/{t1['id']}/toggle", headers=headers)
    assert res.status_code == 200
    toggle_data = res.json()["data"]
    print(f"[PASS] Toggle Topic: Week {w2['week_number']} progress updated to {toggle_data['week_progress']}% (status: {toggle_data['week_status']})")

    # 12. Flashcards
    res = requests.get(f"{BASE_URL}/flashcards", headers=headers)
    assert res.status_code == 200
    fc_list = res.json()["data"]
    assert len(fc_list) >= 8
    print(f"[PASS] Flashcards: {len(fc_list)} flashcards loaded")

    # 13. Progress Analytics
    res = requests.get(f"{BASE_URL}/progress", headers=headers)
    assert res.status_code == 200
    prog_data = res.json()["data"]
    print(f"[PASS] Progress Analytics: {len(prog_data['score_history'])} score history points, {len(prog_data['weekly_activity'])} daily activity records")

    # 14. Profile & Settings
    res = requests.get(f"{BASE_URL}/profile", headers=headers)
    assert res.status_code == 200
    print("[PASS] Profile")

    res = requests.get(f"{BASE_URL}/settings", headers=headers)
    assert res.status_code == 200
    print("[PASS] Settings:", res.json()["data"])

    # 15. Upload and AI Analysis Pipeline
    test_pdf_content = b"%PDF-1.4 sample PDF content with Python, Data Analysis, and SQL database querying concepts."
    files = {"file": ("Sample Machine Learning Guide.pdf", test_pdf_content, "application/pdf")}
    res = requests.post(f"{BASE_URL}/documents/upload", headers=headers, files=files, data={"auto_analyze": "false"})
    assert res.status_code == 200
    new_doc = res.json()["data"]
    print(f"[PASS] PDF Upload: Uploaded '{new_doc['filename']}' (ID {new_doc['id']})")

    res = requests.post(f"{BASE_URL}/documents/{new_doc['id']}/analyze", headers=headers)
    assert res.status_code == 200
    analyzed_doc = res.json()["data"]
    print(f"[PASS] AI Analyze Pipeline: Generated {len(analyzed_doc['topics'])} topics, summary, quiz, and flashcards")

    print("\n=== ALL 15 END-TO-END TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"FAILED with error: {e}")
        sys.exit(1)
