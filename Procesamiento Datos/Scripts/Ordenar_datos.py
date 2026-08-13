import os
import json

# Ruta de la carpeta "Datos Combinados"
carpeta_datos = "Datos Combinados"

# Obtener la lista de archivos JSON en la carpeta
archivos_json = [archivo for archivo in os.listdir(carpeta_datos) if archivo.endswith(".json")]

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(carpeta_datos, archivo)
    
    # Leer el archivo JSON
    with open(ruta_archivo) as file:
        data = json.load(file)

    # Ordenar las claves en orden ascendente
    sorted_keys = sorted(data.keys())

    # Crear un nuevo diccionario ordenado
    sorted_data = {key: data[key] for key in sorted_keys}
    
    # Guardar el resultado en un nuevo archivo JSON
    with open(ruta_archivo, 'w') as file:
        json.dump(sorted_data, file, indent=4)
        
# Imprimir notificación de cambios realizados
print(f"Se han ordenado los sensores en los ficheros")

