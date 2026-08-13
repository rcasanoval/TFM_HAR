import json
import csv
import os

# Ruta de la carpeta
ruta_carpeta = "../../Procesamiento Datos/Datos Unificados"

nueva_carpeta = "../../Procesamiento Datos/data"

# Crear la carpeta para los nuevos archivos combinados si no existe
if not os.path.exists(nueva_carpeta):
    os.makedirs(nueva_carpeta)

# Obtener la lista de archivos JSON en el directorio
archivos_json = [archivo for archivo in os.listdir(ruta_carpeta) if archivo.endswith(".json")]

# Contador para el nombre de archivo
contador = 1

# Recorrer cada archivo JSON
for archivo in archivos_json:
    ruta_archivo = os.path.join(ruta_carpeta, archivo)

    # Leer el archivo JSON
    with open(ruta_archivo) as file:
        data = json.load(file)

    # Verificar si hay datos en el archivo JSON
    if not data:
        print("El archivo JSON está vacío.")
        exit()

    # Obtener las columnas del CSV a partir de todas las claves encontradas
    columnas = set()
    for elemento in data:
        columnas.update(elemento.keys())
        
        
    # Obtener el nombre del archivo sin la extensión
    nombre_archivo = os.path.splitext(archivo)[0]
    
    #Generar el nombre del archivo CSV
    if nombre_archivo != "DatosCombinados_Total_Unificados":
        nuevo_archivo = f"DatosCombinados_Persona_{contador}.csv"
        contador += 1
    else:
        nuevo_archivo = "DatosCombinados_Total.csv"
    
    ruta_nuevo_archivo = os.path.join(nueva_carpeta, nuevo_archivo)
    
    # Escribir los datos en el archivo CSV
    with open(ruta_nuevo_archivo, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=columnas)
        writer.writeheader()
        writer.writerows(data)

print("Se ha guardado el archivo CSV a partir del archivo JSON.")

