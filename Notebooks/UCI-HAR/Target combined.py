# Leer el contenido de y_train.txt
with open('train/y_train.txt', 'r') as y_train_file:
    y_train_lines = y_train_file.readlines()

# Leer el contenido de y_test.txt
with open('test/y_test.txt', 'r') as y_test_file:
    y_test_lines = y_test_file.readlines()

# Obtener los valores de y_train.txt y y_test.txt
y_train_values = [line.strip() for line in y_train_lines]
y_test_values = [line.strip() for line in y_test_lines]

# Crear una lista para almacenar las filas combinadas
combined_data = []

# Agregar los valores de y_train.txt y y_test.txt como una columna llamada "target"
for y_value in y_train_values:
    combined_row = [y_value]
    combined_data.append(combined_row)

for y_value in y_test_values:
    combined_row = [y_value]
    combined_data.append(combined_row)

# Escribir la información combinada en un archivo CSV
with open('combined_targets.csv', 'w') as csv_file:
    # Escribir la cabecera del CSV con "target"
    csv_file.write('target' + '\n')

    # Escribir los valores de las líneas
    for row in combined_data:
        csv_file.write(','.join(row) + '\n')

print("Archivo CSV combinado con los objetivos creados exitosamente.")

