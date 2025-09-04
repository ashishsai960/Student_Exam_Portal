# 🧑‍🎓 Student Exam Portal

A full-stack **online exam portal** (student module) built with **Django REST Framework + React.js**.  
Implements **registration, login (JWT), randomized MCQ exam, 30-minute countdown timer with auto-submit, and results display**.

---

## 📌 Features
- Student **Register/Login** with JWT authentication  
- **Start Exam** → fetches randomized MCQs  
- **Timer** (30 minutes) with **auto-submit**  
- **Next/Previous navigation**  
- **Submit Exam** → score calculated on backend  
- **Result Page** → shows score, percentage, and detailed answer review  
- HackerRank-style clean **exam interface**

---

## 🏗 Project Architecture

Student_Exam_Portal/
├── backend/ # Django backend
│ ├── backend/ # settings, urls
│ ├── users/ # user registration & login
│ ├── exam/ # questions & exam submission
│ └── manage.py
│
├── frontend/ # React frontend
│ └── src/pages/ # Register, Login, Exam, Result pages
│
└── README.md

---

## ⚙️ Tech Stack
- **Frontend:** React.js, Axios, SweetAlert2, CSS  
- **Backend:** Django REST Framework (DRF), JWT (SimpleJWT)  
- **Database:** PostgreSQL (default) or SQLite  
- **Authentication:** JWT Access/Refresh Tokens  

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
cd <YOUR_REPO>
2️⃣ Backend Setup (Django)
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (If requirements.txt not available)
pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) Create superuser
python manage.py createsuperuser

# Start backend server
python manage.py runserver
👉 Backend runs on: http://127.0.0.1:8000
3️⃣ Frontend Setup (React)
cd ../frontend

# Install node modules
npm install

# Start frontend
npm start
👉 Frontend runs on: http://localhost:3000
🔐 Authentication
Login returns JWT access token
Frontend stores token in localStorage
All API requests must include:
Authorization: Bearer <token>
🛠 API Endpoints
🔑 Auth
Register
POST /api/auth/register/
{
  "username": "alice",
  "email": "a@a.com",
  "password": "Pass@123"
}
Login
POST /api/auth/login/
{
  "username": "alice",
  "password": "Pass@123"
}
Response
{
  "access": "<JWT>",
  "username": "alice"
}
📝 Exam
Start Exam
GET /api/exam/start/
Response:
{
  "exam_id": 1,
  "questions": [...],
  "time_limit": 30,
  "total": 5
}
Submit Exam
POST /api/exam/submit/
{
  "exam_id": 1,
  "answers": { "1": "a", "2": "c" }
}
Response:
{
  "score": 1,
  "total": 5,
  "reason": null
}
🧑‍💻 Usage Workflow
Register/Login
Start Exam → Questions load with 30-min timer
Navigate & attempt questions
Submit manually or wait for auto-submit
Results displayed instantly
📝 Commands Reference
Backend
python -m venv venv
source venv/bin/activate     # or venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
Frontend
npm install
npm start
📬 Submission
Push code to a public GitHub repo and share the link
Include:
✅ README.md (this file)
✅ Postman collection (optional but recommended)
👨‍💻 Author
Your Name
📧 your.email@example.com
