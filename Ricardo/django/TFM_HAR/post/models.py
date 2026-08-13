from django.db import models

# Create your models here.
class File(models.Model):
    json = models.FileField(upload_to='store/jsons/')

    def __str__(self):
        return self.json