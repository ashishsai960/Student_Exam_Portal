from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Question(models.Model):
    text = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=5)

    def __str__ (self):
        return self.text[:50]

class ExamSubmission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answers = models.JSONField()
    score = models.IntegerField(default=0)
    start_time = models.DateTimeField(default=timezone)
    submitted_at=models.DateTimeField(auto_now_add=True)


    def is_time_expired(self):
        return timezone.now()>self.start_time + timedelta(minutes=30)
