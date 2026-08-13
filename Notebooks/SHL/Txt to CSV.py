import csv

# Lista de archivos de entrada y salida
input_files = ["Bag_Motion.txt", "Hand_Motion.txt", "Hips_Motion.txt", "Torso_Motion.txt"]
output_files = ["Bag_Motion.csv", "Hand_Motion.csv", "Hips_Motion.csv", "Torso_Motion.csv"]

# Cabeceras para el archivo CSV
headers = [
    "Time", "Ax", "Ay", "Az", "Gx", "Gy", "Gz",
    "Mx", "My", "Mz", "Ow", "Ox", "Oy", "Oz",
    "Gravx", "Gravy", "Gravz", "LAx", "LAy", "LAz",
    "Pressure", "Altitude", "Temperature"
]

# Procesa cada archivo de entrada y crea su archivo de salida CSV correspondiente
for input_file, output_file in zip(input_files, output_files):
    data = []
    with open(input_file, "r") as f:
        lines = f.readlines()
        for line in lines:
            values = line.strip().split()
            data.append(values)

    with open(output_file, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for row in data:
            writer.writerow(row)
            
    print(f"CSV generado para {input_file} -> {output_file}")

print("Proceso de generación de archivos CSV completado.")

