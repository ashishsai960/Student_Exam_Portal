from django.urls import path
from .views import StartExamView, SubmitExamView

urlpatterns = [
    path("start/", StartExamView.as_view(), name="start-exam"),
    path("submit/", SubmitExamView.as_view(), name="submit-exam"),
]
