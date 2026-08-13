from django.urls import path
from . import views


urlpatterns = [
    path('', views.show_files, name='show_files'),
    path('<str:filename>/', views.download_file, name='download_file'),
]