import os
import json

# Ruta de la carpeta "Datos Combinados"
carpeta_datos = "../../Procesamiento Datos/Datos Combinados"

all_data = {}

# Obtener la lista de archivos JSON en la carpeta
archivos_json = [archivo for archivo in os.listdir(carpeta_datos) if archivo.endswith(".json")]

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(carpeta_datos, archivo)
    
    # Leer el archivo JSON
    with open(ruta_archivo) as file:
        data = json.load(file)

    # Crear un diccionario para almacenar las estructuras combinadas por "sensor"
    combined_data = {}
    
    for archivo, datos in data.items():
        for diccionario in datos:
            if diccionario == -1 or (isinstance(diccionario, str)): 
                continue
            sensor = diccionario['sensor']
            if sensor not in combined_data:
                combined_data[sensor] = []
            if sensor not in all_data:
                all_data[sensor] = []
            combined_data[sensor].append(diccionario)
            all_data[sensor].append(diccionario)

    # Guardar el resultado en un nuevo archivo JSON
    with open(ruta_archivo, 'w') as file:
        json.dump(combined_data, file, indent=4)

# Guardar todos los datos combinados en un solo archivo
ruta_salida_total = os.path.join(carpeta_datos, "DatosCombinados_Total.json")
with open(ruta_salida_total, 'w') as file:
    json.dump(all_data, file, indent=4)

# Imprimir notificación de cambios realizados
print("Se han realizado cambios en los ficheros")

