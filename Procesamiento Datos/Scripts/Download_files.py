#!/usr/bin/env python3.10

import boto3
import os

ACCESS_KEY_ID = "AKIAXMLIWNTTYD22JRTF"
SECRET_ACCESS_KEY = "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"
BUCKET_NAME = "upm-har"
LOCAL_DIRECTORY = "ficheros" # nombre de la carpeta local donde se descargarán los archivos

s3 = boto3.client(
    "s3",
    aws_access_key_id=ACCESS_KEY_ID,
    aws_secret_access_key=SECRET_ACCESS_KEY
)

# crea la carpeta local si no existe
if not os.path.exists(LOCAL_DIRECTORY):
    os.makedirs(LOCAL_DIRECTORY)

# obtener la lista de objetos en el bucket
response = s3.list_objects_v2(Bucket=BUCKET_NAME)

# descargar cada objeto en la carpeta local
for obj in response["Contents"]:
    obj_key = obj["Key"]
    obj_file = os.path.join(LOCAL_DIRECTORY, obj_key)
    s3.download_file(BUCKET_NAME, obj_key, obj_file)

print("Todos los archivos han sido descargados exitosamente.")
