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
        
    # Crear un nuevo diccionario para almacenar los datos transformados
    nuevo_diccionario = {}
        
    # Verificar si la clave "1" está presente en el JSON
    if "1" in data:
        # Obtener los datos correspondientes a la clave "1"
        datos = data["1"]

        nuevo_diccionario["1"] = [
            {
                "Az": dato["z"],
                "Ay": dato["y"],
                "Ax": dato["x"],
                "timestamp": dato["timestamp"],
                "activity": dato["activity"],
                "counter": dato["counter"],
                "deviceId": dato["deviceId"]
            }
            for dato in datos
        ]
        
    # Verificar si la clave "2" está presente en el JSON
    if "2" in data:
        # Obtener los datos correspondientes a la clave "1"
        datos = data["2"]

        nuevo_diccionario["2"] = [
            {
                "Mz": dato["z"],
                "My": dato["y"],
                "Mx": dato["x"],
                "timestamp": dato["timestamp"],
                "activity": dato["activity"],
                "counter": dato["counter"],
                "deviceId": dato["deviceId"]
            }
            for dato in datos
        ]
        
    # Verificar si la clave "3" está presente en el JSON
    if "3" in data:
        # Obtener los datos correspondientes a la clave "1"
        datos = data["3"]

        nuevo_diccionario["3"] = [
            {
                "Bpressure": dato["pressure"],
                "timestamp": dato["timestamp"],
                "activity": dato["activity"],
                "counter": dato["counter"],
                "deviceId": dato["deviceId"]
            }
            for dato in datos
        ]
    
    # Verificar si la clave "4" está presente en el JSON
    if "4" in data:
        # Obtener los datos correspondientes a la clave "1"
        datos = data["4"]

        nuevo_diccionario["4"] = [
            {
                "Gz": dato["z"],
                "Gy": dato["y"],
                "Gx": dato["x"],
                "timestamp": dato["timestamp"],
                "activity": dato["activity"],
                "counter": dato["counter"],
                "deviceId": dato["deviceId"]
            }
            for dato in datos
        ]
        
    # Verificar si la clave "5" está presente en el JSON
    if "5" in data:
        # Obtener los datos correspondientes a la clave "1"
        datos = data["5"]

        nuevo_diccionario["5"] = [
            {
                "Lilluminance": dato["illuminance"],
                "timestamp": dato["timestamp"],
                "activity": dato["activity"],
                "counter": dato["counter"],
                "deviceId": dato["deviceId"]
            }
            for dato in datos
        ]

    # Guardar el resultado en un nuevo archivo JSON
    with open(ruta_archivo, 'w') as file:
        json.dump(nuevo_diccionario, file, indent=4)
        
# Imprimir notificación de cambios realizados
print(f"Se han transformado los valores en los ficheros")

