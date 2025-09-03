import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exam.models import Question

questions = [
    {
        "text": "What is the capital of India?",
        "options": {"a": "Delhi", "b": "Mumbai", "c": "Kolkata", "d": "Chennai"},
        "correct_answer": "a"
    },
    {
        "text": "Which language is used in Django?",
        "options": {"a": "Java", "b": "Python", "c": "C++", "d": "Ruby"},
        "correct_answer": "b"
    }
]

for q in questions:
    Question.objects.create(**q)

print("Questions inserted successfully!")
