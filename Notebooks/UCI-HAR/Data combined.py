# Leer el contenido de etiquetas.txt y valores de X_test.txt
with open('features.txt', 'r') as etiquetas_file:
    etiquetas_lines = etiquetas_file.readlines()

with open('test/X_test.txt', 'r') as valores_file:
    valores_lines_test = valores_file.readlines()

with open('train/X_train.txt', 'r') as valores_file_train:
    valores_lines_train = valores_file_train.readlines()

# Obtener las etiquetas del archivo etiquetas.txt y procesarlas
etiquetas = [line.strip().split(' ', 1)[1].replace(',', '-').replace(' ', '-') for line in etiquetas_lines]

# Crear una lista para almacenar las filas combinadas
combined_data = []

# Procesar los valores de X_train.txt para cada línea
for valores_line in valores_lines_train:
    valores = valores_line.strip().split()
    combined_row = valores
    combined_data.append(combined_row)
    
# Procesar los valores de X_test.txt para cada línea
for valores_line in valores_lines_test:
    valores = valores_line.strip().split()
    combined_row = valores
    combined_data.append(combined_row)

# Escribir la información combinada en un archivo CSV
with open('combined_data.csv', 'w') as csv_file:
    # Escribir la cabecera del CSV usando las etiquetas
    csv_file.write(', '.join(etiquetas) + '\n')

    # Escribir los valores de las líneas
    for row in combined_data:
        csv_file.write(','.join(row) + '\n')

print("Archivo CSV combinado creado exitosamente.")

