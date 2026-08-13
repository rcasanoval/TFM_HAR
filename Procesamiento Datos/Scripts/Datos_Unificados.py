import json
import os

# Ruta del archivo JSON
carpeta = "../../Procesamiento Datos/Datos Combinados"
nueva_carpeta = "../../Procesamiento Datos/Datos Unificados"
#ruta_archivo_combinado = "Datos Combinados/Fichero_unificado.json"

# Crear la carpeta para los nuevos archivos combinados si no existe
if not os.path.exists(nueva_carpeta):
    os.makedirs(nueva_carpeta)

# Obtener la lista de archivos JSON en la carpeta
archivos_json = [archivo for archivo in os.listdir(carpeta) if archivo.endswith(".json")]

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(carpeta, archivo)
    
    # Leer el archivo JSON
    with open(ruta_archivo) as file:
        data = json.load(file)

    # Crear un diccionario para almacenar los valores unificados
    combined_data = {}

    # Recorrer las claves del JSON original
    for key in data:
        # Obtener los datos correspondientes a la clave actual
        values = data[key]
    
        # Recorrer los datos
        for value in values:
            # Obtener los valores necesarios para unificar
            timestamp = value["timestamp"]
            activity = value["activity"]
            counter = value["counter"]
            deviceId = value["deviceId"]
        
            # Verificar si ya existe una combinación con los mismos valores de timestamp, activity, counter y deviceId
            combined_key = (timestamp, activity, counter, deviceId)
            if combined_key in combined_data:
                # Si la combinación existe, actualizar los valores correspondientes
                combined_data[combined_key].update(value)
            else:
                # Si la combinación no existe, agregarla al diccionario combinado
                combined_data[combined_key] = value
            
    # Convertir el diccionario combinado en una lista de objetos
    combined_list = list(combined_data.values())
    
    # Obtener el nombre del archivo sin la extensión
    nombre_archivo = os.path.splitext(archivo)[0]
    
    # Guardar los datos en un nuevo archivo JSON
    nuevo_archivo = nombre_archivo + "_Unificados.json"
    ruta_nuevo_archivo = os.path.join(nueva_carpeta, nuevo_archivo)

    # Guardar la lista combinada en el archivo JSON
    with open(ruta_nuevo_archivo, 'w') as file:
        json.dump(combined_list, file, indent=4)

# Imprimir notificación de cambios realizados
print(f"Se han unificado los datos de los ficheros")
