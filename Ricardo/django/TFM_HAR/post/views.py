from django.shortcuts import render
from .models import File
from rest_framework import viewsets
from .serializers import FileSerializer

# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer