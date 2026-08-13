import os
import json

carpeta_datos = "ficheros"

# Obtener la lista de archivos JSON en la carpeta
archivos_json = [archivo for archivo in os.listdir(carpeta_datos) if archivo.endswith(".json")]

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(carpeta_datos, archivo)
    
    # Abre el archivo JSON
    with open(ruta_archivo) as file:
        data = json.load(file)
        
    # Obtiene el valor del campo "deviceId"
    device_id = data["deviceId"]
    
    # Iterar sobre cada clave en el archivo JSON
    for clave in data:
        # Obtener la lista de estructuras de la clave actual
        estructuras = data[clave]
    
        # Verificar si las estructuras son una lista
        if isinstance(estructuras, list):
            # Iterar sobre cada estructura y agregar el nuevo campo "deviceId"
            for estructura in estructuras:
                if not (isinstance(estructura, int)):
                    estructura["deviceId"] = device_id

    # Borrar el último campo "deviceId" que no está dentro de la estructura
    #if "deviceId" in data and not isinstance(data["deviceId"], list):
    #    del data["deviceId"]
        
    # Guarda los cambios en el archivo JSON
    with open(ruta_archivo, "w") as file:
        json.dump(data, file, indent=4)

# Imprimir notificación de cambios realizados
print(f"Se han realizado cambios en los ficheros")
