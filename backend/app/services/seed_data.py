import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.document import Document
from app.models.topic import Topic
from app.models.summary import Summary
from app.models.quiz import Quiz, Question, QuizAttempt, QuizAttemptAnswer
from app.models.flashcard import Flashcard
from app.models.competency import Competency
from app.models.learning_path import LearningPath, LearningPathWeek, LearningPathTopic
from app.models.activity import UserActivity
from app.auth.password import get_password_hash

def seed_database(db: Session):
    """Seeds the database with rich, realistic demo data if not already present."""
    demo_email = "demo@example.com"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
        return

    print("Seeding database with demo user and learning materials...")

    # 1. Create Demo User
    demo_user = User(
        name="Diya Sharma",
        email=demo_email,
        password_hash=get_password_hash("Demo@123"),
        role="Student",
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
        daily_goal_minutes=45,
        preferred_difficulty="Intermediate",
        dark_mode=False,
        email_notifications=True,
        learning_reminders=True,
        quiz_reminders=True,
        created_at=datetime.utcnow() - timedelta(days=21)
    )
    db.add(demo_user)
    db.flush()

    # 2. Competencies as per problem statement
    # Statistics: 85% (Strong), Python: 72% (Good), SQL: 42% (Needs Improvement), Data Analysis: 35% (Weak)
    competency_records = [
        Competency(user_id=demo_user.id, skill="Statistics", score=85.0, status="Strong", total_questions=20, correct_questions=17, updated_at=datetime.utcnow() - timedelta(days=2)),
        Competency(user_id=demo_user.id, skill="Python", score=72.0, status="Good", total_questions=25, correct_questions=18, updated_at=datetime.utcnow() - timedelta(days=3)),
        Competency(user_id=demo_user.id, skill="SQL", score=42.0, status="Needs Improvement", total_questions=20, correct_questions=8, updated_at=datetime.utcnow() - timedelta(days=1)),
        Competency(user_id=demo_user.id, skill="Data Analysis", score=35.0, status="Weak", total_questions=20, correct_questions=7, updated_at=datetime.utcnow())
    ]
    for comp in competency_records:
        db.add(comp)

    # 3. Documents
    docs_data = [
        {
            "filename": "SQL Fundamentals.pdf",
            "size": 1420000,
            "pages": 18,
            "text": "Structured Query Language (SQL) is the standard domain-specific language for relational database management systems. Core syntax includes SELECT, WHERE, ORDER BY, GROUP BY, and HAVING. Key join types include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN. Advanced topics include Common Table Expressions (WITH clauses) and Window Functions.",
            "topics": [
                {"name": "SQL Basics", "difficulty": "Beginner", "importance": "High", "desc": "DDL/DML operations, SELECT syntax, WHERE filtering, and sorting."},
                {"name": "Joins & Relationships", "difficulty": "Intermediate", "importance": "High", "desc": "INNER, LEFT, RIGHT joins and multi-table entity integrity."},
                {"name": "Aggregations", "difficulty": "Intermediate", "importance": "Medium", "desc": "GROUP BY, HAVING clauses, and aggregate functions (COUNT, SUM, AVG)."},
                {"name": "Advanced SQL & Window Functions", "difficulty": "Advanced", "importance": "High", "desc": "CTEs, ROW_NUMBER, RANK, and analytical window functions."}
            ],
            "summary": {
                "overview": "This document is a comprehensive guide to Structured Query Language (SQL) and relational databases. It covers core syntax (SELECT, WHERE, ORDER BY), table joins (INNER, LEFT, FULL OUTER), aggregation (GROUP BY, HAVING), and advanced querying using CTEs and Window Functions.",
                "key_concepts": [
                    "Relational schema structure and primary/foreign keys",
                    "Row filtering using WHERE and boolean operators",
                    "Multi-table querying with INNER, LEFT, and FULL OUTER JOINs",
                    "Data summarization via GROUP BY and aggregate functions",
                    "Analytical queries using CTEs (WITH) and Window Functions (ROW_NUMBER, OVER)"
                ],
                "definitions": [
                    {"term": "Primary Key", "definition": "A unique column or combination of columns identifying each record."},
                    {"term": "Foreign Key", "definition": "A column linking data across relational tables."},
                    {"term": "INNER JOIN", "definition": "Returns records that have matching values in both tables."},
                    {"term": "HAVING Clause", "definition": "Filters aggregated records after GROUP BY."}
                ],
                "key_takeaways": [
                    "Filter data as early as possible using WHERE before joins to maximize performance.",
                    "Use EXPLAIN to verify that indexes are utilized on join keys.",
                    "Use CTEs to structure complex nested subqueries for improved readability."
                ]
            }
        },
        {
            "filename": "Python Fundamentals.pdf",
            "size": 2150000,
            "pages": 24,
            "text": "Python is a high-level, interpreted programming language known for readability. It supports object-oriented, procedural, and functional programming. Core data structures include lists, dictionaries, tuples, and sets. Python features list comprehensions, generators with yield, context managers with 'with', and the Global Interpreter Lock (GIL) in CPython.",
            "topics": [
                {"name": "Python Syntax & Types", "difficulty": "Beginner", "importance": "High", "desc": "Variables, primitive types, control flow, functions, and scoping."},
                {"name": "Data Structures", "difficulty": "Intermediate", "importance": "High", "desc": "Lists, Tuples, Dictionaries, Sets, and list comprehensions."},
                {"name": "Object-Oriented Python", "difficulty": "Intermediate", "importance": "Medium", "desc": "Classes, dunder methods, inheritance, and encapsulation."},
                {"name": "Generators & Memory", "difficulty": "Advanced", "importance": "High", "desc": "Yield generators, iterators, and memory optimization."}
            ],
            "summary": {
                "overview": "A detailed manual covering Python syntax, data structures, and idiomatic coding paradigms. It explores lists, dictionaries, tuples, sets, functions, decorators, generators, and object-oriented architectures.",
                "key_concepts": [
                    "Dynamic typing and Python memory model",
                    "List, dictionary, and set comprehensions",
                    "Memory-efficient streaming with generators and yield",
                    "Object-oriented programming with classes and inheritance",
                    "Error handling using try, except, else, and finally"
                ],
                "definitions": [
                    {"term": "List Comprehension", "definition": "A concise syntactic way to construct lists from existing iterables."},
                    {"term": "Generator", "definition": "A function that yields values on demand using 'yield', conserving memory."},
                    {"term": "Tuple", "definition": "An immutable sequence of Python objects."},
                    {"term": "GIL", "definition": "Global Interpreter Lock ensuring single-threaded bytecode execution in CPython."}
                ],
                "key_takeaways": [
                    "Use generators instead of large in-memory lists for huge datasets.",
                    "Prefer built-in dictionary lookups (O(1)) over nested list iterations (O(n)).",
                    "Write clear unit tests and leverage Python type hinting."
                ]
            }
        },
        {
            "filename": "Data Analysis.pdf",
            "size": 1890000,
            "pages": 20,
            "text": "Data Analysis involves inspecting, cleansing, transforming, and modeling data to discover useful information. In Python, Pandas and NumPy are foundational. Techniques include handling missing values (dropna, fillna), categorical encoding (One-Hot, Ordinal), feature scaling, exploratory data analysis (EDA), and visualizing distributions using Matplotlib and Seaborn.",
            "topics": [
                {"name": "Data Wrangling with Pandas", "difficulty": "Intermediate", "importance": "High", "desc": "DataFrames, indexing, filtering, merging, and reshaping."},
                {"name": "Data Cleaning & Imputation", "difficulty": "Beginner", "importance": "High", "desc": "Handling missing nulls, duplicate removal, and outlier detection."},
                {"name": "Exploratory Data Analysis (EDA)", "difficulty": "Intermediate", "importance": "High", "desc": "Statistical summaries, correlation heatmaps, and distribution plots."},
                {"name": "Feature Engineering", "difficulty": "Advanced", "importance": "High", "desc": "One-hot encoding, log transforms, and feature scaling."}
            ],
            "summary": {
                "overview": "An applied guide to data exploration, cleaning, transformation, and statistical visualization using Python data science libraries like Pandas, NumPy, and Seaborn.",
                "key_concepts": [
                    "DataFrame operations, boolean indexing, and groupby aggregations",
                    "Strategies for missing data imputation (mean, median, forward fill)",
                    "Visual pattern discovery using histograms, boxplots, and scatter plots",
                    "Feature engineering and categorical variable encoding"
                ],
                "definitions": [
                    {"term": "EDA", "definition": "Exploratory Data Analysis - visualizing and summarizing dataset features."},
                    {"term": "One-Hot Encoding", "definition": "Converting categorical values into binary 0/1 indicator columns."},
                    {"term": "Imputation", "definition": "Replacing missing data with substituted plausible values."}
                ],
                "key_takeaways": [
                    "Always examine distributions and check for outliers before modeling.",
                    "Avoid data leakage during feature scaling and imputation.",
                    "Document data transformations in clear, reproducible pipelines."
                ]
            }
        }
    ]

    created_docs = []
    for doc_item in docs_data:
        doc = Document(
            user_id=demo_user.id,
            filename=doc_item["filename"],
            file_path=f"uploads/{doc_item['filename']}",
            file_size=doc_item["size"],
            page_count=doc_item["pages"],
            extracted_text=doc_item["text"],
            status="processed",
            created_at=datetime.utcnow() - timedelta(days=7)
        )
        db.add(doc)
        db.flush()
        created_docs.append(doc)

        # Topics
        for t in doc_item["topics"]:
            top = Topic(
                document_id=doc.id,
                name=t["name"],
                difficulty=t["difficulty"],
                importance=t["importance"],
                description=t["desc"]
            )
            db.add(top)

        # Summary
        s = doc_item["summary"]
        summ = Summary(
            document_id=doc.id,
            overview=s["overview"],
            key_concepts=json.dumps(s["key_concepts"]),
            definitions=json.dumps(s["definitions"]),
            key_takeaways=json.dumps(s["key_takeaways"]),
            created_at=datetime.utcnow() - timedelta(days=7)
        )
        db.add(summ)

    # 4. Quizzes and Questions
    sql_doc = created_docs[0]
    py_doc = created_docs[1]
    da_doc = created_docs[2]

    quizzes_data = [
        {
            "doc_id": sql_doc.id,
            "title": "SQL Fundamentals & Joins Quiz",
            "topic": "SQL",
            "difficulty": "Medium",
            "questions": [
                {
                    "question": "What does SQL stand for?",
                    "options": ["Structured Query Language", "Simple Question Language", "System Query Logic", "Sequential Query Language"],
                    "correct": 0,
                    "explanation": "SQL stands for Structured Query Language, the ANSI standard language for relational databases.",
                    "topic": "SQL",
                    "difficulty": "Easy"
                },
                {
                    "question": "Which SQL clause is used to filter individual rows before grouping?",
                    "options": ["HAVING", "ORDER BY", "WHERE", "GROUP BY"],
                    "correct": 2,
                    "explanation": "WHERE filters rows before any group-by aggregation occurs.",
                    "topic": "SQL",
                    "difficulty": "Easy"
                },
                {
                    "question": "What is the primary difference between INNER JOIN and LEFT JOIN?",
                    "options": [
                        "INNER JOIN returns matching rows only; LEFT JOIN returns all rows from left table and matched from right.",
                        "LEFT JOIN is faster than INNER JOIN in all databases.",
                        "INNER JOIN only works with integer foreign keys.",
                        "LEFT JOIN cannot have a WHERE filter."
                    ],
                    "correct": 0,
                    "explanation": "INNER JOIN requires matches in both tables, whereas LEFT JOIN preserves all left-table rows with NULLs for unmatched right-table attributes.",
                    "topic": "SQL",
                    "difficulty": "Medium"
                },
                {
                    "question": "Which clause is mandatory when filtering results of aggregate functions like COUNT()?",
                    "options": ["WHERE", "HAVING", "LIMIT", "FILTER"],
                    "correct": 1,
                    "explanation": "HAVING was added to SQL specifically because the WHERE keyword cannot be applied to aggregate expressions.",
                    "topic": "SQL",
                    "difficulty": "Medium"
                },
                {
                    "question": "What construct is defined using the 'WITH' keyword in modern SQL?",
                    "options": ["Trigger", "Common Table Expression (CTE)", "Foreign Key Constraint", "Stored Procedure"],
                    "correct": 1,
                    "explanation": "CTEs are named temporary result sets defined via WITH clauses.",
                    "topic": "SQL",
                    "difficulty": "Hard"
                }
            ]
        },
        {
            "doc_id": py_doc.id,
            "title": "Python Data Structures & OOP Quiz",
            "topic": "Python",
            "difficulty": "Medium",
            "questions": [
                {
                    "question": "Which of the following built-in Python data types is immutable?",
                    "options": ["List", "Dictionary", "Tuple", "Set"],
                    "correct": 2,
                    "explanation": "Tuples are immutable; their elements cannot be changed or appended after initialization.",
                    "topic": "Python",
                    "difficulty": "Easy"
                },
                {
                    "question": "What is the primary function of the 'yield' keyword in Python?",
                    "options": ["Immediately breaks out of a while loop", "Pauses execution and produces a generator value", "Declares an abstract method in an OOP class", "Imports asynchronous dependencies"],
                    "correct": 1,
                    "explanation": "yield transforms a function into a generator iterator, emitting items sequentially on demand.",
                    "topic": "Python",
                    "difficulty": "Medium"
                },
                {
                    "question": "What is the average lookup time complexity for a key in a Python dictionary?",
                    "options": ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    "correct": 0,
                    "explanation": "Dictionaries are implemented as hash tables, yielding average O(1) constant time retrieval.",
                    "topic": "Python",
                    "difficulty": "Medium"
                },
                {
                    "question": "Which decorator turns a class method into a getter property attribute?",
                    "options": ["@classmethod", "@staticmethod", "@property", "@getter"],
                    "correct": 2,
                    "explanation": "@property allows method invocation without parentheses, mimicking an attribute.",
                    "topic": "Python",
                    "difficulty": "Medium"
                },
                {
                    "question": "What is the CPython Global Interpreter Lock (GIL)?",
                    "options": ["A file lock on the virtual environment", "A mutex preventing concurrent native threads from executing Python bytecode at once", "A garbage collection threshold", "A JIT optimization flag"],
                    "correct": 1,
                    "explanation": "The GIL is a mutex synchronizing thread execution to safeguard thread safety in CPython memory management.",
                    "topic": "Python",
                    "difficulty": "Hard"
                }
            ]
        },
        {
            "doc_id": da_doc.id,
            "title": "Data Analysis & Pandas Assessment",
            "topic": "Data Analysis",
            "difficulty": "Hard",
            "questions": [
                {
                    "question": "Which Pandas method removes rows with missing values from a DataFrame?",
                    "options": ["df.remove_nulls()", "df.dropna()", "df.fillna()", "df.clean()"],
                    "correct": 1,
                    "explanation": "df.dropna() drops rows or columns containing missing / NaN values.",
                    "topic": "Data Analysis",
                    "difficulty": "Easy"
                },
                {
                    "question": "What is the primary objective of Exploratory Data Analysis (EDA)?",
                    "options": ["Deploying models to Kubernetes", "Summarizing main dataset characteristics and discovering distributions visually", "Encrypting database backups", "Compiling Python to C++"],
                    "correct": 1,
                    "explanation": "EDA analyzes data sets to summarize their key characteristics using visual and statistical summaries.",
                    "topic": "Data Analysis",
                    "difficulty": "Easy"
                },
                {
                    "question": "Which technique transforms categorical strings into distinct numeric binary columns?",
                    "options": ["One-Hot Encoding", "MinMax Normalization", "Log Scaling", "Z-Score Standardization"],
                    "correct": 0,
                    "explanation": "One-Hot Encoding turns categorical columns into binary (0 or 1) dummy indicator columns.",
                    "topic": "Data Analysis",
                    "difficulty": "Medium"
                },
                {
                    "question": "What is a major symptom of model Overfitting during data analysis & ML?",
                    "options": ["High training loss and high test loss", "Very low training error but high test error", "Extremely fast training time", "Uniform distribution of residuals"],
                    "correct": 1,
                    "explanation": "Overfitting happens when a model memorizes the training data noise and fails to generalize to test data.",
                    "topic": "Data Analysis",
                    "difficulty": "Medium"
                },
                {
                    "question": "Which statistical visualization is best suited for identifying outliers in a numerical column?",
                    "options": ["Pie Chart", "Box Plot (Whisker Plot)", "Line Chart", "Donut Chart"],
                    "correct": 1,
                    "explanation": "Box plots display the median, quartiles (IQR), and explicitly mark points beyond 1.5*IQR as outlier points.",
                    "topic": "Data Analysis",
                    "difficulty": "Medium"
                }
            ]
        }
    ]

    created_quizzes = []
    for q_item in quizzes_data:
        quiz = Quiz(
            document_id=q_item["doc_id"],
            user_id=demo_user.id,
            title=q_item["title"],
            topic=q_item["topic"],
            difficulty=q_item["difficulty"],
            created_at=datetime.utcnow() - timedelta(days=5)
        )
        db.add(quiz)
        db.flush()
        created_quizzes.append(quiz)

        for q_data in q_item["questions"]:
            q_rec = Question(
                quiz_id=quiz.id,
                question=q_data["question"],
                options=json.dumps(q_data["options"]),
                correct_answer=q_data["correct"],
                explanation=q_data["explanation"],
                topic=q_data["topic"],
                difficulty=q_data["difficulty"]
            )
            db.add(q_rec)

    # 5. Quiz Attempts for history and progress chart
    # Attempt 1: SQL Quiz -> 42% (2/5)
    sql_quiz = created_quizzes[0]
    sql_questions = db.query(Question).filter(Question.quiz_id == sql_quiz.id).all()
    att1 = QuizAttempt(
        user_id=demo_user.id,
        quiz_id=sql_quiz.id,
        score=2,
        total_questions=5,
        percentage=40.0,
        time_taken_seconds=185,
        topic_breakdown=json.dumps([{"topic": "SQL", "score_percentage": 40.0, "correct": 2, "total": 5, "status": "Needs Improvement"}]),
        completed_at=datetime.utcnow() - timedelta(days=4)
    )
    db.add(att1)
    db.flush()

    for i, q in enumerate(sql_questions):
        is_corr = 1 if i < 2 else 0
        ans = QuizAttemptAnswer(
            attempt_id=att1.id,
            question_id=q.id,
            selected_option=q.correct_answer if is_corr else ((q.correct_answer + 1) % 4),
            is_correct=is_corr
        )
        db.add(ans)

    # Attempt 2: Python Quiz -> 72% (4/5 = 80%)
    py_quiz = created_quizzes[1]
    py_questions = db.query(Question).filter(Question.quiz_id == py_quiz.id).all()
    att2 = QuizAttempt(
        user_id=demo_user.id,
        quiz_id=py_quiz.id,
        score=4,
        total_questions=5,
        percentage=80.0,
        time_taken_seconds=142,
        topic_breakdown=json.dumps([{"topic": "Python", "score_percentage": 80.0, "correct": 4, "total": 5, "status": "Strong"}]),
        completed_at=datetime.utcnow() - timedelta(days=2)
    )
    db.add(att2)
    db.flush()

    for i, q in enumerate(py_questions):
        is_corr = 1 if i < 4 else 0
        ans = QuizAttemptAnswer(
            attempt_id=att2.id,
            question_id=q.id,
            selected_option=q.correct_answer if is_corr else ((q.correct_answer + 1) % 4),
            is_correct=is_corr
        )
        db.add(ans)

    # 6. Flashcards
    flashcards_data = [
        {"front": "What does SQL stand for?", "back": "Structured Query Language, the standard domain-specific language for relational database management.", "topic": "SQL", "doc_id": sql_doc.id, "known": True},
        {"front": "What is a SQL JOIN?", "back": "A clause used to combine rows from two or more tables based on a related column between them.", "topic": "SQL", "doc_id": sql_doc.id, "known": False},
        {"front": "What is the difference between WHERE and HAVING in SQL?", "back": "WHERE filters individual records before aggregation; HAVING filters aggregated groups after GROUP BY.", "topic": "SQL", "doc_id": sql_doc.id, "known": False},
        {"front": "What is a PRIMARY KEY?", "back": "A column or set of columns that uniquely identifies each row in a database table and cannot contain NULL.", "topic": "SQL", "doc_id": sql_doc.id, "known": True},
        {"front": "What is a Python Generator?", "back": "A function that yields values on demand using 'yield', producing items sequentially without loading all into RAM.", "topic": "Python", "doc_id": py_doc.id, "known": True},
        {"front": "What is the difference between a List and a Tuple in Python?", "back": "Lists are mutable (modifiable) defined with []; Tuples are immutable defined with ().", "topic": "Python", "doc_id": py_doc.id, "known": True},
        {"front": "What is the GIL in Python?", "back": "Global Interpreter Lock - a mutex that ensures only one native thread executes Python bytecode at once in CPython.", "topic": "Python", "doc_id": py_doc.id, "known": False},
        {"front": "What is Exploratory Data Analysis (EDA)?", "back": "Analyzing and visualizing datasets to understand main characteristics, detect outliers, and uncover patterns.", "topic": "Data Analysis", "doc_id": da_doc.id, "known": False},
        {"front": "What is One-Hot Encoding?", "back": "Transforming categorical variables into distinct binary columns (0 or 1) for numerical models.", "topic": "Data Analysis", "doc_id": da_doc.id, "known": True},
        {"front": "What is the Mean vs Median in Statistics?", "back": "Mean is the mathematical average (sensitive to outliers); Median is the middle value in ordered data.", "topic": "Statistics", "doc_id": da_doc.id, "known": True}
    ]

    for fc in flashcards_data:
        card = Flashcard(
            user_id=demo_user.id,
            document_id=fc["doc_id"],
            front=fc["front"],
            back=fc["back"],
            topic=fc["topic"],
            known=fc["known"],
            review_required=not fc["known"],
            created_at=datetime.utcnow() - timedelta(days=6)
        )
        db.add(card)

    # 7. Personalized Learning Path (as required in prompt)
    # Week 1 — SQL Basics (Completed)
    # Week 2 — Joins & Queries (In Progress)
    # Week 3 — Advanced SQL (Locked)
    # Week 4 — Data Analysis (Locked)
    lp = LearningPath(
        user_id=demo_user.id,
        title="Personalized Skill Gap Recovery Roadmap",
        overview="Tailored roadmap created by AI to elevate your SQL (42%) and Data Analysis (35%) up to mastery level while leveraging your Python foundation.",
        created_at=datetime.utcnow() - timedelta(days=10)
    )
    db.add(lp)
    db.flush()

    weeks_info = [
        {
            "week_num": 1,
            "title": "Week 1 — SQL Basics",
            "desc": "Foundational query syntax, filtering conditions, and sorting logic.",
            "status": "Completed",
            "progress": 100,
            "hours": 5,
            "diff": "Beginner",
            "topics": [
                ("SELECT & Column Aliasing", True),
                ("WHERE Filtering & Boolean Conditions", True),
                ("ORDER BY & LIMIT", True),
                ("GROUP BY & Basic Aggregations", True)
            ]
        },
        {
            "week_num": 2,
            "title": "Week 2 — Joins & Queries",
            "desc": "Master relational database connections, joins, and nested subqueries.",
            "status": "In Progress",
            "progress": 50,
            "hours": 7,
            "diff": "Intermediate",
            "topics": [
                ("INNER JOIN & Table Relationships", True),
                ("LEFT JOIN & Handling NULLs", True),
                ("RIGHT JOIN & FULL OUTER JOIN", False),
                ("Correlated Subqueries & IN/EXISTS", False)
            ]
        },
        {
            "week_num": 3,
            "title": "Week 3 — Advanced SQL",
            "desc": "Complex analytical queries, common table expressions, and window functions.",
            "status": "Locked",
            "progress": 0,
            "hours": 8,
            "diff": "Advanced",
            "topics": [
                ("Common Table Expressions (WITH)", False),
                ("Window Functions (ROW_NUMBER, RANK)", False),
                ("Partitioning & Running Aggregates", False),
                ("Query Performance & Index Optimization", False)
            ]
        },
        {
            "week_num": 4,
            "title": "Week 4 — Data Analysis",
            "desc": "End-to-end data processing, feature engineering, and statistical insights.",
            "status": "Locked",
            "progress": 0,
            "hours": 9,
            "diff": "Advanced",
            "topics": [
                ("Pandas Data Cleaning & Imputation", False),
                ("Categorical Feature Encoding", False),
                ("Exploratory Data Visualization", False),
                ("Capstone Gap Mastery Project", False)
            ]
        }
    ]

    for w in weeks_info:
        week = LearningPathWeek(
            learning_path_id=lp.id,
            week_number=w["week_num"],
            title=w["title"],
            description=w["desc"],
            status=w["status"],
            progress=w["progress"],
            estimated_hours=w["hours"],
            difficulty=w["diff"]
        )
        db.add(week)
        db.flush()

        for t_name, t_done in w["topics"]:
            top = LearningPathTopic(
                week_id=week.id,
                name=t_name,
                completed=t_done
            )
            db.add(top)

    # 8. User Activities
    activities_data = [
        ("upload", "Uploaded Data Analysis.pdf", "Extracted 20 pages and identified 4 core topics.", datetime.utcnow() - timedelta(hours=3)),
        ("quiz_completed", "Completed SQL Fundamentals & Joins Quiz", "Scored 40% (2/5). AI identified SQL Joins as an area to practice.", datetime.utcnow() - timedelta(days=1)),
        ("flashcard_reviewed", "Reviewed 10 Flashcards", "Marked 6 as Known and 4 for Spaced Repetition.", datetime.utcnow() - timedelta(days=2)),
        ("learning_path_progress", "Completed Week 1: SQL Basics", "Finished 4 milestones and unlocked Week 2.", datetime.utcnow() - timedelta(days=3)),
        ("upload", "Uploaded SQL Fundamentals.pdf", "AI generated 4 topics, summary, and quiz.", datetime.utcnow() - timedelta(days=5))
    ]

    for a_type, a_title, a_desc, a_time in activities_data:
        act = UserActivity(
            user_id=demo_user.id,
            activity_type=a_type,
            title=a_title,
            description=a_desc,
            timestamp=a_time
        )
        db.add(act)

    db.commit()
    print("Database seeded successfully with demo account!")
