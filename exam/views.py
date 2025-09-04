import random
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Question, ExamSubmission
from .serializers import QuestionSerializer

class StartExamView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request):
        submission=ExamSubmission.objects.create(user=request.user,answers={})
        questions= list(Question.objects.all())
        random.shuffle(questions)
        selected = questions[:5]
        serializer =QuestionSerializer(selected,many=True)

        return Response({
            "exam_id":submission.id,
            "questions":serializer.data,
            "time_limit":30*60
        })

class SubmitExamView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        exam_id = request.data.get("exam_id")
        answers= request.data.get("answers",{})

        if not exam_id:
            return Response({"error":"Missing exam_id"}, status=400)
        try:
            answers={str(k):v for k,v in (answers or {}).items()}
            qids_int=[int(k) for k in answers.keys()]
        except Exception:
            return Response({"error":"Invalid answers payload"},status=400)
        
        questions=Question.objects.filter(id__in=qids_int)

        try:
            submission= ExamSubmission.objects.get(id=exam_id,user=request.user)
        except ExamSubmission.DoesNotExist:
            return Response({"error":"Exam Not Found"},status=404)
        
        if submission.is_time_expired():
            reason="Time expired. Answers submitted"
        
        questions = Question.objects.filter(id__in=answers.keys())
        score=0
        for q in questions:
            if answers[str(q.id)]==q.correct_answer:
                score+=1
        submission.answers = answers
        submission.score=score
        submission.save()

        return Response({"score":score,"total":len(questions)},status=200)
# Create your views here.
