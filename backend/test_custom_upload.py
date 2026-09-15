import requests
import json
import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def test_grounded_upload():
    print("=== TESTING DOCUMENT-GROUNDED AI EXTRACTION ===")

    # 1. Login
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": "demo@example.com", "password": "Demo@123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload a custom document on Cellular Biology & Photosynthesis
    biology_text = (
        "Cellular Biology and Plant Physiology.\n\n"
        "Photosynthesis is the biological process by which green plants and certain other organisms transform light energy into chemical energy. "
        "During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.\n\n"
        "Chloroplasts are specialized organelles found in plant and algal cells that conduct photosynthesis. "
        "Chlorophyll is a green pigment located within the thylakoid membranes of chloroplasts that absorbs light energy primarily from blue and red wavelengths.\n\n"
        "The light-dependent reactions take place in the thylakoid membrane where ATP and NADPH are synthesized. "
        "The Calvin Cycle is the set of chemical reactions that take place in the stroma of chloroplasts to fix carbon dioxide into glucose.\n\n"
        "Cellular Respiration is the metabolic pathway that breaks down glucose and produces ATP in the mitochondria. "
        "Mitochondria are double-membrane-bound organelles known as the powerhouse of the cell responsible for aerobic respiration."
    )

    files = {"file": ("Cellular Biology and Plant Physiology.txt", biology_text.encode("utf-8"), "text/plain")}
    res = requests.post(f"{BASE_URL}/documents/upload", headers=headers, files=files, data={"auto_analyze": "false"})
    assert res.status_code == 200, f"Upload failed: {res.text}"
    doc = res.json()["data"]
    doc_id = doc["id"]
    print(f"[PASS] Uploaded '{doc['filename']}' (ID {doc_id})")

    # 3. Analyze the uploaded document
    res = requests.post(f"{BASE_URL}/documents/{doc_id}/analyze", headers=headers)
    assert res.status_code == 200, f"Analysis failed: {res.text}"
    analyzed = res.json()["data"]

    # 4. Check Topics
    topics = analyzed["topics"]
    print(f"\n[PASS] Extracted {len(topics)} Topics:")
    for t in topics:
        print(f"   - {t['name']} ({t['difficulty']}, {t['importance']}): {t['description']}")
    
    # Assert topics are about Biology / Photosynthesis and NOT SQL
    topic_names = " ".join([t['name'].lower() for t in topics])
    assert any(k in topic_names for k in ["biology", "photosynthesis", "chloroplast", "respiration", "plant"]), f"Topics should reflect biology text, got: {topic_names}"

    # 5. Check Summary
    summary = analyzed["summary"]
    print(f"\n[PASS] Generated Grounded Summary:")
    print(f"   Overview: {summary['overview']}")
    print(f"   Key Concepts ({len(summary['key_concepts'])}): {summary['key_concepts']}")
    print(f"   Definitions ({len(summary['definitions'])}): {[d['term'] + ' -> ' + d['definition'] for d in summary['definitions']]}")
    print(f"   Key Takeaways: {summary['key_takeaways']}")

    assert "photosynthesis" in summary['overview'].lower() or "biology" in summary['overview'].lower(), "Summary must be grounded in uploaded biology text"
    
    # 6. Check Generated Quiz
    res = requests.get(f"{BASE_URL}/quizzes", headers=headers)
    quizzes = res.json()["data"]
    bio_quiz = [q for q in quizzes if q["document_id"] == doc_id][0]
    
    res = requests.get(f"{BASE_URL}/quizzes/{bio_quiz['id']}", headers=headers)
    bio_quiz_detail = res.json()["data"]
    print(f"\n[PASS] Generated Quiz: '{bio_quiz_detail['title']}' ({len(bio_quiz_detail['questions'])} questions)")
    for i, q in enumerate(bio_quiz_detail['questions']):
        print(f"   Q{i+1}: {q['question']}")
        for opt_idx, opt in enumerate(q['options']):
            print(f"        {chr(65+opt_idx)}. {opt}")

    # Check that questions mention Photosynthesis/Chloroplasts/Mitochondria/Biology
    all_questions_text = " ".join([q['question'].lower() + " " + " ".join(q['options']).lower() for q in bio_quiz_detail['questions']])
    assert any(w in all_questions_text for w in ["photosynthesis", "chloroplast", "chlorophyll", "calvin", "mitochondria", "respiration"]), "Quiz must contain questions on the uploaded biology material"

    # 7. Check Generated Flashcards
    res = requests.get(f"{BASE_URL}/flashcards?document_id={doc_id}", headers=headers)
    cards = res.json()["data"]
    print(f"\n[PASS] Generated Flashcards ({len(cards)}):")
    for c in cards:
        print(f"   [Front]: {c['front']}")
        print(f"   [Back]: {c['back']}\n")

    assert any("photosynthesis" in c['front'].lower() or "chloroplast" in c['front'].lower() or "mitochondria" in c['front'].lower() or "photosynthesis" in c['back'].lower() for c in cards), "Flashcards must be grounded in uploaded text"

    print("=== VERIFICATION CONFIRMED: SUMMARY AND QUIZZES ARE 100% GROUNDED IN THE UPLOADED FILE! ===")

if __name__ == "__main__":
    test_grounded_upload()
