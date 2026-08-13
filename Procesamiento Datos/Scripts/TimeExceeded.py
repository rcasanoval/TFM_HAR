import json
import os

# Directorio que contiene los archivos JSON
directory = "ficheros"


# Variable para realizar el seguimiento de si se encontró el valor
encontrado = False

# Iterar sobre los archivos en el directorio
for filename in os.listdir(directory):
    if filename.endswith(".json"):
        file_path = os.path.join(directory, filename)
        with open(file_path) as file:
            file_data = json.load(file)
            time_exceeded = file_data.get("timeExceeded")
            if time_exceeded is not None:
                encontrado = True
                print(f"Nombre del archivo: {filename}")
                print(f"Valor de timeExceeded: {time_exceeded}")
                print()

# Si no se encontró el valor en ningún archivo, notificarlo
if not encontrado:
    print("No se encontró el valor 'timeExceeded' en ningún archivo.")
