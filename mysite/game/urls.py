from django.urls import path, re_path
from . import views

app_name = 'game'

urlpatterns = [
    #127.0.0.1/game/
    path('', views.index, name="index"),
]
