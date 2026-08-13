# Ejecución de ficheros

El primer script nos descarga todos los ficheros que se encuentran en el bucket. Esto crea una carpeta llamada ficheros donde se encuentran todos los ficheros del bucket.

```
  python Download_files.py
```

Este script busca añadir a los campos de cada estructura el deviceId que se ha detectado. 

```
  python detail_files.py
```
En este script, se unifican los ficheros para cada usuario y uno completo. Crea una carpeta llamada Datos Combinados sonde se tienen los ficheros de los unificados.

```
  python unified_person_files.py
```
Este script, unifica los valores de cada sensor detectado.
```
  python unified_sensor_data.py 
```

Se tiene un script para confirmar si hay algun fichero que haya excedido el tiempo. 

```
  python TimeExceeded.py
```
Se tiene un script para ordenar los ficheros por el valor de los sensores.

```
  python Ordenar_datos.py
```

Se tiene un script para transformar los datos, se trata de identificar en los nombres el sensor que toma los datos.

```
  python Transformacion_datos.py
```
Se tiene un script para unificar todos los valores tomado, la unificación se realiza con los valores timestamp, activity, counter y deviceId.

```
  python Datos_Unificados.py
```
Se tiene un script para cambiar el fichero de formato JSON a CSV para tratarlo mejor en el notebook.

```
  python Json_to_CSV.py
```

# Notebook HAR TFM.ipynb

Se encuentra los siguiente notebooks: 
- HAR TFM.ipynb: Este script lo he personalizado para el deviceId:"8fe3a65e2ea6658d" el cual ha recopilado más datos. Lo he ajustado porque no toma valores del sensor Barómetro y Luminancia.
- HAR TFM v2.ipynb:Este script se ha ajustado para que se aplique a todos los datos recopilados hasta el momento.

NOTA: Sería interesante crear varios modelos dependiendo de si el móvil tiene los sensores Barómetro y Luminancia. Porque esto hace que cambie un poco la predicción.




