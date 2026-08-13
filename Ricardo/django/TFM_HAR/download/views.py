from django.shortcuts import render
import os
from django.http import HttpResponse, Http404
from django.conf import settings

# Create your views here.
def show_files(request):
    # Definir el directorio que se desea listar
    directory = os.path.join(settings.BASE_DIR, "store/jsons")

    # Obtener la lista de archivos en el directorio
    files = os.listdir(directory)

    # Renderizar la plantilla HTML con la lista de archivos
    context = {'files': files}
    return render(request, 'files.html', context)



def download_file(request, filename):
    # Definir el directorio que se desea listar
    directory = os.path.join(settings.BASE_DIR, "store/jsons")

    # Obtener la ruta completa del archivo a descargar
    file_path = os.path.join(directory, filename)

    # Comprobar si el archivo existe
    if not os.path.exists(file_path):
        raise Http404("El archivo no existe.")
    
    # Imprimir la ruta del archivo en la consola
    print("Ruta del archivo: ", file_path)


    # Abrir el archivo y enviarlo como una respuesta HTTP
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read())
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(filename)
        return response