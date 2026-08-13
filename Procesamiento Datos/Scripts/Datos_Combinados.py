import json
import os

# Directorio de la carpeta que contiene los archivos JSON
directorio = "ficheros"

# Directorio de la carpeta para los nuevos archivos combinados
directorio_combinados = "Datos Combinados"

# Crear la carpeta para los nuevos archivos combinados si no existe
if not os.path.exists(directorio_combinados):
    os.makedirs(directorio_combinados)

# Diccionario para almacenar los datos combinados
datos_combinados = {}

# Obtener la lista de archivos JSON en el directorio
archivos_json = [archivo for archivo in os.listdir(directorio) if archivo.endswith(".json")]

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(directorio, archivo)

    # Cargar el archivo JSON
    with open(ruta_archivo) as f:
        data = json.load(f)

    # Obtener el valor de "deviceId"
    device_id = data["deviceId"]

    # Verificar si el "deviceId" ya existe en el diccionario de datos combinados
    if device_id in datos_combinados:
        # Obtener los datos existentes con el mismo "deviceId"
        datos_existentes = datos_combinados[device_id]

        # Verificar si los datos existentes son un diccionario
        if isinstance(datos_existentes, dict):
            # Si es un diccionario, combinar los datos existentes con los nuevos datos
            for key, value in data.items():
                if key not in datos_existentes:
                    datos_existentes[key] = value
        else:
            # Si no es un diccionario, crear un nuevo diccionario con los datos existentes y los nuevos datos
            datos_combinados[device_id] = {**datos_existentes, **data}
    else:
        # Si es la primera vez que se encuentra el "deviceId", guardar los datos en el diccionario
        datos_combinados[device_id] = data

# Guardar los datos combinados en un archivo JSON único
nuevo_archivo = "DatosCombinados_Total.json"
ruta_nuevo_archivo = os.path.join(directorio_combinados, nuevo_archivo)

with open(ruta_nuevo_archivo, "w") as f:
    json.dump(datos_combinados, f, indent=4)

# Guardar archivos individuales para cada deviceId
for device_id, datos in datos_combinados.items():
    nuevo_archivo = f"DatosCombinados_{device_id}.json"
    ruta_nuevo_archivo = os.path.join(directorio_combinados, nuevo_archivo)

    with open(ruta_nuevo_archivo, "w") as f:
        json.dump(datos, f, indent=4)

print("Se han unido los ficheros por usuario.")


#----------------------------------------------
# Ruta de la carpeta "Datos Combinados"
carpeta_datos = "Datos Combinados"

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
