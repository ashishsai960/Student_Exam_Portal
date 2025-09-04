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
        questions= list(Question.objects.all())
        random.shuffle(questions)
        selected = questions[:5]
        submission=ExamSubmission.objects.create(
            user=request.user,
            answers={},
            question_ids=[q.id for q in selected],
        )
        serializer =QuestionSerializer(selected,many=True)
        data = QuestionSerializer(selected, many=True).data

        return Response({
            "exam_id":submission.id,
            "questions": data,
            "time_limit":30*60,
            "total":len(selected),
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
        except Exception:
            return Response({"error":"Invalid answers payload"},status=400)

        try:
            submission= ExamSubmission.objects.get(id=exam_id,user=request.user)
        except ExamSubmission.DoesNotExist:
            return Response({"error":"Exam Not Found"},status=404)
        qids = submission.question_ids or []
        try:
            qids_int = [int(x) for x in qids]
        except Exception:
            qids_int = [int(x) for x in answers.keys()]

        questions = list(Question.objects.filter(id__in=qids_int))

        
        score=0
        for q in questions:
            selected = answers.get(str(q.id))
            if selected==q.correct_answer:
                score+=1
        submission.answers = answers
        submission.score=score
        submission.save()
        reason = "Time expired. Answers submitted." if submission.is_time_expired() else None


        return Response({"score":score,"total": len(qids_int) if qids_int else len(questions),"reason":reason},status=200)
# Create your views here.
