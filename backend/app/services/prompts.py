"""System and task prompt templates for AI educational generation."""

TOPIC_EXTRACTION_PROMPT = """You are an expert AI curriculum analyst.
Analyze the provided educational material and extract 3 to 6 major topics/skills covered.
For each topic, provide:
- name: clear topic name (e.g., 'SQL Joins', 'Python Data Structures')
- difficulty: 'Beginner', 'Intermediate', or 'Advanced'
- importance: 'High', 'Medium', or 'Low'
- description: a concise 1-2 sentence description of what the student learns

Return ONLY valid JSON matching this schema:
[
  {
    "name": "Topic Name",
    "difficulty": "Intermediate",
    "importance": "High",
    "description": "Short explanation"
  }
]
"""

SUMMARY_GENERATION_PROMPT = """You are an expert AI tutor.
Generate a structured, comprehensive summary of the provided learning material.
Include:
1. overview: 2-3 paragraph thorough overview of the content.
2. key_concepts: list of 4-8 bullet points highlighting essential concepts.
3. definitions: list of objects with 'term' and 'definition' for key terms.
4. key_takeaways: list of 3-5 high-impact actionable points or exam tips.

Return ONLY valid JSON matching this schema:
{
  "overview": "Thorough overview...",
  "key_concepts": ["Concept 1", "Concept 2"],
  "definitions": [
    {"term": "Term 1", "definition": "Definition 1"}
  ],
  "key_takeaways": ["Takeaway 1", "Takeaway 2"]
}
"""

QUIZ_GENERATION_PROMPT = """You are an expert standardized examination board specialist and pedagogy director.
Generate an authentic, professional Multiple Choice Examination paper strictly grounded in the provided educational material.

EXAMINATION QUESTION QUALITY REQUIREMENTS:
1. QUESTION STEM:
   - Clear, unambiguous, and grammatically complete question stem.
   - Tests genuine conceptual understanding, operational purpose, or practical syntax/functionality.
   - Mix question types:
     * Identification: "Which tag/keyword/function is used to...?"
     * Conceptual Analysis: "What is the primary operational difference between...?"
     * Syntax & Attributes: "Which attribute must be specified when...?"
     * Application / Evaluation: "Given the scenario..., what will be the resulting behavior?"
2. OPTIONS (A, B, C, D):
   - Provide EXACTLY 4 plausible, mutually exclusive options.
   - Options must be concise, grammatically parallel, and roughly equal in length.
   - Distractors MUST be legitimate domain concepts from the same document or closely related technical terms.
   - NEVER use meta-language or nonsense filler like 'temporary cache', 'unrelated mechanism', or 'deprecated method'.
   - NEVER use 'All of the above' or 'None of the above'.
3. ACCURACY & EXPLANATION:
   - Only ONE option is objectively correct.
   - correct_answer must be an integer index: 0, 1, 2, or 3.
   - explanation must cite the specific principle from the material and explain why the answer is correct and why common misconceptions fail.

Return ONLY valid JSON matching this schema:
[
  {
    "question": "Which HTML tag is used to create a hyperlink with the destination URL?",
    "options": ["<a>", "<link>", "<href>", "<nav>"],
    "correct_answer": 0,
    "explanation": "The <a> (anchor) tag creates hyperlinks. The destination URL is provided via the href attribute.",
    "topic": "HTML",
    "difficulty": "Medium"
  }
]
"""


FLASHCARD_GENERATION_PROMPT = """You are an expert flashcard designer using spaced repetition principles.
Generate 8 to 12 effective flashcards from the provided learning material.
Each flashcard must have:
- front: a concise question, prompt, or concept trigger
- back: a precise, memorable explanation or answer
- topic: relevant topic/skill tag

Return ONLY valid JSON matching this schema:
[
  {
    "front": "What is a SQL JOIN?",
    "back": "A SQL clause used to combine rows from two or more tables based on a related column.",
    "topic": "SQL"
  }
]
"""

LEARNING_PATH_PROMPT = """You are an expert AI educational advisor.
Create a personalized 4-week learning roadmap for a student based on their competency scores, weak areas, and learning goals.
Competency profile:
{competency_data}

Weak skills requiring the highest priority:
{weak_skills}

Generate a 4-week structured curriculum where earlier weeks focus on fixing fundamental gaps and later weeks advance to application and projects.

Return ONLY valid JSON matching this schema:
{
  "title": "Personalized Skill Mastery Roadmap",
  "overview": "Overview of how this path addresses identified gaps...",
  "weeks": [
    {
      "week_number": 1,
      "title": "Week Title",
      "description": "Description of objectives for this week",
      "status": "In Progress",
      "progress": 0,
      "estimated_hours": 6,
      "difficulty": "Beginner",
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }
  ]
}
"""
