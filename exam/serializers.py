from rest_framework import serializers
from .models import Question, ExamSubmission
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model=Question
        fields =["id","text","options"]

class ExamSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSubmission
        fields="__all__"
