import csv

# Lista de archivos de entrada y salida
input_files = ["Label.txt"]
output_files = ["Label.csv"]

# Cabeceras para el archivo CSV
headers = [
    "Time", "Coarse", "Fine", "Road", "Traffic", "Tunnels", "Social", "Food"
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
