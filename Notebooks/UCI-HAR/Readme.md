# Dataset UCI-HAR (GRU-INC)

Esta carpeta incluye lo siguiente: 
- Modelo: model_UCI-HAR.pkl
- Label_enconder: Para poder testear el modelo con otros datos.
- Notebook desarrollado para estudiar el dataset.

Scripts:
- Data combined.py: Sirve para leer el contenido de las etiquetas y de los valores de las carpetas de entrenamiento y de prueba, con el objetivo de unir todos los datos y transformarlo a un fichero CSV llamado combined_data.csv
- Target combined.py: Se encarga de unificar los datos de las actividades de las carpetas de entrenamiento y de pruebas, al igual que se añade el nombre de la columna como “target”
